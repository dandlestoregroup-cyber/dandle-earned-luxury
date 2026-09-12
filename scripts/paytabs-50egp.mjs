// Explicit operator command, deliberately outside npm test. Never enters card data.
import { PAYMENT_TEST_REFERENCE } from '../supabase/functions/_shared/paymentTest.ts';

const reference = process.argv[2];
if (!PAYMENT_TEST_REFERENCE.test(reference || '')) {
  throw new Error('Supply a unique reference: DN-PT50- followed by 32 uppercase hex characters. Reuse that reference after an uncertain result; never auto-create another.');
}
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!serviceRole) throw new Error('SUPABASE_SERVICE_ROLE_KEY must be supplied securely in the operator environment.');
const base = 'https://rbvbrxjnhmgrtxvwusxr.supabase.co/functions/v1';
const response = await fetch(`${base}/paytabs-create-payment`, {
  method: 'POST',
  headers: {
    authorization: `Bearer ${serviceRole}`,
    apikey: serviceRole,
    'content-type': 'application/json',
    origin: 'https://dandle-vie.com',
  },
  body: JSON.stringify({ payment_test: true, test_reference: reference }),
  signal: AbortSignal.timeout(30_000),
});
const data = await response.json().catch(() => ({}));
if (!response.ok) {
  throw new Error(`Checkout not issued (HTTP ${response.status}); reference ${reference}. Check its stored state before another attempt.`);
}
const url = new URL(data.redirect_url);
if (data.amount !== 50 || data.currency !== 'EGP' || data.payment_test !== true ||
    data.order_reference !== reference || !data.transaction_reference ||
    url.origin !== 'https://secure-egypt.paytabs.com' || url.username || url.password) {
  throw new Error(`Checkout verification failed for ${reference}; do not pay.`);
}
console.log(JSON.stringify({
  reference,
  amount: 50,
  currency: 'EGP',
  paymentUrl: url.href,
  transactionReference: data.transaction_reference,
  charged: false,
  note: 'Live 50 EGP test payment. No goods or delivery. Complete payment yourself; success requires PayTabs verification.',
}, null, 2));
