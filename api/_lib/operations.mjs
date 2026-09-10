import { createHash, randomUUID } from "node:crypto";

const OPERATIONS_EVENT_VERSION = "dandle.ops.v1";
const DEFAULT_MAX_ATTEMPTS = 3;
const DEFAULT_TIMEOUT_MS = 2500;

const clean = (value, max = 200) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export function buildOperationsEvent({
  type,
  entityType,
  entityId,
  state,
  nextAction,
  data = {},
  occurredAt = new Date().toISOString(),
  eventId = randomUUID(),
}) {
  const safeType = clean(type, 80);
  const safeEntityType = clean(entityType, 40);
  const safeEntityId = clean(entityId, 120);
  const safeState = clean(state, 80);
  const safeNextAction = clean(nextAction, 120);

  if (!safeType || !safeEntityType || !safeEntityId || !safeState || !safeNextAction) {
    throw new Error("Operations events require type, entityType, entityId, state and nextAction");
  }

  return {
    version: OPERATIONS_EVENT_VERSION,
    eventId,
    type: safeType,
    entity: {
      type: safeEntityType,
      id: safeEntityId,
    },
    state: safeState,
    nextAction: safeNextAction,
    source: "dandle-vercel",
    occurredAt,
    data,
  };
}

export function stableOperationsEventId(...parts) {
  const normalizedParts = parts.map((part) => clean(String(part), 500));
  if (!normalizedParts.some(Boolean)) {
    throw new Error("Stable operations event IDs require source material");
  }

  const material = JSON.stringify(normalizedParts);
  const hex = createHash("sha256").update(material).digest("hex").slice(0, 32).split("");
  hex[12] = "5";
  hex[16] = ((Number.parseInt(hex[16], 16) & 0x3) | 0x8).toString(16);
  const value = hex.join("");
  return `${value.slice(0, 8)}-${value.slice(8, 12)}-${value.slice(12, 16)}-${value.slice(16, 20)}-${value.slice(20)}`;
}

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export async function emitOperationsEvent(event, options = {}) {
  const url = process.env.DANDLE_OPERATIONS_WEBHOOK_URL?.trim();
  const token = process.env.DANDLE_OPERATIONS_WEBHOOK_TOKEN?.trim();

  if (!url || !token) {
    return { configured: false, delivered: false, status: null, attempts: 0 };
  }

  const fetchImpl = options.fetchImpl || fetch;
  const maxAttempts = Math.max(1, Math.min(5, Number(options.maxAttempts) || DEFAULT_MAX_ATTEMPTS));
  const timeoutMs = Math.max(100, Number(options.timeoutMs) || DEFAULT_TIMEOUT_MS);
  const requestedRetryDelay = Number(options.retryDelayMs);
  const retryDelayMs = Number.isFinite(requestedRetryDelay)
    ? Math.max(0, requestedRetryDelay)
    : 150;
  let status = null;
  let attempts = 0;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    attempts = attempt;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetchImpl(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Dandle-Event-Id": event.eventId,
        },
        body: JSON.stringify(event),
        signal: controller.signal,
      });
      status = response.status;

      if (response.ok) {
        return { configured: true, delivered: true, status, attempts: attempt };
      }

      const retryable = response.status === 408 || response.status === 429 || response.status >= 500;
      if (!retryable || attempt === maxAttempts) break;
    } catch (error) {
      if (attempt === maxAttempts) {
        console.error(
          "Dandle operations event delivery failed",
          error instanceof Error ? error.message : "unknown_error",
        );
        break;
      }
    } finally {
      clearTimeout(timeout);
    }

    if (attempt < maxAttempts && retryDelayMs > 0) {
      await wait(retryDelayMs * attempt);
    }
  }

  console.error("Dandle operations event delivery failed", {
    type: event?.type,
    entityId: event?.entity?.id,
    status,
    attempts,
  });
  return { configured: true, delivered: false, status, attempts };
}
