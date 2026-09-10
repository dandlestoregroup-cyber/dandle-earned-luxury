# Dandle Earned Luxury

Dandle's customer-facing catalogue, Nour adviser, website order flow, order tracking and operations launchpad.

## Architecture

- **GitHub** is the source of truth for application code.
- **Vercel** hosts the Vite site, serverless API boundary and Nour AI Gateway access.
- **TakeApp** remains the commercial back office for order review, acceptance/amendment, customers, fulfilment, payment verification and communication.
- **PayTabs Egypt** is the primary card-payment provider for accepted/amended orders.
- **InstaPay** is a controlled fallback when PayTabs cannot complete and no payment is still uncertain/pending.
- **WhatsApp** is post-order communication/support, not an order-creation or payment-verification path.
- No Base44, Lovable runtime or client-side Shopify checkout is required.

## Order and payment truth

1. Customer submits an order on the Dandle website.
2. The server validates product configurations and recalculates prices from the server catalogue.
3. TakeApp receives the order with a Dandle reference and status `SUBMITTED`.
4. Dandle accepts, amends or rejects the order in the commercial back office.
5. Only accepted/amended orders may pay the verified 40% deposit.
6. PayTabs is attempted first. The server derives the deposit from the verified TakeApp order total; no browser-supplied amount is trusted.
7. Before the PayTabs redirect is exposed to the customer, the active transaction is recorded as `PAYMENT_PENDING` so a second payment method cannot start blindly.
8. PayTabs callback data is public/untrusted. Dandle re-queries PayTabs server-side and validates the verified cart ID, currency and exact expected deposit before recording the result.
9. InstaPay fallback may start only when the order is payable and the existing payment is conclusively unpaid, failed, declined, cancelled or expired. A pending/unknown payment blocks fallback.
10. InstaPay uses the same Dandle order reference and the same server-verified deposit amount. Recipient details come only from server-controlled environment configuration.
11. A customer's InstaPay transaction reference is evidence only. It can move the order to `INSTAPAY_VERIFICATION_REQUIRED`; it can never mark an order paid. Authorized Dandle verification in the commercial back office is required.
12. The remaining 60% is due on delivery under the current commercial flow.
13. Order tracking never fabricates a fallback status when the live status bridge is unavailable.

## Required production environment

```text
TAKEAPP_ORDER_WEBHOOK_URL=
TAKEAPP_ORDER_STATUS_URL=
TAKEAPP_PAYMENT_WEBHOOK_URL=
TAKEAPP_ORDER_WEBHOOK_TOKEN=
PAYTABS_PROFILE_ID=
PAYTABS_SERVER_KEY=
PUBLIC_SITE_URL=https://<production-domain>
DANDLE_OPERATIONS_WEBHOOK_URL=
DANDLE_OPERATIONS_WEBHOOK_TOKEN=
```

For InstaPay fallback, also configure these **server-side only** values in Vercel:

```text
INSTAPAY_RECIPIENT_NAME=
INSTAPAY_RECIPIENT_ID=
```

`INSTAPAY_RECIPIENT_ID` is the verified recipient identifier that Dandle wants customers to use in InstaPay. Do not put these values in `VITE_*` variables or frontend source. If either value is missing, `/api/instapay-intent` fails closed and `/api/integration-health` reports `instapay_fallback_enabled: false`.

Operations delivery uses stable transition IDs and bounded retries; the Activepieces intake remains the idempotent audit boundary. Nour uses Vercel OIDC in hosted environments, with optional `AI_GATEWAY_API_KEY` for compatible local/server setups.

Facebook Lead Ads enter through a separate disabled-until-connected Activepieces flow. It normalizes and de-duplicates the Facebook lead ID, preserves attribution and consent state, routes email-backed records to an idempotent HubSpot upsert, holds unknown-consent leads from outreach, and retains invalid or phone-only records in the DANDLE Lead Queue for recovery.

Missing-ID arrivals receive distinct `RECOVERY:<uuid>` ledger keys, while the original Facebook ID remains empty and the error remains `LEAD_ID_MISSING`. Persist the normalizer's output and reuse it for lookup/insert retries; re-normalizing a new arrival intentionally allocates a new recovery key. Existing valid-ID serialization and deduplication are unchanged.

## InstaPay bridge contract and rollout gate

The TakeApp payment/status bridge is external to this repository. Before deploying the restart fix, its owner must implement and verify this contract:

- Status responses include a nonnegative integer `order.paymentVersion` and the persisted `order.payment` object (`attemptId`, `provider`, `amount`, `currency`). Backfill a version for existing orders; increment it on **every** payment transition, including failures, expiry, evidence, and verified PayTabs callbacks. Never reset or reuse revisions.
- Within one transaction, the payment webhook deduplicates `idempotencyKey`, compares `expectedPaymentVersion` and `expectedPriorPaymentStatuses` when supplied, checks the order is still payable, persists the payment, increments the version, and records the idempotency key. A mismatch returns 409 without mutating anything. These checks must share the same lock/transaction as PayTabs updates so fallback cannot overwrite a concurrent settlement. A status-only check is insufficient when a failed status recurs.
- Replays of an applied key perform no write and do not increment the version. Status reads must expose committed payment state. The API derives the attempt ID from the trusted reference and revision, reuses it for retries, and derives a different ID after a later terminal failure. Customer-supplied attempts, versions, and amounts are ignored.
- Before returning transfer instructions or acknowledging new evidence, the API reads back the expected persisted attempt and state. Missing version/attempt support, a stale read, or a deduplicated write that left the order failed blocks completion. A legacy bridge returning only HTTP 200 is not sufficient.
- Preserve active legacy attempts during migration; do not reset pending or settled orders to unpaid. Backfill an attempt ID for active InstaPay records before allowing evidence submission.

The regression suite models this transactional contract with a synthetic bridge; it does **not** prove the live bridge implements it. Verify two successive failure/restart/evidence cycles and a concurrent PayTabs settlement against a non-production bridge before merge/deployment. Environment presence in integration-health is not proof of transactional support. PayTabs HMAC verification, independent transaction queries, and the trusted 40% deposit calculation are unchanged; customer InstaPay evidence remains unpaid and cannot release fulfilment.

Commercial certainty now accepts only finite positive decimal prices and compares equivalent numeric/string representations consistently. Conflicting or invalid values block recommendations. Date-only delivery promises remain valid through the promised day in Africa/Cairo; timestamps require an explicit offset and expire at their stated instant.

## Local development

```sh
npm install
npm run dev
```

The Vite application runs at `http://localhost:8080`. Use `vercel dev` to exercise `/api` functions locally.

## Verification

```sh
npm ci
npm test
npx tsc -p tsconfig.app.json --noEmit
npx tsc --noEmit --target ES2022 --module ESNext --moduleResolution Bundler --skipLibCheck --lib ES2022,DOM --types node api/*.ts api/_lib/*.ts
npm run lint
npm run build
```

The payment security tests cover server-derived pricing, PayTabs verification requirements, cart/amount mismatch rejection, anti-double-payment fallback gating, fail-closed InstaPay configuration and the rule that customer-submitted InstaPay evidence never marks an order paid.

## Deployment

Deploy the reviewed `main` branch to the linked Vercel project. PayTabs must remain visibly unavailable until its PayTabs/TakeApp environment values are configured. InstaPay fallback must remain unavailable until the two verified InstaPay recipient values are configured. `/api/integration-health` reports the two readiness flags independently.
