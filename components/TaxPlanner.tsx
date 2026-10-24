"use client";

import { useEffect, useMemo, useState } from "react";
import { estimateTax, DEFAULT_ASSUMPTIONS } from "@/lib/engine/taxCalc";
import BarChart from "./Visuals/BarChart";

type Regime = "old" | "new";
const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

function safeAmount(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export default function TaxPlanner() {
  const [fy, setFy] = useState("FY2025-26");
  const [regime, setRegime] = useState<Regime>("new");
  const [gross, setGross] = useState(1200000);
  const [other, setOther] = useState(80000);
  const [c80, setC80] = useState(150000);
  const [d80, setD80] = useState(25000);
  const [nps, setNps] = useState(50000);
  const [home, setHome] = useState(0);
  const [tds, setTds] = useState(80000);
  const [showCompare, setShowCompare] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("taxclarity-tax-planner-v1");
      if (saved) {
        const data = JSON.parse(saved);
        if (data.fy === "FY2025-26" || data.fy === "FY2024-25") setFy(data.fy);
        if (data.regime === "old" || data.regime === "new") setRegime(data.regime);
        if (typeof data.gross === "number") setGross(data.gross);
        if (typeof data.other === "number") setOther(data.other);
        if (typeof data.c80 === "number") setC80(data.c80);
        if (typeof data.d80 === "number") setD80(data.d80);
        if (typeof data.nps === "number") setNps(data.nps);
        if (typeof data.home === "number") setHome(data.home);
        if (typeof data.tds === "number") setTds(data.tds);
        if (typeof data.showCompare === "boolean") setShowCompare(data.showCompare);
      }
    } catch { /* Keep defaults if browser storage is unavailable. */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { window.localStorage.setItem("taxclarity-tax-planner-v1", JSON.stringify({ fy, regime, gross, other, c80, d80, nps, home, tds, showCompare })); } catch { /* Planner remains interactive without persistence. */ }
  }, [fy, regime, gross, other, c80, d80, nps, home, tds, showCompare, hydrated]);

  const inputs = { gross, other, c80, d80, nps, home, tds };
  const calcFor = (which: Regime) => {
    const totalIncome = safeAmount(gross) + safeAmount(other);
    const deductions = which === "old"
      ? safeAmount(c80) + safeAmount(d80) + safeAmount(nps) + safeAmount(home)
      : 0;
    const taxable = Math.max(0, totalIncome - deductions - DEFAULT_ASSUMPTIONS.stdDeduction);
    const est = estimateTax(taxable, which, DEFAULT_ASSUMPTIONS);
    return {
      totalIncome,
      deductions,
      ...est,
      balance: est.tax - safeAmount(tds),
    };
  };

  const calc = useMemo(() => calcFor(regime), [gross, other, c80, d80, nps, home, tds, regime]);
  const oldCalc = useMemo(() => calcFor("old"), [gross, other, c80, d80, nps, home, tds]);
  const newCalc = useMemo(() => calcFor("new"), [gross, other, c80, d80, nps, home, tds]);
  const bestRegime = oldCalc.tax < newCalc.tax ? "old" : newCalc.tax < oldCalc.tax ? "new" : "tie";
  const invalid = Object.values(inputs).some(v => !Number.isFinite(v) || v < 0);

  const fields: { label: string; value: number; setter: (value: number) => void; help?: string }[] = [
    { label: "Gross salary (₹)", value: gross, setter: setGross },
    { label: "Other income: interest / freelance (₹)", value: other, setter: setOther },
    { label: "80C amount entered (₹)", value: c80, setter: setC80, help: "Enter the amount you want to review; eligibility and limits must be verified." },
    { label: "80D health insurance entered (₹)", value: d80, setter: setD80 },
    { label: "NPS amount entered (₹)", value: nps, setter: setNps },
    { label: "Home-loan interest entered (₹)", value: home, setter: setHome },
    { label: "TDS / advance tax paid (₹)", value: tds, setter: setTds },
  ];

  return (
    <div className="space-y-4">
      <section className="card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="font-bold text-lg">Interactive Tax Planning Workspace</div>
            <p className="mt-1 text-xs text-slate-500">Edit the figures to recalculate the estimate immediately.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="text-xs">
              <span className="sr-only">Financial year</span>
              <select value={fy} onChange={e => setFy(e.target.value)} className="h-9 rounded-full border border-slate-200 bg-white px-3 text-xs">
                <option value="FY2025-26">FY2025-26 (AY2026-27)</option>
                <option value="FY2024-25">FY2024-25 (AY2025-26)</option>
              </select>
            </label>
            <label className="text-xs">
              <span className="sr-only">Tax regime</span>
              <select value={regime} onChange={e => setRegime(e.target.value as Regime)} className="h-9 rounded-full border border-slate-200 bg-white px-3 text-xs">
                <option value="new">New regime</option>
                <option value="old">Old regime</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-950">
          <strong>Important:</strong> This project uses synthetic, simplified assumptions in <code>lib/engine/taxCalc.ts</code>, not verified tax law. Financial-year selection currently labels the estimate; it does not load a different official slab table. Do not use these results to file a return.
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fields.map(field => (
            <label key={field.label} className="block">
              <span className="text-[11px] font-semibold">{field.label}</span>
              <input
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                value={field.value}
                onChange={e => field.setter(e.target.value === "" ? 0 : Number(e.target.value))}
                className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
              {field.help && <span className="mt-1 block text-[10px] leading-4 text-slate-500">{field.help}</span>}
            </label>
          ))}
        </div>

        {invalid && <p role="alert" className="mt-3 text-xs text-red-700">Amounts must be non-negative valid numbers.</p>}

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-midnight p-4 text-white">
            <div className="text-[11px] font-semibold tracking-wide text-white/70">ESTIMATED RESULT · {fy} · {regime.toUpperCase()} REGIME</div>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-3"><span className="text-white/75">Total income entered</span><strong>{money(calc.totalIncome)}</strong></div>
              <div className="flex justify-between gap-3"><span className="text-white/75">Deductions counted by prototype</span><strong>{money(calc.deductions)}</strong></div>
              <div className="flex justify-between gap-3"><span className="text-white/75">Standard deduction assumption</span><strong>{money(DEFAULT_ASSUMPTIONS.stdDeduction)}</strong></div>
              <div className="flex justify-between gap-3 border-t border-white/20 pt-2"><span className="text-white/75">Estimated taxable income</span><strong>{money(calc.taxable)}</strong></div>
              <div className="flex justify-between gap-3 border-t border-white/20 pt-2 text-base"><span>Estimated tax</span><strong>{money(calc.tax)}</strong></div>
              <div className="flex justify-between gap-3"><span className="text-white/75">TDS / advance tax entered</span><strong>{money(safeAmount(tds))}</strong></div>
              <div className="flex justify-between gap-3 font-bold"><span>Estimated balance (+ payable / − excess paid)</span><strong>{money(calc.balance)}</strong></div>
            </div>
            <p className="mt-3 text-[10px] leading-4 text-white/65">{calc.label}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="mb-2 text-xs font-bold">Income and estimate comparison</div>
            <BarChart data={[
              { label: "Income", value: calc.totalIncome },
              { label: "Deductions", value: calc.deductions },
              { label: "Taxable", value: calc.taxable },
              { label: "Est. tax", value: calc.tax },
            ]} />
          </div>
        </div>

        <div className="mt-4 text-[10px] leading-5 text-slate-500">
          Slab arithmetic: {calc.breakdown.map((b: any) => `${b.slab}: ${money(b.amount)} × ${b.rate}%`).join(" · ") || "No taxable amount in the configured slabs"}.
          The prototype does not add every statutory rebate, surcharge, cess, special rate, or eligibility condition.
        </div>
      </section>

      <section className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold">Compare both regimes</h3>
            <p className="mt-1 text-xs text-slate-500">Uses the same entered figures and the current synthetic assumptions.</p>
          </div>
          <button type="button" onClick={() => setShowCompare(v => !v)} className="rounded-full border border-slate-300 px-3 py-2 text-xs font-semibold hover:bg-slate-50">
            {showCompare ? "Hide comparison" : "Show comparison"}
          </button>
        </div>
        {showCompare && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {([
              ["Old regime", oldCalc, "old"],
              ["New regime", newCalc, "new"],
            ] as const).map(([label, result, key]) => (
              <div key={key} className={`rounded-xl border p-4 ${bestRegime === key ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold">{label}</span>
                  {bestRegime === key && <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-800">Lower estimate</span>}
                  {bestRegime === "tie" && <span className="rounded-full bg-slate-200 px-2 py-1 text-[10px] font-bold">Same estimate</span>}
                </div>
                <div className="mt-3 text-2xl font-bold">{money(result.tax)}</div>
                <div className="mt-1 text-xs text-slate-500">Estimated tax under prototype rules</div>
                <div className="mt-3 flex justify-between border-t border-slate-200 pt-3 text-xs">
                  <span>Deduction amounts counted</span><strong>{money(result.deductions)}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="mt-3 text-[10px] leading-4 text-slate-500">
          “Lower estimate” is only a comparison of this prototype's arithmetic, not tax advice or a verified recommendation. Actual eligibility and the applicable year's law may change the result.
        </p>
      </section>
    </div>
  );
}
