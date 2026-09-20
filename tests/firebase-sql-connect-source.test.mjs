import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import test from "node:test";

import {
  extractOperations,
  loadAndValidateSqlConnectSources,
  validateSqlConnectSources,
} from "../scripts/verify-firebase-sql-connect-source.mjs";

test("planned SQL Connect schema and connectors pass the source security guard", async () => {
  const result = await loadAndValidateSqlConnectSources();
  assert.equal(result.valid, true, result.errors.join("\n"));
  assert.equal(result.operationCount, 9);
});

test("extracts named GraphQL operations without treating comments as operations", () => {
  const operations = extractOperations(`
    # mutation FakeMutation
    query RealQuery @auth(level: NO_ACCESS) { products { id } }
    mutation RealMutation @auth(level: NO_ACCESS) @transaction { product_insert(data: { id: "p" }) }
  `);
  assert.deepEqual(operations.map(({ kind, name }) => [kind, name]), [
    ["query", "RealQuery"],
    ["mutation", "RealMutation"],
  ]);
});

test("rejects a public customer mutation", () => {
  const result = validateSqlConnectSources({
    schema: requiredSchema(),
    customer: `mutation Unsafe @auth(level: PUBLIC) { customer_delete(authUid: "x") }`,
    server: requiredServerMutations(),
    manifest: safeManifest(),
    firebaseJson: '{"dataconnect":{"source":"dataconnect"}}',
    serviceConfig: "schemaValidation: COMPATIBLE",
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes("must not be PUBLIC")));
});

test("rejects order status without an auth.uid ownership filter", () => {
  const result = validateSqlConnectSources({
    schema: requiredSchema(),
    customer: `
      query ListActiveCatalog @auth(level: PUBLIC) { products(where: {active: {eq: true}}) { id } }
      query MyOrderStatus($reference: String!) @auth(level: USER_ANON) { orders(where: {reference: {eq: $reference}}) { reference } }
    `,
    server: requiredServerMutations(),
    manifest: safeManifest(),
    firebaseJson: '{"dataconnect":{"source":"dataconnect"}}',
    serviceConfig: "schemaValidation: COMPATIBLE",
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes("authenticated Firebase UID")));
});

test("rejects unbounded client lead payloads", () => {
  const result = validateSqlConnectSources({
    schema: requiredSchema(),
    customer: `${requiredCustomerOperations()} mutation CaptureMyLead($details: Any!) @auth(level: USER_ANON) @transaction { lead_insert(data: {customerAuthUid_expr: "auth.uid", details: $details}) }`,
    server: requiredServerMutations(),
    manifest: safeManifest(),
    firebaseJson: '{"dataconnect":{"source":"dataconnect"}}',
    serviceConfig: "schemaValidation: COMPATIBLE",
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes("unbounded Any payloads")));
});

test("rejects server commerce mutation exposed outside Admin SDK", () => {
  const server = requiredServerMutations().replace(
    "mutation CreateCommerceOrder @auth(level: NO_ACCESS)",
    "mutation CreateCommerceOrder @auth(level: USER_ANON)",
  );
  const result = validateSqlConnectSources({
    schema: requiredSchema(),
    customer: requiredCustomerOperations(),
    server,
    manifest: safeManifest(),
    firebaseJson: '{"dataconnect":{"source":"dataconnect"}}',
    serviceConfig: "schemaValidation: COMPATIBLE",
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes("CreateCommerceOrder must be Admin-SDK-only")));
});

test("rejects the invalid direct custom-key update syntax", () => {
  const server = requiredServerMutations().replace(
    'order_update(key: {reference: "x"}, data:',
    'order_update(reference: "x", data:',
  );
  const result = validateSqlConnectSources({
    schema: requiredSchema(),
    customer: requiredCustomerOperations(),
    server,
    manifest: safeManifest(),
    firebaseJson: '{"dataconnect":{"source":"dataconnect"}}',
    serviceConfig: "schemaValidation: COMPATIBLE",
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes("verified PayTabs mutation")));
});

