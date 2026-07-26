const GATEWAY_HEALTH =
  "https://dandle-commerce-os-gateway.vercel.app/api/health";

export default async function handler(request: Request) {
  if (request.method !== "GET") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const response = await fetch(GATEWAY_HEALTH, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Gateway returned ${response.status}`);
    }

    const health = await response.json();
    return Response.json(health, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Integration health check failed", error);
    return Response.json(
      {
        mode: "unavailable",
        flags: {
          commerce_os_write_enabled: false,
          takeapp_bridge_enabled: false,
          paymob_enabled: false,
          whatsapp_actions_enabled: false,
        },
        contracts: {},
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
