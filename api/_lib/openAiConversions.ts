const OPENAI_CONVERSIONS_ENDPOINT = "https://bzr.openai.com/v1/events";
const DEFAULT_SOURCE_URL = "https://dandle-vie.com/";
const DEFAULT_MAX_ATTEMPTS = 3;
const DEFAULT_TIMEOUT_MS = 2500;

export type OpenAiOrderCreatedInput = {
  orderReference: string;
  transactionRef: string;
  amountEgp: number;
  timestampMs?: number;
  sourceUrl?: string;
  oppref?: string | null;
};

export type OpenAiConversionDelivery = {
  configured: boolean;
  sent: boolean;
  eventId: string;
  status: number | null;
  attempts: number;
};

export function stableOpenAiOrderEventId(orderReference: string, transactionRef: string): string {
  return `dandle-order:${orderReference}:${transactionRef}`;
}

export function buildOpenAiOrderCreatedEvent(input: OpenAiOrderCreatedInput) {
  const amount = Number(input.amountEgp);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("OpenAI conversion amount must be a positive EGP value");
  }

  const sourceUrl = input.sourceUrl?.trim() || DEFAULT_SOURCE_URL;
  const parsedSource = new URL(sourceUrl);
  if (parsedSource.protocol !== "https:" && parsedSource.protocol !== "http:") {
    throw new Error("OpenAI conversion source URL must be http(s)");
  }

  const event: Record<string, unknown> = {
    id: stableOpenAiOrderEventId(input.orderReference, input.transactionRef),
    type: "order_created",
    timestamp_ms: input.timestampMs ?? Date.now(),
    action_source: "web",
    source_url: sourceUrl,
    data: {
      type: "contents",
      amount: Math.round(amount * 100),
      currency: "EGP",
    },
  };

  const oppref = input.oppref?.trim();
  if (oppref) event.oppref = oppref;
  return event;
}

const wait = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export async function reportOpenAiOrderCreated(
  input: OpenAiOrderCreatedInput,
  options: {
    fetchImpl?: typeof fetch;
    maxAttempts?: number;
    timeoutMs?: number;
    retryDelayMs?: number;
  } = {},
): Promise<OpenAiConversionDelivery> {
  const eventId = stableOpenAiOrderEventId(input.orderReference, input.transactionRef);
  const pixelId = process.env.OPENAI_ADS_PIXEL_ID?.trim();
  const apiKey = process.env.OPENAI_CONVERSIONS_API_KEY?.trim();
  if (!pixelId || !apiKey) {
    return { configured: false, sent: false, eventId, status: null, attempts: 0 };
  }

  const fetchImpl = options.fetchImpl ?? fetch;
  const maxAttempts = Math.max(1, Math.min(5, Number(options.maxAttempts) || DEFAULT_MAX_ATTEMPTS));
  const timeoutMs = Math.max(100, Number(options.timeoutMs) || DEFAULT_TIMEOUT_MS);
  const retryDelayMs = Math.max(0, Number(options.retryDelayMs) || 150);
  let status: number | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl(
        `${OPENAI_CONVERSIONS_ENDPOINT}?pid=${encodeURIComponent(pixelId)}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            integration_source: "dandle-paytabs",
            events: [buildOpenAiOrderCreatedEvent(input)],
          }),
          signal: controller.signal,
        },
      );
      status = response.status;
      if (response.ok) {
        return { configured: true, sent: true, eventId, status, attempts: attempt };
      }
      const retryable = response.status === 408 || response.status === 429 || response.status >= 500;
      if (!retryable || attempt === maxAttempts) {
        return { configured: true, sent: false, eventId, status, attempts: attempt };
      }
    } catch (error) {
      if (attempt === maxAttempts) {
        console.error("OpenAI conversion delivery unavailable", {
          eventId,
          error: error instanceof Error ? error.message : "unknown_error",
        });
        return { configured: true, sent: false, eventId, status, attempts: attempt };
      }
    } finally {
      clearTimeout(timeout);
    }

    if (retryDelayMs > 0) await wait(retryDelayMs * attempt);
  }

  return { configured: true, sent: false, eventId, status, attempts: maxAttempts };
}
