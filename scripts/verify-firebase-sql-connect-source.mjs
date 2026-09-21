import { readdir, readFile } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
const REQUIRED_TYPES = [
  "Product",
  "ProductVariant",
  "Customer",
  "Order",
  "PaymentAttempt",
  "PaymentEvent",
  "OperationsEvent",
  "Lead",
  "MigrationCheckpoint",
];
const REQUIRED_SERVER_MUTATIONS = [
  "CreateCommerceOrder",
  "RecordPaymentAttempt",
  "RecordVerifiedPayment",
  "CaptureLead",
  "QueueOperationsEvent",
  "RecordMigrationCheckpoint",
];
const CREDENTIAL_PATTERN = /(api[_-]?key|client[_-]?secret|private[_-]?key|access[_-]?token|refresh[_-]?token|password)\s*[:=]\s*["']?[A-Za-z0-9_./+\-=]{8,}/i;

async function filesRecursively(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesRecursively(path) : [path];
  }));
  return nested.flat();
}

export function extractOperations(source) {
  const uncommented = source.replace(/#[^\n]*/g, "");
  const starts = [...uncommented.matchAll(/\b(query|mutation)\s+([A-Za-z][A-Za-z0-9]*)/g)];
  return starts.map((match, index) => ({
    kind: match[1],
    name: match[2],
    source: uncommented.slice(match.index, starts[index + 1]?.index ?? uncommented.length),
  }));
}

export function validateSqlConnectSources({ schema, customer, server, manifest, firebaseJson, serviceConfig }) {
  const errors = [];
  const allSources = [schema, customer, server, manifest, firebaseJson, serviceConfig].join("\n");

  for (const type of REQUIRED_TYPES) {
    if (!new RegExp(`\\btype\\s+${type}\\s+@table\\b`).test(schema)) {
      errors.push(`missing required table type ${type}`);
    }
  }
  if (/\b[A-Za-z][A-Za-z0-9]*_[A-Za-z0-9]*\s*:/.test(schema)) {
    errors.push("schema field names must not contain underscores");
  }
  if (!/schemaValidation:\s*COMPATIBLE\b/.test(serviceConfig)) {
    errors.push("schema validation must preserve unmodeled database objects with COMPATIBLE mode");
  }
  if (/schemaValidation:\s*STRICT\b/.test(serviceConfig)) {
    errors.push("STRICT migrations are forbidden for the cutover source");
  }

  const operations = extractOperations(`${customer}\n${server}`);
  for (const operation of operations) {
    if (!/@auth\s*\(/.test(operation.source)) {
      errors.push(`${operation.kind} ${operation.name} is missing @auth`);
    }
  }
  for (const operation of extractOperations(customer)) {
    if (operation.kind === "mutation" && /@auth\s*\(\s*level:\s*PUBLIC\b/.test(operation.source)) {
      errors.push(`customer mutation ${operation.name} must not be PUBLIC`);
    }
    if (operation.kind === "mutation" && !/auth\.uid/.test(operation.source)) {
      errors.push(`customer mutation ${operation.name} must bind writes to auth.uid`);
    }
    if (operation.kind === "mutation" && /\bAny!?\b/.test(operation.source)) {
      errors.push(`customer mutation ${operation.name} must not accept unbounded Any payloads`);
    }
  }
  const catalog = operations.find((operation) => operation.name === "ListActiveCatalog");
  const activeFilters = catalog?.source.match(/active:\s*\{\s*eq:\s*true\s*\}/g) ?? [];
  if (!catalog || !/@auth\s*\(\s*level:\s*PUBLIC\b/.test(catalog.source) || activeFilters.length < 2) {
    errors.push("public catalogue query must expose active records only");
  }
  const myOrder = operations.find((operation) => operation.name === "MyOrderStatus");
  if (!myOrder || !/@auth\s*\(\s*level:\s*USER_ANON\b/.test(myOrder.source) || !/customerAuthUid:\s*\{\s*eq_expr:\s*"auth\.uid"\s*\}/.test(myOrder.source)) {
    errors.push("order-status query must bind records to the authenticated Firebase UID");
  }
  for (const name of REQUIRED_SERVER_MUTATIONS) {
    const operation = operations.find((candidate) => candidate.name === name);
    if (!operation) {
      errors.push(`missing server mutation ${name}`);
    } else if (!/@auth\s*\(\s*level:\s*NO_ACCESS\b/.test(operation.source)) {
      errors.push(`server mutation ${name} must be Admin-SDK-only`);
    } else if (!/@transaction\b/.test(operation.source)) {
      errors.push(`server mutation ${name} must be transactional`);
    }
  }
  const verifiedPayment = operations.find((operation) => operation.name === "RecordVerifiedPayment");
  const matchingReceipt = verifiedPayment?.source.match(
    /matchingPaymentEvents:\s*paymentEvents[\s\S]*?(?=\n\s*}\s*\n\s*paymentEvent_upsert)/,
  )?.[0] ?? "";
  if (!verifiedPayment ||
      !/paymentEvent_upsert\b/.test(verifiedPayment.source) ||
      !/order_update\b/.test(verifiedPayment.source) ||
      !/totalAmountMinor:\s*\{\s*eq:\s*\$amountMinor\s*\}/.test(verifiedPayment.source) ||
      !/currency:\s*\{\s*eq:\s*\$currency\s*\}/.test(verifiedPayment.source) ||
      !/provider:\s*"paytabs"/.test(verifiedPayment.source) ||
      !/providerProfileId:\s*\{\s*eq:\s*\$providerProfileId\s*\}/.test(verifiedPayment.source) ||
      !/providerTransactionReference:\s*\{\s*eq:\s*\$providerTransactionReference\s*\}/.test(verifiedPayment.source) ||
      !/attemptId:\s*\{\s*eq:\s*\$attemptId\s*\}/.test(verifiedPayment.source) ||
      !/currentPaymentAttemptId:\s*\{\s*eq:\s*\$attemptId\s*\}/.test(verifiedPayment.source) ||
      !/response\.query\.orders\.size\(\)\s*==\s*1\s*&&\s*response\.query\.paymentAttempts\.size\(\)\s*==\s*1/.test(verifiedPayment.source) ||
      !/response\.query\.existingPaymentEvents\.size\(\)\s*==\s*response\.query\.matchingPaymentEvents\.size\(\)/.test(verifiedPayment.source) ||
      !/existingPaymentEvents:\s*paymentEvents\b/.test(verifiedPayment.source) ||
      !/matchingPaymentEvents:\s*paymentEvents\b/.test(verifiedPayment.source) ||
      !/provider:\s*\{\s*eq:\s*"paytabs"\s*\}/.test(matchingReceipt) ||
      !/providerProfileId:\s*\{\s*eq:\s*\$providerProfileId\s*\}/.test(matchingReceipt) ||
      !/orderReference:\s*\{\s*eq:\s*\$orderReference\s*\}/.test(matchingReceipt) ||
      !/providerTransactionReference:\s*\{\s*eq:\s*\$providerTransactionReference\s*\}/.test(matchingReceipt) ||
      !/eventType:\s*\{\s*eq:\s*"authoritative-verification"\s*\}/.test(matchingReceipt) ||
      !/authoritativeStatus:\s*\{\s*eq:\s*"paid"\s*\}/.test(matchingReceipt) ||
      !/amountMinor:\s*\{\s*eq:\s*\$amountMinor\s*\}/.test(matchingReceipt) ||
      !/currency:\s*\{\s*eq:\s*\$currency\s*\}/.test(matchingReceipt) ||
      /processorSnapshot\b/.test(verifiedPayment.source) ||
      !/paymentAttempt_update\s*\(\s*key:\s*\{\s*attemptId:\s*\$attemptId\s*\}/.test(verifiedPayment.source) ||
      !/paymentStatus:\s*"paid"/.test(verifiedPayment.source) ||
      !/order_update\s*\(\s*key:\s*\{\s*reference:\s*\$orderReference\s*\}/.test(verifiedPayment.source) ||
      !/@check\b/.test(verifiedPayment.source)) {
    errors.push("verified PayTabs mutation must bind the exact attempt/profile/transaction and atomically persist paid evidence");
  }
  const paymentAttempt = operations.find((operation) => operation.name === "RecordPaymentAttempt");
  if (!paymentAttempt ||
      !/attemptId:\s*\$attemptId\b/.test(paymentAttempt.source) ||
      !/currentPaymentAttemptId:\s*\$attemptId\b/.test(paymentAttempt.source) ||
      !/totalAmountMinor:\s*\{\s*eq:\s*\$amountMinor\s*\}/.test(paymentAttempt.source) ||
      !/currency:\s*\{\s*eq:\s*\$currency\s*\}/.test(paymentAttempt.source) ||
      !/paymentStatus:\s*\{\s*eq:\s*"unpaid"\s*\}/.test(paymentAttempt.source) ||
      !/@check\b/.test(paymentAttempt.source)) {
    errors.push("payment attempts must match an existing order amount and currency");
  }

  const parsedManifest = JSON.parse(manifest);
  if (parsedManifest.production?.readBackend !== "supabase" || parsedManifest.production?.writeBackend !== "supabase") {
    errors.push("committed production authority must remain Supabase before verified cutover");
  }
  if (parsedManifest.production?.dualWriteEnabled !== false) {
    errors.push("committed production dual writes must remain disabled");
  }
  if (Object.values(parsedManifest.firebaseSqlConnect ?? {}).some((gate) => gate?.verified === true)) {
    errors.push("source-only work must not mark any production cutover gate verified");
  }

  if (CREDENTIAL_PATTERN.test(allSources)) {
    errors.push("Firebase SQL Connect source must not contain credentials");
  }
  const parsedFirebase = JSON.parse(firebaseJson);
  if (parsedFirebase.dataconnect?.source !== "dataconnect") {
    errors.push("firebase.json must point to the reviewed dataconnect source directory");
  }

  return { valid: errors.length === 0, errors, operationCount: operations.length };
}

export async function loadAndValidateSqlConnectSources() {
  const files = await filesRecursively(fileURLToPath(new URL("../dataconnect/", import.meta.url)));
  const gqlFiles = files.filter((file) => extname(file) === ".gql");
  const contents = new Map(await Promise.all(gqlFiles.map(async (file) => [basename(file), await readFile(file, "utf8")])));
  return validateSqlConnectSources({
    schema: contents.get("schema.gql") ?? "",
    customer: await readFile(new URL("../dataconnect/customer/operations.gql", import.meta.url), "utf8"),
    server: await readFile(new URL("../dataconnect/server/operations.gql", import.meta.url), "utf8"),
    manifest: await readFile(new URL("../config/data-backend-cutover.json", import.meta.url), "utf8"),
    firebaseJson: await readFile(new URL("../firebase.json", import.meta.url), "utf8"),
    serviceConfig: await readFile(new URL("../dataconnect/dataconnect.yaml", import.meta.url), "utf8"),
  });
}

async function main() {
  const result = await loadAndValidateSqlConnectSources();
  if (!result.valid) throw new Error(result.errors.join("\n"));
  console.log(`Firebase SQL Connect source guard passed (${result.operationCount} reviewed operations; production remains unchanged).`);
}

const invokedAsScript = process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url;
if (invokedAsScript) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
