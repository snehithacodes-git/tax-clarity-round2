
"use client";

import { useState } from "react";
import { shouldRefer } from "@/lib/engine/referral";

export default function ReviewChecklist() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<{
    title: string;
    details: string[];
    referral: boolean;
  } | null>(null);

  function handleReview() {
    const q = question.trim();

    if (!q) {
      setAnswer({
        title: "Please enter a question",
        details: ["Enter your tax question before starting the review."],
        referral: false,
      });
      return;
    }

    const result = shouldRefer(q);

    if (result.fired) {
      setAnswer({
        title: `Referral triggered: ${result.triggerId}`,
        details: [
          `What was detected: ${result.whatIsWrong}`,
          `Why it matters: ${result.whyItMatters}`,
          `Recommended next step: ${result.nextAction}`,
          `Referral recommendation: ${result.recommend}`,
        ],
        referral: true,
      });
      return;
    }

    const lower = q.toLowerCase();
    const details: string[] = [];

    if (/refund|refund status/.test(lower)) {
      details.push(
        "Check the return status and refund status on the official Income Tax e-Filing portal."
      );
    } else if (/deduction|80c|80d|insurance|loan/.test(lower)) {
      details.push(
        "Review the applicable tax regime, eligibility conditions, supporting documents and statutory limits before claiming a deduction."
      );
    } else if (/form.?16|ais|tis|26as|mismatch/.test(lower)) {
      details.push(
        "Compare the relevant tax statement with Form 16, AIS/TIS and supporting records. Investigate discrepancies before filing."
      );
    } else if (/calculate|tax|income|salary/.test(lower)) {
      details.push(
        "Review the income figures, deductions, tax regime, TDS and assumptions used by the tax calculator."
      );
    } else {
      details.push(
        "The rule-based review did not identify a configured referral trigger for this question."
      );
      details.push(
        "Please provide the relevant tax detail or document type for a more targeted review."
      );
    }

    details.push(
      "This is a preliminary checklist, not a verified legal or tax conclusion. Confirm applicable rules and figures before acting."
    );

    setAnswer({
      title: "Review results",
      details,
      referral: false,
    });
  }

  return (
    <div className="card p-5">
      <h2 className="font-bold text-lg">Review & Referral Triggers</h2>

      <p className="text-sm text-slate-500 mt-1">
        Ask a tax-related question to run the local rule-based review.
      </p>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleReview();
          }
        }}
        placeholder="Example: How can I verify a Form 16 mismatch?"
        className="mt-4 w-full min-h-24 rounded-lg border p-3 text-sm"
      />

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={handleReview}
          className="rounded-full bg-midnight px-4 py-2 text-sm font-semibold text-white"
        >
          Review question
        </button>

        <button
          type="button"
          onClick={() => {
            setQuestion("");
            setAnswer(null);
          }}
          className="rounded-full border px-4 py-2 text-sm"
        >
          Clear
        </button>
      </div>

      {answer && (
        <section
          aria-live="polite"
          className={`mt-5 rounded-xl border p-4 ${
            answer.referral
              ? "border-amber-300 bg-amber-50"
              : "border-slate-200 bg-slate-50"
          }`}
        >
          <h3 className="font-bold">{answer.title}</h3>

          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
            {answer.details.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-4 text-xs text-slate-500">
        No external AI service is used. Results are based on configured rules
        and keyword matching, not a full conversational AI system.
      </p>
    </div>
  );
}
