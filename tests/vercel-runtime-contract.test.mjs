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
