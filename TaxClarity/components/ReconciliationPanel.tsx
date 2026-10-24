
"use client";

import { useEffect, useState } from "react";
import { classify } from "@/lib/engine/reconciliation";
import { Badge } from "./ui/Badge";
import { Input } from "./ui/Input";

type Decision = {
  status: "Confirmed" | "Overridden";
  reason: string;
  timestamp: string;
  amountA: number;
  amountB: number;
};

const STORAGE_KEY = "taxclarity-reconciliation-v1";

export default function ReconciliationPanel() {
  const [a, setA] = useState("8500");
  const [b, setB] = useState("7000");
  const [avg, setAvg] = useState("7000");
  const [decision, setDecision] = useState<Decision | null>(null);
  const [reason, setReason] = useState("");
  const [overrideOpen, setOverrideOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<Decision[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setDecision(data.decision ?? null);
        setHistory(data.history ?? []);
      }
    } catch {
      setMessage("Could not read saved reconciliation data.");
    }
  }, []);

  const numA = a.trim() === "" ? NaN : Number(a);
  const numB = b.trim() === "" ? NaN : Number(b);
  const average = avg.trim() === "" ? NaN : Number(avg);

  const valid =
    Number.isFinite(numA) &&
    Number.isFinite(numB) &&
    numA >= 0 &&
    numB >= 0 &&
    numA <= 100000000 &&
    numB <= 100000000;

  const result = valid
    ? classify(numA, numB, {
        avg:
          Number.isFinite(average) && average >= 0
            ? average
            : undefined,
      })
    : null;

  const errA =
    a.trim() === ""
      ? "Required"
      : !Number.isFinite(numA)
        ? "Invalid number"
        : numA < 0
          ? "Negative not allowed"
          : numA > 100000000
            ? "Value too large"
            : "";

  const errB =
    b.trim() === ""
      ? "Required"
      : !Number.isFinite(numB)
        ? "Invalid number"
        : numB < 0
          ? "Negative not allowed"
          : numB > 100000000
            ? "Value too large"
            : "";

  function persist(next: Decision) {
    const nextHistory = [...history, next];

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          decision: next,
          history: nextHistory,
        })
      );

      setDecision(next);
      setHistory(nextHistory);
      return true;
    } catch {
      setMessage("Could not save. Check browser storage settings.");
      return false;
    }
  }

  function confirmDecision() {
    if (!valid || !result) {
      setMessage("Enter valid amounts before confirming.");
      return;
    }

    const saved = persist({
      status: "Confirmed",
      reason: "Confirmed after reviewing the displayed amounts.",
      timestamp: new Date().toISOString(),
      amountA: numA,
      amountB: numB,
    });

    if (saved) setMessage("Reconciliation confirmed and saved.");
  }

  function submitOverride() {
    if (!valid || !result) {
      setMessage("Enter valid amounts before overriding.");
      return;
    }

    if (!reason.trim()) {
      setMessage("Please enter a reason for the override.");
      return;
    }

    const saved = persist({
      status: "Overridden",
      reason: reason.trim(),
      timestamp: new Date().toISOString(),
      amountA: numA,
      amountB: numB,
    });

    if (saved) {
      setOverrideOpen(false);
      setReason("");
      setMessage("Override saved successfully.");
    }
  }

  return (
    <section className="card space-y-5 p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold">Reconciliation Engine</h2>
        <Badge tone="success">Live calculation</Badge>
      </div>

      <p className="text-xs text-slate-500">
        Demo data only. Compare two amounts and record your decision.
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        <Input
          label="Source A (₹)"
          value={a}
          onChange={(e: any) => setA(e.target.value)}
          error={errA}
        />
        <Input
          label="Source B (₹)"
          value={b}
          onChange={(e: any) => setB(e.target.value)}
          error={errB}
        />
        <Input
          label="Reference average (₹)"
          value={avg}
          onChange={(e: any) => setAvg(e.target.value)}
        />
      </div>

      {valid && result && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-slate-900 p-4 text-white">
            <p className="text-xs opacity-70">AMOUNT DIFFERENCE</p>
            <p className="mt-1 text-2xl font-bold">
              ₹{(numA - numB).toLocaleString("en-IN")}
            </p>
            <p className="mt-3 text-sm">Finding: {result.type}</p>
          </div>

          <div className="rounded-xl border p-4">
            <h3 className="font-bold">Explain & Reconcile</h3>
            <div className="mt-3 space-y-2 text-sm">
              <p><b>Finding:</b> {result.what}</p>
              <p><b>Why it matters:</b> {result.why}</p>
              <p><b>Next action:</b> {result.next}</p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={confirmDecision}
                className="rounded-full bg-midnight px-4 py-2 text-xs font-semibold text-white"
              >
                Confirm & Keep
              </button>

              <button
                type="button"
                onClick={() => {
                  setMessage("");
                  setReason("");
                  setOverrideOpen(true);
                }}
                className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold hover:bg-slate-100"
              >
                Override with reason
              </button>
            </div>
          </div>
        </div>
      )}

      {overrideOpen && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4">
          <h3 className="font-bold">Override reconciliation</h3>
          <p className="mt-1 text-sm text-slate-600">
            Enter why you are overriding this finding. Your reason will be
            saved with the decision.
          </p>

          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="For example: Verified against the corrected source document..."
            className="mt-3 min-h-24 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm"
          />

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={submitOverride}
              disabled={!reason.trim()}
              className="rounded-full bg-midnight px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save override
            </button>

            <button
              type="button"
              onClick={() => {
                setOverrideOpen(false);
                setReason("");
                setMessage("");
              }}
              className="rounded-full border bg-white px-4 py-2 text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {message && (
        <p role="status" aria-live="polite" className="text-sm">
          {message}
        </p>
      )}

      {decision && (
        <div className="rounded-xl border p-4">
          <h3 className="font-bold">Latest saved decision</h3>
          <p className="mt-2 text-sm">
            Status: <b>{decision.status}</b>
          </p>
          <p className="mt-1 text-sm">Reason: {decision.reason}</p>
          <p className="mt-1 text-xs text-slate-500">
            {new Date(decision.timestamp).toLocaleString()}
          </p>
        </div>
      )}

      {history.length > 0 && (
        <div>
          <h3 className="font-bold">Decision history</h3>
          <ul className="mt-3 space-y-3">
            {[...history].reverse().map((item, index) => (
              <li
                key={`${item.timestamp}-${index}`}
                className="rounded-lg border p-3 text-sm"
              >
                <b>{item.status}</b>
                <p className="mt-1">{item.reason}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {new Date(item.timestamp).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-xs text-slate-500">
        Prototype decisions are stored in this browser. They are not a
        server-side or tamper-proof audit record.
      </p>
    </section>
  );
}
