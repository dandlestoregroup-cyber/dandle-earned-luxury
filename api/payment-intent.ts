export async function POST() {
  return Response.json(
    {
      error: "Legacy deposit checkout is retired. Start secure payment from the Dandle cart.",
      paymentAvailable: false,
    },
    { status: 410, headers: { "Cache-Control": "no-store" } },
  );
}
