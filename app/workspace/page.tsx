"use client";

import { useEffect, useState } from "react";
import ReconciliationPanel from "@/components/ReconciliationPanel";
import TaxPlanner from "@/components/TaxPlanner";
import ReviewChecklist from "@/components/ReviewChecklist";
import DiffView from "@/components/DiffView";
import LoanInsurancePlanner from "@/components/LoanInsurancePlanner";
import TaxAssistant from "@/components/TaxAssistant";
import DocumentsReview from "@/components/DocumentsReview";
import { syntheticDocs } from "@/lib/data/synthetic";

type Tab = "reconcile" | "plan" | "loans" | "assistant" | "review" | "diff" | "documents";

const tabs: { k: Tab; label: string; description: string }[] = [
  { k: "reconcile", label: "Reconciliation", description: "Compare amounts from two sources and record a review decision." },
  { k: "plan", label: "Tax Planning", description: "Enter income, deduction amounts and tax already paid to see prototype estimates." },
  { k: "loans", label: "Loans & Insurance", description: "Check EMI pressure, insurance premiums and an emergency-fund target." },
  { k: "assistant", label: "AI Assistant", description: "Ask general tax-workflow questions using a local rule-based assistant without paid AI credits." },
  { k: "review", label: "Review & Referral", description: "Test review triggers with immediate feedback and track review tasks." },
  { k: "diff", label: "Version Diff", description: "Inspect the original and corrected synthetic statement side by side." },
  { k: "documents", label: "Documents & Reports", description: "Import non-sensitive CSV/TXT/JSON rows, review fields, record status, and export a report." },
];

export default function Workspace() {
  const [tab, setTab] = useState<Tab>("reconcile");

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("tab");
    if (requested === "reconcile" || requested === "plan" || requested === "loans" || requested === "assistant" || requested === "review" || requested === "diff" || requested === "documents") {
      setTab(requested);
    }
  }, []);

  const active = tabs.find(t => t.k === tab) ?? tabs[0];

  function selectTab(next: Tab) {
    setTab(next);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", next);
    window.history.replaceState({}, "", url.toString());
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Interactive Workspace</h1>
          <p className="mt-1 text-xs text-slate-500">Enter values, review outputs, and record decisions. Examples are synthetic; calculations are estimates.</p>
        </div>
        <a href="/" className="h-9 px-4 rounded-full bg-white border border-slate-200 text-xs font-semibold flex items-center hover:bg-slate-50">← Back to Home</a>
      </div>

      <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="TaxClarity tools">
        {tabs.map(t => (
          <button
            key={t.k}
            type="button"
            role="tab"
            aria-selected={tab === t.k}
            onClick={() => selectTab(t.k)}
            className={`px-4 h-10 rounded-full border text-xs font-semibold transition ${tab === t.k ? "bg-midnight text-white border-midnight" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-3">
        <p className="text-xs text-slate-500">{active.description}</p>
      </div>

      <div className="mt-5 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 min-w-0">
          {tab === "reconcile" && <ReconciliationPanel />}
          {tab === "plan" && <TaxPlanner />}
          {tab === "loans" && <LoanInsurancePlanner />}
          {tab === "assistant" && <TaxAssistant />}
          {tab === "review" && <ReviewChecklist />}
          {tab === "diff" && <DiffView oldDoc={syntheticDocs[0]} newDoc={syntheticDocs[1]} />}
          {tab === "documents" && <DocumentsReview />}
        </div>

        <aside className="space-y-4">
          <div className="card p-4">
            <div className="text-xs font-bold">Workflow state reference</div>
            <div className="mt-3 space-y-2 text-[11px] leading-5">
              <div><span className="font-semibold">DeadlineState:</span> SAFE → AT_RISK_6D → CRITICAL → OVERDUE</div>
              <div><span className="font-semibold">DraftState:</span> DRAFT → VALIDATED → SUBMITTED_SIM → ACKNOWLEDGED_SIM / DEFECT_NOTICE → RESPONSE</div>
              <div><span className="font-semibold">DocumentState:</span> UPLOADED → SCANNED → VALIDATED → ACCEPTED_FOR_CALC → SUPERSEDED</div>
            </div>
            <div className="mt-3 text-[10px] leading-4 text-slate-500">The state-machine helpers are prototype logic. The workspace does not submit returns or connect to government systems.</div>
          </div>

          <div className="card p-4 bg-amber-50 border-amber-200">
            <div className="text-xs font-bold">⚠ Responsible use</div>
            <p className="text-[11px] text-slate-700 mt-2 leading-5">
              Educational prototype only. Do not enter PAN, Aadhaar, bank credentials or real taxpayer documents. Verify flagged findings against official records and current law.
            </p>
          </div>

          <div className="card p-4">
            <div className="text-xs font-bold">What happens to your input?</div>
            <p className="mt-2 text-[11px] leading-5 text-slate-600">The calculators update in the browser. Review rows and checklist progress are stored locally in this browser where supported; no server database or cross-device sync is configured.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
