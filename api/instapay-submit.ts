export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }
  return Response.json(
    { error: "Manual payment submission is not available. Dandle uses secure card payment via PayTabs." },
    { status: 410, headers: { "Cache-Control": "no-store" } },
  );
}
