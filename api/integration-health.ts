import { getInstapayConfig } from "./_lib/payment.js";

const GATEWAY_HEALTH = "https://dandle-commerce-os-gateway.vercel.app/api/health";

export default async function handler(request: Request) {
  if (request.method !== "GET") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const orderWebhookReady = Boolean(
    process.env.TAKEAPP_ORDER_WEBHOOK_URL?.trim() && process.env.TAKEAPP_ORDER_WEBHOOK_TOKEN?.trim(),
  );
  const orderStatusReady = Boolean(
    process.env.TAKEAPP_ORDER_STATUS_URL?.trim() && process.env.TAKEAPP_ORDER_WEBHOOK_TOKEN?.trim(),
  );
  const paymentBridgeReady = Boolean(
    process.env.TAKEAPP_PAYMENT_WEBHOOK_URL?.trim() && process.env.TAKEAPP_ORDER_WEBHOOK_TOKEN?.trim(),
  );
  const payTabsReady = Boolean(
    process.env.PAYTABS_PROFILE_ID?.trim() && process.env.PAYTABS_SERVER_KEY?.trim() && paymentBridgeReady,
  );
  const instapayReady = Boolean(getInstapayConfig() && orderStatusReady && paymentBridgeReady);

  let gatewayHealth: Record<string, unknown> = {};
  let gatewayReachable = false;
  try {
    const response = await fetch(GATEWAY_HEALTH, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (response.ok) {
      gatewayHealth = await response.json();
      gatewayReachable = true;
    }
  } catch (error) {
    console.error("Integration gateway health check failed", error);
  }

  const gatewayFlags =
    gatewayHealth.flags && typeof gatewayHealth.flags === "object"
      ? (gatewayHealth.flags as Record<string, boolean>)
      : {};

  return Response.json(
    {
      ...gatewayHealth,
      mode: gatewayReachable ? gatewayHealth.mode || "available" : "gateway-unavailable",
      paymentProvider: "PayTabs",
      paymentFallback: "InstaPay",
      flags: {
        ...gatewayFlags,
        takeapp_order_enabled: orderWebhookReady,
        order_status_enabled: orderStatusReady,
        paytabs_enabled: payTabsReady,
        instapay_fallback_enabled: instapayReady,
      },
      localReadiness: {
        takeappOrderWebhook: orderWebhookReady,
        orderStatusBridge: orderStatusReady,
        paymentRecordingBridge: paymentBridgeReady,
        payTabsPayment: payTabsReady,
        instapayFallback: instapayReady,
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
