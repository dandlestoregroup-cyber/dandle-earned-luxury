export default async function handler() {
  return Response.json(
    { error: "Legacy PayTabs callback retired. Use /api/public/paytabs/webhook." },
    { status: 410, headers: { "Cache-Control": "no-store" } },
  );
}
