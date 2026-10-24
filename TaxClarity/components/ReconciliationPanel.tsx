
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
        avg: Number.isFinite(average) && average >= 0
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

  function saveDecision(
    status: Decision["status"],
    decisionReason: string
  ) {
    if (!valid || !result) {
      setMessage("Please enter valid, non-negative amounts first.");
      return;
    }

    const next: Decision = {
      status,
      reason: decisionReason,
      timestamp: new Date().toISOString(),
      amountA: numA,
      amountB: numB,
    };

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
      setMessage(
        status === "Confirmed"
          ? "Reconciliation confirmed and saved in this browser."
          : "Override saved with its reason."
      );
      setOverrideOpen(false);
      setReason("");
    } catch {
      setMessage("Save failed. Please check browser storage settings.");
    }
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-bold">Reconciliation Engine</h2>
        <Badge tone="success">Live calculation</Badge>
      </div>

      <p className="mt-1 text-xs text-slate-500">
        Compare two amounts and record a reconciliation decision.
        Demo data only.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Input
          label="Source A - Payslip Sum (₹)"
          value={a}
          onChange={(e: any) => {
            setA(e.target.value);
            setMessage("");
          }}
          error={errA}
        />

        <Input
          label="Source B - Form 16 Reference (₹)"
          value={b}
          onChange={(e: any) => {
            setB(e.target.value);
            setMessage("");
          }}
          error={errB}
        />

        <Input
          label="Average for plausibility check (₹)"
          value={avg}
          onChange={(e: any) => setAvg(e.target.value)}
        />
      </div>

      {valid && result && (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-slate-900 p-4 text-white">
            <div className="text-xs opacity-70">AMOUNT DIFFERENCE</div>
            <div className="mt-1 text-2xl font-bold">
              ₹{(numA - numB).toLocaleString("en-IN")}
            </div>
            <div className="mt-2 text-xs">
              Source A: ₹{numA.toLocaleString("en-IN")}
            </div>
            <div className="text-xs">
              Source B: ₹{numB.toLocaleString("en-IN")}
            </div>
            <div className="mt-3">
              <Badge
                tone={
                  result.type === "ROUNDING"
                    ? "neutral"
                    : result.type === "IMPLAUSIBLE"
                      ? "coral"
                      : "amber"
                }
              >
                {result.type}
              </Badge>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <h3 className="text-sm font-bold">Explain & Reconcile</h3>

            <div className="mt-3 space-y-2 text-xs">
              <p><b>Finding:</b> {result.what}</p>
              <p><b>Why it matters:</b> {result.why}</p>
              <p><b>Next action:</b> {result.next}</p>
              <p><b>Confidence:</b> {result.confidence}</p>
            </div>

            {decision && (
              <div className="mt-3 rounded-lg border p-3 text-sm">
                <p className="font-semibold">
                  Current decision: {decision.status}
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  Reason: {decision.reason}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {new Date(decision.timestamp).toLocaleString()}
                </p>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  saveDecision(
                    "Confirmed",
                    "Confirmed after reviewing the displayed amounts."
                  )
                }
                className="rounded-full bg-midnight px-4 py-2 text-xs font-semibold text-white"
              >
                Confirm & Keep
              </button>

              <button
                type="button"
                onClick={() => {
                  setReason("");
                  setOverrideOpen(true);
                  setMessage("");
                }}
                className="rounded-full border px-4 py-2 text-xs font-semibold"
              >
                Override with reason
              </button>
            </div>
          </div>
        </div>
      )}

      {overrideOpen && (
        <div className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4">
          <h3 className="font-bold">Override reconciliation</h3>
          <p className="mt-1 text-sm text-slate-600">
            Explain why the displayed reconciliation finding should be
            overridden. This reason will be saved with the decision.
          </p>

          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter a specific reason for this override..."
            className="mt-3 min-h-24 w-full rounded-lg border bg-white p-3 text-sm"
          />

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              disabled={!reason.trim()}
              onClick={() => {
                if (!reason.trim()) {
                  setMessage("An override reason is required.");
                  return;
                }
                saveDecision("Overridden", reason.trim());
              }}
              className="rounded-full bg-midnight px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
            >
              Save override
            </button>

            <button
              type="button"
              onClick={() => setOverrideOpen(false)}
              className="rounded-full border bg-white px-4 py-2 text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {message && (
        <p role="status" aria-live="polite" className="mt-4 text-sm">
          {message}
        </p>
      )}

      {history.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <h3 className="font-bold text-sm">Decision history</h3>
          <ul className="mt-3 space-y-3">
            {[...history].reverse().map((item, index) => (
              <li key={`${item.timestamp}-${index}`} className="text-xs">
                <b>{item.status}</b> — A: ₹
                {item.amountA.toLocaleString("en-IN")} / B: ₹
                {item.amountB.toLocaleString("en-IN")}
                <p className="mt-1 text-slate-600">{item.reason}</p>
                <p className="text-slate-500">
                  {new Date(item.timestamp).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-4 text-xs text-slate-500">
        Prototype only. Decisions are stored in this browser and are not
        a server-side audit log. Confirming or overriding does not establish
        that the underlying tax figures are correct.
      </p>
    </div>
  );
}
