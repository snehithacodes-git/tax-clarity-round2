"use client";

import { useState } from "react";

type Message = { role: "user" | "assistant"; text: string };

const starters = [
  "How can I compare the old and new tax regimes?",
  "What should I check before claiming loan interest?",
  "How do I think about health insurance and tax?",
  "What should I do if Form 16 and AIS do not match?",
];

function answerQuestion(raw: string): string {
  const q = raw.toLowerCase();
  if (/\b(evade|hide income|fake invoice|fake receipt|avoid detection|black money)\b/.test(q)) return "I can’t help conceal income, fabricate evidence, or evade tax. Keep records accurate and discuss corrections or disclosures with a qualified tax professional or the official Income Tax Department resources.";
  if (/\b(old regime|new regime|regime|compare tax)\b/.test(q)) return "Compare both regimes using the same annual income and only the deductions you are actually eligible to claim. This prototype uses synthetic slab assumptions and omits several real-world rules, so its result is a demonstration—not a filing figure. Verify the current financial-year rules before deciding.";
  if (/\b(loan|home loan|interest|emi|mortgage)\b/.test(q)) return "Start with the lender’s annual interest certificate, loan purpose, ownership/co-ownership, property use, and the applicable tax regime. Tax treatment can differ by these facts and may have limits. The Loans & Insurance Planner estimates cash-flow pressure only; it does not confirm a deduction. Ask a qualified tax professional to verify eligibility.";
  if (/\b(insurance|health cover|health insurance|life insurance|premium|80d|80c)\b/.test(q)) return "Choose insurance primarily for protection needs, exclusions, waiting periods, coverage, affordability, and dependents—not solely for tax savings. Tax treatment depends on policy type, who is covered, the applicable regime and current rules. Keep premium receipts and policy documents, and verify eligibility before claiming a deduction.";
  if (/\b(form 16|ais|tis|26as|mismatch|tds|employer)\b/.test(q)) return "Compare the exact amount, financial year, payer/employer, date and source document across Form 16, AIS/TIS, Form 26AS and your bank records. Keep supporting evidence and use the official AIS feedback/correction process where appropriate. Do not silently overwrite a mismatch; refer unresolved or material differences for professional review.";
  if (/\b(freelance|freelancer|business income|invoice|gig)\b/.test(q)) return "Keep invoices, bank statements, expense evidence, contracts and a record of gross receipts. The correct return form and any audit obligations depend on your facts and current law. If records are missing or income classification is unclear, seek professional review rather than guessing.";
  if (/\b(refund|refund status)\b/.test(q)) return "This website cannot access your tax account or check a live refund. Check status only through the official Income Tax Department e-filing portal after signing in yourself. Never share your password, OTP, PAN or Aadhaar in this demo.";
  if (/\b(pan|aadhaar|password|otp|bank details|upload document)\b/.test(q)) return "For privacy, do not enter PAN, Aadhaar, passwords, OTPs, bank credentials or real tax documents into this prototype. Use official government portals for sensitive account actions.";
  if (/\b(reduce tax|save tax|tax planning|deduction|deductions)\b/.test(q)) return "A responsible starting point is to estimate income under both regimes, list only eligible deductions, account for employer TDS and keep supporting evidence. Do not take a loan or buy insurance solely for a possible tax benefit: total costs and personal protection needs matter. This demo’s assumptions are synthetic; confirm current rules and eligibility with official guidance or a qualified professional.";
  return "I can help with general tax-workflow questions about comparing regimes, deductions, loans, insurance, Form 16, AIS/TIS, TDS, document mismatches and privacy. Please ask a more specific question. I’m a local rule-based assistant in this demo, not a connected generative-AI service, tax professional, or government portal.";
}

export default function TaxAssistant() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", text: "Hi! Ask me about tax planning, loans, insurance, documents or review checks. I work locally without paid AI credits and do not send your inputs to an AI API." }]);
  function ask(text = question) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages(current => [...current, { role: "user", text: trimmed }, { role: "assistant", text: answerQuestion(trimmed) }]);
    setQuestion("");
  }
  return <section className="card p-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><h2 className="text-xl font-bold">TaxClarity Assistant</h2><p className="mt-1 text-sm text-slate-600">Instant local guidance · No API key · No paid AI credits</p></div>
      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Local demo</span>
    </div>
    <div className="mt-4 max-h-[420px] space-y-3 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3" aria-live="polite">
      {messages.map((m, i) => <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[92%] whitespace-pre-wrap rounded-xl px-4 py-3 text-sm leading-6 ${m.role === "user" ? "bg-midnight text-white" : "border border-slate-200 bg-white text-slate-800"}`}><div className="mb-1 text-[10px] font-bold uppercase tracking-wide opacity-70">{m.role === "user" ? "You" : "Assistant"}</div>{m.text}</div></div>)}
    </div>
    <form className="mt-3 flex gap-2" onSubmit={e => { e.preventDefault(); ask(); }}>
      <input value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask a tax or review question…" className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100" aria-label="Ask TaxClarity Assistant" />
      <button type="submit" className="rounded-lg bg-midnight px-4 py-2 text-sm font-semibold text-white hover:opacity-90">Ask</button>
    </form>
    <div className="mt-4"><p className="text-xs font-semibold text-slate-500">Try asking</p><div className="mt-2 flex flex-wrap gap-2">{starters.map(s => <button type="button" key={s} onClick={() => ask(s)} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-100">{s}</button>)}</div></div>
    <p className="mt-4 text-xs leading-5 text-slate-500">This is a local rule-based assistant, not a large language model. It provides general information only and may not cover your situation. Verify tax rules and decisions with official sources or a qualified professional.</p>
  </section>;
}
