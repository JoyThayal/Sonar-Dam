import { Language, translations } from "@/lib/translations";

interface NavbarProps {
  lang: Language;
  setLang: (lang: Language) => void;
  onRefresh: () => void;
  loading: boolean;
}

const languageOptions: { code: Language; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "hi", label: "हिन्दी" },
  { code: "bn", label: "বাংলা" },
  { code: "or", label: "ଓଡ଼ିଆ" },
];

export default function Navbar({
  lang,
  setLang,
  onRefresh,
  loading,
}: NavbarProps) {
  const t = translations[lang];

  return (
    <header className="border-b border-stone-200/80 bg-[#FAF9F6]/80 backdrop-blur-md sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-5 h-16 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-pulse" />
          <div>
            <h1 className="text-base sm:text-lg font-semibold tracking-tight text-stone-900 leading-none">
              {t.brand}
            </h1>
            <p className="hidden sm:block text-[11px] uppercase tracking-widest text-stone-400 mt-1">
              {t.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="flex items-center bg-stone-200/70 p-0.5 rounded-lg text-xs font-medium">
            {languageOptions.map((item) => (
              <button
                key={item.code}
                onClick={() => setLang(item.code)}
                className={`px-2 sm:px-2.5 py-1 rounded-md transition cursor-pointer ${
                  lang === item.code
                    ? "bg-white text-stone-900 shadow-xs font-semibold"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="text-xs font-medium text-stone-600 hover:text-stone-900 border border-stone-200 bg-white px-2.5 sm:px-3 py-1.5 rounded-lg transition cursor-pointer disabled:opacity-50 shrink-0"
          >
            {loading ? "..." : `↻ ${t.refresh}`}
          </button>
        </div>
      </div>
    </header>
  );
}
