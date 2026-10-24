"use client";
import { useState, useMemo } from "react";
import { estimateTax, DEFAULT_ASSUMPTIONS } from "@/lib/engine/taxCalc";
import BarChart from "./Visuals/BarChart";

export default function TaxPlanner(){
  const [fy,setFy]=useState("FY2025-26");
  const [regime,setRegime]=useState<"old"|"new">("new");
  const [gross,setGross]=useState(1200000);
  const [other,setOther]=useState(80000);
  const [c80,setC80]=useState(150000);
  const [d80,setD80]=useState(25000);
  const [nps,setNps]=useState(50000);
  const [home,setHome]=useState(0);
  const [tds,setTds]=useState(80000);

  const calc = useMemo(()=>{
    const deductions = regime==="old" ? (c80+d80+nps+home) : 0;
    const totalIncome = gross+other;
    const taxable = Math.max(0, totalIncome - deductions - DEFAULT_ASSUMPTIONS.stdDeduction);
    const est = estimateTax(taxable, regime, DEFAULT_ASSUMPTIONS);
    return {totalIncome, deductions, ...est, balance: est.tax - tds};
  },[gross,other,c80,d80,nps,home,tds,regime]);

  return (
    <div className="space-y-4">
      <div className="card p-5">
        <div className="flex flex-wrap justify-between gap-3">
          <div className="font-bold">Tax Planning Workspace</div>
          <div className="flex gap-2">
            <select value={fy} onChange={e=>setFy(e.target.value)} className="h-8 rounded-full border px-3 text-xs"><option>FY2025-26 (AY2026-27)</option><option>FY2024-25</option></select>
            <select value={regime} onChange={e=>setRegime(e.target.value as any)} className="h-8 rounded-full border px-3 text-xs"><option value="new">New Regime</option><option value="old">Old Regime</option></select>
          </div>
        </div>
        <div className="mt-2 text-[11px] text-slate-500">Assumptions: Std deduction ₹{DEFAULT_ASSUMPTIONS.stdDeduction} • Source: Synthetic • Retrieval: 2026-10-24 • {regime==="old" ? "Old allows 80C/80D" : "New disallows most deductions"} • Clearly marked ESTIMATE</div>

        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            ["Gross Salary", gross, setGross],
            ["Other Income (interest/freelance)", other, setOther],
            ["80C (ELSS/PPF) up to 1.5L", c80, setC80],
            ["80D Health Insurance", d80, setD80],
            ["NPS 80CCD", nps, setNps],
            ["Home Loan Interest", home, setHome],
            ["TDS / Advance Paid", tds, setTds],
          ].map(([label,val,setter]:any)=>(
            <label key={label} className="block"><div className="text-[11px] font-semibold">{label}</div><input type="number" value={val} onChange={e=>setter(parseFloat(e.target.value)||0)} className="mt-1 w-full h-9 rounded-lg border px-3 text-sm" /></label>
          ))}
        </div>

        <div className="mt-5 grid md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-midnight text-white p-4">
            <div className="text-[11px] opacity-60">ESTIMATED BREAKDOWN - {fy} - {regime.toUpperCase()} - SYNTHETIC</div>
            <div className="mt-2 text-sm space-y-1">
              <div className="flex justify-between"><span>Total Income</span><span>₹{calc.totalIncome.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Deductions Eligible ({regime})</span><span>₹{calc.deductions.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Taxable Income</span><span>₹{calc.taxable.toLocaleString()}</span></div>
              <div className="flex justify-between font-bold border-t border-white/20 pt-2 mt-2"><span>Estimated Tax</span><span>₹{calc.tax.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>TDS Paid</span><span>₹{tds.toLocaleString()}</span></div>
              <div className="flex justify-between font-bold"><span>Balance Payable / (Refund)</span><span>₹{calc.balance.toLocaleString()}</span></div>
            </div>
            <div className="mt-3 text-[10px] opacity-70">{calc.label}</div>
          </div>
          <BarChart data={[
            {label:"Gross", value:gross},
            {label:"Deductions", value:calc.deductions},
            {label:"Taxable", value:calc.taxable},
            {label:"Est. Tax", value:calc.tax},
          ]} />
        </div>
        <div className="mt-3 text-[10px] text-slate-500">Calculation: {calc.breakdown.map((b:any)=>`${b.slab}: ₹${b.amount}×${b.rate}%`).join(" | ")} • Does not treat investment as automatic deduction. Verify limits officially.</div>
      </div>
    </div>
  );
}
