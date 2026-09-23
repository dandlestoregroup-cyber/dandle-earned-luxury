import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const POST_ROUTES = [
  "instapay-intent.ts",
  "instapay-submit.ts",
  "nour-render.ts",
  "nour.ts",
  "order-intent.ts",
  "payment-intent.ts",
  "paytabs-callback.ts",
];

const GET_ROUTES = ["integration-health.ts", "order-status.ts"];

test("Vercel Web handlers use named HTTP method exports", () => {
  for (const file of POST_ROUTES) {
    const source = readFileSync(new URL(`../api/${file}`, import.meta.url), "utf8");
    assert.match(source, /export async function POST\(request: Request\)/, file);
    assert.doesNotMatch(source, /export default async function/, file);
  }

  for (const file of GET_ROUTES) {
    const source = readFileSync(new URL(`../api/${file}`, import.meta.url), "utf8");
    assert.match(source, /export async function GET\(request: Request\)/, file);
    assert.doesNotMatch(source, /export default async function/, file);
  }

  const webhook = readFileSync(
    new URL("../api/public/paytabs/webhook.ts", import.meta.url),
    "utf8",
  );
  assert.match(webhook, /export \{ POST \} from "\.\.\/\.\.\/paytabs-callback\.js"/);
});

test("NOUR compatibility route delegates to the canonical Supabase runtime", () => {
  const source = readFileSync(new URL("../api/nour/v1.ts", import.meta.url), "utf8");
  assert.match(
    source,
    /https:\/\/otjucmwadqqkvpgefafm\.supabase\.co\/functions\/v1\/nour-api/,
  );
  assert.match(source, /await fetch\(CANONICAL_NOUR_API/);
  assert.doesNotMatch(source, /nourJourney\.mjs/);
  assert.doesNotMatch(source, /createNourReply/);
});

test("NOUR can be called cross-origin only from approved DANDLE surfaces", () => {
  const source = readFileSync(new URL("../api/nour/v1.ts", import.meta.url), "utf8");
  assert.match(source, /export async function OPTIONS\(request: Request\)/);
  assert.match(source, /https:\/\/dandle-vie\.com/);
  assert.match(source, /https:\/\/www\.dandle-vie\.com/);
  assert.match(source, /https:\/\/dandle-earned-luxury\.lovable\.app/);
  assert.match(source, /Access-Control-Allow-Origin/);
  assert.match(source, /Access-Control-Allow-Methods/);
  assert.match(source, /Origin not allowed/);
  assert.doesNotMatch(source, /Access-Control-Allow-Origin["']?\s*[:,]\s*["']\*["']/);
});
