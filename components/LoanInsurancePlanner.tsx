"use client";

import { useMemo, useState } from "react";
import { DEFAULT_ASSUMPTIONS, estimateTax } from "@/lib/engine/taxCalc";

type Regime = "old" | "new";
function money(n: number) { return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number.isFinite(n) ? n : 0); }
function amount(s: string) { const n = Number(s); return Number.isFinite(n) && n > 0 ? n : 0; }

export default function LoanInsurancePlanner() {
  const [grossIncome, setGrossIncome] = useState("1200000");
  const [monthlyEmi, setMonthlyEmi] = useState("18000");
  const [loanBalance, setLoanBalance] = useState("1800000");
  const [annualInterest, setAnnualInterest] = useState("140000");
  const [healthPremium, setHealthPremium] = useState("25000");
  const [lifePremium, setLifePremium] = useState("18000");
  const [dependents, setDependents] = useState("2");
  const [monthlyExpenses, setMonthlyExpenses] = useState("30000");
  const [regime, setRegime] = useState<Regime>("old");
  const [candidateDeduction, setCandidateDeduction] = useState("75000");
  const [annualStrategyCost, setAnnualStrategyCost] = useState("18000");

  const result = useMemo(() => {
    const income = amount(grossIncome), emi = amount(monthlyEmi), loan = amount(loanBalance), interest = amount(annualInterest);
    const health = amount(healthPremium), life = amount(lifePremium), expenses = amount(monthlyExpenses);
    const debtService = emi * 12;
    const emiRatio = income > 0 ? debtService / income : 0;
    const emergencyTarget = expenses * 6;
    const insuranceOutgo = health + life;
    const annualFixedOutgo = debtService + expenses * 12 + insuranceOutgo;
    const cashLeft = income - annualFixedOutgo;
    const risk = emiRatio > 0.4 ? "High" : emiRatio > 0.3 ? "Watch" : "Within simple guideline";
    const notes: string[] = [];
    if (emiRatio > 0.4) notes.push("Your annual EMI exceeds 40% of entered annual income. Stress-test your budget before taking another loan.");
    else if (emiRatio > 0.3) notes.push("Your EMI is between 30% and 40% of entered annual income. Keep a buffer for emergencies and rate changes.");
    else notes.push("Your EMI is below 30% of entered annual income in this simple screen. This alone does not prove affordability.");
    if (health === 0) notes.push("No health-insurance premium entered. Review suitable health cover independently of tax savings.");
    if (Number(dependents) > 0 && life === 0) notes.push("You entered financial dependents but no life-insurance premium. Assess protection needs independently of tax benefits.");
    if (loan > 0 && interest === 0) notes.push("A loan balance is entered but annual interest is zero. Check the lender's annual interest certificate before using any tax estimate.");
    const baseTaxable = Math.max(0, income - DEFAULT_ASSUMPTIONS.stdDeduction);
    const proposedDeduction = regime === "old" ? amount(candidateDeduction) : 0;
    const scenarioTaxable = Math.max(0, baseTaxable - proposedDeduction);
    const taxBefore = estimateTax(baseTaxable, regime, DEFAULT_ASSUMPTIONS).tax;
    const taxAfter = estimateTax(scenarioTaxable, regime, DEFAULT_ASSUMPTIONS).tax;
    const estimatedTaxSaved = Math.max(0, taxBefore - taxAfter);
    const strategyCost = amount(annualStrategyCost);
    return { income, emi, loan, interest, health, life, insuranceOutgo, debtService, emiRatio, emergencyTarget, annualFixedOutgo, cashLeft, risk, notes, taxBefore, taxAfter, proposedDeduction, estimatedTaxSaved, strategyCost, netIllustrativeBenefit: estimatedTaxSaved - strategyCost };
  }, [grossIncome, monthlyEmi, loanBalance, annualInterest, healthPremium, lifePremium, dependents, monthlyExpenses, regime, candidateDeduction, annualStrategyCost]);

  const fields = [
    ["Gross annual income before tax (₹)", grossIncome, setGrossIncome],
    ["Monthly loan EMI (₹)", monthlyEmi, setMonthlyEmi],
    ["Outstanding loan balance (₹)", loanBalance, setLoanBalance],
    ["Annual home-loan interest paid (₹)", annualInterest, setAnnualInterest],
    ["Annual health-insurance premium (₹)", healthPremium, setHealthPremium],
    ["Annual life-insurance premium (₹)", lifePremium, setLifePremium],
    ["Monthly essential expenses (₹)", monthlyExpenses, setMonthlyExpenses],
  ] as const;

  return <section className="space-y-5">
    <div><h2 className="text-xl font-bold">Loans, Insurance & Tax-Saving Scenario Planner</h2><p className="mt-1 text-sm text-slate-600">Review affordability and model a hypothetical eligible deduction. This does not recommend a product or establish legal eligibility.</p></div>
    <div className="grid gap-4 sm:grid-cols-2">{fields.map(([label, value, setter]) => <label key={label} className="block space-y-1.5"><span className="text-xs font-semibold text-slate-700">{label}</span><input type="number" min="0" step="1000" value={value} onChange={e => setter(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100" /></label>)}
      <label className="block space-y-1.5"><span className="text-xs font-semibold text-slate-700">Number of financial dependents</span><input type="number" min="0" step="1" value={dependents} onChange={e => setDependents(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900" /></label>
    </div>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <Metric title="EMI / gross annual income" value={`${(result.emiRatio * 100).toFixed(1)}%`} sub={`Simple screen: ${result.risk}`} />
      <Metric title="Annual EMI outgo" value={money(result.debtService)} sub="Monthly EMI × 12" />
      <Metric title="Annual insurance premiums" value={money(result.insuranceOutgo)} sub="Health + life premiums entered" />
      <Metric title="Six-month emergency fund target" value={money(result.emergencyTarget)} sub="6 × monthly essential expenses" />
      <Metric title="Income after listed outgo" value={money(result.cashLeft)} sub="Gross income minus EMI, expenses and premiums; before tax adjustments" />
      <Metric title="Outstanding loan balance" value={money(result.loan)} sub={`Interest entered: ${money(result.interest)}`} />
    </div>
    <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4"><h3 className="text-sm font-bold text-indigo-950">Checklist based on your inputs</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">{result.notes.map((note, i) => <li key={i}>{note}</li>)}</ul></div>

    <section className="rounded-xl border border-slate-200 p-4 sm:p-5 space-y-4">
      <div><h3 className="text-base font-bold">Tax-saving strategy impact sandbox</h3><p className="mt-1 text-xs leading-5 text-slate-500">Enter only a deduction amount you believe may be eligible and an estimated annual cost for the related product/strategy. The app does not confirm that the deduction qualifies.</p></div>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block"><span className="text-xs font-semibold">Regime for scenario</span><select value={regime} onChange={e => setRegime(e.target.value as Regime)} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"><option value="old">Old regime (prototype)</option><option value="new">New regime (prototype; entered candidate deduction ignored)</option></select></label>
        <label className="block"><span className="text-xs font-semibold">Hypothetical eligible deduction (₹)</span><input type="number" min="0" value={candidateDeduction} onChange={e => setCandidateDeduction(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" /></label>
        <label className="block"><span className="text-xs font-semibold">Annual strategy/product cost (₹)</span><input type="number" min="0" value={annualStrategyCost} onChange={e => setAnnualStrategyCost(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" /></label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric title="Tax before scenario" value={money(result.taxBefore)} sub="Synthetic slab estimate" />
        <Metric title="Tax after scenario" value={money(result.taxAfter)} sub="Assumes entered deduction is eligible only in old regime" />
        <Metric title="Estimated tax difference" value={money(result.estimatedTaxSaved)} sub="Before cost; not a guaranteed saving" />
        <Metric title="Illustrative net effect" value={money(result.netIllustrativeBenefit)} sub="Estimated tax difference minus entered annual cost" />
      </div>
      <p className="text-xs leading-5 text-slate-600">A positive net effect is not proof that a strategy is appropriate. Insurance and loan decisions should be based on protection, borrowing costs, liquidity and personal needs—not tax savings alone. The calculation omits rebates, cess, surcharge, deduction limits and statutory eligibility checks.</p>
    </section>
    <p className="text-xs leading-5 text-slate-500">Tax assumptions are synthetic in this hackathon prototype. Home-loan interest, insurance premiums and other amounts are not automatically deductions. Eligibility depends on applicable law, regime, policy/loan details, ownership, caps and evidence. Do not use these results to file a return.</p>
  </section>;
}
function Metric({ title, value, sub }: { title: string; value: string; sub: string }) { return <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">{title}</p><p className="mt-2 text-xl font-bold text-slate-900">{value}</p><p className="mt-1 text-xs text-slate-500">{sub}</p></div>; }
