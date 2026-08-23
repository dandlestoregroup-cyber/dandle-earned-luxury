export interface DandleShowroomFact {
  id: string;
  title: string;
  claim: string;
  customerCopy: string;
  appliesTo: string;
  waterproof?: boolean;
  summerUse?: boolean;
  evidenceClass: "human-verified-showroom";
  verifiedAt: string;
  canonicalNotionUrl: string;
  boundaries: string[];
}

/**
 * Runtime mirror of governed DANDLE showroom facts.
 * Canonical knowledge remains in Notion. This file exposes only customer-safe
 * facts and must never create extra checkout gates or verification friction.
 */
export const WATERPROOF_SUMMER_RECLINER_FABRIC: DandleShowroomFact = {
  id: "waterproof-summer-recliner-fabric",
  title: "Waterproof Summer Recliner Fabric",
  claim:
    "DANDLE has a showroom-verified waterproof fabric option intended for summer use on recliners.",
  customerCopy:
    "Waterproof summer fabric available for DANDLE recliners.",
  appliesTo: "DANDLE recliners",
  waterproof: true,
  summerUse: true,
  evidenceClass: "human-verified-showroom",
  verifiedAt: "2026-08-23",
  canonicalNotionUrl:
    "https://app.notion.com/p/3c55bbcf367e818f9c6de117d71e415a",
  boundaries: [
    "Do not generalize the waterproof claim to unrelated DANDLE fabrics.",
    "Missing supplier or technical metadata must not block or delay checkout.",
  ],
};
