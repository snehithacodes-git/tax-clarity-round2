export function Button({children, variant="primary", ...p}:any){
  const base="h-9 px-4 rounded-full text-xs font-semibold inline-flex items-center justify-center";
  const styles:any={primary:"bg-midnight text-white hover:bg-black", secondary:"bg-white border border-slate-200 hover:bg-slate-50", ghost:"hover:bg-slate-100"};
  return <button className={`${base} ${styles[variant]}`} {...p}>{children}</button>;
}
