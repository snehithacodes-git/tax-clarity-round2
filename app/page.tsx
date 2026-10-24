"use client";

import Link from "next/link";
import { useState } from "react";

const currency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function Home() {
  const [salary, setSalary] = useState("850000");
  const [otherIncome, setOtherIncome] = useState("25000");
  const combinedIncome = Math.max(0, Number(salary) || 0) + Math.max(0, Number(otherIncome) || 0);

  const tools = [
    { title: "Reconciliation", tag: "COMPARE SOURCES", description: "Enter two amounts, see the difference, review rule-based explanations, and confirm or override a finding with a reason.", tab: "reconcile", color: "bg-blue-50 text-blue-700" },
    { title: "Tax planning", tag: "CALCULATE AN ESTIMATE", description: "Enter salary, other income, deduction amounts and TDS. View the estimate and compare both prototype regimes.", tab: "plan", color: "bg-emerald-50 text-emerald-700" },
    { title: "Review & referral", tag: "TYPE AND CHECK", description: "Type a tax-related question to test configured referral triggers and work through a review checklist.", tab: "review", color: "bg-amber-50 text-amber-800" },
    { title: "Version comparison", tag: "INSPECT CHANGES", description: "Compare the synthetic original and corrected statement side by side and inspect the changed amount.", tab: "diff", color: "bg-violet-50 text-violet-700" },
    { title: "Loans & insurance", tag: "MODEL STRATEGIES", description: "Review EMI pressure, insurance outgo, emergency savings and a hypothetical tax-impact scenario.", tab: "loans", color: "bg-cyan-50 text-cyan-800" },
    { title: "TaxClarity assistant", tag: "ASK A QUESTION", description: "Get local rule-based guidance on common tax workflow questions without paid AI credits.", tab: "assistant", color: "bg-fuchsia-50 text-fuchsia-800" },
    { title: "Documents & reports", tag: "IMPORT AND EXPORT", description: "Import non-sensitive CSV/TXT/JSON rows, mark review status and download a report.", tab: "documents", color: "bg-orange-50 text-orange-800" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <section className="pt-12 pb-10 grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-widest bg-white border border-slate-200 rounded-full px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> IMPACTX 2026 • INTERACTIVE TAX WORKSPACE
          </div>
          <h1 className="mt-6 text-5xl font-bold tracking-tight leading-[0.98]">
            Understand your records.<br />
            <span className="text-slate-400">Explore your numbers.</span><br />
            Know what to verify.
          </h1>
          <p className="mt-5 text-[15px] leading-6 text-slate-600 max-w-[55ch]">
            TaxClarity helps you enter financial figures, compare records, inspect rule-based discrepancies, explore simplified tax estimates and track review actions. Each tool should show how its result was produced. <span className="font-semibold">This is an educational prototype, not an official filing authority.</span>
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/workspace" className="h-11 px-6 rounded-full bg-midnight text-white text-sm font-semibold flex items-center hover:bg-black">Open Interactive Workspace →</Link>
            <a href="https://github.com/akshayahasinidesetty/taxclarity" target="_blank" rel="noreferrer" className="h-11 px-6 rounded-full bg-white border border-slate-200 text-sm font-semibold flex items-center">View Source Code ↗</a>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
            <span>✓ Editable inputs</span>
            <span>✓ Immediate rule-based outputs</span>
            <span>✓ Synthetic examples</span>
          </div>
        </div>

        <div className="card p-3">
          <div className="rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white">
            <div className="text-xs opacity-70">TRY IT NOW · INCOME INPUT</div>
            <p className="mt-2 text-sm text-white/75">Change either amount and the combined income updates instantly.</p>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-[11px] text-white/70">Annual salary (₹)</span>
                <input type="number" min="0" value={salary} onChange={e => setSalary(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-white/20 bg-white/10 px-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-300" />
              </label>
              <label className="block">
                <span className="text-[11px] text-white/70">Other annual income (₹)</span>
                <input type="number" min="0" value={otherIncome} onChange={e => setOtherIncome(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-white/20 bg-white/10 px-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-300" />
              </label>
            </div>
            <div className="mt-4 rounded-xl bg-white p-4 text-slate-900">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Combined income entered</div>
              <div className="mt-1 text-3xl font-bold">{currency(combinedIncome)}</div>
              <p className="mt-2 text-[11px] leading-4 text-slate-500">This adds your entries only. It is not taxable income and is not a tax payable calculation.</p>
            </div>
            <Link href="/workspace" className="mt-3 flex h-10 items-center justify-center rounded-lg bg-emerald-400 px-4 text-sm font-bold text-slate-950 hover:bg-emerald-300">Continue to tax planning →</Link>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="card p-3"><div className="text-xs font-semibold">Explainable checks</div><div className="text-[11px] text-slate-500 mt-1">See the difference, why it may matter, and what to verify.</div></div>
            <div className="card p-3"><div className="text-xs font-semibold">Human review</div><div className="text-[11px] text-slate-500 mt-1">Confirm findings or record an override reason.</div></div>
          </div>
        </div>
      </section>

      <section className="mt-2">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold tracking-[0.18em] text-indigo-700">CHOOSE A TOOL</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">Separate tools for separate tasks.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Open a tool, enter your own values, and inspect the resulting output. Document intake supports CSV/TXT/JSON text, not PDF/image OCR. All tax values remain prototype estimates.</p>
          </div>
          <Link href="/workspace" className="text-sm font-semibold text-indigo-700 hover:underline">Open all tools →</Link>
        </div>
        <div className="mt-5 grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {tools.map((tool, index) => (
            <Link key={tool.tab} href={`/workspace?tab=${tool.tab}`} className="card group p-5 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/5">
              <div className="flex items-center justify-between gap-2">
                <span className={`rounded-lg px-3 py-2 text-xs font-bold ${tool.color}`}>0{index + 1}</span>
                <span className="text-slate-400 transition group-hover:translate-x-1">↗</span>
              </div>
              <div className="mt-4 text-[10px] font-bold tracking-[0.14em] text-indigo-700">{tool.tag}</div>
              <h3 className="mt-2 text-base font-bold">{tool.title}</h3>
              <p className="mt-2 text-xs leading-5 text-slate-600">{tool.description}</p>
              <div className="mt-4 text-xs font-semibold text-indigo-700">Open tool →</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8 grid md:grid-cols-3 gap-4">
        {[
          { t: "Different source periods", d: "Payslips, Form 16, AIS/TIS and bank interest may cover different periods and use different formats." },
          { t: "A difference needs context", d: "Rounding, timing, missing records, corrected sources and internal contradictions need different checks." },
          { t: "Every finding needs a next step", d: "TaxClarity should explain what to verify and avoid silently choosing between conflicting records." },
        ].map(card => (
          <div key={card.t} className="card p-5"><div className="font-semibold text-sm">{card.t}</div><div className="text-xs text-slate-600 mt-2 leading-5">{card.d}</div></div>
        ))}
      </section>

      <section className="mt-8 card p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-600">Prototype simulation only — no data is submitted to the Income Tax Department.</div>
        <div className="text-xs font-semibold">TaxClarity • IMPACTX 2026</div>
      </section>
    </div>
  );
}
