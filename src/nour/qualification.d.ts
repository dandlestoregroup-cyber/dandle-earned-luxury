export type EvidenceKind =
  | 'customer_preference'
  | 'nour_recommendation'
  | 'working_assumption'
  | 'customer_stated'
  | 'observed_evidence'
  | 'system_verified_fact'
  | 'human_verified_fact';

export type NextBestActionType =
  | 'ask'
  | 'show'
  | 'demonstrate'
  | 'compare'
  | 'configure'
  | 'visualize'
  | 'verify'
  | 'resolve'
  | 'capture'
  | 'quote'
  | 'close'
  | 'follow_up'
  | 'handoff'
  | 'stop';

export type StaffResolution = 'done' | 'not_possible' | 'needs_follow_up';

export interface EvidenceRecord {
  id: string;
  kind: EvidenceKind;
  subject: string;
  value: unknown;
  source: string;
  confidence: number | null;
  reversible: boolean | null;
  verificationStatus: string;
  consequence: string;
  observedAt: string;
}

export interface VerificationRecord {
  id: string;
  subject: string;
  field: string;
  value: unknown;
  source: string;
  evidenceKind: 'system_verified_fact' | 'human_verified_fact';
  status: string;
  verifiedBy?: string;
  verifiedAt: string;
  freshness: string;
  consequence: string;
  requiredBefore: string[];
}

export interface StaffIntervention {
  id: string;
  type: string;
  reason: string;
  requestedBy: string;
  assignedRole: string;
  requiredForAction: string | null;
  status: 'open' | StaffResolution;
  result: unknown;
  evidenceRef: string | null;
  createdAt: string;
  resolvedAt: string | null;
}

export interface NourJourneyState {
  journeyId: string;
  customerRef: string | null;
  isAnonymous: boolean;
  activeShowroomId: string;
  channel: string;
  journeyStage: string;
  jobToBeDone: unknown;
  productHypothesis: unknown;
  configurationHypothesis: unknown;
  customerStated: EvidenceRecord[];
  observedEvidence: EvidenceRecord[];
  preferences: EvidenceRecord[];
  rejections: EvidenceRecord[];
  workingAssumptions: EvidenceRecord[];
  verificationRegistry: VerificationRecord[];
  unresolvedQuestions: unknown[];
  staffInterventions: StaffIntervention[];
  nextBestAction: { type: NextBestActionType; objective?: string };
  purchaseReadiness: string;
  followUpState: string;
  approvedConfigurationVersion: string | null;
  explicitOrderApproval: { configurationVersion: string; approvedAt: string } | null;
  validConfiguration: boolean;
  commercialAuthority: boolean;
  customerStopped: boolean;
  escapeRoutes: string[];
  policyBreaches: string[];
  updatedAt: string;
}

export const EVIDENCE_KINDS: readonly EvidenceKind[];
export const NEXT_BEST_ACTIONS: readonly NextBestActionType[];
export const STAFF_RESOLUTIONS: readonly StaffResolution[];
export const ESCAPE_ROUTES: readonly string[];

export function createInitialJourneyState(input: {
  journeyId: string;
  activeShowroomId: string;
  channel?: string;
  customerRef?: string | null;
}): NourJourneyState;

export function makeEvidence(input: {
  id: string;
  kind: EvidenceKind;
  subject: string;
  value: unknown;
  source: string;
  confidence?: number | null;
  reversible?: boolean | null;
  verificationStatus?: string;
  consequence?: string;
  observedAt?: string;
}): EvidenceRecord;

export function createVerification(input: {
  id: string;
  subject: string;
  field: string;
  value: unknown;
  source: string;
  evidenceKind: 'system_verified_fact' | 'human_verified_fact';
  status?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  freshness?: string;
  consequence?: string;
  requiredBefore?: string[];
}): VerificationRecord;

export function verificationSatisfied(state: NourJourneyState, field: string, action: string): boolean;
export function canPerformConsequentialAction(state: NourJourneyState, action: string, requiredFields?: string[]): { allowed: boolean; missing: string[] };
export function createStaffIntervention(input: { id: string; type: string; reason: string; requestedBy?: string; assignedRole: string; requiredForAction?: string | null }): StaffIntervention;
export function resolveStaffIntervention(intervention: StaffIntervention, resolution: StaffResolution, result?: unknown, evidenceRef?: string | null): StaffIntervention;
export function setNextBestAction(state: NourJourneyState, action: { type: NextBestActionType; objective?: string }): NourJourneyState;
export function approveConfiguration(state: NourJourneyState, versionId: string): NourJourneyState;
export function mutateConfiguration(state: NourJourneyState, nextConfiguration: unknown, nextVersionId: string): NourJourneyState;
export function canTransitionToOrder(state: NourJourneyState, requiredVerificationFields?: string[]): { allowed: boolean; reasons: string[] };
export function recordCustomerStop(state: NourJourneyState): NourJourneyState;
export function projectCustomerView(state: NourJourneyState): Record<string, unknown>;
export function projectStaffView(state: NourJourneyState): Record<string, unknown>;
export function qualifyNourState(state: NourJourneyState): { status: 'QUALIFIED' | 'FAILED'; failures: string[] };

export const NOUR_QUALIFICATION_SOURCE: Readonly<{
  canonicalNotionUrl: string;
  governingArchitectureUrl: string;
}>;
