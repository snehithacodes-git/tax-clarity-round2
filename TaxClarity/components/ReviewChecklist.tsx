"use client";
import { useState } from "react";
import { shouldRefer } from "@/lib/engine/referral";

export default function ReviewChecklist(){
  const [q,setQ]=useState("");
  const referral = shouldRefer(q);
  return (
    <div className="card p-5">
      <div className="font-bold">Review & Referral Triggers</div>
      <p className="text-xs text-slate-500 mt-1">Type a question to test referral boundary. Example: "What is best way to reduce my tax?"</p>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Ask something..." className="mt-3 w-full h-9 rounded-lg border px-3 text-sm" />
      {referral.fired && (
        <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3">
          <div className="text-xs font-bold">STOP - Referral Trigger Fired: {referral.triggerId}</div>
          <div className="text-xs mt-1"><b>What is wrong:</b> {referral.whatIsWrong}</div>
          <div className="text-xs"><b>Why it matters:</b> {referral.whyItMatters}</div>
          <div className="text-xs"><b>Next:</b> {referral.nextAction}</div>
          <div className="text-xs mt-2 font-semibold">Recommendation: {referral.recommend}</div>
        </div>
      )}
      <div className="mt-4 space-y-2 text-xs">
        {[
          "Check Form16 issue date vs payslip period - Mar salary may be Apr credit",
          "Confirm employer TAN and AIS freshness timestamp",
          "Verify bank interest in AIS/TIS vs passbook",
          "If freelance invoice missing in AIS - declare manually with evidence",
          "If two latest Form16s claim latest - show side-by-side, do not choose silently",
          "If typo adds extra zero - flag for confirmation, allow legitimate high value after override"
        ].map((t,i)=><label key={i} className="flex gap-2"><input type="checkbox" /> <span>{t}</span></label>)}
      </div>
    </div>
  );
}
