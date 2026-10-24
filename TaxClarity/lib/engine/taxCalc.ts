// SYNTHETIC ASSUMPTIONS ONLY - DO NOT USE AS REAL TAX LAW
// Source: Synthetic for hackathon, Retrieval: 2026-10-24, FY: FY2025-26, Confidence: PRODUCT ASSUMPTION
export const DEFAULT_ASSUMPTIONS = {
  stdDeduction: 50000,
  slabs_new: [
    { upto: 300000, rate: 0 },
    { upto: 600000, rate: 5 },
    { upto: 900000, rate: 10 },
    { upto: 1200000, rate: 15 },
    { upto: 1500000, rate: 20 },
    { upto: Infinity, rate: 30 },
  ],
  slabs_old: [
    { upto: 250000, rate: 0 },
    { upto: 500000, rate: 5 },
    { upto: 1000000, rate: 20 },
    { upto: Infinity, rate: 30 },
  ],
  source: "Synthetic assumption - Not official CBDT - Verify current Finance Act",
  fy: "FY2025-26",
  retrievalDate: "2026-10-24"
};

export function estimateTax(taxable:number, regime:"old"|"new", assumptions=DEFAULT_ASSUMPTIONS){
  const slabs = regime==="new" ? assumptions.slabs_new : assumptions.slabs_old;
  let remaining=taxable; let tax=0; let prev=0; const breakdown:any[]=[];
  for(const s of slabs){
    const amount = Math.min(remaining, s.upto - prev);
    if(amount<=0){ prev=s.upto; continue; }
    const slabTax = amount * s.rate/100;
    breakdown.push({slab:`${prev}-${s.upto===Infinity?"∞":s.upto}`, amount, rate:s.rate, tax:slabTax});
    tax+=slabTax; remaining-=amount; prev=s.upto; if(remaining<=0) break;
  }
  return { tax: Math.round(tax), taxable, breakdown, label:"ESTIMATE - EDUCATIONAL PROTOTYPE - VERIFY CURRENT LAW - NOT OFFICIAL", assumptions };
}
