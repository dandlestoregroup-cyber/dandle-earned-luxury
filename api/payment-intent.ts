export default async function handler() {
  return Response.json(
    { error: "Legacy deposit checkout is retired. Use /api/public/paytabs/checkout." },
    { status: 410, headers: { "Cache-Control": "no-store" } },
  );
}
