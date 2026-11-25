import { Language, translations } from "@/lib/translations";

interface NavbarProps {
  lang: Language;
  setLang: (lang: Language) => void;
  onRefresh: () => void;
  loading: boolean;
}

const languageOptions: { code: Language; label: string }[] = [
  { code: "bn", label: "বাংলা" },
  { code: "or", label: "ଓଡ଼ିଆ" },
  { code: "en", label: "EN" },
  { code: "hi", label: "हिन्दी" },
];

export default function Navbar({
  lang,
  setLang,
  onRefresh,
  loading,
}: NavbarProps) {
  const t = translations[lang];

  return (
    <header className="border-b border-stone-200/80 bg-[#FAF9F6]/90 backdrop-blur-md sticky top-0 z-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-5 py-3 sm:py-0 sm:h-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
        {/* Top Row: Brand Name & Refresh Button */}
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-pulse shrink-0" />
            <div>
              <h1 className="text-lg font-bold tracking-tight text-stone-900 leading-none">
                {t.brand}
              </h1>
              <p className="text-[11px] uppercase tracking-widest text-stone-400 mt-1">
                {t.subtitle}
              </p>
            </div>
          </div>

          {/* Mobile Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="sm:hidden text-xs font-medium text-stone-700 active:scale-95 border border-stone-200 bg-white px-3 py-1.5 rounded-lg transition cursor-pointer disabled:opacity-50"
          >
            {loading ? "..." : `↻ ${t.refresh}`}
          </button>
        </div>

        {/* Bottom Row on Mobile / Right Side on Desktop: Language Switcher */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="grid grid-cols-4 sm:flex items-center bg-stone-200/70 p-1 rounded-xl text-xs font-medium w-full sm:w-auto">
            {languageOptions.map((item) => (
              <button
                key={item.code}
                onClick={() => setLang(item.code)}
                className={`py-1.5 sm:px-2.5 sm:py-1 rounded-lg text-center transition cursor-pointer ${
                  lang === item.code
                    ? "bg-white text-stone-900 shadow-xs font-bold"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Desktop Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="hidden sm:inline-flex text-xs font-medium text-stone-600 hover:text-stone-900 border border-stone-200 bg-white px-3 py-1.5 rounded-lg transition cursor-pointer disabled:opacity-50 shrink-0"
          >
            {loading ? "..." : `↻ ${t.refresh}`}
          </button>
        </div>
      </div>
    </header>
  );
}
