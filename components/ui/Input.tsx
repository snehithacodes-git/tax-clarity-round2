export function Input({label, error, ...props}:any){
  return (
    <label className="block">
      <div className="text-[11px] font-semibold text-slate-700 mb-1">{label}</div>
      <input className="w-full h-9 rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-eteal" {...props} />
      {error && <div className="text-[11px] text-coral mt-1">{error}</div>}
    </label>
  );
}
