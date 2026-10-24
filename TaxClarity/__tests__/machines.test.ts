import { LEGAL_TRANSITIONS, transition, clearLog } from "@/lib/state/machines";
test("legal transitions defined", ()=>{ expect(LEGAL_TRANSITIONS.Draft.DRAFT).toContain("VALIDATED"); });
test("audit log append", ()=>{ clearLog(); const e=transition("DRAFT","VALIDATED","test"); expect(e.hash).toBeDefined(); });
