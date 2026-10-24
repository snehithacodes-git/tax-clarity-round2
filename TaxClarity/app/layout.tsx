
import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "TaxClarity | IMPACTX 2026",
  description:
    "TaxClarity helps users compare tax records, investigate discrepancies, review tax-saving options, and organize next steps.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#F7F8FC] text-slate-900 antialiased">
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <a href="/" className="flex shrink-0 items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
                TC
              </span>

              <span>
                <span className="block text-base font-bold leading-tight tracking-tight">
                  TaxClarity
                </span>
                <span className="mt-1 block text-[10px] font-medium text-slate-500">
                  Understand. Verify. Prepare.
                </span>
              </span>
            </a>

            <nav className="flex items-center gap-3 text-sm sm:gap-6">
              <a
                href="/"
                className="hidden font-medium text-slate-600 transition hover:text-indigo-700 sm:inline"
              >
                Home
              </a>

              <a
                href="/workspace"
                className="font-medium text-slate-600 transition hover:text-indigo-700"
              >
                Workspace
              </a>

              <a
                href="https://github.com/snehithacodes-git/tax-clarity-round2"
                target="_blank"
                rel="noreferrer"
                className="hidden font-medium text-slate-600 transition hover:text-indigo-700 sm:inline"
              >
                GitHub ↗
              </a>

              <a
                href="/workspace"
                className="inline-flex min-h-9 items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 sm:text-sm"
              >
                Open app <span className="ml-2">→</span>
              </a>
            </nav>
          </div>
        </header>

        <main className="min-h-[70vh]">{children}</main>

        <footer className="mt-16 border-t border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white">
                TC
              </span>

              <div>
                <p className="text-sm font-bold text-slate-900">
                  TaxClarity
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  IMPACTX 2026 · Tax-record review prototype
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
              <a
                href="/workspace"
                className="transition hover:text-indigo-700"
              >
                Workspace
              </a>

              <a
                href="https://github.com/snehithacodes-git/tax-clarity-round2"
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-indigo-700"
              >
                Source code ↗
              </a>
            </div>
          </div>

          <div className="border-t border-slate-100 px-4 py-4 text-center text-[11px] leading-5 text-slate-500">
            TaxClarity is an educational prototype. It does not submit tax
            returns or independently verify official records. Check applicable
            rules and information before making financial or tax decisions.
          </div>
        </footer>
      </body>
    </html>
  );
}
