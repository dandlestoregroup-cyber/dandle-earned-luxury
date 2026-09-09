export const NOUR_IMAGE_MODELS = Object.freeze({
  fast: "gpt-image-2.5-flare-2026-09-08",
  precision: "gpt-image-2.5-sunburst-2026-09-08",
  legacy: "gpt-image-2-2026-04-21",
});

const ATTEMPT_POLICY = Object.freeze([
  Object.freeze({ model: NOUR_IMAGE_MODELS.fast, quality: "high" }),
  Object.freeze({ model: NOUR_IMAGE_MODELS.precision, quality: "xhigh" }),
  Object.freeze({ model: NOUR_IMAGE_MODELS.precision, quality: "max" }),
]);

export function getRenderPolicy(attempt) {
  const index = Number.isInteger(attempt) ? Math.min(Math.max(attempt, 1), ATTEMPT_POLICY.length) - 1 : 0;
  return ATTEMPT_POLICY[index];
}

export function getModelFallbackChain(model) {
  if (model === NOUR_IMAGE_MODELS.precision) {
    return [NOUR_IMAGE_MODELS.precision, NOUR_IMAGE_MODELS.fast, NOUR_IMAGE_MODELS.legacy];
  }
  if (model === NOUR_IMAGE_MODELS.fast) {
    return [NOUR_IMAGE_MODELS.fast, NOUR_IMAGE_MODELS.legacy];
  }
  return [NOUR_IMAGE_MODELS.legacy];
}

export function qualityForModel(model, requestedQuality) {
  if (model === NOUR_IMAGE_MODELS.legacy && (requestedQuality === "xhigh" || requestedQuality === "max")) {
    return "high";
  }
  return requestedQuality;
}

export function shouldTryModelFallback(status, detail = "") {
  if ([403, 404, 429, 500, 502, 503, 504].includes(status)) return true;
  if (status !== 400) return false;
  return /model|availability|access|unsupported|does not exist|not found/i.test(String(detail));
}
