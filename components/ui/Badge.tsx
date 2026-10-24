export function Badge({children, tone="neutral"}:{children:any, tone?: "neutral"|"amber"|"coral"|"success"}){
  const m:any={neutral:"bg-slate-100 text-slate-700", amber:"bg-amber-100 text-amber-800", coral:"bg-red-100 text-red-700", success:"bg-emerald-100 text-emerald-800"};
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${m[tone]}`}>{children}</span>;
}
