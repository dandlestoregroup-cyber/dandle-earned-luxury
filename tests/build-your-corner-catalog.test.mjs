import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const buildPage = await readFile(new URL("../src/pages/BuildYourCorner.tsx", import.meta.url), "utf8");
const app = await readFile(new URL("../src/App.tsx", import.meta.url), "utf8");
const legacyStaticPage = new URL("../public/build-your-corner/index.html", import.meta.url);

test("Build Your Corner consumes the storefront commercial catalogue instead of parallel inventory literals", async () => {
  assert.match(buildPage, /import \{ products, type Product \} from "@\/types\/product"/);
  assert.match(buildPage, /product\.dimensionsCm/);
  assert.match(buildPage, /product\.comingSoon/);
  assert.match(buildPage, /product\.priceManual/);
  assert.match(buildPage, /product\.pricePower/);
  assert.doesNotMatch(
    buildPage,
    /Statement Chair|Side Table|Floor Lamp|Compact Dining Set|Bar Trolley|Modular Sofa|Guest Daybed/,
  );
  assert.match(app, /path="\/build-your-corner"/);
  await assert.rejects(access(legacyStaticPage), "legacy static page must not bypass the canonical catalogue");
});
