"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";

type Row = { id: number; source: string; field: string; value: string; note: string; status: "needs-review" | "verified" | "flagged" };
const STORAGE_KEY = "taxclarity-document-review-v1";
const sampleRows: Row[] = [
  { id: 1, source: "Sample Form 16", field: "Salary income", value: "850000", note: "Synthetic sample value", status: "needs-review" },
  { id: 2, source: "Sample AIS/TIS", field: "Interest income", value: "25000", note: "Synthetic sample value", status: "needs-review" },
  { id: 3, source: "Sample Form 26AS", field: "TDS", value: "80000", note: "Synthetic sample value", status: "needs-review" },
];

function csvEscape(value: string) { return `"${String(value ?? "").replace(/"/g, '""')}"`; }
function downloadText(filename: string, content: string, type = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"' && quoted && text[i + 1] === '"') { cell += '"'; i++; }
    else if (ch === '"') quoted = !quoted;
    else if (ch === "," && !quoted) { row.push(cell.trim()); cell = ""; }
    else if ((ch === "\n" || ch === "\r") && !quoted) {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell.trim());
      if (row.some(v => v !== "")) rows.push(row);
      row = []; cell = "";
    } else cell += ch;
  }
  row.push(cell.trim());
  if (row.some(v => v !== "")) rows.push(row);
  return rows;
}

