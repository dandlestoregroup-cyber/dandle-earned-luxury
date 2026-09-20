import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const ALLOWED_BACKENDS = new Set(["supabase", "firebase-sql-connect"]);
const REQUIRED_GATES = [
  "billingApproval",
  "projectIdentity",
  "sqlConnectService",
  "cloudSqlInstance",
  "schemaAndConnectors",
  "firebaseAuth",
  "migration",
  "persistence",
  "paymentCommerce",
  "endToEndReadWrite",
  "rollback",
];
const IDENTITY_FIELDS = {
  projectIdentity: "projectId",
  sqlConnectService: "serviceId",
  cloudSqlInstance: "instanceId",
};
const CREDENTIAL_FIELD = /(api.?key|secret|password|private.?key|access.?token|refresh.?token|credential)/i;

function nonEmpty(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function findCredentialFields(value, path = []) {
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, child]) => {
    const next = [...path, key];
    const here = CREDENTIAL_FIELD.test(key) ? [next.join(".")] : [];
    return here.concat(findCredentialFields(child, next));
  });
}

export function evaluateFirebaseCutoverReadiness(firebase) {
  if (!firebase || typeof firebase !== "object" || Array.isArray(firebase)) {
    throw new Error("firebaseSqlConnect must be an object");
  }

  const missing = [];
  for (const name of REQUIRED_GATES) {
    const gate = firebase[name];
    if (!gate || typeof gate !== "object" || Array.isArray(gate)) {
      missing.push(name);
      continue;
    }
    if (gate.verified !== true) missing.push(`${name}.verified`);
    if (!nonEmpty(gate.evidence)) missing.push(`${name}.evidence`);

    const identityField = IDENTITY_FIELDS[name];
    if (identityField && !nonEmpty(gate[identityField])) {
      missing.push(`${name}.${identityField}`);
    }
  }

  return { ready: missing.length === 0, missing };
}

export function validateDataBackendCutover(config) {
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    throw new Error("Cutover manifest must be an object");
  }
  if (config.version !== 1) throw new Error("Unsupported cutover manifest version");

  const credentialFields = findCredentialFields(config);
  if (credentialFields.length) {
    throw new Error(`Cutover manifest must not contain credentials: ${credentialFields.join(", ")}`);
  }

  const production = config.production;
  if (!production || typeof production !== "object" || Array.isArray(production)) {
    throw new Error("production must be an object");
  }
  if (!ALLOWED_BACKENDS.has(production.readBackend) || !ALLOWED_BACKENDS.has(production.writeBackend)) {
    throw new Error("Unknown production data backend");
  }
  if (production.readBackend !== production.writeBackend) {
    throw new Error("DANDLE must have a single production data authority");
  }
  if (production.dualWriteEnabled !== false) {
    throw new Error("Dual production writes are forbidden until a separately reviewed migration design exists");
  }

  const readiness = evaluateFirebaseCutoverReadiness(config.firebaseSqlConnect);
  const firebaseIsAuthoritative = production.readBackend === "firebase-sql-connect";
  if (firebaseIsAuthoritative && !readiness.ready) {
    throw new Error(
      `Firebase SQL Connect cannot become authoritative; missing: ${readiness.missing.join(", ")}`,
    );
  }

  return { safe: true, ...readiness };
}

async function main() {
  const manifestUrl = new URL("../config/data-backend-cutover.json", import.meta.url);
  const config = JSON.parse(await readFile(manifestUrl, "utf8"));
  const result = validateDataBackendCutover(config);

  if (result.ready) {
    console.log("Firebase SQL Connect cutover gates are complete.");
  } else {
    console.log(`Firebase SQL Connect remains disabled; ${result.missing.length} gate fields are incomplete.`);
  }
}

const invokedAsScript = process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url;
if (invokedAsScript) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
