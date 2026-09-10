import test from "node:test";
import assert from "node:assert/strict";
import { auditCommercialTruth, recommendationGuard } from "../src/nour/certainty.mjs";

const NOW = new Date("2026-08-31T10:00:00Z");

function dependable(overrides = {}) {
  return {
    priceValues: [28900],
    promotion: { active: false },
    stock: { status: "verified_in_stock", verifiedAt: "2026-08-31T08:00:00Z" },
    delivery: { fixedDate: "2026-09-05", verifiedAt: "2026-08-31T08:00:00Z", promises: ["2026-09-05"] },
    installation: { included: true, scope: "Delivery placement and setup" },
    warranty: { term: "12 months", verifiedAt: "2026-08-31T08:00:00Z" },
    afterSales: { channel: "DANDLE care", active: true },
    ...overrides,
  };
}

test("dependable SKU passes the recommendation gate", () => {
  const result = auditCommercialTruth(dependable(), NOW);
  assert.equal(result.score, 100);
  assert.equal(result.status, "dependable");
  assert.equal(result.recommendable, true);
});

test("contradictory prices block recommendation", () => {
  const result = recommendationGuard(dependable({ priceValues: [28900, 29900] }), NOW);
  assert.equal(result.recommendable, false);
  assert.equal(result.action, "verify_or_handoff");
  assert.ok(result.issues.some((issue) => issue.code === "PRICE_CONFLICT"));
});

test("expired promotion blocks recommendation", () => {
  const result = auditCommercialTruth(dependable({
    promotion: { active: true, label: "Summer offer", endsAt: "2026-08-30T23:59:59Z" },
  }), NOW);
  assert.equal(result.recommendable, false);
  assert.ok(result.issues.some((issue) => issue.code === "PROMOTION_EXPIRED"));
});

test("unstable delivery promises block recommendation", () => {
  const result = auditCommercialTruth(dependable({
    delivery: {
      fixedDate: "2026-09-05",
      verifiedAt: "2026-08-31T08:00:00Z",
      promises: ["2026-09-05", "2026-09-08"],
    },
  }), NOW);
  assert.equal(result.recommendable, false);
  assert.ok(result.issues.some((issue) => issue.code === "DELIVERY_PROMISE_CONFLICT"));
});

test("only finite positive decimal prices pass, including equivalent representations", () => {
  for (const priceValues of [[], ["unknown"], [" "], [""], [-100], [0], ["0"], [Infinity],
    [NaN], [null], [true], [{}], ["0x10"], ["28900 EGP"], [28900, "unknown"], [28900, 0]]) {
    const result = recommendationGuard(dependable({ priceValues }), NOW);
    assert.equal(result.checks.price, false, JSON.stringify(priceValues));
    assert.equal(result.recommendable, false);
    assert.equal(result.action, "verify_or_handoff");
    assert.ok(result.issues.some((issue) => issue.code === "PRICE_UNVERIFIED"));
  }
  const equivalent = auditCommercialTruth(dependable({ priceValues: [28900, "28900", " 28900.00 "] }), NOW);
  assert.equal(equivalent.recommendable, true);
  assert.equal(equivalent.score, 100);
});

test("expired delivery dates block recommendation, while date-only promises last through the Cairo day", () => {
  const audit = (fixedDate, now = NOW) => auditCommercialTruth(dependable({
    delivery: { fixedDate, verifiedAt: "2026-08-31T08:00:00Z" },
  }), now);
  for (const expired of ["2020-01-01", "2026-08-30", "2026-08-31T09:59:59Z", NOW.toISOString()]) {
    const result = audit(expired);
    assert.equal(result.recommendable, false, expired);
    assert.ok(result.issues.some((issue) => issue.code === "DELIVERY_DATE_EXPIRED"));
  }
  assert.equal(audit("2026-08-31").recommendable, true);
  assert.equal(audit("2026-08-31", new Date("2026-08-31T20:59:59Z")).recommendable, true);
  assert.equal(audit("2026-08-31", new Date("2026-08-31T21:00:00Z")).recommendable, false);
  assert.equal(audit("2026-08-31T13:01:00+03:00").recommendable, true);
  for (const invalid of ["not-a-date", "2026-02-30", "2026-09-01T10:00:00", ""]) {
    const result = audit(invalid);
    assert.equal(result.recommendable, false, invalid);
    assert.ok(result.issues.some((issue) => issue.code === "DELIVERY_DATE_UNVERIFIED"));
  }
});
