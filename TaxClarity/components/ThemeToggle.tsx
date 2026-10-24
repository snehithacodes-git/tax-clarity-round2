"use client";
import { useEffect, useState } from "react";
export default function ThemeToggle(){
  const [dark,setDark]=useState(false);
  useEffect(()=>{ const s=localStorage.getItem("tc-theme"); if(s==="dark"){document.documentElement.classList.add("dark"); setDark(true);} },[]);
  const toggle=()=>{ const n=!dark; setDark(n); document.documentElement.classList.toggle("dark",n); localStorage.setItem("tc-theme", n?"dark":"light"); };
  return <button onClick={toggle} className="h-8 w-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-xs">{dark?"☀":"🌙"}</button>;
}
