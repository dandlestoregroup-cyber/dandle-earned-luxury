import { readFile } from "node:fs/promises";

const customerTypesUrl = new URL("../dataconnect-generated/customer/index.d.ts", import.meta.url);
const customerPackageUrl = new URL("../dataconnect-generated/customer/package.json", import.meta.url);
const serverTypesUrl = new URL("../dataconnect-generated/server/index.d.ts", import.meta.url);
const serverPackageUrl = new URL("../dataconnect-generated/server/package.json", import.meta.url);

const [customerTypes, customerPackageSource, serverTypes, serverPackageSource] = await Promise.all([
  readFile(customerTypesUrl, "utf8"),
  readFile(customerPackageUrl, "utf8"),
  readFile(serverTypesUrl, "utf8"),
  readFile(serverPackageUrl, "utf8"),
]);

const customerPackage = JSON.parse(customerPackageSource);
const serverPackage = JSON.parse(serverPackageSource);
const errors = [];

for (const name of ["listActiveCatalog", "myOrderStatus", "upsertMyCustomer"]) {
  if (!new RegExp(`export function ${name}\\b`).test(customerTypes)) {
    errors.push(`customer SDK is missing ${name}`);
  }
}
for (const name of [
  "createCommerceOrder",
  "recordPaymentAttempt",
  "recordVerifiedPayment",
  "captureLead",
  "queueOperationsEvent",
  "recordMigrationCheckpoint",
]) {
  if (!new RegExp(`export function ${name}\\b`).test(serverTypes)) {
    errors.push(`server Admin SDK is missing ${name}`);
  }
  if (new RegExp(`export function ${name}\\b`).test(customerTypes)) {
    errors.push(`customer SDK must not expose Admin-only operation ${name}`);
  }
}

if (!customerTypes.includes("from 'firebase/data-connect'")) {
  errors.push("customer SDK must target firebase/data-connect");
}
if (!serverTypes.includes("from 'firebase-admin/data-connect'")) {
  errors.push("server SDK must target firebase-admin/data-connect");
}
if (!customerPackage.peerDependencies?.firebase) {
  errors.push("customer SDK must declare the Firebase runtime peer dependency");
}
if (!serverPackage.peerDependencies?.["firebase-admin"]) {
  errors.push("server SDK must declare the Firebase Admin runtime peer dependency");
}
if (!/customerAuthUid:\s*string/.test(serverTypes) || !/totalAmountMinor:\s*Int64String/.test(serverTypes)) {
  errors.push("server order SDK types must preserve customer ownership and minor-unit money");
}
if (!/amountMinor:\s*Int64String/.test(serverTypes) || !/currency:\s*string/.test(serverTypes)) {
  errors.push("generated payment SDK types must preserve amount and currency inputs");
}
if (!/RecordVerifiedPaymentVariables\s*\{[\s\S]*?attemptId:\s*UUIDString;[\s\S]*?providerProfileId:\s*string;[\s\S]*?providerTransactionReference:\s*string;/.test(serverTypes)) {
  errors.push("verified payment SDK must bind the exact attempt, profile, and transaction");
}
if (!/RecordVerifiedPaymentData\s*\{[\s\S]*?paymentAttempt_update\?:\s*PaymentAttempt_Key\s*\|\s*null;/.test(serverTypes)) {
  errors.push("verified payment SDK must atomically update the matched attempt");
}

if (errors.length > 0) {
  throw new Error(errors.join("\n"));
}

console.log("Firebase SQL Connect SDK boundary passed (customer and Admin operations remain separated).");
