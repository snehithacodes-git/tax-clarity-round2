"use client";

import Link from "next/link";

const features = [
  {
    number: "01",
    title: "Document reconciliation",
    description:
      "Compare records from payslips, Form 16, AIS/TIS, bank interest and other income sources to identify amounts that need review.",
    tag: "COMPARE RECORDS",
  },
  {
    number: "02",
    title: "Explainable discrepancy checks",
    description:
      "Understand possible rounding differences, timing mismatches, missing records and contradictory totals with understandable rule-based explanations.",
    tag: "FIND DIFFERENCES",
  },
  {
    number: "03",
    title: "Tax-saving review plan",
    description:
      "Organize potential deductions, existing payments and practical next steps without encouraging unnecessary financial products.",
    tag: "PLAN RESPONSIBLY",
  },
  {
    number: "04",
    title: "Review checklist",
    description:
      "Turn detected issues into a structured checklist of evidence to inspect, questions to resolve and cases that may need professional review.",
    tag: "KNOW WHAT TO DO",
  },
  {
    number: "05",
    title: "Version comparison",
    description:
      "Review changes between record versions, inspect differences and understand which figures or fields need additional verification.",
    tag: "TRACK CHANGES",
  },
  {
    number: "06",
    title: "Audit and review workflow",
    description:
      "Follow a structured review process with explicit decisions, status tracking and clear boundaries between automated checks and human judgment.",
    tag: "REVIEW WITH CONTROL",
  },
];

const steps = [
  {
    number: "01",
    title: "Bring records together",
    description:
      "Start with the available documents or use the sample data to explore the workflow.",
  },
  {
    number: "02",
    title: "Inspect the differences",
    description:
      "Review normalized figures, possible mismatches, explanations and evidence that is still needed.",
  },
  {
    number: "03",
    title: "Take the next step",
    description:
      "Use the checklist and review plan to decide what to verify, correct or escalate.",
  },
];

