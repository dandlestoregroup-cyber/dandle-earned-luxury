import test from "node:test";
import assert from "node:assert/strict";
import { createNourReply } from "../api/_lib/nourJourney.mjs";

test("routes a small-room need to SpaceSaver with grounded product link", () => {
  const result = createNourReply({ message: "I need comfort for a small apartment" });
  assert.equal(result.recommendations[0].id, "spacesaver");
  assert.equal(result.recommendations[0].productUrl, "/products/spacesaver");
  assert.equal(result.commercialSource, "DANDLE server catalogue");
  assert.equal(result.nextBestAction, "SHOW");
});

test("preserves the shortlist and original need for a price follow-up", () => {
  const first = createNourReply({ message: "I need comfort for a small apartment" });
  const result = createNourReply({
    message: "What's the price?",
    journey: { id: first.journeyId, lastNeed: "I need comfort for a small apartment", recommendations: first.recommendations },
  });
  assert.deepEqual(result.recommendations.map((item) => item.id), first.recommendations.map((item) => item.id));
  assert.equal(result.memoryPatch.lastNeed, "I need comfort for a small apartment");
  assert.match(result.reply, /price starts at/i);
  assert.equal(result.nextBestAction, "SHOW");
});

test("preserves the shortlist for comparison and WhatsApp handoff", () => {
  const first = createNourReply({ message: "I need comfort for a small apartment" });
  const journey = { id: "journey_test", lastNeed: "I need comfort for a small apartment", recommendations: first.recommendations };
  const comparison = createNourReply({ message: "compare those", journey });
  assert.deepEqual(comparison.recommendations.map((item) => item.id), first.recommendations.map((item) => item.id));
  assert.match(comparison.reply, /while/i);

  const handoff = createNourReply({ message: "Continue on WhatsApp", journey });
  assert.equal(handoff.journeyId, "journey_test");
  assert.equal(handoff.nextBestAction, "CLOSE");
  assert.deepEqual(handoff.recommendations.map((item) => item.id), first.recommendations.map((item) => item.id));
  assert.equal(handoff.memoryPatch.lastNeed, journey.lastNeed);
  assert.equal(handoff.memoryPatch.appendActions.length, 1);
});

test("responds naturally in Arabic", () => {
  const result = createNourReply({ message: "محتاج كرسي يساعد والدي في الوقوف" });
  assert.match(result.reply, /أقرب اختيار/);
  assert.ok(["easyup", "easyup-compact"].includes(result.recommendations[0].id));
});

test("matches the exact Arabic standing prompt", () => {
  const result = createNourReply({ message: "مساعدة في الوقوف" });
  assert.ok(["easyup", "easyup-compact"].includes(result.recommendations[0].id));
  assert.equal(result.nextBestAction, "SHOW");
});

test("matches the exact Arabic seating-for-two prompt", () => {
  const result = createNourReply({ message: "كرسي لشخصين" });
  assert.equal(result.recommendations[0].id, "cozycompanion");
  assert.equal(result.nextBestAction, "SHOW");
});
