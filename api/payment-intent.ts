export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }
  return Response.json(
    {
      error: "Legacy deposit checkout is retired. Start secure payment from the Dandle cart.",
      paymentAvailable: false,
    },
    { status: 410, headers: { "Cache-Control": "no-store" } },
  );
}
