
"use client";

import { useState } from "react";

type Regime = "old" | "new";

type PlanItem = {
  priority: number;
  title: string;
  section: string;
  potential: number;
  action: string;
  note: string;
};

const money = (value: number) =>
  "₹" + Math.max(0, value).toLocaleString("en-IN");

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
  const [homeType, setHomeType] = useState("none");
  const [employerNps, setEmployerNps] = useState("0");
  const [generated, setGenerated] = useState(false);

  const number = (value: string) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  };

  const annualIncome = number(income);
  const monthlyBudget = number(budget);
  const current80C = Math.min(150000, number(used80C));
  const selfPremium = number(selfInsurance);
  const parentPremium = number(parentInsurance);
  const education = number(educationInterest);
  const home = number(homeInterest);
  const employer = number(employerNps);

  const selfHealthCap = 25000;
  const parentHealthCap = parentSenior ? 50000 : 25000;

  const selfHealthEligible = Math.min(selfPremium, selfHealthCap);
  const parentHealthEligible = Math.min(parentPremium, parentHealthCap);
  const remaining80C = Math.max(0, 150000 - current80C);

  const plan: PlanItem[] = [];

  if (regime === "old") {
    if (remaining80C > 0) {
      plan.push({
        priority: 1,
        title: "Review eligible Section 80C contributions",
        section: "Section 80C",
        potential: remaining80C,
        action:
          "Check existing EPF, eligible life insurance premiums, eligible tuition fees, PPF and other qualifying payments first. Only invest more if it suits your financial goals.",
        note:
          "The ₹1.5 lakh limit is shared across eligible items. Do not double-count amounts already included.",
      });
    }

    if (selfHealthEligible < selfHealthCap) {
      plan.push({
        priority: 2,
        title: "Review health insurance for yourself and family",
        section: "Section 80D",
        potential: selfHealthCap - selfHealthEligible,
        action:
          "Check whether you already have eligible health insurance and whether additional coverage is genuinely needed. Verify payment and eligibility rules before claiming.",
        note:
          "Potential unused deduction capacity is not a recommendation to buy a policy. Actual benefit depends on eligible payments and statutory conditions.",
      });
    }

    if (parentHealthEligible < parentHealthCap) {
      plan.push({
        priority: 3,
        title: "Check eligible health coverage for parents",
        section: "Section 80D",
        potential: parentHealthCap - parentHealthEligible,
        action:
          "If relevant, review your parents' existing coverage and medical needs. Confirm who paid the premium and which limit applies.",
        note:
          "The illustrative limit depends on age and eligibility. Avoid buying duplicate or unsuitable cover for tax reasons.",
      });
    }

    if (education > 0) {
      plan.push({
        priority: 4,
        title: "Check education-loan interest eligibility",
        section: "Section 80E",
        potential: education,
        action:
          "Obtain the lender's annual interest certificate and verify that the loan, lender, course and claimant satisfy the applicable conditions.",
        note:
          "This is the interest amount entered, not a verified deduction. Principal repayments are not included.",
      });
    } else {
      plan.push({
        priority: 4,
        title: "Review existing education loans, if any",
        section: "Section 80E",
        potential: 0,
        action:
          "If you already have a qualifying education loan, check its annual interest certificate. Do not take a new loan simply to obtain a tax deduction.",
        note:
          "Eligibility depends on statutory conditions; an education loan is not a tax-saving purchase.",
      });
    }

    if (homeType === "self" && home > 0) {
      plan.push({
        priority: 5,
        title: "Verify home-loan interest eligibility",
        section: "Section 24(b)",
        potential: Math.min(home, 200000),
        action:
          "Check the loan certificate, property use, ownership, completion and other applicable conditions with the current rules.",
        note:
          "₹2 lakh is an indicative ceiling for certain eligible self-occupied cases under the old-regime rules; it is not a guaranteed deduction.",
      });
    } else if (homeType === "letout" && home > 0) {
      plan.push({
        priority: 5,
        title: "Review the let-out property calculation",
        section: "House property",
        potential: home,
        action:
          "Calculate rental income and eligible interest together. Check the applicable loss set-off and carry-forward restrictions.",
        note:
          "Interest is not automatically a deduction from salary. Tax treatment depends on house-property rules.",
      });
    }
  } else {
    plan.push({
      priority: 1,
      title: "Compare both tax regimes before investing",
      section: "Regime comparison",
      potential: 0,
      action:
        "Use verified current-year tax slabs and eligible deductions to compare total tax under both regimes before choosing.",
      note:
        "Most personal deductions under Sections 80C and 80D are not available under the new regime. Do not assume insurance or investment purchases reduce new-regime tax.",
    });

    if (employer > 0) {
      plan.push({
        priority: 2,
        title: "Verify employer NPS contribution treatment",
        section: "Section 80CCD(2)",
        potential: employer,
        action:
          "Check your salary structure, employer contribution, eligible salary base and the current statutory limit.",
        note:
          "This is a review amount, not a confirmed eligible deduction. Employee contributions have different rules.",
      });
    }

    if (homeType === "letout" && home > 0) {
      plan.push({
        priority: 3,
        title: "Review interest on let-out property",
        section: "Section 24(b)",
        potential: home,
        action:
          "Check the house-property computation and restrictions applicable to the selected regime.",
        note:
          "A deduction in the property calculation does not necessarily reduce tax on salary or other income by the same amount.",
      });
    }

    plan.push({
      priority: 4,
      title: "Prioritize financial protection over tax deductions",
      section: "Insurance review",
      potential: 0,
      action:
        "Review health coverage, emergency savings and dependants' protection based on your actual needs and affordability.",
      note:
        "Do not buy insurance or borrow money just for a deduction that may not be available in your regime.",
    });
  }

  plan.sort((a, b) => a.priority - b.priority);

  const potential80D =
    regime === "old"
      ? selfHealthEligible + parentHealthEligible
      : 0;

  const potential80C = regime === "old" ? current80C : 0;

  const estimatedPotentialDeductions =
    potential80C +
    potential80D +
    (regime === "old" ? education : 0) +
    (regime === "old" && homeType === "self"
      ? Math.min(home, 200000)
      : 0);

  return (
    <section className="space-y-4">
      <div className="card p-5">
        <h2 className="text-xl font-bold">Personalized Tax-Saving Plan</h2>
        <p className="mt-2 text-sm text-slate-500">
          Answer these questions to generate a prioritized checklist for
          review. This prototype does not verify documents or determine
          final tax eligibility.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm">
            Annual income (₹)
            <input
              type="number"
              min="0"
              value={income}
              onChange={(e) => {
                setIncome(e.target.value);
                setGenerated(false);
              }}
              className="mt-1 w-full rounded-lg border p-2"
            />
          </label>

          <label className="text-sm">
            Monthly budget for additional saving (₹)
            <input
              type="number"
              min="0"
              value={budget}
              onChange={(e) => {
                setBudget(e.target.value);
                setGenerated(false);
              }}
              className="mt-1 w-full rounded-lg border p-2"
            />
          </label>

          <label className="text-sm">
            Tax regime
            <select
              value={regime}
              onChange={(e) => {
                setRegime(e.target.value as Regime);
                setGenerated(false);
              }}
              className="mt-1 w-full rounded-lg border p-2"
            >
              <option value="old">Old regime</option>
              <option value="new">New regime</option>
            </select>
          </label>

          <label className="text-sm">
            Eligible 80C payments already made (₹)
            <input
              type="number"
              min="0"
              value={used80C}
              onChange={(e) => {
                setUsed80C(e.target.value);
                setGenerated(false);
              }}
              className="mt-1 w-full rounded-lg border p-2"
            />
          </label>

          <label className="text-sm">
            Eligible self/family health premiums paid (₹)
            <input
              type="number"
              min="0"
              value={selfInsurance}
              onChange={(e) => {
                setSelfInsurance(e.target.value);
                setGenerated(false);
              }}
              className="mt-1 w-full rounded-lg border p-2"
            />
          </label>

          <label className="text-sm">
            Eligible parents' health premiums paid (₹)
            <input
              type="number"
              min="0"
              value={parentInsurance}
              onChange={(e) => {
                setParentInsurance(e.target.value);
                setGenerated(false);
              }}
              className="mt-1 w-full rounded-lg border p-2"
            />
          </label>

          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={parentSenior}
              onChange={(e) => {
                setParentSenior(e.target.checked);
                setGenerated(false);
              }}
            />
            Parent eligibility may use the senior-citizen limit (verify age
            and statutory conditions)
          </label>

          <label className="text-sm">
            Education-loan interest paid this year (₹)
            <input
              type="number"
              min="0"
              value={educationInterest}
              onChange={(e) => {
                setEducationInterest(e.target.value);
                setGenerated(false);
              }}
              className="mt-1 w-full rounded-lg border p-2"
            />
          </label>

          <label className="text-sm">
            Home-loan interest paid this year (₹)
            <input
              type="number"
              min="0"
              value={homeInterest}
              onChange={(e) => {
                setHomeInterest(e.target.value);
                setGenerated(false);
              }}
              className="mt-1 w-full rounded-lg border p-2"
            />
          </label>

          <label className="text-sm">
            Property type
            <select
              value={homeType}
              onChange={(e) => {
                setHomeType(e.target.value);
                setGenerated(false);
              }}
              className="mt-1 w-full rounded-lg border p-2"
            >
              <option value="none">No home-loan claim</option>
              <option value="self">Self-occupied property</option>
              <option value="letout">Let-out property</option>
            </select>
          </label>

          <label className="text-sm">
            Employer NPS contribution (₹)
            <input
              type="number"
              min="0"
              value={employerNps}
              onChange={(e) => {
                setEmployerNps(e.target.value);
                setGenerated(false);
              }}
              className="mt-1 w-full rounded-lg border p-2"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={() => setGenerated(true)}
          className="mt-5 rounded-full bg-midnight px-5 py-3 text-sm font-semibold text-white"
        >
          Generate my plan
        </button>
      </div>

      {generated && (
        <>
          <div className="card p-5">
            <h3 className="font-bold">Your plan summary</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border p-3">
                <p className="text-xs text-slate-500">Annual income entered</p>
                <p className="mt-1 text-lg font-bold">
                  {money(annualIncome)}
                </p>
              </div>
              <div className="rounded-xl border p-3">
                <p className="text-xs text-slate-500">Monthly budget entered</p>
                <p className="mt-1 text-lg font-bold">
                  {money(monthlyBudget)}
                </p>
              </div>
              <div className="rounded-xl border p-3">
                <p className="text-xs text-slate-500">
                  Potential deductions to review
                </p>
                <p className="mt-1 text-lg font-bold">
                  {money(estimatedPotentialDeductions)}
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              This is an indicative sum of entered amounts and review limits,
              not verified deductions or tax saved. It excludes regime-specific
              validation, overlapping claims, and several statutory conditions.
            </p>
          </div>

          <div className="card p-5">
            <h3 className="font-bold">Recommended next steps</h3>
            <div className="mt-4 space-y-4">
              {plan.map((item, index) => (
                <article key={item.title} className="rounded-xl border p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.section}
                      </p>
                      {item.potential > 0 && (
                        <p className="mt-2 text-sm font-semibold">
                          Amount to verify: {money(item.potential)}
                        </p>
                      )}
                      <p className="mt-2 text-sm">{item.action}</p>
                      <p className="mt-2 text-xs text-slate-500">
                        {item.note}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </>
      )}

      <p className="px-1 text-xs text-slate-500">
        Tax rules change by financial year and regime. Verify the applicable
        provisions with the official Income Tax Department and a qualified
        tax professional. No loan, insurance or investment is recommended
        solely to obtain a tax deduction.
      </p>
    </section>
  );
}
