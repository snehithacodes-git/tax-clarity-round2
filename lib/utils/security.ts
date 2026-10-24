export function redactFigures(text:string){ return text.replace(/₹\s?\d[\d,]+/g, "[REDACTED]"); }
export function verifyNoFinancialInLogs(logs:string[]){
  const regex=/\b\d{5,}\b/; // 5+ digit numbers = potential financial leak
  const hits=logs.filter(l=>regex.test(l) && !l.includes("[REDACTED]"));
  return { zero: hits.length===0, hits };
}
