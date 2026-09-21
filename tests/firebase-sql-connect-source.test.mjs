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

test("rejects verified payment that is not bound to the exact processor attempt", () => {
  const server = requiredServerMutations().replace(
    "providerProfileId: {eq: $providerProfileId}",
    "providerProfileId: {eq: \"untrusted-profile\"}",
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
  assert.ok(result.errors.some((error) => error.includes("exact attempt/profile/transaction")));
});

test("rejects verified payment that does not check the matched attempt result", () => {
  const server = requiredServerMutations().replace(
    "response.query.orders.size() == 1 && response.query.paymentAttempts.size() == 1",
    "response.query.orders.size() == 1",
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
  assert.ok(result.errors.some((error) => error.includes("exact attempt/profile/transaction")));
});

test("rejects settlement of an attempt that is not current for the order", () => {
  const server = requiredServerMutations().replace(
    "currentPaymentAttemptId: {eq: $attemptId}",
    "currentPaymentAttemptId: {eq: \"stale\"}",
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
  assert.ok(result.errors.some((error) => error.includes("exact attempt/profile/transaction")));
});

test("rejects non-idempotent verified payment event insertion", () => {
  const server = requiredServerMutations().replace("paymentEvent_upsert", "paymentEvent_insert");
  const result = validateSqlConnectSources({
    schema: requiredSchema(),
    customer: requiredCustomerOperations(),
    server,
    manifest: safeManifest(),
    firebaseJson: '{"dataconnect":{"source":"dataconnect"}}',
    serviceConfig: "schemaValidation: COMPATIBLE",
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes("exact attempt/profile/transaction")));
});

test("rejects replay that can overwrite a conflicting receipt", () => {
  const server = requiredServerMutations().replace(
    "response.query.existingPaymentEvents.size() == response.query.matchingPaymentEvents.size()",
    "response.query.existingPaymentEvents.size() >= 0",
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
  assert.ok(result.errors.some((error) => error.includes("exact attempt/profile/transaction")));
});

test("rejects replay that can rewrite the persisted payment event type", () => {
  const server = requiredServerMutations().replace(
    'eventType: {eq: "authoritative-verification"}',
    'eventType: {eq: "other"}',
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
  assert.ok(result.errors.some((error) => error.includes("exact attempt/profile/transaction")));
});

test("rejects mutable raw processor snapshots in the settlement receipt", () => {
  const server = requiredServerMutations().replace(
    'paymentEvent_upsert(data: {provider: "paytabs", providerProfileId: $providerProfileId})',
    'paymentEvent_upsert(data: {provider: "paytabs", providerProfileId: $providerProfileId, processorSnapshot: $processorSnapshot})',
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
  assert.ok(result.errors.some((error) => error.includes("exact attempt/profile/transaction")));
});

test("rejects creation of a new payment attempt for an already-paid order", () => {
  const server = requiredServerMutations().replace('paymentStatus: {eq: "unpaid"}', 'paymentStatus: {eq: "paid"}');
  const result = validateSqlConnectSources({
    schema: requiredSchema(),
    customer: requiredCustomerOperations(),
    server,
    manifest: safeManifest(),
    firebaseJson: '{"dataconnect":{"source":"dataconnect"}}',
    serviceConfig: "schemaValidation: COMPATIBLE",
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes("payment attempts must match")));
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
    mutation RecordPaymentAttempt($attemptId: UUID!, $amountMinor: Int64!, $currency: String!) @auth(level: NO_ACCESS) @transaction {
      query @check(expr: "true") { orders(where: {totalAmountMinor: {eq: $amountMinor}, currency: {eq: $currency}, paymentStatus: {eq: "unpaid"}}) { reference } }
      paymentAttempt_insert(data: {attemptId: $attemptId})
      order_update(key: {reference: "x"}, data: {currentPaymentAttemptId: $attemptId}) @check(expr: "this != null")
    }
    mutation RecordVerifiedPayment($attemptId: UUID!, $providerProfileId: String!, $providerTransactionReference: String!) @auth(level: NO_ACCESS) @transaction {
      query @check(expr: "response.query.orders.size() == 1 && response.query.paymentAttempts.size() == 1 && response.query.existingPaymentEvents.size() == response.query.matchingPaymentEvents.size()") {
        orders(where: {currentPaymentAttemptId: {eq: $attemptId}, totalAmountMinor: {eq: $amountMinor}, currency: {eq: $currency}}) { reference }
        paymentAttempts(where: {attemptId: {eq: $attemptId}, providerProfileId: {eq: $providerProfileId}, providerTransactionReference: {eq: $providerTransactionReference}}) { attemptId }
        existingPaymentEvents: paymentEvents(where: {providerTransactionReference: {eq: $providerTransactionReference}}) { providerTransactionReference }
        matchingPaymentEvents: paymentEvents(where: {
          provider: {eq: "paytabs"}, providerProfileId: {eq: $providerProfileId}, orderReference: {eq: $orderReference},
          providerTransactionReference: {eq: $providerTransactionReference}, eventType: {eq: "authoritative-verification"}, authoritativeStatus: {eq: "paid"},
          amountMinor: {eq: $amountMinor}, currency: {eq: $currency}
        }) { providerTransactionReference }
      }
      paymentEvent_upsert(data: {provider: "paytabs", providerProfileId: $providerProfileId})
      paymentAttempt_update(key: {attemptId: $attemptId}, data: {status: "paid"}) @check(expr: "this != null")
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
