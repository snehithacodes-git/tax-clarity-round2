import { shouldRefer } from "@/lib/engine/referral";

test("flags a Form 16 and AIS mismatch for review", () => {
  expect(shouldRefer("Form 16 and AIS mismatch").fired).toBe(true);
});

test("routes loan and insurance tax-saving questions to verification", () => {
  const result = shouldRefer("How can I reduce tax using loans or insurance?");
  expect(result.fired).toBe(true);
  if (result.fired) expect(result.triggerId).toBe("PERSONALIZED_TAX_ADVICE");
});

test("flags requests to hide income", () => {
  const result = shouldRefer("Can I hide income?");
  expect(result.fired).toBe(true);
  if (result.fired) expect(result.triggerId).toBe("COMPLIANCE_BOUNDARY");
});

test("does not invent an escalation for an unrelated greeting", () => {
  expect(shouldRefer("hello there").fired).toBe(false);
});
