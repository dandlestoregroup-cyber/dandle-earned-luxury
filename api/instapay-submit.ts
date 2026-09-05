export default async function handler() {
  return Response.json(
    { error: "InstaPay checkout is retired. Secure card payment via PayTabs only." },
    { status: 410, headers: { "Cache-Control": "no-store" } },
  );
}
