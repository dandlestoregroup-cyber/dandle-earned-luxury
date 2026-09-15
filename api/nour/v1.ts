export async function POST(request: Request) {
  if (request.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405 });
  try {
    // Vercel emits this TypeScript function as CommonJS. Keep the ESM catalogue
    // behind a native dynamic import so Node does not try to require() it.
    const { createNourReply } = await import("../_lib/nourJourney.mjs");
    const body = await request.json();
    if (!body || typeof body.message !== "string" || !body.message.trim()) {
      return Response.json({ error: "A message is required" }, { status: 400 });
    }
    return Response.json(createNourReply({
      message: body.message,
      journey: typeof body.journey === "object" && body.journey ? body.journey : {},
      source: typeof body.source === "object" && body.source ? body.source : {},
    }));
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}
