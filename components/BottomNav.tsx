import { Language, translations } from "@/lib/translations";

export type MobileTab = "rates" | "calendar" | "calc";

interface BottomNavProps {
  lang: Language;
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
}

export default function BottomNav({
  lang,
  activeTab,
  onTabChange,
}: BottomNavProps) {
  const t = translations[lang];

  const tabs: { id: MobileTab; label: string; icon: string }[] = [
    {
      id: "rates",
      label: t.tabRates,
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      id: "calendar",
      label: t.tabCalendar,
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    },
    {
      id: "calc",
      label: t.tabCalc,
      icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200/90 px-3 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
      <div className="grid grid-cols-3 gap-1.5 max-w-md mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition cursor-pointer ${
              activeTab === tab.id
                ? "bg-stone-900 text-amber-400 font-semibold shadow-xs"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            <svg
              className="w-5 h-5 mb-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
            </svg>
            <span className="text-[11px] leading-tight">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
