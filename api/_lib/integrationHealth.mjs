const DEFAULT_GATEWAY_TIMEOUT_MS = 2500;

export async function fetchGatewayHealth(url, options = {}) {
  const fetchImpl = options.fetchImpl || fetch;
  const requestedTimeout = Number(options.timeoutMs);
  const timeoutMs = Number.isFinite(requestedTimeout)
    ? Math.max(100, requestedTimeout)
    : DEFAULT_GATEWAY_TIMEOUT_MS;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetchImpl(url, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}
