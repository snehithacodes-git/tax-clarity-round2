export function DiffView({oldDoc,newDoc}:{oldDoc:any,newDoc:any}){
  return (
    <div className="card p-5">
      <div className="font-bold">Supersession Diff - Corrected Statement Handling</div>
      <div className="mt-3 grid md:grid-cols-2 gap-4">
        <div className="rounded-lg border border-red-200 bg-red-50 p-3"><div className="text-[11px] font-bold">OLD - SUPERSEDED - {oldDoc.id}</div><pre className="text-[11px] mt-2 whitespace-pre-wrap">{JSON.stringify(oldDoc,null,2)}</pre></div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3"><div className="text-[11px] font-bold">NEW - ACTIVE - {newDoc.id} - supersedes {newDoc.supersedesId}</div><pre className="text-[11px] mt-2 whitespace-pre-wrap">{JSON.stringify(newDoc,null,2)}</pre></div>
      </div>
      <div className="mt-3 text-[11px]">Diff: Amount changed ₹{oldDoc.statedTotal} → ₹{newDoc.statedTotal} (Δ ₹{newDoc.statedTotal-oldDoc.statedTotal}). All drafts using old doc marked AFFECTED - NEEDS REVALIDATION. Draft never silently uses superseded doc.</div>
    </div>
  );
}
export default DiffView;
