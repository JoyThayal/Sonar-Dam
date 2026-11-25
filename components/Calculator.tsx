"use client";

import { useState } from "react";
import { Language, translations } from "@/lib/translations";

interface CalculatorProps {
  lang: Language;
  rate22k: number;
  rate24k: number;
}

export default function Calculator({
  lang,
  rate22k,
  rate24k,
}: CalculatorProps) {
  const t = translations[lang];
  const [weight, setWeight] = useState<number>(10);
  const [purity, setPurity] = useState<"22K" | "24K">("22K");
  const [makingCharge, setMakingCharge] = useState<number>(10);

  const unitRate = purity === "22K" ? rate22k : rate24k;
  const goldBase = unitRate * (weight || 0);
  const makingCost = (goldBase * (makingCharge || 0)) / 100;
  const total = Math.round(goldBase + makingCost);

  return (
    <section className="bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-8">
      <div className="mb-5 sm:mb-6">
        <h3 className="text-base font-semibold text-stone-900">
          {t.calcTitle}
        </h3>
        <p className="text-xs text-stone-400 mt-1">{t.calcSub}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1.5">
            {t.selectKarat}
          </label>
          <select
            value={purity}
            onChange={(e) => setPurity(e.target.value as "22K" | "24K")}
            className="w-full bg-[#FAF9F6] border border-stone-200 rounded-xl px-3.5 py-3 sm:py-2.5 text-base sm:text-sm text-stone-900 focus:outline-none focus:border-stone-900 transition"
          >
            <option value="22K">22K Gold</option>
            <option value="24K">24K Gold</option>
          </select>
        </div>

        <div className="grid grid-cols-2 sm:contents gap-3">
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">
              {t.weightLabel}
            </label>
            <input
              type="number"
              inputMode="decimal"
              min="0.1"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
              className="w-full bg-[#FAF9F6] border border-stone-200 rounded-xl px-3.5 py-3 sm:py-2.5 text-base sm:text-sm text-stone-900 tabular-nums focus:outline-none focus:border-stone-900 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">
              {t.makingLabel}
            </label>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              max="50"
              value={makingCharge}
              onChange={(e) => setMakingCharge(parseFloat(e.target.value) || 0)}
              className="w-full bg-[#FAF9F6] border border-stone-200 rounded-xl px-3.5 py-3 sm:py-2.5 text-base sm:text-sm text-stone-900 tabular-nums focus:outline-none focus:border-stone-900 transition"
            />
          </div>
        </div>
      </div>

      <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-stone-500">
          <span>
            {t.goldValue}:{" "}
            <strong className="text-stone-800 tabular-nums">
              ₹{Math.round(goldBase).toLocaleString("en-IN")}
            </strong>
          </span>
          <span>
            {t.makingValue}:{" "}
            <strong className="text-stone-800 tabular-nums">
              ₹{Math.round(makingCost).toLocaleString("en-IN")}
            </strong>
          </span>
        </div>

        <div className="bg-amber-50/80 sm:bg-transparent p-3 sm:p-0 rounded-xl flex items-baseline justify-between sm:justify-end gap-3">
          <span className="text-xs font-medium text-stone-500">
            {t.totalPayable}
          </span>
          <span className="text-2xl font-bold text-amber-700 tabular-nums">
            ₹{total.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </section>
  );
}
