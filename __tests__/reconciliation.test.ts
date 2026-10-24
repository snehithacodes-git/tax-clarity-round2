import { classify } from "@/lib/engine/reconciliation";
test("rounding within 10", ()=>{ expect(classify(1000,1005,{}) .type).toBe("ROUNDING"); });
test("implausible >500%", ()=>{ expect(classify(4500000,0,{avg:450000}).type).toBe("IMPLAUSIBLE"); });
test("internal contradiction", ()=>{ expect(classify(0,0,{statedTotal:520000,lineSum:500000}).type).toBe("INTERNAL"); });
test("timing default", ()=>{ expect(classify(8500,7000,{}).delta).toBe(1500); });