test("rejects source-only work that marks a production cutover gate verified", () => {
  const manifest = JSON.parse(safeManifest());
  manifest.firebaseSqlConnect.billingApproval.verified = true;
  const result = validateSqlConnectSources({
    schema: requiredSchema(),
    customer: requiredCustomerOperations(),
    server: requiredServerMutations(),
    manifest: JSON.stringify(manifest),
    firebaseJson: '{"dataconnect":{"source":"dataconnect"}}',
    serviceConfig: "schemaValidation: COMPATIBLE",
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes("must not mark any production cutover gate verified")));
});

test("production deployment guard fails closed without spend approval", async () => {
  const result = await new Promise((resolve) => {
    const child = spawn(process.execPath, ["scripts/guard-firebase-sql-connect-deploy.mjs"], {
      cwd: new URL("../", import.meta.url),
      env: { ...process.env, DANDLE_FIREBASE_DEPLOY_APPROVED: "" },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let output = "";
    child.stdout.on("data", (chunk) => { output += chunk; });
    child.stderr.on("data", (chunk) => { output += chunk; });
    child.on("close", (code) => resolve({ code, output }));
  });

  assert.notEqual(result.code, 0);
  assert.match(result.output, /explicit owner spend\/provisioning approval is absent/);
});

test("production deployment guard still fails with approval while evidence gates are incomplete", async () => {
  const result = await new Promise((resolve) => {
    const child = spawn(process.execPath, ["scripts/guard-firebase-sql-connect-deploy.mjs"], {
      cwd: new URL("../", import.meta.url),
      env: { ...process.env, DANDLE_FIREBASE_DEPLOY_APPROVED: "true" },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let output = "";
    child.stdout.on("data", (chunk) => { output += chunk; });
    child.stderr.on("data", (chunk) => { output += chunk; });
    child.on("close", (code) => resolve({ code, output }));
  });

  assert.notEqual(result.code, 0);
  assert.match(result.output, /deployment is blocked: .*billingApproval\.verified/);
});

function requiredSchema() {
  return [
    "Product", "ProductVariant", "Customer", "Order", "PaymentAttempt",
    "PaymentEvent", "OperationsEvent", "Lead", "MigrationCheckpoint",
  ].map((name) => `type ${name} @table { id: String! }`).join("\n");
}

function requiredCustomerOperations() {
  return `
    query ListActiveCatalog @auth(level: PUBLIC) {
      products(where: {active: {eq: true}}) { id }
      productVariants(where: {active: {eq: true}}) { id }
    }
    query MyOrderStatus @auth(level: USER_ANON) { orders(where: {customerAuthUid: {eq_expr: "auth.uid"}}) { reference } }
  `;
}

function requiredServerMutations() {
  return `
    mutation CreateCommerceOrder @auth(level: NO_ACCESS) @transaction { order_insert(data: {}) }
    mutation RecordPaymentAttempt($amountMinor: Int64!, $currency: String!) @auth(level: NO_ACCESS) @transaction {
      query @check(expr: "true") { orders(where: {totalAmountMinor: {eq: $amountMinor}, currency: {eq: $currency}}) { reference } }
      paymentAttempt_insert(data: {})
    }
    mutation RecordVerifiedPayment @auth(level: NO_ACCESS) @transaction {
      query @check(expr: "true") { orders(where: {totalAmountMinor: {eq: $amountMinor}, currency: {eq: $currency}}) { reference } }
      paymentEvent_insert(data: {provider: "paytabs"})
      order_update(key: {reference: "x"}, data: {paymentStatus: "paid"}) @check(expr: "this != null")
    }
    mutation CaptureLead @auth(level: NO_ACCESS) @transaction { lead_insert(data: {}) }
    mutation QueueOperationsEvent @auth(level: NO_ACCESS) @transaction { operationsEvent_insert(data: {}) }
    mutation RecordMigrationCheckpoint @auth(level: NO_ACCESS) @transaction { migrationCheckpoint_upsert(data: {}) }
  `;
}

function safeManifest() {
  return JSON.stringify({
    production: { readBackend: "supabase", writeBackend: "supabase", dualWriteEnabled: false },
    firebaseSqlConnect: { billingApproval: { verified: false } },
  });
}
