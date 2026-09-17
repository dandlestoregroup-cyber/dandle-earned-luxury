export const LEAD_PIPELINE_VERSION = "dandle.leads.v1";

const clean = (value, max = 300) =>
  typeof value === "string" || typeof value === "number"
    ? String(value).trim().replace(/[\u0000-\u001f\u007f]/g, "").slice(0, max)
    : "";

function unwrapLead(input) {
  const root = input?.body ?? input ?? {};
  const candidates = [root?.lead, root?.data, root?.value, root];
  return {
    root,
    lead: candidates.find((value) => value && typeof value === "object" && (
      Array.isArray(value.field_data) || value.id || value.leadgen_id
    )) || {},
  };
}

export function normalizeFacebookLead(input, options = {}) {
  const { root, lead } = unwrapLead(input);
  const fields = {};

  for (const entry of Array.isArray(lead.field_data) ? lead.field_data.slice(0, 80) : []) {
    const key = clean(entry?.name, 80).toLowerCase().replace(/[^a-z0-9]+/g, "_");
    const value = Array.isArray(entry?.values)
      ? entry.values.map((item) => clean(item, 500)).filter(Boolean).join(", ")
      : clean(entry?.value, 500);
    if (key && value && fields[key] === undefined) fields[key] = value;
  }

  const pick = (...keys) => {
    for (const key of keys) {
      const normalized = clean(fields[key] ?? lead[key], 500);
      if (normalized) return normalized;
    }
    return "";
  };

  const leadId = clean(lead.id ?? lead.leadgen_id ?? root.leadgen_id, 120);
  // Persist this normalized result before ledger retries. Distinct malformed
  // arrivals must never share a deduplication key, even for identical payloads.
  const recoveryId = leadId ? "" : `RECOVERY:${globalThis.crypto.randomUUID()}`;
  const pageId = clean(lead.page_id ?? lead.pageId ?? root.page_id ?? options.expectedPageId, 120);
  const formId = clean(lead.form_id ?? lead.formId ?? root.form_id, 120);
  const email = pick("email", "email_address").toLowerCase();
  const phone = pick("phone_number", "phone", "mobile_number", "mobile");
  const fullName = pick("full_name", "name");
  const nameParts = fullName.split(/\s+/).filter(Boolean);
  const firstName = pick("first_name", "firstname") || nameParts.shift() || "";
  const lastName = pick("last_name", "lastname") || nameParts.join(" ");
  const consentRaw = pick(
    "contact_consent",
    "consent",
    "privacy_consent",
    "agree_to_be_contacted",
    "permission_to_contact",
  ).toLowerCase();
  const positiveConsent = /^(?:yes|y|true|1|agree|agreed|granted|نعم|موافق)$/.test(consentRaw);
  const negativeConsent = /^(?:no|n|false|0|decline|declined|denied|لا|غير موافق)$/.test(consentRaw);
  const consent = positiveConsent ? "GRANTED" : negativeConsent ? "DENIED" : "UNKNOWN";

  const createdRaw = lead.created_time ?? lead.createdTime ?? root.created_time;
  const numericCreated = Number(createdRaw);
  const parsedCreated = Number.isFinite(numericCreated) && numericCreated > 0
    ? new Date(numericCreated < 100_000_000_000 ? numericCreated * 1000 : numericCreated)
    : new Date(clean(createdRaw, 80));
  const receivedAt = Number.isFinite(parsedCreated.getTime())
    ? parsedCreated.toISOString()
    : (options.now || new Date()).toISOString();
  const validEmail = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  let qualification = "READY_FOR_CRM";
  let nextAction = consent === "GRANTED"
    ? "NOUR_QUALIFY_WITH_PERMISSION"
    : "UPSERT_CRM_AND_HOLD_OUTREACH";
  let errorCode = "";

  if (!leadId) {
    qualification = "FAILED";
    nextAction = "RECOVER_FACEBOOK_LEAD";
    errorCode = "LEAD_ID_MISSING";
  } else if ((!email && !phone) || !validEmail) {
    qualification = "FAILED";
    nextAction = "RECOVER_FACEBOOK_LEAD";
    errorCode = !validEmail ? "EMAIL_INVALID" : "CONTACT_MISSING";
  } else if (consent === "DENIED") {
    qualification = "NEEDS_REVIEW";
    nextAction = "STOP_CONTACT_AND_REVIEW";
    errorCode = "CONTACT_DENIED";
  } else if (!email) {
    qualification = "NEEDS_REVIEW";
    nextAction = "VERIFY_PHONE_ONLY_LEAD";
    errorCode = "EMAIL_MISSING";
  }

  const attribution = {
    facebookLeadId: leadId,
    pageId,
    formId,
    adId: clean(lead.ad_id ?? lead.adId, 120),
    adsetId: clean(lead.adset_id ?? lead.adsetId, 120),
    campaignId: clean(lead.campaign_id ?? lead.campaignId, 120),
    platform: clean(lead.platform ?? root.platform, 40) || "facebook",
    createdTime: receivedAt,
  };
  const normalized = {
    version: LEAD_PIPELINE_VERSION,
    leadId,
    ...(recoveryId ? { recoveryId } : {}),
    pageId,
    formId,
    firstName,
    lastName,
    fullName: fullName || [firstName, lastName].filter(Boolean).join(" "),
    email,
    phone,
    consent,
    productInterest: pick(
      "product_interest",
      "preferred_product",
      "what_are_you_interested_in",
      "interest",
    ),
    attribution,
  };
  const record = {
    "Lead ID": leadId || recoveryId,
    "Page ID": pageId,
    "Form ID": formId,
    Name: normalized.fullName,
    Email: email,
    Phone: phone,
    Source: "Facebook Lead Ads",
    "Attribution JSON": JSON.stringify(attribution),
    Consent: consent,
    Qualification: qualification,
    "Next Action": nextAction,
    "Error Code": errorCode,
    "Received At": receivedAt,
    "HubSpot Contact ID": "",
    "Normalized JSON": JSON.stringify(normalized),
  };
  const crm = qualification === "READY_FOR_CRM" ? [{
    email,
    firstName,
    lastName,
    phone,
    leadId,
    pageId,
    formId,
    consent,
    attributionJson: JSON.stringify(attribution),
    productInterest: normalized.productInterest,
    receivedAt,
    nextAction,
  }] : [];

  return {
    leadId: record["Lead ID"],
    record,
    crm,
    qualification,
    nextAction,
    consent,
  };
}

export function routeNewFacebookLead(normalized, existingRows) {
  if (!normalized?.record || !Array.isArray(existingRows)) {
    throw new Error("DANDLE_LEAD_LOOKUP_INVALID");
  }
  if (existingRows.length > 1) {
    throw new Error("DANDLE_DUPLICATE_LEAD_LEDGER_CONFLICT");
  }
  if (existingRows.length === 1) {
    const cells = existingRows[0]?.cells;
    if (!cells || typeof cells !== "object") throw new Error("DANDLE_LEAD_LOOKUP_INVALID");
    const stored = Object.values(cells).find((cell) => cell && cell.fieldName === "Normalized JSON");
    if (!stored || stored.value !== normalized.record["Normalized JSON"]) {
      throw new Error("DANDLE_FACEBOOK_LEAD_ID_CONFLICT");
    }
    return { records: [], crm: [], duplicate: true, leadId: normalized.leadId };
  }

  return {
    records: [normalized.record],
    crm: normalized.crm,
    duplicate: false,
    leadId: normalized.leadId,
    qualification: normalized.qualification,
    nextAction: normalized.nextAction,
  };
}
