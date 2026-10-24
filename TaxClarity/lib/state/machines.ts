export type DeadlineState = "SAFE"|"AT_RISK_6D"|"CRITICAL"|"OVERDUE";
export type DraftState = "DRAFT"|"VALIDATED"|"SUBMITTED_SIM"|"ACKNOWLEDGED_SIM"|"DEFECT_NOTICE"|"RESPONSE";
export type DocumentState = "UPLOADED"|"SCANNED"|"VALIDATED"|"ACCEPTED_FOR_CALC"|"SUPERSEDED";

export interface AuditEntry { timestamp:string; from:string; to:string; reason:string; sourceDocId?:string; hashPrev?:string; hash:string; }

let auditLog:AuditEntry[]=[];
function hash(str:string){ let h=0; for(let i=0;i<str.length;i++) h=(h*31+str.charCodeAt(i))>>>0; return h.toString(16); }

export function transition(from:string,to:string,reason:string,sourceDocId?:string){
  const prevHash = auditLog.length ? auditLog[auditLog.length-1].hash : "GENESIS";
  const entry:AuditEntry = { timestamp:new Date().toISOString(), from, to, reason, sourceDocId, hashPrev:prevHash, hash:"" };
  entry.hash = hash(JSON.stringify(entry)+prevHash);
  auditLog.push(entry);
  return entry;
}
export function getAuditLog(){ return auditLog; }
export function clearLog(){ auditLog=[]; }

// Legal transitions - no collapsed status
export const LEGAL_TRANSITIONS = {
  Deadline: { SAFE:["AT_RISK_6D"], AT_RISK_6D:["CRITICAL","SAFE"], CRITICAL:["OVERDUE","SAFE"], OVERDUE:[] },
  Draft: { DRAFT:["VALIDATED"], VALIDATED:["SUBMITTED_SIM"], SUBMITTED_SIM:["ACKNOWLEDGED_SIM","DEFECT_NOTICE"], ACKNOWLEDGED_SIM:[], DEFECT_NOTICE:["RESPONSE"], RESPONSE:["VALIDATED"] },
  Document: { UPLOADED:["SCANNED"], SCANNED:["VALIDATED"], VALIDATED:["ACCEPTED_FOR_CALC"], ACCEPTED_FOR_CALC:["SUPERSEDED"], SUPERSEDED:[] }
};
