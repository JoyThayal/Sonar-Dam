interface RateCardProps {
  title: string;
  badge: string;
  price10g: number;
  price1g: number;
  label10g: string;
  label1g: string;
  featured?: boolean;
}

export default function RateCard({
  title,
  badge,
  price10g,
  price1g,
  label10g,
  label1g,
  featured = false,
}: RateCardProps) {
  return (
    <div
      className={`rounded-2xl p-5 sm:p-7 transition-all ${
        featured
          ? "bg-stone-900 text-stone-50 shadow-xl shadow-stone-900/10"
          : "bg-white text-stone-900 border border-stone-200/80"
      }`}
    >
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <span
          className={`text-[11px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full ${
            featured
              ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
              : "bg-stone-100 text-stone-500"
          }`}
        >
          {badge}
        </span>
      </div>

      <h2
        className={`text-sm font-medium ${
          featured ? "text-stone-400" : "text-stone-500"
        }`}
      >
        {title}
      </h2>

      <div className="mt-2 flex items-baseline justify-between gap-2">
        <p className="text-2xl min-[380px]:text-3xl sm:text-4xl font-light tracking-tight tabular-nums">
          ₹{price10g.toLocaleString("en-IN")}
        </p>
        <span className="text-xs text-stone-400 text-right shrink-0">
          {label10g}
        </span>
      </div>

      <div
        className={`mt-5 sm:mt-6 pt-3.5 sm:pt-4 border-t flex items-center justify-between text-sm ${
          featured
            ? "border-stone-800 text-stone-300"
            : "border-stone-100 text-stone-600"
        }`}
      >
        <span>{label1g}</span>
        <span className="font-semibold tabular-nums">
          ₹{price1g.toLocaleString("en-IN")}
        </span>
      </div>
    </div>
  );
}
