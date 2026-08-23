import test from 'node:test';
import assert from 'node:assert/strict';

import {
  approveConfiguration,
  canPerformConsequentialAction,
  canTransitionToOrder,
  createInitialJourneyState,
  createStaffIntervention,
  createVerification,
  makeEvidence,
  mutateConfiguration,
  projectCustomerView,
  projectStaffView,
  qualifyNourState,
  recordCustomerStop,
  resolveStaffIntervention,
} from '../src/nour/qualification.mjs';

test('working assumptions must carry confidence and reversibility', () => {
  assert.throws(() => makeEvidence({
    id: 'a1',
    kind: 'working_assumption',
    subject: 'room_size',
    value: 'compact',
    source: 'navigation inference',
  }));

  const assumption = makeEvidence({
    id: 'a2',
    kind: 'working_assumption',
    subject: 'room_size',
    value: 'compact',
    source: 'navigation inference',
    confidence: 0.6,
    reversible: true,
  });

  assert.equal(assumption.kind, 'working_assumption');
});

test('verification blocks only the consequential action that depends on it', () => {
  const state = createInitialJourneyState({
    journeyId: 'j1',
    activeShowroomId: 'showroom_1_dandle',
  });

  const quote = canPerformConsequentialAction(state, 'quote', ['price']);
  assert.equal(quote.allowed, false);
  assert.deepEqual(quote.missing, ['price']);

  // Browsing remains possible because verification is action-scoped.
  assert.equal(state.nextBestAction.type, 'ask');
});

test('verified fact satisfies the relevant consequential action', () => {
  const state = createInitialJourneyState({
    journeyId: 'j2',
    activeShowroomId: 'showroom_1_dandle',
  });
  state.verificationRegistry.push(createVerification({
    id: 'v1',
    subject: 'RelaxMax',
    field: 'price',
    value: 21900,
    source: 'governed product source',
    evidenceKind: 'system_verified_fact',
    verifiedBy: 'catalogue-service',
    requiredBefore: ['quote'],
  }));

  assert.equal(canPerformConsequentialAction(state, 'quote', ['price']).allowed, true);
});

test('staff actions resolve only to Done / Not possible / Needs follow-up', () => {
  const intervention = createStaffIntervention({
    id: 's1',
    type: 'measure_clearance',
    reason: 'clearance affects configuration',
    assignedRole: 'salesperson',
    requiredForAction: 'quote',
  });

  const resolved = resolveStaffIntervention(intervention, 'done', 'Measured on site', 'measurement:1');
  assert.equal(resolved.status, 'done');
  assert.throws(() => resolveStaffIntervention(intervention, 'maybe'));
});

test('order cannot happen without valid configuration, authority and explicit current-version approval', () => {
  let state = createInitialJourneyState({
    journeyId: 'j3',
    activeShowroomId: 'showroom_1_dandle',
  });
  assert.equal(canTransitionToOrder(state).allowed, false);

  state.validConfiguration = true;
  state.commercialAuthority = true;
  state = approveConfiguration(state, 'cfg-v1');
  assert.equal(canTransitionToOrder(state).allowed, true);

  state = mutateConfiguration(state, { fabric: 'waterproof-summer' }, 'cfg-v2');
  assert.equal(canTransitionToOrder(state).allowed, false);
  assert.ok(canTransitionToOrder(state).reasons.includes('configuration_not_approved'));
});

test('clear customer stop immediately becomes stop action', () => {
  const state = recordCustomerStop(createInitialJourneyState({
    journeyId: 'j4',
    activeShowroomId: 'showroom_1_dandle',
  }));

  assert.equal(state.customerStopped, true);
  assert.equal(state.nextBestAction.type, 'stop');
  assert.equal(qualifyNourState(state).status, 'QUALIFIED');
});

test('customer and staff projections are synchronized but not mirrored', () => {
  const state = createInitialJourneyState({
    journeyId: 'j5',
    activeShowroomId: 'showroom_1_dandle',
  });
  state.unresolvedQuestions.push('confirm fabric availability');

  const customer = projectCustomerView(state);
  const staff = projectStaffView(state);

  assert.equal(customer.primaryAction, 'ask');
  assert.equal('verification' in customer, false);
  assert.equal(Array.isArray(staff.verification), true);
  assert.equal(Array.isArray(staff.unresolvedQuestions), true);
});

test('policy breaches fail qualification', () => {
  const state = createInitialJourneyState({
    journeyId: 'j6',
    activeShowroomId: 'showroom_1_dandle',
  });
  state.policyBreaches.push('fake_urgency');

  const result = qualifyNourState(state);
  assert.equal(result.status, 'FAILED');
  assert.ok(result.failures.includes('policy_breach:fake_urgency'));
});
