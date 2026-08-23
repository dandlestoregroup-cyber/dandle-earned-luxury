export const EVIDENCE_KINDS = Object.freeze([
  'customer_preference',
  'nour_recommendation',
  'working_assumption',
  'customer_stated',
  'observed_evidence',
  'system_verified_fact',
  'human_verified_fact',
]);

export const NEXT_BEST_ACTIONS = Object.freeze([
  'ask',
  'show',
  'demonstrate',
  'compare',
  'configure',
  'visualize',
  'verify',
  'resolve',
  'capture',
  'quote',
  'close',
  'follow_up',
  'handoff',
  'stop',
]);

export const STAFF_RESOLUTIONS = Object.freeze([
  'done',
  'not_possible',
  'needs_follow_up',
]);

export const ESCAPE_ROUTES = Object.freeze([
  'talk_to_person',
  'skip',
  'go_back',
  'just_browsing',
  'continue_later',
]);

const VERIFIED_KINDS = new Set(['system_verified_fact', 'human_verified_fact']);

export function createInitialJourneyState({
  journeyId,
  activeShowroomId,
  channel = 'showroom',
  customerRef = null,
}) {
  if (!journeyId) throw new Error('journeyId is required');
  if (!activeShowroomId) throw new Error('activeShowroomId is required');

  return {
    journeyId,
    customerRef,
    isAnonymous: !customerRef,
    activeShowroomId,
    channel,
    journeyStage: 'recognize',
    jobToBeDone: null,
    productHypothesis: null,
    configurationHypothesis: null,
    customerStated: [],
    observedEvidence: [],
    preferences: [],
    rejections: [],
    workingAssumptions: [],
    verificationRegistry: [],
    unresolvedQuestions: [],
    staffInterventions: [],
    nextBestAction: {
      type: 'ask',
      objective: 'discover_job_to_be_done',
    },
    purchaseReadiness: 'exploring',
    followUpState: 'none',
    approvedConfigurationVersion: null,
    explicitOrderApproval: null,
    validConfiguration: false,
    commercialAuthority: false,
    customerStopped: false,
    escapeRoutes: [...ESCAPE_ROUTES],
    policyBreaches: [],
    updatedAt: new Date().toISOString(),
  };
}

export function makeEvidence({
  id,
  kind,
  subject,
  value,
  source,
  confidence = null,
  reversible = null,
  verificationStatus = 'unverified',
  consequence = 'low',
  observedAt = new Date().toISOString(),
}) {
  if (!id || !subject || !source) throw new Error('Evidence id, subject and source are required');
  if (!EVIDENCE_KINDS.includes(kind)) throw new Error(`Unsupported evidence kind: ${kind}`);

  if (kind === 'working_assumption') {
    if (typeof confidence !== 'number' || confidence < 0 || confidence > 1) {
      throw new Error('Working assumptions require confidence between 0 and 1');
    }
    if (typeof reversible !== 'boolean') {
      throw new Error('Working assumptions require reversible=true/false');
    }
  }

  return {
    id,
    kind,
    subject,
    value,
    source,
    confidence,
    reversible,
    verificationStatus,
    consequence,
    observedAt,
  };
}

export function createVerification({
  id,
  subject,
  field,
  value,
  source,
  evidenceKind,
  status = 'verified',
  verifiedBy,
  verifiedAt = new Date().toISOString(),
  freshness = 'current_interaction',
  consequence = 'commitment',
  requiredBefore = [],
}) {
  if (!id || !subject || !field || !source) {
    throw new Error('Verification id, subject, field and source are required');
  }
  if (!VERIFIED_KINDS.has(evidenceKind)) {
    throw new Error('Verification must be system-verified or human-verified');
  }
  return {
    id,
    subject,
    field,
    value,
    source,
    evidenceKind,
    status,
    verifiedBy,
    verifiedAt,
    freshness,
    consequence,
    requiredBefore,
  };
}

export function verificationSatisfied(state, field, action) {
  return state.verificationRegistry.some((item) =>
    item.field === field &&
    item.status === 'verified' &&
    VERIFIED_KINDS.has(item.evidenceKind) &&
    (!item.requiredBefore?.length || item.requiredBefore.includes(action)),
  );
}

export function canPerformConsequentialAction(state, action, requiredFields = []) {
  const missing = requiredFields.filter((field) => !verificationSatisfied(state, field, action));
  return {
    allowed: missing.length === 0,
    missing,
  };
}

export function createStaffIntervention({
  id,
  type,
  reason,
  requestedBy = 'nour',
  assignedRole,
  requiredForAction = null,
}) {
  if (!id || !type || !reason || !assignedRole) {
    throw new Error('Staff intervention id, type, reason and assignedRole are required');
  }
  return {
    id,
    type,
    reason,
    requestedBy,
    assignedRole,
    requiredForAction,
    status: 'open',
    result: null,
    evidenceRef: null,
    createdAt: new Date().toISOString(),
    resolvedAt: null,
  };
}

export function resolveStaffIntervention(intervention, resolution, result = null, evidenceRef = null) {
  if (!STAFF_RESOLUTIONS.includes(resolution)) {
    throw new Error(`Unsupported staff resolution: ${resolution}`);
  }
  return {
    ...intervention,
    status: resolution,
    result,
    evidenceRef,
    resolvedAt: new Date().toISOString(),
  };
}

