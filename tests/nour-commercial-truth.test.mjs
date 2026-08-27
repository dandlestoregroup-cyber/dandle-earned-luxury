import test from "node:test";
import assert from "node:assert/strict";

import {
  COMMERCIAL_DEFLECTION_AR,
  COMMERCIAL_DEFLECTION_EN,
  containsCommercialClaim,
  enforceAdviserOnly,
} from "../src/nour/commercialTruth.mjs";

test("catches prices in either script and either word order", () => {
  const priced = [
    "The RelaxMax starts at 28,500 EGP.",
    "RelaxMax is EGP 28500 for the manual version.",
    "الديفا بـ ٣٨٠٠٠ جنيه.",
    "سعرها ج.م ٣٨٬٠٠٠",
    "It comes to 125000 for the complete set.",
    "That's about 42,000 LE.",
  ];
  for (const text of priced) {
    assert.equal(containsCommercialClaim(text), true, text);
  }
});

test("catches measurements, lead times, discounts and stock claims", () => {
  const claims = [
    "You'll want about 10 cm of wall clearance.",
    "سيبي ١٥ سم من الحيطة.",
    "Production takes 14 days.",
    "التسليم خلال ٣ أسابيع.",
    "I can offer you a discount on that one.",
    "فيه خصم على الموديل ده.",
    "That colour is in stock.",
    "الموديل ده متوفر دلوقتي.",
  ];
  for (const text of claims) {
    assert.equal(containsCommercialClaim(text), true, text);
  }
});

test("leaves ordinary placement advice alone", () => {
  const safe = [
    "Open corner beside the sofa.",
    "Here are 3 placements that read naturally in this room.",
    "Option 2 keeps the window light on your left.",
    "الركن الفاضي جنب الكنبة.",
    "جربي مكانين: جنب المكتبة، أو مقابل التلفزيون.",
    "The Diva in Olive Beige suits the warm tones already in the room.",
    "Summer 2026 fabric reads well against these walls.",
  ];
  for (const text of safe) {
    assert.equal(containsCommercialClaim(text), false, text);
  }
});

test("enforceAdviserOnly passes safe replies through untouched", () => {
  const reply = "Open corner beside the sofa keeps the walkway clear.";
  assert.deepEqual(enforceAdviserOnly(reply, "where should it go?"), { reply, deflected: false });
});

test("enforceAdviserOnly replaces the whole reply, never part of it", () => {
  const result = enforceAdviserOnly(
    "Great choice. The RelaxMax is 28,500 EGP and ships in 14 days.",
    "how much is the RelaxMax?",
  );
  assert.equal(result.deflected, true);
  assert.equal(result.reply, COMMERCIAL_DEFLECTION_EN);
  assert.equal(containsCommercialClaim(result.reply), false);
  assert.ok(!result.reply.includes("28,500"));
});

test("enforceAdviserOnly answers Arabic customers in Arabic", () => {
  const result = enforceAdviserOnly("The Diva is 38,000 EGP.", "الديفا بكام؟");
  assert.equal(result.deflected, true);
  assert.equal(result.reply, COMMERCIAL_DEFLECTION_AR);
});

test("the deflections do not themselves trip the guard", () => {
  assert.equal(containsCommercialClaim(COMMERCIAL_DEFLECTION_EN), false);
  assert.equal(containsCommercialClaim(COMMERCIAL_DEFLECTION_AR), false);
});

test("empty replies are left for the caller's fallback", () => {
  assert.deepEqual(enforceAdviserOnly("", "hi"), { reply: "", deflected: false });
  assert.deepEqual(enforceAdviserOnly(null, "hi"), { reply: "", deflected: false });
});
