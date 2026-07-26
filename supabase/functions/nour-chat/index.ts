// Legacy endpoint intentionally disabled.
// Nour now runs through the Vercel /api/nour function and Vercel AI Gateway.
Deno.serve(() =>
  new Response(
    JSON.stringify({
      error: "Moved",
      endpoint: "/api/nour",
    }),
    {
      status: 410,
      headers: { "Content-Type": "application/json" },
    },
  ),
);
