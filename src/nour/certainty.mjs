export const CERTAINTY_WEIGHTS = Object.freeze({
  price: 20,
  promotion: 15,
  stock: 20,
  delivery: 20,
  installation: 10,
  warranty: 10,
  afterSales: 5,
});

const REQUIRED_FOR_RECOMMENDATION = ["price", "stock", "delivery", "warranty"];

function present(value) {
  return value !== null && value !== undefined && value !== "";
}

function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeBoolean(value) {
  return value === true || value === "true";
}

export function auditCommercialTruth(record, now = new Date()) {
  const issues = [];
  const checks = {};

  const priceValues = Array.isArray(record?.priceValues) ? record.priceValues.filter(present) : [];
  const uniquePrices = [...new Set(priceValues.map((value) => String(value).trim()))];
  checks.price = uniquePrices.length === 1;
  if (uniquePrices.length === 0) issues.push({ code: "PRICE_UNVERIFIED", severity: "block" });
  if (uniquePrices.length > 1) issues.push({ code: "PRICE_CONFLICT", severity: "block", values: uniquePrices });

  const promoActive = normalizeBoolean(record?.promotion?.active);
  const promoEndsAt = parseDate(record?.promotion?.endsAt);
  const promoExpired = promoActive && promoEndsAt && promoEndsAt.getTime() < now.getTime();
  checks.promotion = !promoActive || Boolean(promoEndsAt && !promoExpired && present(record?.promotion?.label));
  if (promoExpired) issues.push({ code: "PROMOTION_EXPIRED", severity: "block" });
  if (promoActive && !promoEndsAt) issues.push({ code: "PROMOTION_END_UNVERIFIED", severity: "block" });

  checks.stock = record?.stock?.status === "verified_in_stock" && present(record?.stock?.verifiedAt);
  if (!checks.stock) issues.push({ code: "STOCK_UNVERIFIED", severity: "block" });

  const deliveryDate = parseDate(record?.delivery?.fixedDate);
  checks.delivery = Boolean(deliveryDate && present(record?.delivery?.verifiedAt));
  if (!checks.delivery) issues.push({ code: "DELIVERY_DATE_UNVERIFIED", severity: "block" });
  if (Array.isArray(record?.delivery?.promises) && new Set(record.delivery.promises.filter(present)).size > 1) {
    checks.delivery = false;
    issues.push({ code: "DELIVERY_PROMISE_CONFLICT", severity: "block" });
  }

  checks.installation = normalizeBoolean(record?.installation?.included) && present(record?.installation?.scope);
  if (!checks.installation) issues.push({ code: "INSTALLATION_UNVERIFIED", severity: "warn" });

  checks.warranty = present(record?.warranty?.term) && present(record?.warranty?.verifiedAt);
  if (!checks.warranty) issues.push({ code: "WARRANTY_UNVERIFIED", severity: "block" });

  checks.afterSales = present(record?.afterSales?.channel) && normalizeBoolean(record?.afterSales?.active);
  if (!checks.afterSales) issues.push({ code: "AFTER_SALES_UNVERIFIED", severity: "warn" });

  const score = Object.entries(CERTAINTY_WEIGHTS).reduce(
    (sum, [key, weight]) => sum + (checks[key] ? weight : 0),
    0,
  );

  const hardGatePassed = REQUIRED_FOR_RECOMMENDATION.every((key) => checks[key]);
  const recommendable = hardGatePassed && score >= 80 && !issues.some((issue) => issue.severity === "block");

  return {
    score,
    status: recommendable ? "dependable" : score >= 60 ? "needs_verification" : "do_not_promise",
    recommendable,
    checks,
    issues,
  };
}

export function recommendationGuard(record, now = new Date()) {
  const audit = auditCommercialTruth(record, now);
  return {
    ...audit,
    action: audit.recommendable ? "recommend" : "verify_or_handoff",
  };
}
