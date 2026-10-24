export function shouldRefer(question: string) {
  const q = question.toLowerCase().trim();
  const trigger = (triggerId: string, whatIsWrong: string, whyItMatters: string, nextAction: string, recommend: string) => ({ fired: true as const, triggerId, whatIsWrong, whyItMatters, nextAction, recommend });

  if (/\b(evade|hide income|fake invoice|fake receipt|black money|avoid detection)\b/.test(q)) {
    return trigger("COMPLIANCE_BOUNDARY", "The question may involve hiding income, fabricated evidence, or tax evasion.", "False records or concealment can create serious legal and financial consequences.", "Do not proceed with concealment. Correct records and seek qualified advice about lawful next steps.", "Qualified tax professional / official Income Tax Department resources");
  }
  if (/\bfreelance|freelancer\b/.test(q) && /\bno invoice|missing invoice|no records|missing records\b/.test(q)) {
    return trigger("PROFESSIONAL_REVIEW", "Freelance income is described without complete supporting records.", "Income classification, evidence and return requirements depend on the facts and current law.", "Collect available contracts, bank statements, client records and expense evidence; do not fabricate invoices.", "Qualified tax professional");
  }
  if (/\b(best way to reduce tax|how to save tax|reduce tax|tax planning|deduction|deductions|loan|insurance|regime|80c|80d|nps|home loan|health cover|life cover|premium|tax saving|tax-saving)\b/.test(q)) {
    return trigger("PERSONALIZED_TAX_ADVICE", "The question asks for tax planning or a deduction decision that depends on individual facts and current law.", "Eligibility may depend on the financial year, tax regime, income type, policy or loan details, limits and supporting evidence.", "Use the planner only for a rough comparison; verify current rules and personal eligibility before acting.", "Official Income Tax Department guidance / qualified tax professional");
  }
  if (/\b(mismatch|does not match|doesn't match|different amount|conflicting|difference|discrepancy|not matching|wrong amount)\b/.test(q) && /\b(form 16|form16|ais|tis|26as|tds|employer|bank|interest|salary|statement|certificate)\b/.test(q)) {
    return trigger("DOCUMENT_MISMATCH", "Two financial sources appear to show conflicting values.", "A mismatch can affect the accuracy of a return and may need correction by the source or official feedback process.", "Compare the financial year, payer, amount and date; preserve evidence and use the official correction/feedback route if needed.", "Source issuer / official portal / qualified tax professional if unresolved");
  }
  if (/\b(refund status|check my refund|file my return|submit my return|live account|login)\b/.test(q)) {
    return trigger("LIVE_SERVICE_UNAVAILABLE", "The prototype cannot access taxpayer accounts or submit a return.", "Pretending to check an account or submit a filing could mislead the user.", "Use the official e-filing portal directly. Never share passwords or OTPs here.", "Official Income Tax Department e-filing portal");
  }
  return { fired: false as const, triggerId: "", whatIsWrong: "", whyItMatters: "", nextAction: "", recommend: "" };
}
