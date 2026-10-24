import "./globals.css";
import type { Metadata } from "next";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "TaxClarity - IMPACTX 2026",
  description: "Tax-record reconciliation and preparation assistant - Understand, Verify, Prepare"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#F4F7FB] text-midnight antialiased">
        <header className="sticky top-0 z-50 backdrop-blur bg-white/80 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[64px] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-midnight flex items-center justify-center text-white font-bold">TC</div>
              <div>
                <div className="font-bold leading-none">TaxClarity</div>
                <div className="text-[10px] text-slate-500">IMPACTX 2026 • Dataset & Data Engineering</div>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="/" className="hover:text-slate-900">Home</a>
              <a href="/workspace" className="hover:text-slate-900">Workspace</a>
              <a href="https://github.com/akshayahasinidesetty/taxclarity" target="_blank" className="hover:text-slate-900">GitHub</a>
              <ThemeToggle />
            </nav>
            <div className="md:hidden flex items-center gap-2"><ThemeToggle /></div>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-16 border-t border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-6 py-6 text-xs text-slate-500 flex flex-col sm:flex-row justify-between gap-2">
            <span>TaxClarity • Akshaya Hasini Desetty — 25BCE8286 • Snehitha Marella — 25BCA7653 • Prototype Simulation Only</span>
            <span>Does not submit to Income Tax Department. Verify officially.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
