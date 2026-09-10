import assert from "node:assert/strict";
import test from "node:test";

import { fetchGatewayHealth } from "../api/_lib/integrationHealth.mjs";

test("integration health aborts an unresponsive upstream gateway", async () => {
  let observedSignal;
  const startedAt = Date.now();

  await assert.rejects(fetchGatewayHealth("https://gateway.test/health", {
    timeoutMs: 100,
    fetchImpl: async (_url, init) => {
      observedSignal = init.signal;
      return await new Promise((_, reject) => {
        init.signal.addEventListener("abort", () => reject(new Error("aborted")), { once: true });
      });
    },
  }), /aborted/);

  assert.equal(observedSignal.aborted, true);
  assert.ok(Date.now() - startedAt < 1000);
});

test("integration health forwards no-store JSON request settings", async () => {
  let observedInit;
  const response = await fetchGatewayHealth("https://gateway.test/health", {
    fetchImpl: async (_url, init) => {
      observedInit = init;
      return new Response('{"mode":"ready"}', {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    },
  });

  assert.equal(response.status, 200);
  assert.deepEqual(observedInit.headers, { Accept: "application/json" });
  assert.equal(observedInit.cache, "no-store");
  assert.equal(observedInit.signal.aborted, false);
});
