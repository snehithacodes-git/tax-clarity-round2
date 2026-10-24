
"use client";

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

export default function DiffView({
  oldDoc,
  newDoc,
}: {
  oldDoc: TaxDocument;
  newDoc: TaxDocument;
}) {
  const money = (n: number) =>
    `₹${n.toLocaleString("en-IN")}`;

  const fields: {
    label: string;
    oldValue: string;
    newValue: string;
  }[] = [
    {
      label: "Document ID",
      oldValue: oldDoc.id,
      newValue: newDoc.id,
    },
    {
      label: "Version",
      oldValue: oldDoc.versionId,
      newValue: newDoc.versionId,
    },
    {
      label: "Issue date",
      oldValue: oldDoc.issueDate,
      newValue: newDoc.issueDate,
    },
    {
      label: "Financial year",
      oldValue: oldDoc.taxPeriod,
      newValue: newDoc.taxPeriod,
    },
    {
      label: "Source entity",
      oldValue: oldDoc.sourceEntity,
      newValue: newDoc.sourceEntity,
    },
    {
      label: "Stated total",
      oldValue: money(oldDoc.statedTotal),
      newValue: money(newDoc.statedTotal),
    },
    {
      label: "Status",
      oldValue: oldDoc.isSuperseded ? "Superseded" : "Active",
      newValue: newDoc.isSuperseded ? "Superseded" : "Active",
    },
  ];

  const changed = fields.filter(
    (field) => field.oldValue !== field.newValue
  );

  const oldLines = new Map(
    oldDoc.lineItems.map((item) => [item.desc, item.amount])
  );

  const newLines = new Map(
    newDoc.lineItems.map((item) => [item.desc, item.amount])
  );

  const lineNames = Array.from(
    new Set([...oldLines.keys(), ...newLines.keys()])
  );

  const changedLines = lineNames.filter(
    (name) => oldLines.get(name) !== newLines.get(name)
  );

  const totalDelta = newDoc.statedTotal - oldDoc.statedTotal;

  return (
    <section className="card space-y-5 p-5">
      <div>
        <h2 className="text-lg font-bold">Version Diff</h2>
        <p className="mt-1 text-sm text-slate-500">
          Compare the earlier document with its corrected version.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-xs font-semibold text-red-700">
            PREVIOUS VERSION
          </p>
          <p className="mt-2 break-words font-bold">{oldDoc.id}</p>
          <p className="mt-2 text-sm">
            Stated total: {money(oldDoc.statedTotal)}
          </p>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs font-semibold text-emerald-700">
            NEW VERSION
          </p>
          <p className="mt-2 break-words font-bold">{newDoc.id}</p>
          <p className="mt-2 text-sm">
            Stated total: {money(newDoc.statedTotal)}
          </p>
        </div>
      </div>

      <div className="rounded-xl border p-4">
        <p className="text-sm text-slate-500">
          Change in stated total
        </p>
        <p className="mt-1 text-2xl font-bold">
          {totalDelta > 0 ? "+" : ""}
          {money(totalDelta)}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          This is the document-total difference, not the final tax
          liability difference.
        </p>
      </div>

      <div>
        <h3 className="font-bold">Field-by-field comparison</h3>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2">Field</th>
                <th className="p-2">Previous</th>
                <th className="p-2">New</th>
                <th className="p-2">Result</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field) => {
                const isChanged =
                  field.oldValue !== field.newValue;

                return (
                  <tr
                    key={field.label}
                    className="border-b last:border-0"
                  >
                    <td className="p-2 font-medium">
                      {field.label}
                    </td>
                    <td className="p-2">{field.oldValue}</td>
                    <td className="p-2">{field.newValue}</td>
                    <td className="p-2">
                      <span
                        className={
                          isChanged
                            ? "font-semibold text-amber-700"
                            : "text-slate-500"
                        }
                      >
                        {isChanged ? "Changed" : "Unchanged"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="font-bold">Line-item changes</h3>

        {changedLines.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">
            No line-item changes detected.
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {changedLines.map((name) => {
              const oldAmount = oldLines.get(name);
              const newAmount = newLines.get(name);

              return (
                <div
                  key={name}
                  className="rounded-lg border p-3"
                >
                  <p className="font-semibold">{name}</p>
                  <p className="mt-1 text-sm">
                    Previous:{" "}
                    {oldAmount === undefined
                      ? "Not present"
                      : money(oldAmount)}
                  </p>
                  <p className="text-sm">
                    New:{" "}
                    {newAmount === undefined
                      ? "Removed"
                      : money(newAmount)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded-lg bg-amber-50 p-3 text-sm">
        <b>Review required:</b> Verify the corrected document and
        revalidate calculations that depend on the changed fields.
        This comparison uses the supplied documents; it does not
        independently verify their authenticity.
      </div>
    </section>
  );
}
