"use client";

import { useMemo, useState } from "react";

type LineItem = {
  desc: string;
  amount: number;
};

type TaxDocument = {
  id: string;
  versionId: string;
  issueDate: string;
  taxPeriod: string;
  sourceEntity: string;
  uploadTime: string;
  supersedesId: string | null;
  lineItems: LineItem[];
  statedTotal: number;
  freshness: string;
  isSuperseded?: boolean;
};

type DiffViewProps = {
  oldDoc: TaxDocument;
  newDoc: TaxDocument;
};

type LineChange = {
  name: string;
  oldAmount: number | undefined;
  newAmount: number | undefined;
  status: "added" | "removed" | "modified";
  delta: number | null;
};

const money = (value: number) => {
  if (!Number.isFinite(value)) return "Not available";

  const absolute = Math.abs(value).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });

  if (value < 0) return `−₹${absolute}`;
  return `₹${absolute}`;
};

const signedMoney = (value: number) => {
  if (!Number.isFinite(value)) return "Not available";
  if (value > 0) return `+${money(value)}`;
  if (value < 0) return `−${money(Math.abs(value))}`;
  return money(0);
};

const display = (value: string | null | undefined) => {
  return value && value.trim() ? value : "Not provided";
};

function StatusBadge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "green" | "amber" | "red" | "blue";
}) {
  const styles = {
    neutral: "bg-slate-100 text-slate-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-800",
    red: "bg-red-50 text-red-700",
    blue: "bg-blue-50 text-blue-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${styles[tone]}`}
    >
      {children}
    </span>
  );
}

function SummaryCard({
  label,
  value,
  detail,
  tone = "neutral",
}: {
  label: string;
  value: string;
  detail: string;
  tone?: "neutral" | "green" | "amber" | "red";
}) {
  const borderStyles = {
    neutral: "border-slate-200",
    green: "border-emerald-200",
    amber: "border-amber-200",
    red: "border-red-200",
  };

  return (
    <div className={`rounded-2xl border bg-white p-4 ${borderStyles[tone]}`}>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-2 break-words text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
        {value}
      </p>
      <p className="mt-2 text-xs leading-5 text-slate-500">{detail}</p>
    </div>
  );
}

