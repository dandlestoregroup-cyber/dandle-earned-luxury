// Legacy endpoint intentionally disabled.
// Product media is maintained in GitHub and deployed through Vercel.
Deno.serve(() =>
  new Response(
    JSON.stringify({
      error: "Disabled",
      message: "Product image generation is managed outside this legacy endpoint.",
    }),
    {
      status: 410,
      headers: { "Content-Type": "application/json" },
    },
  ),
);
