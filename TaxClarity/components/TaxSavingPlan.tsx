
"use client";

import { useMemo, useState } from "react";

type Regime = "old" | "new";
type PropertyType = "none" | "self" | "letout";

type PlanItem = {
  title: string;
  section: string;
  amountToReview: number;
  action: string;
  note: string;
};

const money = (value: number) =>
  "₹" + Math.round(value).toLocaleString("en-IN");

const toAmount = (value: string) => {
  if (value.trim() === "") return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
};

function AmountField({
  label,
  value,
  onChange,
  help,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  help?: string;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input
        type="number"
        min="0"
        step="1"
        inputMode="numeric"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm"
      />
      {help && (
        <span className="mt-1 block text-xs font-normal text-slate-500">
          {help}
        </span>
      )}
    </label>
  );
}

export default function TaxSavingPlan() {
  const [income, setIncome] = useState("1200000");
  const [regime, setRegime] = useState<Regime>("old");
  const [budget, setBudget] = useState("5000");
  const [used80C, setUsed80C] = useState("80000");
  const [selfInsurance, setSelfInsurance] = useState("0");
  const [parentInsurance, setParentInsurance] = useState("0");
  const [parentSenior, setParentSenior] = useState(false);
  const [educationInterest, setEducationInterest] = useState("0");
  const [homeInterest, setHomeInterest] = useState("0");
  const [homeType, setHomeType] = useState<PropertyType>("none");
  const [employerNps, setEmployerNps] = useState("0");
  const [generated, setGenerated] = useState(false);

  const annualIncome = toAmount(income);
  const monthlyBudget = toAmount(budget);
  const existing80C = toAmount(used80C);
  const selfPremium = toAmount(selfInsurance);
  const parentPremium = toAmount(parentInsurance);
  const education = toAmount(educationInterest);
  const home = toAmount(homeInterest);
  const employer = toAmount(employerNps);

  // These are illustrative review limits from the existing prototype,
  // not a current-year eligibility engine. Verify all applicable rules.
  const cap80C = 150000;
  const selfHealthCap = 25000;
  const parentHealthCap = parentSenior ? 50000 : 25000;
  const selfHealthForReview = Math.min(selfPremium, selfHealthCap);
  const parentHealthForReview = Math.min(parentPremium, parentHealthCap);
  const unused80CCapacity = Math.max(0, cap80C - Math.min(existing80C, cap80C));

  const plan = useMemo<PlanItem[]>(() => {
    const items: PlanItem[] = [];

    if (regime === "old") {
      items.push({
        title: "Check eligible Section 80C payments",
        section: "Section 80C",
        amountToReview: unused80CCapacity,
        action:
          "First total any eligible EPF, PPF, tuition fees, life-insurance premiums and other qualifying payments already made. Only consider further saving if it fits your needs and budget.",
        note:
          "The remaining amount is unused capacity under the prototype's illustrative limit, not a recommendation to invest and not tax saved. Shared limits and eligibility must be checked.",
      });

      items.push({
        title: "Review health insurance for yourself and family",
        section: "Section 80D",
        amountToReview: Math.max(0, selfHealthCap - selfHealthForReview),
        action:
          "Check existing coverage, who paid the premium and whether the payment meets the applicable conditions.",
        note:
          "The unused figure is a review prompt only. Do not purchase a policy solely for a possible deduction.",
      });

      items.push({
        title: "Review health expenses or insurance for parents",
        section: "Section 80D",
        amountToReview: Math.max(0, parentHealthCap - parentHealthForReview),
        action:
          "Confirm your parents' ages, existing policies, who paid and the conditions that apply to the claim.",
        note:
          "The limit shown is illustrative. The applicable limit and qualifying expenses must be verified for the relevant year.",
      });

      items.push({
        title: "Check education-loan interest",
        section: "Section 80E",
        amountToReview: education,
        action:
          "If you already have an eligible education loan, obtain the annual interest certificate and check the borrower, lender and course conditions.",
        note:
          "This is the amount you entered, not a verified deduction. Do not take a loan solely for tax benefits.",
      });

      if (homeType === "self" && home > 0) {
        items.push({
          title: "Check interest on a self-occupied home loan",
          section: "Section 24(b) review",
          amountToReview: Math.min(home, 200000),
          action:
            "Review the interest certificate, property use, ownership and relevant conditions before claiming.",
          note:
            "The displayed cap is illustrative and does not confirm eligibility. Verify the applicable year and regime.",
        });
      }

      if (homeType === "letout" && home > 0) {
        items.push({
          title: "Review your let-out property calculation",
          section: "House property",
          amountToReview: home,
          action:
            "Consider rent, eligible interest and the relevant loss set-off rules together. Do not treat the interest amount alone as your tax saving.",
          note:
            "Property income rules are more complex than this checklist. Get the complete calculation verified.",
        });
      }
    } else {
      items.push({
        title: "Compare the two tax regimes",
        section: "Regime comparison",
        amountToReview: 0,
        action:
          "Compare total tax under both regimes using the correct tax year, salary details, applicable deductions and current official rules before deciding.",
        note:
          "This component does not calculate final tax or determine which regime is better for you.",
      });

      items.push({
        title: "Check employer NPS contributions",
        section: "Employer contribution review",
        amountToReview: employer,
        action:
          "Check your salary statement, employer contribution and the conditions and limits applicable to your tax year.",
        note:
          "This is the amount entered for review, not a verified deduction. Different contribution types can have different treatment.",
      });

      if (homeType === "letout" && home > 0) {
        items.push({
          title: "Review interest on let-out property",
          section: "House property",
          amountToReview: home,
          action:
            "Check the full house-property calculation and restrictions under the selected regime.",
          note:
            "Do not assume the entire interest amount reduces taxable salary or tax payable.",
        });
      }

      items.push({
        title: "Protect your finances first",
        section: "Budget and protection",
        amountToReview: 0,
        action:
          "Prioritize essential expenses, emergency savings and suitable insurance based on actual needs and affordability.",
        note:
          "Avoid borrowing or buying a financial product just because it appears in a tax checklist.",
      });
    }

    return items;
  }, [
    regime,
    unused80CCapacity,
    selfHealthForReview,
    parentHealthForReview,
    parentHealthCap,
    education,
    homeType,
    home,
    employer,
  ]);

  const enteredAmountsForReview =
    (regime === "old" ? Math.min(existing80C, cap80C) : 0) +
    (regime === "old"
      ? selfHealthForReview + parentHealthForReview
      : 0) +
    (regime === "old" ? education : 0) +
    (regime === "old" && homeType === "self"
      ? Math.min(home, 200000)
      : 0);

  function update(setter: (value: string) => void, value: string) {
    setter(value);
    setGenerated(false);
  }

  return (
    <section className="space-y-4">
      <div className="card space-y-5 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Planning checklist · Demo
          </p>
          <h2 className="mt-1 text-xl font-bold">
            Build your tax-saving review plan
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Answer what you know. TaxClarity will organize possible items to
            check and suggest next steps. It does not verify documents, calculate
            final tax or guarantee that a deduction is allowed.
          </p>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm">
          <p className="font-semibold">Before you begin</p>
          <p className="mt-1 text-slate-700">
            Use amounts for the relevant financial year. Estimates and limits
            in this prototype are illustrative; verify current official rules.
            Do not enter PAN, Aadhaar or bank account details.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <AmountField
            label="Annual income (₹)"
            value={income}
            onChange={(v) => update(setIncome, v)}
            help="Enter your approximate annual income before deductions."
          />

          <AmountField
            label="Monthly amount available to save (₹)"
            value={budget}
            onChange={(v) => update(setBudget, v)}
            help="An affordability input, not a recommended investment."
          />

          <label className="block text-sm font-medium">
            Tax regime you want to review
            <select
              value={regime}
              onChange={(e) => {
                setRegime(e.target.value as Regime);
                setGenerated(false);
              }}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm"
            >
              <option value="old">Old regime</option>
              <option value="new">New regime</option>
            </select>
            <span className="mt-1 block text-xs font-normal text-slate-500">
              This selection does not confirm that this regime is best for you.
            </span>
          </label>

          <AmountField
            label="Eligible 80C payments already made (₹)"
            value={used80C}
            onChange={(v) => update(setUsed80C, v)}
            help="Enter qualifying payments already made, if known."
          />

          <AmountField
            label="Health insurance premiums paid for self/family (₹)"
            value={selfInsurance}
            onChange={(v) => update(setSelfInsurance, v)}
            help="Enter the amount paid, not a future planned purchase."
          />

          <AmountField
            label="Health insurance premiums paid for parents (₹)"
            value={parentInsurance}
            onChange={(v) => update(setParentInsurance, v)}
            help="Enter the amount paid, if applicable."
          />

          <label className="flex items-start gap-3 rounded-lg border p-3 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={parentSenior}
              onChange={(e) => {
                setParentSenior(e.target.checked);
                setGenerated(false);
              }}
              className="mt-1"
            />
            <span>
              <span className="font-medium">
                A parent may qualify under a senior-citizen limit
              </span>
              <span className="mt-1 block text-xs text-slate-500">
                Select only if relevant; age and all statutory conditions must
                be checked separately.
              </span>
            </span>
          </label>

          <AmountField
            label="Education-loan interest paid this year (₹)"
            value={educationInterest}
            onChange={(v) => update(setEducationInterest, v)}
            help="Interest only; do not include principal repayment."
          />

          <AmountField
            label="Home-loan interest paid this year (₹)"
            value={homeInterest}
            onChange={(v) => update(setHomeInterest, v)}
            help="Use the lender's interest certificate if available."
          />

          <label className="block text-sm font-medium">
            Property type
            <select
              value={homeType}
              onChange={(e) => {
                setHomeType(e.target.value as PropertyType);
                setGenerated(false);
              }}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm"
            >
              <option value="none">No home-loan claim</option>
              <option value="self">Self-occupied property</option>
              <option value="letout">Let-out property</option>
            </select>
          </label>

          <AmountField
            label="Employer NPS contribution (₹)"
            value={employerNps}
            onChange={(v) => update(setEmployerNps, v)}
            help="Enter the employer contribution if known."
          />
        </div>

        <button
          type="button"
          onClick={() => setGenerated(true)}
          className="w-full rounded-full bg-midnight px-5 py-3 text-sm font-semibold text-white sm:w-auto"
        >
          Generate my review plan
        </button>
      </div>

      {generated && (
        <>
          <div className="card space-y-4 p-5">
            <div>
              <h3 className="text-lg font-bold">Your summary</h3>
              <p className="mt-1 text-sm text-slate-600">
                These numbers organize your inputs. They do not represent tax
                saved or a confirmed deduction.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border p-4">
                <p className="text-xs text-slate-500">Annual income entered</p>
                <p className="mt-1 text-xl font-bold">{money(annualIncome)}</p>
              </div>

              <div className="rounded-xl border p-4">
                <p className="text-xs text-slate-500">Monthly saving budget</p>
                <p className="mt-1 text-xl font-bold">{money(monthlyBudget)}</p>
              </div>

              <div className="rounded-xl border p-4 sm:col-span-2">
                <p className="text-xs text-slate-500">
                  Entered amounts to review
                </p>
                <p className="mt-1 text-xl font-bold">
                  {money(enteredAmountsForReview)}
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  This indicative sum includes selected entered amounts. It may
                  contain amounts that are not eligible, and it does not
                  include a verified assessment of overlapping claims, all
                  statutory conditions or the applicable tax year.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <h4 className="font-semibold">What this number does not mean</h4>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-5">
                <li>It is not the amount of tax you will save.</li>
                <li>It is not confirmation that a claim is eligible.</li>
                <li>
                  Unused deduction capacity is different from money already
                  paid or invested.
                </li>
                <li>
                  A deduction from taxable income does not reduce tax by the
                  same amount.
                </li>
              </ul>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-lg font-bold">Recommended next steps</h3>
            <p className="mt-1 text-sm text-slate-600">
              Work through the checklist in order. Skip anything that does not
              apply to you.
            </p>

            <div className="mt-4 space-y-4">
              {plan.map((item, index) => (
                <article
                  key={item.title}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold">
                      {index + 1}
                    </span>

                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="mt-1 text-xs font-medium text-slate-500">
                        {item.section}
                      </p>

                      {item.amountToReview > 0 && (
                        <p className="mt-2 text-sm font-semibold">
                          Amount to check: {money(item.amountToReview)}
                        </p>
                      )}

                      <div className="mt-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          What to do
                        </p>
                        <p className="mt-1 text-sm leading-6">{item.action}</p>
                      </div>

                      <div className="mt-3 rounded-lg bg-slate-50 p-3">
                        <p className="text-xs font-semibold">Important note</p>
                        <p className="mt-1 text-xs leading-5 text-slate-600">
                          {item.note}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </>
      )}

      <p className="px-1 text-xs leading-5 text-slate-500">
        TaxClarity is an educational prototype, not an official filing service
        or substitute for qualified tax advice. Rules, section references,
        eligibility and limits can change. Confirm them for the relevant
        financial year using the official Income Tax Department resources
        before making a claim or financial decision.
      </p>
    </section>
  );
}
