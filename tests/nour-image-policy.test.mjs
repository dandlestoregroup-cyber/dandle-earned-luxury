import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  NOUR_IMAGE_MODELS,
  getModelFallbackChain,
  getRenderPolicy,
  qualityForModel,
  shouldTryModelFallback,
} from "../api/_lib/nourImagePolicy.mjs";

test("Nour starts fast and escalates only after visual QA failure", () => {
  assert.deepEqual(getRenderPolicy(1), {
    model: "gpt-image-2.5-flare-2026-09-08",
    quality: "high",
  });
  assert.deepEqual(getRenderPolicy(2), {
    model: "gpt-image-2.5-sunburst-2026-09-08",
    quality: "xhigh",
  });
  assert.deepEqual(getRenderPolicy(3), {
    model: "gpt-image-2.5-sunburst-2026-09-08",
    quality: "max",
  });
});

test("render policy clamps invalid attempt numbers safely", () => {
  assert.equal(getRenderPolicy(0).model, NOUR_IMAGE_MODELS.fast);
  assert.equal(getRenderPolicy(Number.NaN).model, NOUR_IMAGE_MODELS.fast);
  assert.equal(getRenderPolicy(99).quality, "max");
});

test("precision model falls back without taking Nour offline", () => {
  assert.deepEqual(getModelFallbackChain(NOUR_IMAGE_MODELS.precision), [
    NOUR_IMAGE_MODELS.precision,
    NOUR_IMAGE_MODELS.fast,
    NOUR_IMAGE_MODELS.legacy,
  ]);
  assert.deepEqual(getModelFallbackChain(NOUR_IMAGE_MODELS.fast), [
    NOUR_IMAGE_MODELS.fast,
    NOUR_IMAGE_MODELS.legacy,
  ]);
});

test("legacy GPT Image 2 never receives unsupported 2.5 quality levels", () => {
  assert.equal(qualityForModel(NOUR_IMAGE_MODELS.legacy, "max"), "high");
  assert.equal(qualityForModel(NOUR_IMAGE_MODELS.legacy, "xhigh"), "high");
  assert.equal(qualityForModel(NOUR_IMAGE_MODELS.fast, "xhigh"), "xhigh");
});

test("fallback happens only for availability, access, rate, or server failures", () => {
  assert.equal(shouldTryModelFallback(404, "model not found"), true);
  assert.equal(shouldTryModelFallback(429, "rate limited"), true);
  assert.equal(shouldTryModelFallback(503, "temporarily unavailable"), true);
  assert.equal(shouldTryModelFallback(400, "You do not have access to model"), true);
  assert.equal(shouldTryModelFallback(400, "invalid image payload"), false);
  assert.equal(shouldTryModelFallback(401, "invalid api key"), false);
});

test("Nour render source uses Image edits and omits the obsolete input_fidelity parameter", async () => {
  const source = await readFile(new URL("../api/nour-render.ts", import.meta.url), "utf8");
  assert.match(source, /https:\/\/api\.openai\.com\/v1\/images\/edits/);
  assert.match(source, /getRenderPolicy\(attempt\)/);
  assert.match(source, /imageModel: render\.model/);
  assert.doesNotMatch(source, /input_fidelity/);
});
