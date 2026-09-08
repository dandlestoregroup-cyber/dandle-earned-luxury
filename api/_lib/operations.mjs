const OPERATIONS_EVENT_VERSION = "dandle.ops.v1";

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
  eventId = crypto.randomUUID(),
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

export async function emitOperationsEvent(event) {
  const url = process.env.DANDLE_OPERATIONS_WEBHOOK_URL?.trim();
  const token = process.env.DANDLE_OPERATIONS_WEBHOOK_TOKEN?.trim();

  if (!url || !token) {
    return { configured: false, delivered: false, status: null };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
      signal: controller.signal,
    });

    if (!response.ok) {
      console.error("Dandle operations event delivery failed", {
        type: event?.type,
        entityId: event?.entity?.id,
        status: response.status,
      });
    }

    return {
      configured: true,
      delivered: response.ok,
      status: response.status,
    };
  } catch (error) {
    console.error(
      "Dandle operations event delivery failed",
      error instanceof Error ? error.message : "unknown_error",
    );
    return { configured: true, delivered: false, status: null };
  } finally {
    clearTimeout(timeout);
  }
}
