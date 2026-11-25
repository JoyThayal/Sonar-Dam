"use client";

import { useEffect, useState, useCallback, useSyncExternalStore } from "react";
import { Language, translations } from "@/lib/translations";
import Navbar from "@/components/Navbar";
import RateCard from "@/components/RateCard";
import Calculator from "@/components/Calculator";
import PriceCalendar, { HistoryRecord } from "@/components/PriceCalendar";

interface GoldRates {
  gold24k_1g: number;
  gold24k_10g: number;
  gold22k_1g: number;
  gold22k_10g: number;
}

// ব্রাউজার মাউন্ট হয়েছে কি না তা চেক করার জন্য (কোনো React 19 লিন্টার ওয়ার্নিং ছাড়াই)
const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export default function Home() {
  const isClient = useIsClient();

  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem(
        "sonar_dam_lang",
      ) as Language | null;
      if (savedLang && ["bn", "or", "en", "hi"].includes(savedLang)) {
        return savedLang;
      }
    }
    return "bn";
  });

  const [rates, setRates] = useState<GoldRates | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const t = translations[lang];

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem("sonar_dam_lang", newLang);
  };

  const loadGoldRates = useCallback(
    async (isInitial = false) => {
      if (!isInitial) setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/gold-rate");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setRates(data.rates);
        setHistory(data.history || []);
        setUpdatedAt(data.updatedAt);
      } catch {
        setError(t.errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [t.errorMsg],
  );

  useEffect(() => {
    let active = true;
    const init = async () => {
      if (active) await loadGoldRates(true);
    };
    init();
    return () => {
      active = false;
    };
  }, [loadGoldRates]);

  // ব্রাউজার থেকে ভাষা রিড হওয়ার আগে ফাঁকা ব্যাকগ্রাউন্ড দেখাবে (ফ্ল্যাশ আটকাতে)
  if (!isClient) {
    return <div className="min-h-screen bg-[#FAF9F6]" />;
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 selection:bg-amber-200">
      <Navbar
        lang={lang}
        setLang={handleLanguageChange}
        onRefresh={() => loadGoldRates(false)}
        loading={loading}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-5 py-6 sm:py-12 space-y-6 sm:space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-medium text-stone-800">{t.city}</span>
            <span>•</span>
            <span>{t.gstIncluded}</span>
          </div>
          {updatedAt && (
            <span>
              {t.lastUpdated}:{" "}
              <strong className="text-stone-700 font-medium">
                {updatedAt}
              </strong>
            </span>
          )}
        </div>

        {loading && !rates ? (
          <div className="py-20 text-center text-sm text-stone-400 animate-pulse">
            {t.loading}
          </div>
        ) : error ? (
          <div className="bg-red-50/70 border border-red-200/80 text-red-700 p-6 rounded-2xl text-sm text-center">
            {error}
          </div>
        ) : (
          rates && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <RateCard
                  title={t.gold22k}
                  badge={t.hallmark916}
                  price10g={rates.gold22k_10g}
                  price1g={rates.gold22k_1g}
                  label10g={t.per10g}
                  label1g={t.per1g}
                  featured={true}
                />
                <RateCard
                  title={t.gold24k}
                  badge={t.pure999}
                  price10g={rates.gold24k_10g}
                  price1g={rates.gold24k_1g}
                  label10g={t.per10g}
                  label1g={t.per1g}
                />
              </div>

              <div className="flex flex-col gap-6 sm:gap-8">
                {/* মোবাইলে ক্যালেন্ডার আগে দেখাবে (order-1), ডেক্সটপে পরে (md:order-2) */}
                <div className="order-1 md:order-2">
                  <PriceCalendar lang={lang} history={history} />
                </div>

                {/* মোবাইলে ক্যালকুলেটর নিচে থাকবে (order-2), ডেক্সটপে আগে (md:order-1) */}
                <div className="order-2 md:order-1">
                  <Calculator
                    lang={lang}
                    rate22k={rates.gold22k_1g}
                    rate24k={rates.gold24k_1g}
                  />
                </div>
              </div>
            </>
          )
        )}
      </main>
    </div>
  );
}