export default function DocumentsReview() {
  const [rows, setRows] = useState<Row[]>(sampleRows);
  const [sourceName, setSourceName] = useState("Manual review");
  const [message, setMessage] = useState("Using synthetic examples. Upload a CSV to review your own non-sensitive test data.");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Row[];
        if (Array.isArray(parsed)) setRows(parsed);
      }
    } catch { /* Keep in-memory defaults when storage is unavailable. */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rows)); }
    catch { setMessage("Browser storage is unavailable or full. Your latest edits may not persist after closing this page."); }
  }, [rows, hydrated]);

  const counts = useMemo(() => ({
    all: rows.length,
    verified: rows.filter(r => r.status === "verified").length,
    flagged: rows.filter(r => r.status === "flagged").length,
    pending: rows.filter(r => r.status === "needs-review").length,
  }), [rows]);

  async function importFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setSourceName(file.name);
    try {
      const text = await file.text();
      if (file.name.toLowerCase().endsWith(".csv")) {
        const parsed = parseCsv(text);
        if (parsed.length < 2) { setMessage("CSV needs a header row and at least one data row."); return; }
        const headers = parsed[0].map(h => h.toLowerCase());
        const find = (names: string[]) => headers.findIndex(h => names.some(n => h.includes(n)));
        const fieldIndex = find(["field", "item", "description", "particular", "name", "type"]);
        const valueIndex = find(["value", "amount", "total", "income", "tds", "number"]);
        const sourceIndex = find(["source", "document", "file"]);
        const noteIndex = find(["note", "comment", "evidence", "reference"]);
        const imported: Row[] = parsed.slice(1).filter(r => r.some(v => v !== "")).map((r, index) => ({
          id: Date.now() + index,
          source: sourceIndex >= 0 ? (r[sourceIndex] || file.name) : file.name,
          field: fieldIndex >= 0 ? (r[fieldIndex] || `Row ${index + 2}`) : (r[0] || `Row ${index + 2}`),
          value: valueIndex >= 0 ? (r[valueIndex] || "") : (r[1] || ""),
          note: noteIndex >= 0 ? (r[noteIndex] || "Imported from CSV; verify source") : "Imported from CSV; verify source",
          status: "needs-review" as const,
        }));
        if (!imported.length) { setMessage("No data rows were found in this CSV."); return; }
        setRows(imported);
        setMessage(`Imported ${imported.length} rows from ${file.name}. Fields were parsed from CSV text; no tax facts were independently verified.`);
      } else if (/\.(txt|json)$/i.test(file.name)) {
        const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
        const imported = lines.map((line, index) => ({ id: Date.now() + index, source: file.name, field: `Line ${index + 1}`, value: line, note: "Imported text; manually classify and verify", status: "needs-review" as const }));
        setRows(imported);
        setMessage(`Imported ${imported.length} text lines. This is text intake only, not OCR or automatic tax-document interpretation.`);
      } else {
        setMessage("Supported formats are CSV, TXT and JSON. PDF/image OCR is not implemented in this offline prototype.");
      }
    } catch {
      setMessage("Could not read this file. Try a UTF-8 CSV or TXT file.");
    } finally { event.target.value = ""; }
  }

  function updateRow(id: number, patch: Partial<Row>) {
    setRows(current => current.map(row => row.id === id ? { ...row, ...patch } : row));
  }
  function exportCsv() {
    const header = ["source", "field", "value", "note", "status"].map(csvEscape).join(",");
    const body = rows.map(r => [r.source, r.field, r.value, r.note, r.status].map(csvEscape).join(","));
    downloadText("taxclarity-review.csv", [header, ...body].join("\r\n"), "text/csv;charset=utf-8");
  }
  function exportReport() {
    const report = { product: "TaxClarity", reportType: "Local document review", generatedAt: new Date().toISOString(), source: sourceName, counts, rows, disclaimer: "Prototype review output only. Imported values are not independently verified and this is not a tax return or professional advice." };
    downloadText("taxclarity-review-report.json", JSON.stringify(report, null, 2), "application/json;charset=utf-8");
  }

  return <section className="card p-5 space-y-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><h2 className="text-lg font-bold">Document Intake & Review</h2><p className="mt-1 text-xs leading-5 text-slate-500">Import non-sensitive CSV/TXT/JSON test data, edit extracted rows, record verification status and export a review report.</p></div>
      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-800">Local-only prototype</span>
    </div>
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-950"><b>Privacy and accuracy:</b> Do not upload PAN, Aadhaar, account numbers, credentials or real confidential documents. Files are read in your browser. This tool does not perform PDF/image OCR, authenticate document sources, or verify tax law.</div>
    <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
      <label className="block"><span className="text-xs font-semibold">Import CSV, TXT or JSON</span><input type="file" accept=".csv,.txt,.json,text/csv,text/plain,application/json" onChange={importFile} className="mt-2 block w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-xs file:font-semibold" /></label>
      <button onClick={exportCsv} type="button" className="rounded-lg border border-slate-300 px-4 py-2.5 text-xs font-semibold hover:bg-slate-50">Export CSV</button>
      <button onClick={exportReport} type="button" className="rounded-lg bg-midnight px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800">Download report</button>
    </div>
    <p role="status" className="text-xs leading-5 text-slate-600">{message}</p>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Count label="Total rows" value={counts.all}/><Count label="Needs review" value={counts.pending}/><Count label="Verified by you" value={counts.verified}/><Count label="Flagged by you" value={counts.flagged}/>
    </div>
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full min-w-[760px] border-collapse text-left text-xs">
        <thead className="bg-slate-50"><tr>{["Source", "Field", "Value / text", "Review note", "Status"].map(h => <th key={h} className="border-b px-3 py-3 font-bold">{h}</th>)}</tr></thead>
        <tbody>{rows.map(row => <tr key={row.id} className="align-top odd:bg-white even:bg-slate-50/50">
          <td className="border-b px-2 py-2"><input aria-label="Source" value={row.source} onChange={e => updateRow(row.id, { source: e.target.value })} className="w-32 rounded border border-slate-200 px-2 py-2" /></td>
          <td className="border-b px-2 py-2"><input aria-label="Field" value={row.field} onChange={e => updateRow(row.id, { field: e.target.value })} className="w-36 rounded border border-slate-200 px-2 py-2" /></td>
          <td className="border-b px-2 py-2"><input aria-label="Value or text" value={row.value} onChange={e => updateRow(row.id, { value: e.target.value })} className="w-32 rounded border border-slate-200 px-2 py-2" /></td>
          <td className="border-b px-2 py-2"><input aria-label="Review note" value={row.note} onChange={e => updateRow(row.id, { note: e.target.value })} className="w-44 rounded border border-slate-200 px-2 py-2" /></td>
          <td className="border-b px-2 py-2"><select aria-label="Review status" value={row.status} onChange={e => updateRow(row.id, { status: e.target.value as Row["status"] })} className="rounded border border-slate-200 bg-white px-2 py-2"><option value="needs-review">Needs review</option><option value="verified">Verified</option><option value="flagged">Flagged</option></select><button type="button" onClick={() => setRows(current => current.filter(r => r.id !== row.id))} className="mt-2 block text-[10px] font-semibold text-red-700 hover:underline">Remove row</button></td>
        </tr>)}</tbody>
      </table>
      {rows.length === 0 && <p className="p-5 text-xs text-slate-500">No rows. Import a file or restore the sample data.</p>}
    </div>
    <div className="flex flex-wrap gap-2"><button type="button" onClick={() => setRows(current => [...current, { id: Date.now(), source: "Manual entry", field: "New field", value: "", note: "Enter supporting evidence", status: "needs-review" }])} className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold hover:bg-slate-50">+ Add row</button><button type="button" onClick={() => { setRows(sampleRows); setSourceName("Synthetic sample"); setMessage("Restored synthetic sample rows."); }} className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold hover:bg-slate-50">Restore sample data</button><button type="button" onClick={() => { setRows([]); setMessage("All review rows cleared. Export anything you need first."); }} className="rounded-lg border border-red-200 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-50">Clear all rows</button></div>
    <p className="text-[10px] leading-4 text-slate-500">Review rows are stored in this browser's local storage when available. They do not sync across devices and may be removed if browser site data is cleared. “Verified” means you marked it verified; the application has not independently authenticated it.</p>
  </section>;
}
function Count({ label, value }: { label: string; value: number }) { return <div className="rounded-lg border border-slate-200 p-3"><div className="text-[10px] text-slate-500">{label}</div><div className="mt-1 text-xl font-bold">{value}</div></div>; }
