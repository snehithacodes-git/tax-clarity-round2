"use client";
import { useState } from "react";
import ReconciliationPanel from "@/components/ReconciliationPanel";
import TaxPlanner from "@/components/TaxPlanner";
import ReviewChecklist from "@/components/ReviewChecklist";
import DiffView from "@/components/DiffView";
import { syntheticDocs } from "@/lib/data/synthetic";

export default function Workspace() {
  const [tab, setTab] = useState<"reconcile"|"plan"|"review"|"diff">("reconcile");
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-bold">Workspace</h1><p className="text-xs text-slate-500">Synthetic demo data • All calculations are estimates • No real taxpayer data</p></div>
        <div className="flex gap-2 bg-white border border-slate-200 rounded-full p-1">
          {[
            {k:"reconcile", l:"Reconciliation"},
            {k:"plan", l:"Tax Planning"},
            {k:"review", l:"Review & Referral"},
            {k:"diff", l:"Version Diff"}
          ].map(t=>(
            <button key={t.k} onClick={()=>setTab(t.k as any)} className={`px-4 h-8 rounded-full text-xs font-semibold ${tab===t.k ? 'bg-midnight text-white' : 'text-slate-600 hover:bg-slate-100'}`}>{t.l}</button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {tab==="reconcile" && <ReconciliationPanel />}
          {tab==="plan" && <TaxPlanner />}
          {tab==="review" && <ReviewChecklist />}
          {tab==="diff" && <DiffView oldDoc={syntheticDocs[0]} newDoc={syntheticDocs[1]} />}
        </div>
        <div className="space-y-4">
          <div className="card p-4">
            <div className="text-xs font-bold">State Machines (PS08 Requirement)</div>
            <div className="mt-3 space-y-2 text-[11px]">
              <div><span className="font-semibold">DeadlineState:</span> SAFE → AT_RISK_6D → CRITICAL</div>
              <div><span className="font-semibold">DraftState:</span> DRAFT → VALIDATED → SUBMITTED_SIM → ACKNOWLEDGED_SIM → DEFECT_NOTICE → RESPONSE</div>
              <div><span className="font-semibold">DocumentState:</span> UPLOADED → SCANNED → VALIDATED → ACCEPTED_FOR_CALC → SUPERSEDED</div>
            </div>
            <div className="mt-3 text-[10px] text-slate-500">All transitions append-only hash-chained audit log. No single collapsed status field.</div>
          </div>
          <div className="card p-4 bg-amber-50 border-amber-200">
            <div className="text-xs font-bold">⚠️ Responsible Use</div>
            <div className="text-[11px] text-slate-700 mt-2 leading-5">
              Educational prototype only. Not tax authority/CA. Do not store PAN/Aadhaar/bank credentials. Verify all flagged findings on official portal. Referral triggers fire for tax-advice questions.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
