
"use client";

import { useState } from "react";
import ReconciliationPanel from "@/components/ReconciliationPanel";
import TaxPlanner from "@/components/TaxPlanner";
import TaxSavingPlan from "@/components/TaxSavingPlan";
import ReviewChecklist from "@/components/ReviewChecklist";
import DiffView from "@/components/DiffView";
import { syntheticDocs } from "@/lib/data/synthetic";

type Tab = "reconcile" | "plan" | "saving" | "review" | "diff";

export default function Workspace() {
  const [tab, setTab] = useState<Tab>("reconcile");

  const tabs: { k: Tab; l: string }[] = [
    { k: "reconcile", l: "Reconciliation" },
    { k: "plan", l: "Tax Planning" },
    { k: "saving", l: "Tax Saving Plan" },
    { k: "review", l: "Review & Referral" },
    { k: "diff", l: "Version Diff" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Workspace</h1>
          <p className="text-xs text-slate-500">
            Synthetic demo data • Calculations are estimates • No real taxpayer data
          </p>
        </div>

        <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-1">
          {tabs.map((item) => (
            <button
              key={item.k}
              type="button"
              onClick={() => setTab(item.k)}
              aria-pressed={tab === item.k}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                tab === item.k
                  ? "bg-midnight text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {item.l}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          {tab === "reconcile" && <ReconciliationPanel />}

          {tab === "plan" && <TaxPlanner />}

          {tab === "saving" && <TaxSavingPlan />}

          {tab === "review" && <ReviewChecklist />}

          {tab === "diff" && (
            <DiffView
              oldDoc={syntheticDocs[0]}
              newDoc={syntheticDocs[1]}
            />
          )}
        </div>

        <aside className="space-y-4">
          <div className="card p-4">
            <h2 className="text-xs font-bold">
              State Machines (PS08 Requirement)
            </h2>

            <div className="mt-3 space-y-2 text-[11px]">
              <p>
                <span className="font-semibold">DeadlineState:</span>{" "}
                SAFE → AT_RISK_6D → CRITICAL
              </p>

              <p>
                <span className="font-semibold">DraftState:</span>{" "}
                DRAFT → VALIDATED → SUBMITTED_SIM → ACKNOWLEDGED_SIM →
                DEFECT_NOTICE → RESPONSE
              </p>

              <p>
                <span className="font-semibold">DocumentState:</span>{" "}
                UPLOADED → SCANNED → VALIDATED → ACCEPTED_FOR_CALC →
                SUPERSEDED
              </p>
            </div>

            <p className="mt-3 text-[10px] text-slate-500">
              Demonstration state transitions. Verify audit implementation
              separately before describing the log as append-only or tamper-proof.
            </p>
          </div>

          <div className="card border border-amber-200 bg-amber-50 p-4">
            <h2 className="text-xs font-bold">
              Responsible Use
            </h2>

            <p className="mt-2 text-[11px] leading-5 text-slate-700">
              Educational prototype only. Not a tax authority or substitute
              for professional advice. Do not store PAN, Aadhaar, or bank
              credentials. Verify tax rules and findings using official sources.
              Referral results are preliminary and depend on the rules implemented.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
