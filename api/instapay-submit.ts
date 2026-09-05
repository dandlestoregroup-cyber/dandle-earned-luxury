export async function POST() {
  return Response.json(
    { error: "Manual payment submission is not available. Dandle uses secure card payment via PayTabs." },
    { status: 410, headers: { "Cache-Control": "no-store" } },
  );
}
