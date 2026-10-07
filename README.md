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

## DAN-002 purchase attribution and safeguards

- The existing `dandle_campaign_attribution` session store captures `oppref`, Google clicks and UTMs on every landing route. Cart includes that snapshot in `/api/order-intent`; the server allowlists and sanitizes the fields without trimming or truncating the opaque `oppref` and sends them with the TakeApp order and operations event.
- **The TakeApp bridge must persist and read back `order.attribution.oppref` or `order.metadata.attribution.oppref` after acceptance and through settlement.** Automated tests simulate that bridge with the actual Vercel handlers, but live TakeApp read-back remains a separate required release gate.
- The Vercel callback sends a server-only OpenAI purchase only after PayTabs raw HMAC authentication, independent transaction query, profile/reference/currency/amount matching, current pinned transaction, and an explicit atomic bridge acknowledgment `{applied:true}` for a newly persisted payment transition. An ambiguous HTTP 200 does **not** permit conversion. Replayed paid orders, old transactions, unsettled statuses, payment tests and no-op bridge acknowledgments cannot report another purchase. Conversion transport failure must not change payment truth.
- The separate Supabase PayTabs callback continues to own only Supabase-managed payment sessions; the Vercel/TakeApp and Supabase routes have distinct callback URLs and stores. Do not create an additional browser-side purchase event or route one payment through both. Send Vercel conversion only for `source: dandle-vercel` orders with a valid `oppref`; keep that opaque reference out of generic campaign analytics and URL propagation. Stable event IDs support downstream deduplication but are not a durable exactly-once delivery ledger.
- `OPENAI_ADS_PIXEL_ID` and `OPENAI_CONVERSIONS_API_KEY` are optional **server-only** secrets. Neither activating PayTabs nor launching campaigns is part of this change. Complete production read-back, CI, credentials verification, one authorized settlement and release approvals before shipping.

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
