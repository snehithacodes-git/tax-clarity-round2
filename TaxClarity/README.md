# TaxClarity — IMPACTX 2026 prototype

A light-first Next.js prototype for tax-record reconciliation, educational tax estimates, review guidance, and document-version comparison.

## Requirements
- Node.js 18.17+ (Node.js 20 LTS recommended)
- npm

## Run locally (Windows / macOS / Linux)
1. Extract this ZIP.
2. Open the extracted `TaxClarity` folder in VS Code.
3. Open Terminal → New Terminal.
4. Run:

   ```bash
   npm install
   npm run dev
   ```

5. Open http://localhost:3000 and select **Open Workspace** (or visit http://localhost:3000/workspace).

## Checks
```bash
npm run typecheck
npm test
npm run build
```

## Important limitations
- This is a hackathon/educational prototype, not production-ready tax software.
- Tax slabs and deductions in `lib/engine/taxCalc.ts` are synthetic assumptions and must not be used for real tax decisions.
- No Income Tax Department integration or filing is implemented.
- Do not enter PAN, Aadhaar, bank credentials, or real taxpayer documents.
- The audit log is in-memory and its simple hash function is not a cryptographic integrity mechanism.
- The buttons labelled as demo actions are not all backed by persistence or server APIs.
