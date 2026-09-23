const OPENAI_CONVERSIONS_ENDPOINT = "https://bzr.openai.com/v1/events";
const DEFAULT_SOURCE_URL = "https://dandle-vie.com/";

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
  status?: number;
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

/**
 * Server-side purchase telemetry. Missing Ads credentials are a safe no-op,
 * and delivery failure never changes payment truth or causes PayTabs retries.
 * The stable event id lets OpenAI deduplicate callback retries.
 */
export async function reportOpenAiOrderCreated(
  input: OpenAiOrderCreatedInput,
): Promise<OpenAiConversionDelivery> {
  const eventId = stableOpenAiOrderEventId(input.orderReference, input.transactionRef);
  const pixelId = Deno.env.get("OPENAI_ADS_PIXEL_ID")?.trim();
  const apiKey = Deno.env.get("OPENAI_CONVERSIONS_API_KEY")?.trim();
  if (!pixelId || !apiKey) return { configured: false, sent: false, eventId };

  try {
    const response = await fetch(`${OPENAI_CONVERSIONS_ENDPOINT}?pid=${encodeURIComponent(pixelId)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        integration_source: "dandle-paytabs",
        events: [buildOpenAiOrderCreatedEvent(input)],
      }),
    });

    if (!response.ok) {
      console.error("OpenAI conversion delivery failed", {
        eventId,
        status: response.status,
      });
      return { configured: true, sent: false, eventId, status: response.status };
    }

    return { configured: true, sent: true, eventId, status: response.status };
  } catch (error) {
    console.error("OpenAI conversion delivery unavailable", {
      eventId,
      error: error instanceof Error ? error.message : "unknown_error",
    });
    return { configured: true, sent: false, eventId };
  }
}