export function setNextBestAction(state, action) {
  if (!action || !NEXT_BEST_ACTIONS.includes(action.type)) {
    throw new Error('State must contain exactly one valid next-best action');
  }
  return {
    ...state,
    nextBestAction: { ...action },
    updatedAt: new Date().toISOString(),
  };
}

export function approveConfiguration(state, versionId) {
  if (!versionId) throw new Error('Configuration version is required');
  return {
    ...state,
    approvedConfigurationVersion: versionId,
    explicitOrderApproval: {
      configurationVersion: versionId,
      approvedAt: new Date().toISOString(),
    },
    updatedAt: new Date().toISOString(),
  };
}

export function mutateConfiguration(state, nextConfiguration, nextVersionId) {
  if (!nextVersionId) throw new Error('New configuration version is required');
  return {
    ...state,
    configurationHypothesis: nextConfiguration,
    approvedConfigurationVersion: null,
    explicitOrderApproval: null,
    purchaseReadiness: 'configuring',
    updatedAt: new Date().toISOString(),
  };
}

export function canTransitionToOrder(state, requiredVerificationFields = []) {
  const verification = canPerformConsequentialAction(state, 'order', requiredVerificationFields);
  const reasons = [];

  if (!state.validConfiguration) reasons.push('invalid_configuration');
  if (!state.commercialAuthority) reasons.push('commercial_authority_missing');
  if (!state.approvedConfigurationVersion) reasons.push('configuration_not_approved');
  if (
    !state.explicitOrderApproval ||
    state.explicitOrderApproval.configurationVersion !== state.approvedConfigurationVersion
  ) {
    reasons.push('explicit_customer_approval_missing');
  }
  if (!verification.allowed) reasons.push(...verification.missing.map((field) => `unverified:${field}`));
  if (state.customerStopped) reasons.push('customer_stopped');

  return {
    allowed: reasons.length === 0,
    reasons,
  };
}

export function recordCustomerStop(state) {
  return {
    ...state,
    customerStopped: true,
    nextBestAction: { type: 'stop', objective: 'respect_customer_stop' },
    purchaseReadiness: 'paused',
    updatedAt: new Date().toISOString(),
  };
}

export function projectCustomerView(state) {
  return {
    stage: state.journeyStage,
    objective: state.nextBestAction?.objective ?? null,
    primaryAction: state.nextBestAction?.type ?? null,
    escapeRoutes: state.escapeRoutes,
    recommendation: state.productHypothesis,
    purchaseReadiness: state.purchaseReadiness,
  };
}

export function projectStaffView(state) {
  return {
    journeyId: state.journeyId,
    customerRef: state.customerRef,
    activeShowroomId: state.activeShowroomId,
    jobToBeDone: state.jobToBeDone,
    recommendation: state.productHypothesis,
    configuration: state.configurationHypothesis,
    customerStated: state.customerStated,
    observedEvidence: state.observedEvidence,
    preferences: state.preferences,
    rejections: state.rejections,
    assumptions: state.workingAssumptions,
    verification: state.verificationRegistry,
    unresolvedQuestions: state.unresolvedQuestions,
    staffInterventions: state.staffInterventions,
    nextBestAction: state.nextBestAction,
    purchaseReadiness: state.purchaseReadiness,
    followUpState: state.followUpState,
  };
}

export function qualifyNourState(state) {
  const failures = [];

  if (!state?.journeyId) failures.push('journey_id_missing');
  if (!state?.activeShowroomId) failures.push('active_showroom_missing');
  if (!state?.nextBestAction || !NEXT_BEST_ACTIONS.includes(state.nextBestAction.type)) {
    failures.push('exactly_one_next_best_action_required');
  }

  for (const assumption of state?.workingAssumptions ?? []) {
    if (assumption.kind !== 'working_assumption') failures.push(`assumption_kind_invalid:${assumption.id}`);
    if (typeof assumption.confidence !== 'number') failures.push(`assumption_confidence_missing:${assumption.id}`);
    if (typeof assumption.reversible !== 'boolean') failures.push(`assumption_reversibility_missing:${assumption.id}`);
    if (!assumption.source) failures.push(`assumption_source_missing:${assumption.id}`);
  }

  for (const intervention of state?.staffInterventions ?? []) {
    if (intervention.status !== 'open' && !STAFF_RESOLUTIONS.includes(intervention.status)) {
      failures.push(`staff_resolution_invalid:${intervention.id}`);
    }
  }

  if (state?.customerStopped && state.nextBestAction?.type !== 'stop' && state.nextBestAction?.type !== 'handoff') {
    failures.push('customer_stop_not_respected');
  }

  for (const breach of state?.policyBreaches ?? []) {
    failures.push(`policy_breach:${breach}`);
  }

  return {
    status: failures.length ? 'FAILED' : 'QUALIFIED',
    failures,
  };
}

export const NOUR_QUALIFICATION_SOURCE = Object.freeze({
  canonicalNotionUrl: 'https://app.notion.com/p/3c55bbcf367e8106b4abccf87c9252b5',
  governingArchitectureUrl: 'https://app.notion.com/p/3c55bbcf367e81dc9c93d51919707878',
});
