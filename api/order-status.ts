const referencePattern = /^DN-[A-Z0-9-]{4,48}$/;

export default async function handler(request: Request) {
  if (request.method !== "GET") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const reference = new URL(request.url).searchParams.get("reference")?.trim() || "";
  if (!referencePattern.test(reference)) {
    return Response.json({ error: "Invalid order reference" }, { status: 400 });
  }

  const statusUrl = process.env.TAKEAPP_ORDER_STATUS_URL?.trim();
  const statusToken = process.env.TAKEAPP_ORDER_WEBHOOK_TOKEN?.trim();
  if (!statusUrl || !statusToken) {
    return Response.json(
      {
        success: false,
        reference,
        status: "STATUS_UNAVAILABLE",
        manualConfirmationRequired: true,
        error: "Live order status is not connected yet",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const upstream = await fetch(
      `${statusUrl}${statusUrl.includes("?") ? "&" : "?"}reference=${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${statusToken}` },
        cache: "no-store",
      },
    );
    if (!upstream.ok) {
      throw new Error(`TakeApp status bridge returned ${upstream.status}`);
    }
    return Response.json(await upstream.json(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("TakeApp status bridge failed", error);
    return Response.json(
      {
        success: false,
        reference,
        status: "STATUS_UNAVAILABLE",
        manualConfirmationRequired: true,
        error: "Live order status is temporarily unavailable",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
