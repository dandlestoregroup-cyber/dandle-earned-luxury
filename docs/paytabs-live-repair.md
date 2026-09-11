# Live DANDLE payment repair

dandle-vie.com currently uses the Lovable-hosted Supabase project
`rbvbrxjnhmgrtxvwusxr`. The separate Vercel deployment has all payment and
TakeApp readiness flags disabled. Deploying the Vercel app does not repair the
live domain. No domain migration is included here.

This change brings the live project's two PayTabs functions and their shared
dependencies into GitHub, then fixes pending/held-payment retry rules,
conditional retry acquisition, redirect validation, and stale callback writes.
The catalogue is a snapshot of the live Lovable project; compare it against the
live catalogue before deployment if merchandise has changed since this import.
It must not be regenerated from the separate Vercel catalogue.

The workflow `Deploy live PayTabs repair` is manually dispatched after review.
It deploys only these two functions. It needs the repository Actions secret
`SUPABASE_ACCESS_TOKEN`, whose account must have access to the existing project.
An earlier deployment failed with exit 41 because that secret was absent. No
credential has been retrieved, created, or printed by this repair.

## 50 EGP payment test

The normal public checkout still uses catalogue prices. The operator-only test
branch requires the existing production service-role credential, fixes the
amount at exactly 50 EGP, creates no catalogue item, and marks the order and
line as a payment test with no goods or delivery. Its `items` metadata contains
`payment_test: true` and `fulfilment_required: false`; any external order
consumer must honor these before the test is run. The imported callback only
updates payment state and the payment audit log; it sends no fulfilment event.

From a secure operator environment with `SUPABASE_SERVICE_ROLE_KEY` configured:

```sh
node scripts/paytabs-50egp.mjs DN-PT50-<32-UPPERCASE-HEX-CHARACTERS>
```

Use one unique reference. Keep it after a timeout or error; the unique order
reference prevents creating duplicate sessions for that same test request.
Do not automatically run this script in CI or normal tests. It prints the
validated hosted payment link without charging the card. Opening the link is
not proof of settlement. The owner must pay on PayTabs, then the callback must
verify the transaction identity, EGP currency and exact 50 EGP amount before
the test order becomes paid. A real card on a live merchant profile incurs a
real 50 EGP charge; this is not PayTabs sandbox mode.

Pending/held sessions cannot be retried, and public reference retries cannot
restart test orders. No public product price, ordinary deposit policy, or
PayTabs credential is changed.
