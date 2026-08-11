# Dandle Earned Luxury

Dandle's customer-facing catalogue, Nour adviser, website order flow, order tracking and operations launchpad.

## Architecture

- **GitHub** is the source of truth for application code.
- **Vercel** hosts the Vite site, serverless API boundary and Nour AI Gateway access.
- **TakeApp** remains the commercial back office for order review, acceptance/amendment, customers, fulfilment and communication.
- **PayTabs Egypt** is the card-payment provider for accepted/amended orders only.
- **WhatsApp** is post-order communication/support, not an order-creation path.
- No Base44, Lovable runtime or client-side Shopify checkout is required.

## Order truth

1. Customer submits an order on the Dandle website.
2. The server validates product configurations and recalculates prices from the server catalogue.
3. TakeApp receives the order with a Dandle reference and status `SUBMITTED`.
4. Dandle accepts, amends or rejects the order in the commercial back office.
5. Only accepted/amended orders may request a PayTabs hosted payment page for the 40% deposit.
6. PayTabs callback data is re-queried server-side before a payment update is recorded.
7. The remaining 60% is due on delivery.
8. Order tracking never fabricates a fallback status when the live status bridge is unavailable.

## Required production environment

```text
TAKEAPP_ORDER_WEBHOOK_URL=
TAKEAPP_ORDER_STATUS_URL=
TAKEAPP_PAYMENT_WEBHOOK_URL=
TAKEAPP_ORDER_WEBHOOK_TOKEN=
PAYTABS_PROFILE_ID=
PAYTABS_SERVER_KEY=
PUBLIC_SITE_URL=https://<production-domain>
```

Nour uses Vercel OIDC in hosted environments, with optional `AI_GATEWAY_API_KEY` for compatible local/server setups.

## Local development

```sh
npm install
npm run dev
```

The Vite application runs at `http://localhost:8080`. Use `vercel dev` to exercise `/api` functions locally.

## Verification

```sh
npm ci
npx tsc -p tsconfig.app.json --noEmit
npx tsc --noEmit --target ES2022 --module ESNext --moduleResolution Bundler --skipLibCheck --lib ES2022,DOM --types node api/*.ts api/_lib/*.ts
npm run build
```

The pull request CI runs the same compile/build gates and rejects reintroduced Paymob runtime references.

## Deployment

Deploy the reviewed `main` branch to the linked Vercel project. Payment must remain visibly unavailable until all PayTabs and TakeApp payment-recording environment values above are configured and `/api/integration-health` reports `paytabs_enabled: true`.
