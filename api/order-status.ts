const referencePattern = /^DN-[A-Z0-9-]{4,40}$/;

export default async function handler(request: Request) {
  if (request.method !== "GET") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const reference = new URL(request.url).searchParams.get("reference")?.trim() || "";
  if (!referencePattern.test(reference)) {
    return Response.json({ error: "Invalid order reference" }, { status: 400 });
  }

  const statusUrl = process.env.TAKEAPP_ORDER_STATUS_URL;
  const statusToken = process.env.TAKEAPP_ORDER_WEBHOOK_TOKEN;

  if (statusUrl && statusToken) {
    try {
      const upstream = await fetch(
        `${statusUrl}${statusUrl.includes("?") ? "&" : "?"}reference=${encodeURIComponent(reference)}`,
        {
          headers: { Authorization: `Bearer ${statusToken}` },
          cache: "no-store",
        },
      );
      if (upstream.ok) {
        return Response.json(await upstream.json(), {
          headers: { "Cache-Control": "no-store" },
        });
      }
    } catch (error) {
      console.error("TakeApp status bridge failed", error);
    }
  }

  return Response.json(
    {
      success: true,
      order: {
        reference,
        status: "PENDING",
        createdAt: new Date().toISOString(),
        totalPrice: "0",
        currencyCode: "EGP",
        lineItems: [],
      },
      source: "manual-confirmation",
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
