
"use client";

import { useState } from "react";
import { shouldRefer } from "@/lib/engine/referral";

type ReviewAnswer = {
  title: string;
  summary: string;
  details: string[];
  referral: boolean;
};

const examples = [
  "How do I verify a mismatch between Form 16 and AIS?",
  "My freelance income has no invoices.",
  "Two corrected documents both appear to be the latest.",
  "What is the best way to reduce tax?",
];

export default function ReviewChecklist() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<ReviewAnswer | null>(null);

  function handleReview() {
    const q = question.trim();

    if (!q) {
      setAnswer({
        title: "Enter a question to begin",
        summary: "Tell us what you need help checking.",
        details: [
          "Choose an example below or enter a question about your records.",
        ],
        referral: false,
      });
      return;
    }

    const referral = shouldRefer(q);

    if (referral.fired) {
      setAnswer({
        title: "This needs additional verification",
        summary:
          "TaxClarity has detected a situation that should not be resolved by this basic checklist alone.",
        details: [
          `What we noticed: ${referral.whatIsWrong}`,
          `Why it matters: ${referral.whyItMatters}`,
          `What to do next: ${referral.nextAction}`,
          `Where to get help: ${referral.recommend}`,
          `Reference trigger: ${referral.triggerId}`,
        ],
        referral: true,
      });
      return;
    }

    const lower = q.toLowerCase();
    let details: string[];

    if (/refund|refund status/.test(lower)) {
      details = [
        "What to check: your return status and refund status.",
        "Why it matters: a refund status and a return-processing status are not always the same.",
        "Next step: check the official Income Tax e-Filing portal.",
      ];
    } else if (
      /form.?16|ais|tis|26as|mismatch|does not match/.test(lower)
    ) {
      details = [
        "What to check: compare the amounts, financial periods and source details across the relevant records.",
        "Why it matters: a difference may be caused by timing, an entry error or a source document that needs correction.",
        "Next step: identify the exact amount that differs, confirm which period each record covers, and contact the issuer if needed.",
      ];
    } else if (/deduction|80c|80d|insurance|loan|nps/.test(lower)) {
      details = [
        "What to check: the selected tax regime, eligible payment, supporting proof and applicable financial-year rules.",
        "Why it matters: an amount paid is not automatically an eligible deduction, and a deduction is not the same as tax saved.",
        "Next step: verify the current official rules before buying a product or claiming an amount.",
      ];
    } else if (/notice|penalty|deadline|defect/.test(lower)) {
      details = [
        "What to check: the exact notice, deadline and action requested.",
        "Why it matters: missing a response deadline can have consequences.",
        "Next step: verify the notice through official channels and seek qualified help if you are unsure how to respond.",
      ];
    } else {
      details = [
        "What to check: identify the document, amount, financial year and specific issue involved.",
        "Why it matters: this prototype only recognizes a limited set of configured patterns.",
        "Next step: provide more detail or verify the issue with an official source or qualified professional.",
      ];
    }

    setAnswer({
      title: "Suggested review steps",
      summary:
        "No configured referral rule matched this wording. That does not mean the issue is risk-free or that your tax position has been verified.",
      details,
      referral: false,
    });
  }

  return (
    <section className="card space-y-4 p-5">
      <div>
        <h2 className="text-lg font-bold">Review your tax question</h2>
        <p className="mt-1 text-sm text-slate-600">
          Describe the issue. TaxClarity will check its configured rules and
          suggest a next step.
        </p>
      </div>

      <label htmlFor="tax-review-question" className="block text-sm font-medium">
        What are you trying to resolve?
      </label>

      <textarea
        id="tax-review-question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleReview();
          }
        }}
        placeholder="Example: My Form 16 amount differs from AIS..."
        className="min-h-28 w-full rounded-lg border border-slate-300 p-3 text-sm"
        aria-describedby="review-help"
      />

      <p id="review-help" className="text-xs text-slate-500">
        Press Enter to review or Shift+Enter for a new line. Do not enter PAN,
        Aadhaar, bank account numbers or other sensitive personal details.
      </p>

      <div>
        <p className="mb-2 text-xs font-semibold text-slate-600">
          Try an example
        </p>
        <div className="flex flex-wrap gap-2">
          {examples.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => {
                setQuestion(example);
                setAnswer(null);
              }}
              className="rounded-full border border-slate-300 px-3 py-2 text-left text-xs hover:bg-slate-50"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleReview}
          className="rounded-full bg-midnight px-5 py-3 text-sm font-semibold text-white"
        >
          Review question
        </button>

        <button
          type="button"
          onClick={() => {
            setQuestion("");
            setAnswer(null);
          }}
          className="rounded-full border px-5 py-3 text-sm"
        >
          Clear
        </button>
      </div>

      {answer && (
        <section
          aria-live="polite"
          className={`rounded-xl border p-4 ${
            answer.referral
              ? "border-amber-300 bg-amber-50"
              : "border-slate-200 bg-slate-50"
          }`}
        >
          <h3 className="font-bold">{answer.title}</h3>
          <p className="mt-2 text-sm">{answer.summary}</p>

          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm">
            {answer.details.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ol>
        </section>
      )}

      <p className="text-xs text-slate-500">
        Prototype only. This review uses local keyword rules, not a full AI
        system or a verified legal or tax opinion. Confirm important decisions
        through official sources.
      </p>
    </section>
  );
}
