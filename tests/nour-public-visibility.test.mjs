import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const app = await readFile(new URL("../src/App.tsx", import.meta.url), "utf8");
const navigation = await readFile(new URL("../src/components/Navigation.tsx", import.meta.url), "utf8");

test("public NOUR route stays hidden in canonical source", () => {
  assert.match(app, /path="\/nour-chat" element={<Navigate to="\/" replace\/>}/);
  assert.doesNotMatch(app, /path="\/nour-chat" element={<NourChat/);
  assert.doesNotMatch(navigation, /Ask Nour|href: "\/nour-chat"/);
});

test("test store is default-off and explicitly gated", () => {
  assert.match(app, /VITE_NOUR_TEST_STORE_ENABLED === "true"/);
  assert.match(app, /path="\/try-nour" element={nourTestStoreEnabled \? <NourStore \/> : <Navigate to="\/" replace \/>}/);
});
