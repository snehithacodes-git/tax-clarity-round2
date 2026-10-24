import { estimateTax } from "@/lib/engine/taxCalc";
test("zero taxable", ()=>{ expect(estimateTax(0,"new").tax).toBe(0); });
test("basic slab", ()=>{ const r=estimateTax(400000,"new"); expect(r.tax).toBeGreaterThan(0); });
test("old vs new differs", ()=>{ const n=estimateTax(800000,"new"); const o=estimateTax(800000,"old"); expect(n.tax).not.toBe(o.tax); });
