import { readFile } from "node:fs/promises";
import { validateDataBackendCutover } from "./verify-data-backend-cutover.mjs";
import { loadAndValidateSqlConnectSources } from "./verify-firebase-sql-connect-source.mjs";

const manifest = JSON.parse(await readFile(new URL("../config/data-backend-cutover.json", import.meta.url), "utf8"));
const readiness = validateDataBackendCutover(manifest);
const source = await loadAndValidateSqlConnectSources();

if (!source.valid) {
  throw new Error(`Firebase SQL Connect source guard failed: ${source.errors.join("; ")}`);
}
if (process.env.DANDLE_FIREBASE_DEPLOY_APPROVED !== "true") {
  throw new Error("Firebase SQL Connect deployment is blocked: explicit owner spend/provisioning approval is absent.");
}
if (!readiness.ready) {
  throw new Error(`Firebase SQL Connect deployment is blocked: ${readiness.missing.join(", ")}`);
}

console.log("Firebase SQL Connect deployment prerequisites are recorded. This guard does not deploy resources.");
