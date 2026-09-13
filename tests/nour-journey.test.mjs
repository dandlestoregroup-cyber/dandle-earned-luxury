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
