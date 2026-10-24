"use client";
import { useState } from "react";
import { classify } from "@/lib/engine/reconciliation";
import { Badge } from "./ui/Badge";
import { Input } from "./ui/Input";

export default function ReconciliationPanel(){
  const [a,setA]=useState("8500");
  const [b,setB]=useState("7000");
  const [avg,setAvg]=useState("7000");
  const numA=parseFloat(a); const numB=parseFloat(b);
  const valid = !isNaN(numA) && !isNaN(numB);
  const result = valid ? classify(numA,numB,{avg:parseFloat(avg)||undefined}) : null;
  const errA = a==="" ? "Required" : isNaN(numA) ? "Invalid number" : numA<0 ? "Negative not allowed here" : numA>100000000 ? "Excessively large - confirm" : "";
  const errB = b==="" ? "Required" : isNaN(numB) ? "Invalid number" : "";

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between"><div className="font-bold">Reconciliation Engine</div><Badge tone="success">Live</Badge></div>
      <p className="text-xs text-slate-500 mt-1">Edit two amounts - difference recalculates immediately. Synthetic demo only.</p>
      <div className="mt-4 grid sm:grid-cols-3 gap-4">
        <Input label="Source A - Payslip Sum (₹)" value={a} onChange={(e:any)=>setA(e.target.value)} error={errA} />
        <Input label="Source B - Form16 Ref (₹)" value={b} onChange={(e:any)=>setB(e.target.value)} error={errB} />
        <Input label="Avg for implausible check (₹)" value={avg} onChange={(e:any)=>setAvg(e.target.value)} />
      </div>
      {valid && result && (
        <div className="mt-5 grid md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-slate-900 text-white p-4">
            <div className="text-[11px] opacity-60">DELTA</div>
            <div className="text-2xl font-bold">₹{(numA-numB).toLocaleString("en-IN")}</div>
            <div className="mt-2 text-xs">A: ₹{numA} • B: ₹{numB}</div>
            <div className="mt-2"><Badge tone={result.type==="ROUNDING"?"neutral": result.type==="IMPLAUSIBLE"?"coral":"amber"}>{result.type}</Badge></div>
          </div>
          <div className="rounded-xl bg-white border border-slate-200 p-4">
            <div className="text-xs font-bold">Explain & Override</div>
            <div className="text-xs mt-2 space-y-1">
              <div><span className="font-semibold">What is wrong:</span> {result.what}</div>
              <div><span className="font-semibold">Why it matters:</span> {result.why}</div>
              <div><span className="font-semibold">Next action:</span> {result.next}</div>
              <div><span className="font-semibold">Confidence:</span> {result.confidence}</div>
              <div><span className="font-semibold">Source:</span> Synthetic • Freshness: {new Date().toISOString().slice(0,10)}</div>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="h-7 px-3 rounded-full bg-midnight text-white text-[11px]">Confirm & Keep</button>
              <button className="h-7 px-3 rounded-full bg-white border text-[11px]">Override with reason</button>
            </div>
          </div>
        </div>
      )}
      <div className="mt-4 text-[10px] text-slate-500">Prototype Simulation Only. Does not claim error or fraud. Human review required. Tolerance: ±Rs10 rounding, FY period mapping.</div>
    </div>
  );
}
