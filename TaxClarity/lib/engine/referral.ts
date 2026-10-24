
export type ReferralResult = {
  fired: boolean;
  triggerId?: string;
  whatIsWrong?: string;
  whyItMatters?: string;
  nextAction?: string;
  recommend?: string;
};

export function shouldRefer(question: string): ReferralResult {
  const q = question.toLowerCase().replace(/\s+/g, " ").trim();

  const has = (...terms: string[]) =>
    terms.some((term) => q.includes(term));

  // Requests requiring personalized professional advice
  if (
    has(
      "best way to reduce tax",
      "how to save tax",
      "how do i reduce my tax",
      "tax avoidance",
      "evade tax",
      "hide income",
      "hide my income",
      "avoid reporting income"
    )
  ) {
    return {
      fired: true,
      triggerId: "PERSONALIZED_TAX_ADVICE",
      whatIsWrong:
        "This question asks for personalized tax-saving or tax-avoidance advice.",
      whyItMatters:
        "The correct answer depends on your financial circumstances and the tax rules for the relevant financial year.",
      nextAction:
        "Do not make a financial decision based only on this prototype. Verify the applicable rules and seek qualified advice when needed.",
      recommend:
        "Official Income Tax Department resources or a qualified tax professional",
    };
  }

  // Freelance income with missing supporting records
  if (
    has("freelance", "freelancer", "freelancing", "contract work") &&
    has(
      "no invoice",
      "without invoice",
      "missing invoice",
      "no proof",
      "no records"
    )
  ) {
    return {
      fired: true,
      triggerId: "FREELANCE_RECORDS_REVIEW",
      whatIsWrong:
        "Freelance income may not have complete supporting records.",
      whyItMatters:
        "Missing evidence can make income reporting and the correct filing treatment harder to establish.",
      nextAction:
        "Collect available contracts, bank entries, invoices and payment records. Ask a tax professional to review unresolved gaps.",
      recommend: "Qualified tax professional",
    };
  }

  // Conflicting or materially different source amounts
  if (
    has("mismatch", "does not match", "doesn't match", "difference") &&
    has(
      "20%",
      "20 percent",
      "large difference",
      "major difference",
      "significant difference"
    )
  ) {
    return {
      fired: true,
      triggerId: "MATERIAL_MISMATCH_REVIEW",
      whatIsWrong:
        "You reported a potentially material difference between records.",
      whyItMatters:
        "The amounts may cover different periods, contain an entry error or require a corrected source document. The percentage alone cannot identify the cause.",
      nextAction:
        "Compare the periods, source documents and totals. Request a correction from the source or verify the relevant statement through the official portal.",
      recommend:
        "Official verification; seek professional help if the difference remains unresolved",
    };
  }

  // Corrected documents or competing latest versions
  if (
    has("both latest", "two latest versions", "conflicting versions", "which version is latest")
  ) {
    return {
      fired: true,
      triggerId: "DOCUMENT_VERSION_CONFLICT",
      whatIsWrong:
        "More than one document may be marked as the latest version.",
      whyItMatters:
        "Choosing one automatically could cause a draft to use outdated or conflicting figures.",
      nextAction:
        "Pause the affected calculation. Compare issue dates, version identifiers and supersession references before selecting a version.",
      recommend: "Verify with the document issuer if the conflict cannot be resolved",
    };
  }

  // Contradictory totals
  if (
    has("total does not match", "total doesn't match", "contradictory total", "line items")
  ) {
    return {
      fired: true,
      triggerId: "DOCUMENT_TOTAL_CONFLICT",
      whatIsWrong:
        "The document's stated total may not agree with its individual line items.",
      whyItMatters:
        "Using the wrong total can change the result of later calculations.",
      nextAction:
        "Show the stated total and the sum of the line items separately. Check the original document and request clarification if necessary.",
      recommend: "Document issuer or qualified tax professional",
    };
  }

  // High-risk or unresolved situations
  if (
    has("notice", "defect notice", "scrutiny", "penalty", "prosecution", "legal notice")
  ) {
    return {
      fired: true,
      triggerId: "NOTICE_OR_LEGAL_REVIEW",
      whatIsWrong:
        "The question may involve an official notice or a legal consequence.",
      whyItMatters:
        "Response requirements and deadlines depend on the actual notice and applicable rules.",
      nextAction:
        "Read the notice carefully, record its deadline and verify it through official channels. Do not ignore it.",
      recommend: "Qualified tax professional or appropriate official channel",
    };
  }

  return { fired: false };
}
