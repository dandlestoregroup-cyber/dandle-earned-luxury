export const DANDLE_ORDER_REFERENCE_RE = /^DN-[A-Za-z0-9-]{4,40}$/;

export function isValidDandleOrderReference(value: unknown): value is string {
  return typeof value === "string" && DANDLE_ORDER_REFERENCE_RE.test(value);
}