export default function DiffView({ oldDoc, newDoc }: DiffViewProps) {
  const [showUnchanged, setShowUnchanged] = useState(true);
  const [lineFilter, setLineFilter] = useState<
    "all" | "added" | "removed" | "modified"
  >("all");

  const fields = useMemo(
    () => [
      {
        label: "Document ID",
        oldValue: display(oldDoc.id),
        newValue: display(newDoc.id),
      },
      {
        label: "Version",
        oldValue: display(oldDoc.versionId),
        newValue: display(newDoc.versionId),
      },
      {
        label: "Issue date",
        oldValue: display(oldDoc.issueDate),
        newValue: display(newDoc.issueDate),
      },
      {
        label: "Financial year / tax period",
        oldValue: display(oldDoc.taxPeriod),
        newValue: display(newDoc.taxPeriod),
      },
      {
        label: "Source entity",
        oldValue: display(oldDoc.sourceEntity),
        newValue: display(newDoc.sourceEntity),
      },
      {
        label: "Upload time",
        oldValue: display(oldDoc.uploadTime),
        newValue: display(newDoc.uploadTime),
      },
      {
        label: "Stated total",
        oldValue: money(oldDoc.statedTotal),
        newValue: money(newDoc.statedTotal),
      },
      {
        label: "Freshness",
        oldValue: display(oldDoc.freshness),
        newValue: display(newDoc.freshness),
      },
      {
        label: "Document status",
        oldValue: oldDoc.isSuperseded ? "Superseded" : "Not marked superseded",
        newValue: newDoc.isSuperseded ? "Superseded" : "Not marked superseded",
      },
      {
        label: "Supersedes document",
        oldValue: display(oldDoc.supersedesId),
        newValue: display(newDoc.supersedesId),
      },
    ],
    [oldDoc, newDoc]
  );

  const changedFields = fields.filter(
    (field) => field.oldValue !== field.newValue
  );

  const lineChanges = useMemo(() => {
    const oldLines = new Map<string, number>();
    const newLines = new Map<string, number>();

    oldDoc.lineItems.forEach((item) => {
      oldLines.set(item.desc, (oldLines.get(item.desc) ?? 0) + item.amount);
    });

    newDoc.lineItems.forEach((item) => {
      newLines.set(item.desc, (newLines.get(item.desc) ?? 0) + item.amount);
    });

    const names = Array.from(
      new Set([...oldLines.keys(), ...newLines.keys()])
    );

    const changes: LineChange[] = [];

    for (const name of names) {
      const oldAmount = oldLines.get(name);
      const newAmount = newLines.get(name);

      if (oldAmount === undefined && newAmount !== undefined) {
        changes.push({
          name,
          oldAmount,
          newAmount,
          status: "added",
          delta: null,
        });
      } else if (newAmount === undefined && oldAmount !== undefined) {
        changes.push({
          name,
          oldAmount,
          newAmount,
          status: "removed",
          delta: null,
        });
      } else if (
        oldAmount !== undefined &&
        newAmount !== undefined &&
        oldAmount !== newAmount
      ) {
        changes.push({
          name,
          oldAmount,
          newAmount,
          status: "modified",
          delta: newAmount - oldAmount,
        });
      }
    }

    return { changes, oldLines, newLines };
  }, [oldDoc.lineItems, newDoc.lineItems]);

  const totalDelta = newDoc.statedTotal - oldDoc.statedTotal;
  const hasValidTotals =
    Number.isFinite(oldDoc.statedTotal) &&
    Number.isFinite(newDoc.statedTotal);

  const addedCount = lineChanges.changes.filter(
    (line) => line.status === "added"
  ).length;

  const removedCount = lineChanges.changes.filter(
    (line) => line.status === "removed"
  ).length;

  const modifiedCount = lineChanges.changes.filter(
    (line) => line.status === "modified"
  ).length;

  const filteredLineChanges = lineChanges.changes.filter(
    (line) => lineFilter === "all" || line.status === lineFilter
  );

  const unchangedLines = Array.from(lineChanges.oldLines.keys()).filter(
    (name) =>
      lineChanges.newLines.has(name) &&
      lineChanges.oldLines.get(name) === lineChanges.newLines.get(name)
  );

  const totalLineItems = newDoc.lineItems.length;
  const computedOldTotal = oldDoc.lineItems.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const computedNewTotal = newDoc.lineItems.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const oldTotalMismatch =
    Number.isFinite(oldDoc.statedTotal) &&
    Math.abs(computedOldTotal - oldDoc.statedTotal) > 0.01;

  const newTotalMismatch =
    Number.isFinite(newDoc.statedTotal) &&
    Math.abs(computedNewTotal - newDoc.statedTotal) > 0.01;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="card space-y-4 p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-lg text-indigo-700">
                ⇄
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-700">
                Document review
              </span>
            </div>
            <h2 className="mt-4 text-xl font-bold tracking-tight sm:text-2xl">
              Version comparison
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Compare two supplied document versions, inspect changed fields
              and identify line items that need verification.
            </p>
          </div>

          <StatusBadge tone={changedFields.length > 0 || lineChanges.changes.length > 0 ? "amber" : "green"}>
            {changedFields.length > 0 || lineChanges.changes.length > 0
              ? "Changes detected"
              : "No differences detected"}
          </StatusBadge>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Previous version
              </p>
              <StatusBadge tone="neutral">Old</StatusBadge>
            </div>
            <p className="mt-3 break-words text-base font-bold">
              {display(oldDoc.id)}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Version {display(oldDoc.versionId)}
            </p>
            <div className="mt-4 border-t border-slate-200 pt-3">
              <p className="text-xs text-slate-500">Stated document total</p>
              <p className="mt-1 text-lg font-bold">
                {money(oldDoc.statedTotal)}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                New version
              </p>
              <StatusBadge tone="blue">New</StatusBadge>
            </div>
            <p className="mt-3 break-words text-base font-bold">
              {display(newDoc.id)}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Version {display(newDoc.versionId)}
            </p>
            <div className="mt-4 border-t border-indigo-100 pt-3">
              <p className="text-xs text-slate-500">Stated document total</p>
              <p className="mt-1 text-lg font-bold">
                {money(newDoc.statedTotal)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Change in stated total"
          value={hasValidTotals ? signedMoney(totalDelta) : "Not available"}
          detail="Difference between the two document totals"
          tone={totalDelta === 0 ? "neutral" : totalDelta > 0 ? "green" : "red"}
        />
        <SummaryCard
          label="Changed fields"
          value={String(changedFields.length)}
          detail="Metadata and stated-total fields that differ"
          tone={changedFields.length > 0 ? "amber" : "green"}
        />
        <SummaryCard
          label="Changed line items"
          value={String(lineChanges.changes.length)}
          detail={`${addedCount} added · ${removedCount} removed · ${modifiedCount} modified`}
          tone={lineChanges.changes.length > 0 ? "amber" : "green"}
        />
        <SummaryCard
          label="New version line items"
          value={String(totalLineItems)}
          detail="Number of line-item entries in the new document"
        />
      </div>

      {/* Total interpretation */}
      <div className="card p-5 sm:p-6">
        <h3 className="font-bold">Understanding the total difference</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {totalDelta > 0
            ? `The new document's stated total is ${money(totalDelta)} higher than the previous document's stated total.`
            : totalDelta < 0
              ? `The new document's stated total is ${money(Math.abs(totalDelta))} lower than the previous document's stated total.`
              : "The stated totals are equal in the two versions."}
        </p>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          A total difference is not the same as a change in tax payable. Verify
          the source documents, reporting period, line items and applicable
          calculations before taking action.
        </p>
      </div>

      {/* Field comparison */}
      <div className="card p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-lg font-bold">Field-by-field comparison</h3>
            <p className="mt-1 text-sm text-slate-500">
              Review metadata and totals from both supplied versions.
            </p>
          </div>

          <label className="inline-flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={showUnchanged}
              onChange={(event) => setShowUnchanged(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            Show unchanged fields
          </label>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="p-3 font-semibold">Field</th>
                <th className="p-3 font-semibold">Previous</th>
                <th className="p-3 font-semibold">New</th>
                <th className="p-3 font-semibold">Result</th>
              </tr>
            </thead>
            <tbody>
              {fields
                .filter(
                  (field) =>
                    showUnchanged || field.oldValue !== field.newValue
                )
                .map((field) => {
                  const changed = field.oldValue !== field.newValue;

                  return (
                    <tr
                      key={field.label}
                      className="border-t border-slate-100 align-top"
                    >
                      <td className="p-3 font-medium text-slate-800">
                        {field.label}
                      </td>
                      <td className="max-w-[220px] break-words p-3 text-slate-600">
                        {field.oldValue}
                      </td>
                      <td className="max-w-[220px] break-words p-3 text-slate-600">
                        {field.newValue}
                      </td>
                      <td className="p-3">
                        {changed ? (
                          <StatusBadge tone="amber">Changed</StatusBadge>
                        ) : (
                          <StatusBadge tone="green">Unchanged</StatusBadge>
                        )}
                      </td>
                    </tr>
                  );
                })}

              {!showUnchanged && changedFields.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-6 text-center text-sm text-slate-500"
                  >
                    No changed fields were detected.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Line item changes */}
      <div className="card p-5 sm:p-6">
        <div>
          <h3 className="text-lg font-bold">Line-item changes</h3>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Line items are matched by their description. Identically named
            entries are grouped before comparing their totals.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
            <p className="text-xs text-emerald-800">Added</p>
            <p className="mt-1 text-xl font-bold text-emerald-800">
              {addedCount}
            </p>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50 p-3">
            <p className="text-xs text-red-800">Removed</p>
            <p className="mt-1 text-xl font-bold text-red-800">
              {removedCount}
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs text-amber-800">Modified</p>
            <p className="mt-1 text-xl font-bold text-amber-800">
              {modifiedCount}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {(
            [
              ["all", "All changes"],
              ["added", "Added"],
              ["removed", "Removed"],
              ["modified", "Modified"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setLineFilter(value)}
              aria-pressed={lineFilter === value}
              className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                lineFilter === value
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {filteredLineChanges.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-6 text-center">
            <p className="text-sm font-semibold text-slate-700">
              {lineChanges.changes.length === 0
                ? "No line-item differences detected"
                : "No changes match this filter"}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              {lineChanges.changes.length === 0
                ? "The matched line-item descriptions have equal totals in both versions. This does not verify document completeness."
                : "Choose another filter to inspect the other changes."}
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {filteredLineChanges.map((line) => (
              <article
                key={line.name}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h4 className="break-words font-semibold">{line.name}</h4>
                    <div className="mt-2">
                      {line.status === "added" && (
                        <StatusBadge tone="green">Added in new version</StatusBadge>
                      )}
                      {line.status === "removed" && (
                        <StatusBadge tone="red">Missing from new version</StatusBadge>
                      )}
                      {line.status === "modified" && (
                        <StatusBadge tone="amber">Amount changed</StatusBadge>
                      )}
                    </div>
                  </div>

                  {line.delta !== null && (
                    <div className="sm:text-right">
                      <p className="text-xs text-slate-500">Amount difference</p>
                      <p
                        className={`mt-1 font-bold ${
                          line.delta > 0
                            ? "text-emerald-700"
                            : line.delta < 0
                              ? "text-red-700"
                              : "text-slate-700"
                        }`}
                      >
                        {signedMoney(line.delta)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Previous amount</p>
                    <p className="mt-1 break-words text-sm font-semibold">
                      {line.oldAmount === undefined
                        ? "Not present"
                        : money(line.oldAmount)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">New amount</p>
                    <p className="mt-1 break-words text-sm font-semibold">
                      {line.newAmount === undefined
                        ? "Not present"
                        : money(line.newAmount)}
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-xs leading-5 text-slate-500">
                  {line.status === "added"
                    ? "Verify that this item belongs in the corrected document and is supported by evidence."
                    : line.status === "removed"
                      ? "Verify why this item is absent and whether the revised document is complete."
                      : "Check the supporting records and determine whether the amount change is expected."}
                </p>
              </article>
            ))}
          </div>
        )}

        {unchangedLines.length > 0 && (
          <details className="mt-4 rounded-xl border border-slate-200 p-4">
            <summary className="cursor-pointer text-sm font-semibold text-slate-700">
              View unchanged line items ({unchangedLines.length})
            </summary>
            <ul className="mt-3 space-y-2">
              {unchangedLines.map((name) => (
                <li
                  key={name}
                  className="flex flex-col gap-1 border-t border-slate-100 pt-2 text-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="break-words text-slate-700">{name}</span>
                  <span className="font-medium">
                    {money(lineChanges.oldLines.get(name) ?? 0)}
                  </span>
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>

      {/* Internal consistency */}
      <div className="card p-5 sm:p-6">
        <h3 className="text-lg font-bold">Stated total vs. line-item sum</h3>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          This arithmetic check compares each document's stated total with the
          sum of its supplied line items. It does not establish that the
          underlying records are complete or eligible for a tax claim.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            {
              label: "Previous version",
              stated: oldDoc.statedTotal,
              calculated: computedOldTotal,
              mismatch: oldTotalMismatch,
            },
            {
              label: "New version",
              stated: newDoc.statedTotal,
              calculated: computedNewTotal,
              mismatch: newTotalMismatch,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-slate-200 p-4"
            >
              <p className="text-sm font-semibold">{item.label}</p>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">Stated total</span>
                  <span className="font-semibold">{money(item.stated)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">Line-item sum</span>
                  <span className="font-semibold">{money(item.calculated)}</span>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                  <span className="text-slate-500">Arithmetic difference</span>
                  <span className="font-semibold">
                    {money(item.stated - item.calculated)}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                {item.mismatch ? (
                  <StatusBadge tone="amber">
                    Total needs review
                  </StatusBadge>
                ) : (
                  <StatusBadge tone="green">
                    Totals agree arithmetically
                  </StatusBadge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review guidance */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 font-bold text-amber-800">
            !
          </span>
          <div>
            <h3 className="font-bold text-slate-900">
              Review before relying on the new version
            </h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
              <li>
                Confirm the document's source, reporting period and issue date.
              </li>
              <li>
                Inspect each changed amount against the supporting record.
              </li>
              <li>
                Resolve any mismatch between the stated total and line-item sum.
              </li>
              <li>
                Check whether the newer document formally supersedes the
                previous one before treating it as authoritative.
              </li>
              <li>
                Recalculate any downstream reconciliation or tax estimate that
                depends on changed fields.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <p className="px-1 text-xs leading-5 text-slate-500">
        TaxClarity compares the document data supplied to this component. It
        does not independently authenticate documents, retrieve official tax
        records or determine final tax liability. Confirm important decisions
        with the relevant official records or a qualified tax professional.
      </p>
    </section>
  );
}
