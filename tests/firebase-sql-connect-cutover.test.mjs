import assert from "node:assert/strict";
import test from "node:test";

import {
  evaluateFirebaseCutoverReadiness,
  validateDataBackendCutover,
} from "../scripts/verify-data-backend-cutover.mjs";

const baseline = {
  version: 1,
  production: {
    readBackend: "supabase",
    writeBackend: "supabase",
    dualWriteEnabled: false,
  },
  firebaseSqlConnect: {
    billingApproval: { verified: false, evidence: null },
    projectIdentity: { verified: false, projectId: null, evidence: null },
    sqlConnectService: { verified: false, serviceId: null, evidence: null },
    cloudSqlInstance: { verified: false, instanceId: null, evidence: null },
    schemaAndConnectors: { verified: false, evidence: null },
    firebaseAuth: { verified: false, evidence: null },
    migration: { verified: false, evidence: null },
    persistence: { verified: false, evidence: null },
    paymentCommerce: { verified: false, evidence: null },
    endToEndReadWrite: { verified: false, evidence: null },
    rollback: { verified: false, evidence: null },
  },
};

const clone = (value) => structuredClone(value);

test("keeps Supabase authoritative while every Firebase cutover gate is incomplete", () => {
  const result = validateDataBackendCutover(baseline);

  assert.equal(result.ready, false);
  assert.equal(result.safe, true);
  assert.equal(result.missing.length, 25);
  assert.ok(result.missing.includes("billingApproval.verified"));
  assert.ok(result.missing.includes("projectIdentity.projectId"));
  assert.ok(result.missing.includes("endToEndReadWrite.evidence"));
});

test("rejects Firebase as a production backend before all gates are proven", () => {
  const config = clone(baseline);
  config.production.readBackend = "firebase-sql-connect";
  config.production.writeBackend = "firebase-sql-connect";

  assert.throws(
    () => validateDataBackendCutover(config),
    /Firebase SQL Connect cannot become authoritative/,
  );
});

test("rejects split production authorities and dual writes", () => {
  const split = clone(baseline);
  split.production.readBackend = "firebase-sql-connect";
  assert.throws(() => validateDataBackendCutover(split), /single production data authority/);

  const dualWrite = clone(baseline);
  dualWrite.production.dualWriteEnabled = true;
  assert.throws(() => validateDataBackendCutover(dualWrite), /Dual production writes are forbidden/);
});

test("requires specific identity values as well as evidence", () => {
  const config = clone(baseline);
  for (const gate of Object.values(config.firebaseSqlConnect)) {
    gate.verified = true;
    gate.evidence = "https://github.com/example/repo/issues/1";
  }

  const result = evaluateFirebaseCutoverReadiness(config.firebaseSqlConnect);
  assert.equal(result.ready, false);
  assert.deepEqual(
    result.missing,
    ["projectIdentity.projectId", "sqlConnectService.serviceId", "cloudSqlInstance.instanceId"],
  );
});

test("cannot become ready by deleting a required gate", () => {
  const config = clone(baseline);
  for (const gate of Object.values(config.firebaseSqlConnect)) {
    gate.verified = true;
    gate.evidence = "https://github.com/example/repo/issues/1";
  }
  config.firebaseSqlConnect.projectIdentity.projectId = "dandle-production";
  config.firebaseSqlConnect.sqlConnectService.serviceId = "dandle-commerce";
  config.firebaseSqlConnect.cloudSqlInstance.instanceId = "dandle-commerce-primary";
  delete config.firebaseSqlConnect.endToEndReadWrite;

  const result = evaluateFirebaseCutoverReadiness(config.firebaseSqlConnect);
  assert.equal(result.ready, false);
  assert.ok(result.missing.includes("endToEndReadWrite"));
});

test("allows one Firebase production authority only after every gate has evidence", () => {
  const config = clone(baseline);
  for (const gate of Object.values(config.firebaseSqlConnect)) {
    gate.verified = true;
    gate.evidence = "https://github.com/example/repo/issues/1";
  }
  config.firebaseSqlConnect.projectIdentity.projectId = "dandle-production";
  config.firebaseSqlConnect.sqlConnectService.serviceId = "dandle-commerce";
  config.firebaseSqlConnect.cloudSqlInstance.instanceId = "dandle-commerce-primary";
  config.production.readBackend = "firebase-sql-connect";
  config.production.writeBackend = "firebase-sql-connect";

  const result = validateDataBackendCutover(config);
  assert.equal(result.ready, true);
  assert.equal(result.safe, true);
});

test("rejects credential-like fields in the committed cutover manifest", () => {
  const config = clone(baseline);
  config.firebaseSqlConnect.projectIdentity.apiKey = "must-not-be-committed";

  assert.throws(() => validateDataBackendCutover(config), /must not contain credentials/);
});
