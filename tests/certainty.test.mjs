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
