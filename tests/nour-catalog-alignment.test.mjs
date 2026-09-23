import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const serverCatalog = await readFile(new URL("../api/_lib/catalog.ts", import.meta.url), "utf8");
const storefrontCatalog = await readFile(new URL("../src/types/product.ts", import.meta.url), "utf8");

const expected = [
  ["grand-relaxmax", "fixed", 32100],
  ["relaxmax", "manual", 21900],
  ["relaxmax", "power", 28900],
  ["spacesaver", "manual", 24900],
  ["spacesaver", "power", 29900],
  ["easyup-compact", "fixed", 46900],
  ["worknest", "manual", 26900],
  ["worknest", "power", 33900],
  ["easyup", "fixed", 42900],
  ["comfortplus", "manual", 29900],
  ["comfortplus", "power", 36900],
  ["cozycompanion", "manual", 42000],
  ["cozycompanion", "power", 54000],
  ["diva", "manual", 23900],
  ["diva", "power", 30900],
  ["complete-set", "manual", 62900],
  ["complete-set", "power", 90900],
];

const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function productBlock(id) {
  const pattern = new RegExp(`\\{\\s*id: \\"${escape(id)}\\"[\\s\\S]*?\\n  \\},`);
  const match = storefrontCatalog.match(pattern);
  assert.ok(match, `storefront product ${id} exists`);
  return match[0];
}

test("legacy order pricing mirrors the canonical Dandle/NOUR catalogue", () => {
  for (const [id, mechanism, price] of expected) {
    const serverKey = mechanism === "fixed" ? "fixed" : mechanism;
    const serverPattern = new RegExp(`(?:\\"${escape(id)}\\"|${escape(id)}): \\{[^}]*${serverKey}: ${price}`);
    assert.match(serverCatalog, serverPattern, `${id} ${mechanism} server price`);

    const block = productBlock(id);
    if (mechanism === "fixed") {
      assert.match(block, new RegExp(`price: ${price}`), `${id} storefront price`);
    } else if (mechanism === "manual") {
      assert.match(block, new RegExp(`priceManual: ${price}`), `${id} manual storefront price`);
    } else {
      assert.match(block, new RegExp(`pricePower: ${price}`), `${id} power storefront price`);
    }
  }
});
