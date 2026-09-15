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

test("creates a resumable journey and a close action for WhatsApp", () => {
  const result = createNourReply({ message: "Continue on WhatsApp", journey: { id: "journey_test" } });
  assert.equal(result.journeyId, "journey_test");
  assert.equal(result.nextBestAction, "CLOSE");
  assert.equal(result.memoryPatch.appendActions.length, 1);
});

test("responds naturally in Arabic", () => {
  const result = createNourReply({ message: "محتاج كرسي يساعد والدي في الوقوف" });
  assert.match(result.reply, /أقرب اختيار/);
  assert.ok(["easyup", "easyup-compact"].includes(result.recommendations[0].id));
});

test("preserves the shortlist across price and WhatsApp follow-ups", () => {
  const first = createNourReply({ message: "I need comfort for a small apartment" });
  const journey = { id: first.journeyId, recommendations: first.recommendations, lastNeed: "I need comfort for a small apartment" };
  const price = createNourReply({ message: "What's the price?", journey });
  const handoff = createNourReply({ message: "Continue on WhatsApp", journey });
  assert.equal(price.recommendations[0].id, "spacesaver");
  assert.equal(price.nextBestAction, "SHOW");
  assert.equal(handoff.recommendations[0].id, "spacesaver");
  assert.equal(handoff.nextBestAction, "CLOSE");
});

test("recognizes the Arabic choices offered in the qualification prompt", () => {
  assert.ok(["easyup", "easyup-compact"].includes(createNourReply({ message: "مساعدة في الوقوف" }).recommendations[0].id));
  assert.equal(createNourReply({ message: "كرسي لشخصين" }).recommendations[0].id, "cozycompanion");
});
