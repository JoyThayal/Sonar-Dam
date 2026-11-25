"use client";

import { useEffect, useState, useCallback, useSyncExternalStore } from "react";
import { Language, translations } from "@/lib/translations";
import Navbar from "@/components/Navbar";
import RateCard from "@/components/RateCard";
import Calculator from "@/components/Calculator";
import PriceCalendar, { HistoryRecord } from "@/components/PriceCalendar";
import BottomNav, { MobileTab } from "@/components/BottomNav";

interface GoldRates {
  gold24k_1g: number;
  gold24k_10g: number;
  gold22k_1g: number;
  gold22k_10g: number;
}

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
      const saved = localStorage.getItem("sonar_dam_lang") as Language | null;
      if (saved && ["bn", "or", "en", "hi"].includes(saved)) return saved;
    }
    return "bn";
  });

  const [activeTab, setActiveTab] = useState<MobileTab>("rates");
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

  const handleTabChange = (tab: MobileTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  if (!isClient) return <div className="min-h-screen bg-[#FAF9F6]" />;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 selection:bg-amber-200 pb-24 md:pb-12">
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
              <div
                className={`${activeTab === "rates" ? "grid" : "hidden md:grid"} grid-cols-1 md:grid-cols-2 gap-5`}
              >
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

              <div
                className={activeTab === "calc" ? "block" : "hidden md:block"}
              >
                <Calculator
                  lang={lang}
                  rate22k={rates.gold22k_1g}
                  rate24k={rates.gold24k_1g}
                />
              </div>

              <div
                className={
                  activeTab === "calendar" ? "block" : "hidden md:block"
                }
              >
                <PriceCalendar lang={lang} history={history} />
              </div>
            </>
          )
        )}
      </main>

      <BottomNav
        lang={lang}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    </div>
  );
}
