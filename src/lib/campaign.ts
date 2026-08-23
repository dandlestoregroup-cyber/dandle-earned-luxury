/**
 * North Coast campaign attribution + tracking.
 * Captures Google/UTM identifiers in-session and forwards events to any
 * analytics surfaces already present on the page. No new analytics vendor.
 */
const STORAGE_KEY = "dandle_campaign_attribution";

const PARAM_KEYS = [
  "gclid",
  "wbraid",
  "gbraid",
  "fbclid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export type Attribution = Partial<Record<(typeof PARAM_KEYS)[number], string>> & {
  landing_path?: string;
  captured_at?: string;
};

export function readAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}

export function captureCampaignAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const params = new URLSearchParams(window.location.search);
    const fresh: Attribution = {};
    PARAM_KEYS.forEach((key) => {
      const value = params.get(key);
      if (value) fresh[key] = value.slice(0, 200);
    });

    const stored = readAttribution();
    if (Object.keys(fresh).length === 0) return stored;

    const next: Attribution = {
      ...stored,
      ...fresh,
      landing_path: stored.landing_path ?? window.location.pathname,
      captured_at: stored.captured_at ?? new Date().toISOString(),
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  } catch {
    return {};
  }
}

export function withCampaignParams(path: string): string {
  const attr = readAttribution();
  const entries = Object.entries(attr).filter(
    ([key, value]) => value && (PARAM_KEYS as readonly string[]).includes(key)
  );
  if (entries.length === 0) return path;

  const [base, existing] = path.split("?");
  const params = new URLSearchParams(existing || "");
  entries.forEach(([key, value]) => {
    if (!params.has(key)) params.set(key, String(value));
  });
  return `${base}?${params.toString()}`;
}

export type NorthCoastEvent =
  | "north_coast_view"
  | "north_coast_fabric_engaged"
  | "north_coast_colour_selected"
  | "north_coast_product_selected"
  | "north_coast_nour_started"
  | "north_coast_lead"
  | "north_coast_checkout_started";

export function trackCampaign(event: NorthCoastEvent, payload?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const props = { campaign: "north_coast_summer_2026", ...readAttribution(), ...payload };
  try {
    const w = window as unknown as {
      dataLayer?: unknown[];
      plausible?: (eventName: string, options?: unknown) => void;
      posthog?: { capture: (eventName: string, properties?: unknown) => void };
    };
    w.dataLayer?.push({ event, ...props });
    w.plausible?.(event, { props });
    w.posthog?.capture(event, props);
  } catch {
    // Tracking must never interrupt shopping.
  }
}
