"use client";

import { useEffect, useMemo, useState } from "react";
import { classify } from "@/lib/engine/reconciliation";
import { Badge } from "./ui/Badge";
import { Input } from "./ui/Input";

type Decision = { status: "CONFIRMED" | "OVERRIDDEN"; note: string; delta: number };

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);

export default function ReconciliationPanel() {
  const [a, setA] = useState("8500");
  const [b, setB] = useState("7000");
  const [avg, setAvg] = useState("7000");
  const [decision, setDecision] = useState<Decision | null>(null);
  const [showOverride, setShowOverride] = useState(false);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("taxclarity-reconciliation-v1");
      if (saved) {
        const data = JSON.parse(saved);
        if (typeof data.a === "string") setA(data.a);
        if (typeof data.b === "string") setB(data.b);
        if (typeof data.avg === "string") setAvg(data.avg);
        if (data.decision && (data.decision.status === "CONFIRMED" || data.decision.status === "OVERRIDDEN")) setDecision(data.decision);
        if (typeof data.reason === "string") setReason(data.reason);
      }
    } catch { /* Keep defaults if browser storage is unavailable. */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { window.localStorage.setItem("taxclarity-reconciliation-v1", JSON.stringify({ a, b, avg, decision, reason })); } catch { /* The current session still works without persistence. */ }
  }, [a, b, avg, decision, reason, hydrated]);

  const numA = a.trim() === "" ? NaN : Number(a);
  const numB = b.trim() === "" ? NaN : Number(b);
  const numAvg = avg.trim() === "" ? NaN : Number(avg);
  const valid = Number.isFinite(numA) && Number.isFinite(numB) && numA >= 0 && numB >= 0;
  const result = useMemo(
    () => valid ? classify(numA, numB, { avg: Number.isFinite(numAvg) && numAvg > 0 ? numAvg : undefined }) : null,
    [valid, numA, numB, numAvg]
  );

  const errA = a.trim() === "" ? "Required" : !Number.isFinite(numA) ? "Enter a valid number" : numA < 0 ? "Use a non-negative amount" : numA > 1000000000 ? "Amount is unusually large; confirm it" : "";
  const errB = b.trim() === "" ? "Required" : !Number.isFinite(numB) ? "Enter a valid number" : numB < 0 ? "Use a non-negative amount" : "";
  const delta = valid ? numA - numB : 0;

  function updateAmount(setter: (value: string) => void, value: string) {
    setter(value);
    setDecision(null);
    setMessage("");
  }

  function confirmResult() {
    if (!result) return;
    setDecision({ status: "CONFIRMED", note: "User confirmed this finding for the review record.", delta });
    setMessage("Finding marked as confirmed for this browser session. No external filing or permanent audit storage occurred.");
    setShowOverride(false);
  }

  function saveOverride() {
    if (!result) return;
    if (reason.trim().length < 8) {
      setMessage("Please enter an override reason of at least 8 characters.");
      return;
    }
    setDecision({ status: "OVERRIDDEN", note: reason.trim(), delta });
    setMessage("Override reason recorded for this browser session. The original finding remains visible above.");
    setShowOverride(false);
  }

  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="font-bold">Reconciliation Engine</div>
        <Badge tone="success">Interactive</Badge>
      </div>
      <p className="text-xs text-slate-500 mt-1">
        Enter figures from two sources. The difference and review guidance update as you type. Example values are synthetic.
      </p>

      <div className="mt-4 grid sm:grid-cols-3 gap-4">
        <Input label="Source A — Payslip sum (₹)" type="number" min="0" value={a} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateAmount(setA, e.target.value)} error={errA} />
        <Input label="Source B — Form 16 reference (₹)" type="number" min="0" value={b} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateAmount(setB, e.target.value)} error={errB} />
        <Input label="Typical amount for plausibility check (₹)" type="number" min="0" value={avg} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateAmount(setAvg, e.target.value)} />
      </div>

      {valid && result && (
        <div className="mt-5 grid md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-slate-900 text-white p-4">
            <div className="text-[11px] opacity-70">DIFFERENCE (A − B)</div>
            <div className="text-2xl font-bold mt-1">{money(delta)}</div>
            <div className="mt-2 text-xs opacity-80">Source A: {money(numA)} · Source B: {money(numB)}</div>
            <div className="mt-3"><Badge tone={result.type === "ROUNDING" ? "neutral" : result.type === "IMPLAUSIBLE" ? "coral" : "amber"}>{result.type}</Badge></div>
            <div className="mt-3 text-xs opacity-80">This classification is a rule-based prompt to investigate, not proof of an error or fraud.</div>
          </div>

          <div className="rounded-xl bg-white border border-slate-200 p-4">
            <div className="text-xs font-bold">Explanation and next steps</div>
            <div className="text-xs mt-3 space-y-2">
              <div><span className="font-semibold">Finding:</span> {result.what}</div>
              <div><span className="font-semibold">Why it matters:</span> {result.why}</div>
              <div><span className="font-semibold">Suggested next step:</span> {result.next}</div>
              <div><span className="font-semibold">Rule confidence:</span> {Math.round(result.confidence * 100)}% (heuristic, not statistical certainty)</div>
              <div><span className="font-semibold">Evaluation date:</span> {new Date().toLocaleDateString("en-IN")}</div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={confirmResult} className="h-9 px-4 rounded-full bg-midnight text-white text-xs font-semibold hover:bg-black">Confirm finding</button>
              <button type="button" onClick={() => { setShowOverride(v => !v); setMessage(""); }} className="h-9 px-4 rounded-full bg-white border border-slate-300 text-xs font-semibold hover:bg-slate-50">Override with reason</button>
            </div>
            {showOverride && (
              <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <label className="block text-xs font-semibold" htmlFor="override-reason">Why are you overriding this finding?</label>
                <textarea id="override-reason" value={reason} onChange={e => setReason(e.target.value)} rows={3} className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-2 text-sm" placeholder="e.g. The difference is explained by a salary credit in the next month." />
                <button type="button" onClick={saveOverride} className="mt-2 h-9 rounded-full bg-indigo-700 px-4 text-xs font-semibold text-white hover:bg-indigo-800">Save override reason</button>
              </div>
            )}
            {decision && (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900">
                <div className="font-bold">{decision.status === "CONFIRMED" ? "Finding confirmed" : "Finding overridden"}</div>
                <p className="mt-1">{decision.note}</p>
                <p className="mt-1">Recorded difference: {money(decision.delta)}</p>
              </div>
            )}
            {message && <p role="status" className="mt-3 text-xs text-slate-600">{message}</p>}
          </div>
        </div>
      )}

      {!valid && <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-900">Enter valid, non-negative amounts in both source fields to see the analysis.</p>}
      <div className="mt-4 text-[10px] text-slate-500">Prototype only. Inputs and decisions are saved in this browser when local storage is available. They are not synced to a server or sent to an external service.</div>
    </div>
  );
}
