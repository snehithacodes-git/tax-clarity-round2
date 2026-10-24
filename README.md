# TaxClarity — Interactive Hackathon Prototype

## Run locally

Requirements: Node.js (LTS) and npm.

```powershell
npm install
npm run dev
```

Open the local URL printed in the terminal (usually http://localhost:3000). To validate the production build:

```powershell
npm run build
```

## Interactive tools

- Reconciliation: compare two entered amounts and record a review decision.
- Tax Planner: compare old/new regime estimates from entered values using the project's synthetic assumptions.
- Loans & Insurance: estimate EMI-to-income ratio, annual cash outgo and a six-month emergency-fund target. It does not recommend products or confirm tax deductions.
- TaxClarity Assistant: local keyword/rule-based general guidance; it uses no paid AI API or external model. It is not a generative AI model and does not send questions to a remote service.
- Review & Referral: type a question and see configured referral triggers, plus sample prompts when no rule matches.
- Version Diff: compare the included synthetic document versions.

## Important limitations

This is an educational hackathon prototype. The tax slab assumptions are synthetic and are not official tax law. Calculations omit real-world items such as all eligibility rules, rebates, cess, surcharge and some deduction limits. Loan/insurance tax treatment is not determined automatically. Do not use results for filing or financial decisions without checking current official rules and, where appropriate, consulting a qualified professional.

Do not enter PAN, Aadhaar, passwords, OTPs, bank credentials, or real taxpayer documents. The prototype does not connect to the Income Tax Department or submit returns.


## Final prototype capabilities and limitations

- Tax planning compares old/new synthetic slab estimates and shows the arithmetic used. The financial-year selector does not load official tax law.
- Loans & Insurance includes EMI/cash-flow indicators and a hypothetical tax-impact sandbox. Entered deductions are not eligibility-checked; the result is not tax advice.
- Tax Assistant is a local rule-based assistant. It is not a generative AI model and does not access government accounts or external sources.
- Review checklist and document-review rows use browser local storage where available. Data does not sync to a backend or other devices.
- Document Intake accepts CSV, TXT and JSON text for editable review. It does not provide PDF/image OCR, identity verification, automatic tax document extraction, or official portal integration.
- Document review supports manual verification statuses and CSV/JSON report exports. “Verified” means the user marked the row verified; it is not independently authenticated by the app.
- Never enter PAN, Aadhaar, passwords, OTPs, bank credentials or confidential real taxpayer records into this demo.

## Verify before demo

Run `npm install`, `npm run typecheck`, `npm test`, and `npm run build`. Fix any environment-specific errors before presenting.
