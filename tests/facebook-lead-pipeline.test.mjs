import assert from "node:assert/strict";
import test from "node:test";

import {
  LEAD_PIPELINE_VERSION,
  normalizeFacebookLead,
  routeNewFacebookLead,
} from "../automation/activepieces/dandleFacebookLead.mjs";

const CREATED_TIME = 1_789_047_829;

function lead(fieldData = [], overrides = {}) {
  return {
    id: "FB-TEST-001",
    created_time: CREATED_TIME,
    page_id: "DANDLE-PAGE",
    form_id: "DANDLE-FORM",
    campaign_id: "DANDLE-CAMPAIGN",
    field_data: fieldData,
    ...overrides,
  };
}

test("explicitly permitted Facebook lead is CRM-ready and routed to Nour", () => {
  const result = normalizeFacebookLead(lead([
    { name: "full_name", values: ["Dandle Test Lead"] },
    { name: "email", values: ["lead@example.invalid"] },
    { name: "phone_number", values: ["+200000000000"] },
    { name: "contact_consent", values: ["yes"] },
  ]));

  const normalized = JSON.parse(result.record["Normalized JSON"]);
  assert.equal(normalized.version, LEAD_PIPELINE_VERSION);
  assert.equal(result.qualification, "READY_FOR_CRM");
  assert.equal(result.nextAction, "NOUR_QUALIFY_WITH_PERMISSION");
  assert.equal(result.crm.length, 1);
});

test("unknown consent permits CRM continuity but blocks outreach", () => {
  const result = normalizeFacebookLead(lead([
    { name: "email", values: ["lead@example.invalid"] },
  ]));

  assert.equal(result.consent, "UNKNOWN");
  assert.equal(result.qualification, "READY_FOR_CRM");
  assert.equal(result.nextAction, "UPSERT_CRM_AND_HOLD_OUTREACH");
});

test("phone-only lead is retained for review instead of creating a duplicate-prone CRM record", () => {
  const result = normalizeFacebookLead(lead([
    { name: "phone_number", values: ["+200000000000"] },
  ]));

  assert.equal(result.qualification, "NEEDS_REVIEW");
  assert.equal(result.nextAction, "VERIFY_PHONE_ONLY_LEAD");
  assert.equal(result.crm.length, 0);
});

test("invalid lead is retained with a recoverable error state", () => {
  const result = normalizeFacebookLead(lead([
    { name: "email", values: ["not-an-email"] },
  ]));

  assert.equal(result.qualification, "FAILED");
  assert.equal(result.record["Error Code"], "EMAIL_INVALID");
  assert.equal(result.nextAction, "RECOVER_FACEBOOK_LEAD");
});

test("same Facebook lead is suppressed and conflicting reuse is rejected", () => {
  const normalized = normalizeFacebookLead(lead([
    { name: "email", values: ["lead@example.invalid"] },
  ]));
  const existing = [{
    cells: {
      normalized: {
        fieldName: "Normalized JSON",
        value: normalized.record["Normalized JSON"],
      },
    },
  }];

  assert.equal(routeNewFacebookLead(normalized, existing).duplicate, true);

  const conflict = normalizeFacebookLead(lead([
    { name: "email", values: ["different@example.invalid"] },
  ]));
  assert.throws(() => routeNewFacebookLead(conflict, existing), /DANDLE_FACEBOOK_LEAD_ID_CONFLICT/);
});
