export type MismatchType = 'ROUNDING'|'TIMING'|'MISSING'|'SOURCE_CORRECTION'|'IMPLAUSIBLE'|'INTERNAL'|'VERSION_CONFLICT';
export interface Discrepancy {
  type: MismatchType; delta: number; what: string; why: string; next: string; confidence: number; source: string; freshness: string;
}
export function classify(a:number,b:number,ctx:{avg?:number,statedTotal?:number,lineSum?:number}):Discrepancy{
  const delta=a-b;
  const freshness=new Date().toISOString();
  const source="Synthetic demo - No official data";
  if(ctx.statedTotal!=null && ctx.lineSum!=null && ctx.statedTotal!==ctx.lineSum){
    return {type:'INTERNAL', delta: ctx.statedTotal-ctx.lineSum, what:`Stated total ₹${ctx.statedTotal} != sum(lineItems) ₹${ctx.lineSum}`, why:"Internal contradiction - calculation will be inconsistent", next:"Present discrepancy, show which figure each calculation used, ask user which to use", confidence:0.95, source, freshness};
  }
  if(Math.abs(delta)<=10){
    return {type:'ROUNDING', delta, what:`₹${Math.abs(delta)} rounding difference`, why:"Portal rounding tolerance ±Rs10", next:"Auto-accept portal value within tolerance", confidence:0.9, source, freshness};
  }
  if(ctx.avg && Math.abs(a) > ctx.avg*5){
    return {type:'IMPLAUSIBLE', delta, what:`₹${a} is >500% avg ₹${ctx.avg} - possible extra zero typo`, why:"Implausible figure may be data entry error", next:"Flag for confirmation, do NOT block legitimate high value - allow override after confirmation", confidence:0.8, source, freshness};
  }
  if(Math.abs(delta)>1000){
    return {type:'SOURCE_CORRECTION', delta, what:`Delta ₹${delta} exceeds tolerance`, why:"May need employer correction or missing deduction proof", next:"Check if all 80C proofs submitted to employer, confirm TAN, verify AIS", confidence:0.75, source, freshness};
  }
  return {type:'TIMING', delta, what:`Delta ₹${delta} - timing or missing record`, why:"Mar salary credited Apr, or bank interest not in Form16", next:"Review FY mapping, check AIS freshness, declare missing manually if needed", confidence:0.7, source, freshness};
}
