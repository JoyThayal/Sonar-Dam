import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const CACHE_DURATION_MS = 3 * 60 * 60 * 1000; // ৩ ঘণ্টা ক্যাশ থাকবে

export async function GET() {
  const apiKey = process.env.GOLD_API_KEY;
  const KOLKATA_LOCAL_PREMIUM_PER_GRAM = 85;
  const GST_PERCENTAGE = 0.03;

  try {
    const todayIST = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    // ১. প্রথমে Supabase থেকে সব সেভ করা দিনের ডেটা নিয়ে আসা
    const { data: historyData } = await supabase
      .from("daily_gold_rates")
      .select("*")
      .order("rate_date", { ascending: false })
      .limit(31);

    const todayRecord = historyData?.find(
      (item) => item.rate_date === todayIST,
    );

    // ২. আজকের ডেটা যদি ৩ ঘণ্টার কম পুরনো হয়, তবে API কল না করে ডাটাবেস থেকেই ফেরত দেবে
    if (todayRecord && todayRecord.updated_at) {
      const lastUpdatedTime = new Date(todayRecord.updated_at).getTime();
      const nowTime = Date.now();

      if (nowTime - lastUpdatedTime < CACHE_DURATION_MS) {
        return NextResponse.json({
          source: "cache",
          city: "Kolkata",
          updatedAt: new Date(todayRecord.updated_at).toLocaleTimeString(
            "en-IN",
            {
              timeZone: "Asia/Kolkata",
              hour: "2-digit",
              minute: "2-digit",
            },
          ),
          rates: {
            gold24k_1g: todayRecord.gold24k_1g,
            gold24k_10g: todayRecord.gold24k_10g,
            gold22k_1g: todayRecord.gold22k_1g,
            gold22k_10g: todayRecord.gold22k_10g,
          },
          history: historyData || [],
        });
      }
    }

    // ৩. ৩ ঘণ্টা পার হয়ে গেলে বা আজকের ডেটা না থাকলে লাইভ API থেকে দাম আনা
    if (!apiKey) {
      throw new Error("API Key পাওয়া যায়নি");
    }

    const response = await fetch(
      "https://api.goldprice.dev/v1/convert?from=XAU&to=INR&amount=1&unit=gram",
      {
        headers: { Authorization: `Bearer ${apiKey}` },
        cache: "no-store",
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

    const nowISO = new Date().toISOString();

    // ৪. নতুন দাম Supabase-এ সেভ বা আপডেট করা
    await supabase.from("daily_gold_rates").upsert(
      {
        rate_date: todayIST,
        gold22k_1g: final22k,
        gold22k_10g: final22k * 10,
        gold24k_1g: final24k,
        gold24k_10g: final24k * 10,
        updated_at: nowISO,
      },
      { onConflict: "rate_date" },
    );

    // আপডেটেড হিস্ট্রি লিস্ট তৈরি
    const updatedHistory = historyData
      ? [
          {
            rate_date: todayIST,
            gold22k_1g: final22k,
            gold22k_10g: final22k * 10,
            gold24k_1g: final24k,
            gold24k_10g: final24k * 10,
            updated_at: nowISO,
          },
          ...historyData.filter((item) => item.rate_date !== todayIST),
        ]
      : [];

    return NextResponse.json({
      source: "live",
      city: "Kolkata",
      updatedAt: new Date(nowISO).toLocaleTimeString("en-IN", {
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
      history: updatedHistory,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "সোনার দাম লোড বা সেভ করা সম্ভব হয়নি।" },
      { status: 500 },
    );
  }
}
