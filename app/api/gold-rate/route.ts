import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const apiKey = process.env.GOLD_API_KEY;

  const KOLKATA_LOCAL_PREMIUM_PER_GRAM = 85;
  const GST_PERCENTAGE = 0.03;

  try {
    if (!apiKey) {
      throw new Error("API Key পাওয়া যায়নি");
    }

    // ১. লাইভ API থেকে আজকের দাম আনা
    const response = await fetch(
      "https://api.goldprice.dev/v1/convert?from=XAU&to=INR&amount=1&unit=gram",
      {
        headers: { Authorization: `Bearer ${apiKey}` },
        next: { revalidate: 1800 }, // প্রতি ৩০ মিনিট পরপর আপডেট
      },
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const raw24k = Number(
      data?.result || data?.price || data?.converted_amount || 0,
    );
    const raw22k = raw24k * (22 / 24);

    const final24k = Math.round(
      (raw24k + KOLKATA_LOCAL_PREMIUM_PER_GRAM) * (1 + GST_PERCENTAGE),
    );
    const final22k = Math.round(
      (raw22k + KOLKATA_LOCAL_PREMIUM_PER_GRAM) * (1 + GST_PERCENTAGE),
    );

    // ২. ভারতের বর্তমান তারিখ বের করা (YYYY-MM-DD)
    const todayIST = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    // ৩. আজকের আসল দাম Supabase-এ সেভ বা আপডেট করা
    await supabase.from("daily_gold_rates").upsert(
      {
        rate_date: todayIST,
        gold22k_1g: final22k,
        gold22k_10g: final22k * 10,
        gold24k_1g: final24k,
        gold24k_10g: final24k * 10,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "rate_date" },
    );

    // ৪. Supabase থেকে সব সেভ করা দিনের আসল ডেটা নিয়ে আসা (নতুন থেকে পুরনো)
    const { data: historyData } = await supabase
      .from("daily_gold_rates")
      .select("*")
      .order("rate_date", { ascending: false })
      .limit(31);

    return NextResponse.json({
      source: "live",
      city: "Kolkata",
      updatedAt: new Date().toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
      }),
      rates: {
        gold24k_1g: final24k,
        gold24k_10g: final24k * 10,
        gold22k_1g: final22k,
        gold22k_10g: final22k * 10,
      },
      history: historyData || [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: "সোনার দাম লোড বা সেভ করা সম্ভব হয়নি।" },
      { status: 500 },
    );
  }
}
