import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="pt-12 pb-8 grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-widest bg-white border border-slate-200 rounded-full px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> IMPACTX 2026 • 24H HACKATHON • ROUND 1
          </div>
          <h1 className="mt-6 text-5xl font-bold tracking-tight leading-[0.95]">
            Understand the records.<br />
            <span className="text-slate-400">Verify the differences.</span><br />
            Prepare with confidence.
          </h1>
          <p className="mt-5 text-[15px] leading-6 text-slate-600 max-w-[52ch]">
            TaxClarity is a tax-record reconciliation and preparation assistant. It compares payslips, Form 16, AIS/TIS, bank interest and freelance income using tolerance-aware rules, explains discrepancies in plain language, and tells you what to verify next. <span className="font-semibold">Not an official filing authority.</span>
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/workspace" className="h-11 px-6 rounded-full bg-midnight text-white text-sm font-semibold flex items-center hover:bg-black">Open Workspace →</Link>
            <a href="https://github.com/akshayahasinidesetty/taxclarity" target="_blank" className="h-11 px-6 rounded-full bg-white border border-slate-200 text-sm font-semibold flex items-center">View Source Code</a>
          </div>
          <div className="mt-6 flex gap-6 text-xs text-slate-500">
            <span>✓ Synthetic demo data only</span>
            <span>✓ Explainable rules</span>
            <span>✓ No real PAN stored</span>
          </div>
        </div>
        <div className="card p-3">
          <div className="rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-4 text-white">
            <div className="text-xs opacity-60">LIVE RECONCILIATION PREVIEW</div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="bg-white/10 rounded-lg p-3"><div className="text-[11px] opacity-60">Payslip Sum</div><div className="font-bold">₹8,500</div></div>
              <div className="bg-white/10 rounded-lg p-3"><div className="text-[11px] opacity-60">Form 16 Ref</div><div className="font-bold">₹7,000</div></div>
              <div className="bg-amber-400 text-black rounded-lg p-3"><div className="text-[11px]">Delta</div><div className="font-bold">₹1,500</div></div>
            </div>
            <div className="mt-4 bg-white rounded-xl p-3 text-slate-900">
              <div className="text-xs font-bold">Classification: TIMING + MISSING RECORD</div>
              <div className="text-xs text-slate-600 mt-1">March salary credited April, bank interest not in Form16. What to verify: Check Form16 issue date vs payslip period, confirm employer TAN, verify AIS freshness.</div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="card p-3"><div className="text-xs font-semibold">Validation & Normalization</div><div className="text-[11px] text-slate-500 mt-1">Date parse, amount norm, total = sum(lineItems), freshness tag</div></div>
            <div className="card p-3"><div className="text-xs font-semibold">Review Guidance</div><div className="text-[11px] text-slate-500 mt-1">What is wrong → Why it matters → Next action → Refer if needed</div></div>
          </div>
        </div>
      </section>

      {/* 3 problem cards */}
      <section className="mt-2 grid md:grid-cols-3 gap-4">
        {[
          { t: "Spread across sources", d: "Payslips, Form16, AIS, bank interest use different periods and formats." },
          { t: "Same amount, different meaning", d: "Rounding ±Rs10, timing, missing record, source correction, internal contradiction." },
          { t: "No clear next step", d: "User cannot tell if employer correction, direct claim, or professional review needed." }
        ].map(c => (
          <div key={c.t} className="card p-5"><div className="font-semibold text-sm">{c.t}</div><div className="text-xs text-slate-600 mt-2 leading-5">{c.d}</div></div>
        ))}
      </section>

      <section className="mt-8 card p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-600">Prototype Simulation Only — This action does not submit data to Income Tax Department. Always verify officially.</div>
        <div className="text-xs font-semibold">Team: Akshaya Hasini Desetty — 25BCE8286 • Snehitha Marella — 25BCA7653</div>
      </section>
    </div>
  );
}
