export interface CertaintyIssue {
  code: string;
  severity: "block" | "warn";
  values?: string[];
}

export interface CommercialTruthRecord {
  priceValues?: Array<string | number>;
  promotion?: { active?: boolean; label?: string; endsAt?: string };
  stock?: { status?: string; verifiedAt?: string };
  delivery?: { fixedDate?: string; verifiedAt?: string; promises?: string[] };
  installation?: { included?: boolean; scope?: string };
  warranty?: { term?: string; verifiedAt?: string };
  afterSales?: { channel?: string; active?: boolean };
}

export function auditCommercialTruth(record: CommercialTruthRecord, now?: Date): {
  score: number;
  status: "dependable" | "needs_verification" | "do_not_promise";
  recommendable: boolean;
  checks: Record<string, boolean>;
  issues: CertaintyIssue[];
};

export function recommendationGuard(record: CommercialTruthRecord, now?: Date): ReturnType<typeof auditCommercialTruth> & {
  action: "recommend" | "verify_or_handoff";
};
