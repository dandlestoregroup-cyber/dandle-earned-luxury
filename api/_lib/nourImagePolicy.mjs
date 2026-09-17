// Precision edits only. No silent provider/model downgrade or automatic paid retry.
export const NOUR_IMAGE_MODELS = Object.freeze({ precision: "gpt-image-2.5-sunburst" });
export const NOUR_RENDER_POLICY = Object.freeze({ model: NOUR_IMAGE_MODELS.precision, quality: "high", maxAttempts: 1 });
