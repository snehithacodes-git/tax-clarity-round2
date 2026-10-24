"use client";

import { useEffect, useMemo, useState } from "react";
import { shouldRefer } from "@/lib/engine/referral";

const tasks = [
  "Check Form 16 issue date against payslip periods; March salary may be credited in April.",
  "Confirm employer TAN and check the AIS/TIS freshness timestamp.",
  "Compare bank interest against AIS/TIS and bank statements.",
  "For freelance income, collect invoices or other available supporting evidence.",
  "If two corrected statements exist, compare them side by side instead of choosing silently.",
  "If a value looks unusually high, confirm the source before overriding the warning.",
];

export default function ReviewChecklist() {
  const [q, setQ] = useState("");
  const [checked, setChecked] = useState<boolean[]>(tasks.map(() => false));
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("taxclarity-review-checklist-v1");
      if (saved) { const parsed = JSON.parse(saved); if (Array.isArray(parsed) && parsed.length === tasks.length) setChecked(parsed.map(Boolean)); }
    } catch { /* Storage may be disabled; keep in-memory checklist. */ }
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try { window.localStorage.setItem("taxclarity-review-checklist-v1", JSON.stringify(checked)); } catch { /* Storage unavailable; checklist still works until reload. */ }
  }, [checked, hydrated]);
  const referral = useMemo(() => shouldRefer(q), [q]);
  const complete = checked.filter(Boolean).length;

  function toggleTask(index: number) {
    setChecked(current => current.map((value, i) => i === index ? !value : value));
  }

  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="font-bold">Review & Referral Checklist</div>
          <p className="mt-1 text-xs text-slate-500">Enter a question and get a visible review result. Try the examples if your wording is not recognized. Mark checks as you complete them.</p>
        </div>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">{complete}/{tasks.length} complete</span>
      </div>

      <label className="mt-4 block">
        <span className="text-xs font-semibold">Ask a review question</span>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder='Try: "What is the best way to reduce tax?"' className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
      </label>

      {q.trim() && (
        referral.fired ? (
          <div role="status" className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="text-xs font-bold text-amber-950">Professional-review boundary · {referral.triggerId}</div>
            <div className="mt-2 space-y-1 text-xs leading-5 text-amber-950">
              <p><b>Concern:</b> {referral.whatIsWrong}</p>
              <p><b>Why it matters:</b> {referral.whyItMatters}</p>
              <p><b>Next action:</b> {referral.nextAction}</p>
              <p><b>Suggested referral:</b> {referral.recommend}</p>
            </div>
          </div>
        ) : (
          <div role="status" className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-5 text-slate-700">
            <p className="font-bold">No escalation rule matched this exact wording.</p>
            <p className="mt-1">Try a more specific question or use the TaxClarity Assistant for general guidance. This is a keyword-based prototype, so no match is not proof that a tax position is safe or correct.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["How do I reduce tax using loans or insurance?", "Form 16 and AIS mismatch", "Freelance income with no invoices", "Can I hide income?"].map(example => <button key={example} type="button" onClick={() => setQ(example)} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-semibold text-indigo-700 hover:bg-indigo-50">{example}</button>)}
            </div>
          </div>
        )
      )}

      <div className="mt-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-bold">Your review tasks</h3>
          <button type="button" onClick={() => setChecked(tasks.map(() => false))} className="text-xs font-semibold text-indigo-700 hover:underline">Reset checklist</button>
        </div>
        <div className="mt-3 space-y-3">
          {tasks.map((task, i) => (
            <label key={task} className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-100 p-3 hover:bg-slate-50">
              <input type="checkbox" checked={checked[i]} onChange={() => toggleTask(i)} className="mt-0.5 h-4 w-4 accent-indigo-700" />
              <span className={`text-xs leading-5 ${checked[i] ? "text-slate-400 line-through" : "text-slate-700"}`}>{task}</span>
            </label>
          ))}
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${(complete / tasks.length) * 100}%` }} />
        </div>
        <p className="mt-2 text-[10px] text-slate-500">Checklist progress is saved in this browser when local storage is available; it does not sync to a server or other devices.</p>
      </div>
    </div>
  );
}
