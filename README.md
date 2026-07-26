# Dandle Earned Luxury

Dandle's customer-facing comfort catalogue, Nour adviser, cart, trust pages, and
operations launchpad.

## Architecture

- **GitHub** is the source of truth for application code.
- **Vercel** builds and hosts the site, serverless APIs, and Nour's AI Gateway
  access.
- **TakeApp** remains the commercial back office for products, customers,
  chats, orders, and analytics.
- **Paymob** is shown as unavailable until onboarding and merchant verification
  are complete.

No Base44 or Lovable runtime, build plugin, API, or AI credit is required.

## Local development

```sh
npm install
npm run dev
```

The Vite application runs at `http://localhost:8080`. Use `vercel dev` when
testing the `/api` functions locally.

## Verification

```sh
npm run build
npm run lint
```

## Deployment

Deploy from GitHub to the linked Vercel project. Vercel OIDC authenticates Nour
to AI Gateway in hosted environments; the endpoint falls back to deterministic
verified product matching when AI Gateway is unavailable.