const demoRecords = [
  {
    source: "Payslip records",
    detail: "Illustrative total",
    amount: "₹8,500",
    status: "Reference A",
  },
  {
    source: "Comparison record",
    detail: "Illustrative total",
    amount: "₹7,000",
    status: "Reference B",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f8fc] text-slate-900">
      {/* Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="TaxClarity home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-lg font-bold text-white">
              T
            </span>
            <span>
              <span className="block text-lg font-bold tracking-tight">
                TaxClarity
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Understand before you file
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
            <a className="transition hover:text-slate-950" href="#features">
              Features
            </a>
            <a className="transition hover:text-slate-950" href="#workflow">
              How it works
            </a>
            <a className="transition hover:text-slate-950" href="#trust">
              Trust & safety
            </a>
          </nav>

          <Link
            href="/workspace"
            className="inline-flex min-h-10 items-center justify-center rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Open workspace <span className="ml-2">↗</span>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="pointer-events-none absolute -right-32 -top-20 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-40 top-64 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-28 lg:pt-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              Built for clearer tax-record reviews
            </div>

            <h1 className="mt-7 max-w-3xl text-5xl font-bold leading-[1.06] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Your tax records.
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                Finally in context.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Tax information can be scattered across documents, dates and
              sources. TaxClarity helps you compare records, investigate
              discrepancies and organize the next steps—all in one structured
              workspace.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/workspace"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Explore TaxClarity <span className="ml-2">→</span>
              </Link>
              <a
                href="#features"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Discover features
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-xs font-medium text-slate-600">
              <span className="inline-flex items-center gap-2">
                <span className="text-emerald-600">✓</span> Explainable checks
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="text-emerald-600">✓</span> Sample-data exploration
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="text-emerald-600">✓</span> No paid AI required
              </span>
            </div>

            <p className="mt-5 max-w-lg text-xs leading-5 text-slate-500">
              A decision-support prototype, not an official tax filing service
              or a substitute for professional tax advice.
            </p>
          </div>

          {/* Product preview: illustrative values, not live user data */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-indigo-200/60 via-blue-100/30 to-sky-200/60 blur-xl" />

            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-900/10 sm:p-5">
              <div className="flex items-center justify-between border-b border-slate-100 px-2 pb-4 pt-2">
                <div>
                  <p className="text-sm font-bold">Reconciliation overview</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Illustrative demonstration
                  </p>
                </div>
                <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                  Sample data
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 py-5">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Reference A</p>
                  <p className="mt-2 text-2xl font-bold tracking-tight">
                    ₹8,500
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Illustrative total
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Reference B</p>
                  <p className="mt-2 text-2xl font-bold tracking-tight">
                    ₹7,000
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Illustrative total
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-lg text-amber-800">
                    !
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900">
                      Difference requires review
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      The two example totals differ by ₹1,500. This alone does
                      not establish an error or explain its cause.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-700">
                    1
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold">
                      Inspect reporting periods
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Check dates, source and context
                    </p>
                  </div>
                  <span className="text-xs text-slate-400">→</span>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-sm font-bold text-violet-700">
                    2
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold">
                      Review supporting evidence
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Find the figures that need confirmation
                    </p>
                  </div>
                  <span className="text-xs text-slate-400">→</span>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-700">
                    3
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold">
                      Record the next action
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Resolve, request clarification or escalate
                    </p>
                  </div>
                  <span className="text-xs text-slate-400">→</span>
                </div>
              </div>

              <p className="px-1 pb-1 pt-4 text-[10px] leading-4 text-slate-400">
                Concept preview only. These figures are hard-coded examples,
                not a live calculation or a finding about your tax records.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-7 sm:grid-cols-3 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3">
            <span className="text-xl text-indigo-600">◎</span>
            <div>
              <p className="text-sm font-semibold">Traceable reasoning</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Review why a rule flags an issue instead of trusting a mystery
                score.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl text-indigo-600">⌕</span>
            <div>
              <p className="text-sm font-semibold">Evidence-first workflow</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Separate a possible discrepancy from a verified conclusion.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl text-indigo-600">↗</span>
            <div>
              <p className="text-sm font-semibold">Practical next steps</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Organize the questions and checks that should happen next.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem and solution */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
            The problem we address
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Tax records are connected.
            <br className="hidden sm:block" /> Reviewing them shouldn't be
            confusing.
          </h2>
          <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">
            Different documents can use different reporting periods, formats
            and descriptions. TaxClarity gives users a structured way to
            investigate the differences before deciding what to do.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-lg text-rose-700">
              ↔
            </span>
            <h3 className="mt-5 text-base font-bold">
              Information is fragmented
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Salary statements, tax records, bank interest and other income
              details may need to be reviewed side by side.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-lg text-amber-700">
              ≠
            </span>
            <h3 className="mt-5 text-base font-bold">
              Differences need context
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              A mismatch may come from timing, rounding, missing information or
              an actual error. The number alone cannot decide which.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-700">
              ✓
            </span>
            <h3 className="mt-5 text-base font-bold">
              Next steps should be clear
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Users need a practical review path: what to check, which evidence
              matters and when to ask a qualified professional.
            </p>
          </article>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-24 border-y border-slate-200 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
                One connected workspace
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                From scattered records
                <br className="hidden sm:block" /> to structured reviews.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-slate-600">
              Explore the available modules from a single workspace. Actual
              behavior depends on the implemented functionality in this
              prototype.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.number}
                className="group rounded-2xl border border-slate-200 bg-[#fbfcff] p-6 transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:bg-white hover:shadow-xl hover:shadow-indigo-950/5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-300">
                    {feature.number}
                  </span>
                  <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[9px] font-bold tracking-wider text-slate-500">
                    {feature.tag}
                  </span>
                </div>
                <h3 className="mt-7 text-lg font-bold tracking-tight">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {feature.description}
                </p>
                <Link
                  href="/workspace"
                  className="mt-6 inline-flex items-center text-sm font-semibold text-indigo-700 transition group-hover:text-indigo-900"
                >
                  Explore workspace <span className="ml-2">→</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="scroll-mt-24 mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
              A clearer process
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Three steps.
              <br />
              Better visibility.
            </h2>
            <p className="mt-5 text-sm leading-7 text-slate-600">
              TaxClarity is designed to support review and preparation—not to
              make unverified financial decisions on your behalf.
            </p>
            <Link
              href="/workspace"
              className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Start exploring <span className="ml-2">→</span>
            </Link>
          </div>

          <div className="space-y-4">
            {steps.map((step) => (
              <article
                key={step.number}
                className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-5 sm:gap-6 sm:p-6"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-sm font-bold text-indigo-700">
                  {step.number}
                </span>
                <div>
                  <h3 className="font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {step.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Trust and boundaries */}
      <section id="trust" className="scroll-mt-24 bg-slate-950 py-16 text-white sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">
              Designed with care
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Clarity includes knowing the limits.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300">
              Financial information deserves careful handling. Automated
              comparisons can help surface questions, but they cannot replace
              official records, statutory eligibility checks or professional
              judgment.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="font-semibold">Transparent checks</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Explain what a rule flags and what evidence is still required.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="font-semibold">No guaranteed outcomes</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                A flagged difference is not proof of an error, fraud or tax
                liability.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="font-semibold">Use sample records first</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Explore the demonstration without entering sensitive identity
                or banking details.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="font-semibold">Verify before acting</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Confirm applicable rules and amounts for the relevant tax year
                through official sources.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#f7f8fc] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 px-6 py-12 text-center text-white shadow-xl shadow-indigo-950/10 sm:px-12 sm:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-200">
            TaxClarity workspace
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            Make the next tax-record review more organized.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-indigo-100">
            Start with the available demonstration, review the tools and
            identify the questions that need answers.
          </p>
          <Link
            href="/workspace"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-indigo-50"
          >
            Open TaxClarity <span className="ml-2">→</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
              T
            </span>
            <div>
              <p className="text-sm font-bold">TaxClarity</p>
              <p className="mt-1 text-xs text-slate-500">
                IMPACTX 2026 · Tax-record review prototype
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-3 text-xs font-medium text-slate-600">
            <Link className="hover:text-indigo-700" href="/workspace">
              Workspace
            </Link>
            <a
              className="hover:text-indigo-700"
              href="https://github.com/snehithacodes-git/tax-clarity-round2"
              target="_blank"
              rel="noreferrer"
            >
              Source code ↗
            </a>
            <a className="hover:text-indigo-700" href="#trust">
              Trust & safety
            </a>
          </div>
        </div>

        <div className="border-t border-slate-100 px-4 py-4 text-center text-[11px] leading-5 text-slate-500">
          TaxClarity is an educational prototype. It does not file returns,
          access government systems or guarantee deduction eligibility.
          Verify information with official sources before making financial or
          tax decisions.
        </div>
      </footer>
    </main>
  );
}
