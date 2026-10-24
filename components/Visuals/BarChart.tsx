export default function BarChart({data}:{data:{label:string,value:number}[]}){
  const max = Math.max(...data.map(d=>d.value),1);
  return (
    <div className="card p-4">
      <div className="text-xs font-bold">Visual Analytics - Live from inputs</div>
      <div className="mt-3 space-y-2">
        {data.map(d=>(
          <div key={d.label} className="flex items-center gap-2">
            <div className="w-20 text-[11px]">{d.label}</div>
            <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-midnight" style={{width:`${(d.value/max)*100}%`}} /></div>
            <div className="w-20 text-[11px] text-right">₹{d.value.toLocaleString()}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[10px] text-slate-500">Tabular alternative: {data.map(d=>`${d.label}=₹${d.value}`).join(", ")} • All values estimates based on synthetic assumptions.</div>
    </div>
  );
}
