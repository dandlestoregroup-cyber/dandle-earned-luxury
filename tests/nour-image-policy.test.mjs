import assert from 'node:assert/strict';
import test from 'node:test';
import { NOUR_RENDER_POLICY } from '../api/_lib/nourImagePolicy.mjs';

test('i2i uses Sunburst precision with a single bounded paid attempt', () => {
  assert.deepEqual(NOUR_RENDER_POLICY, { model: 'gpt-image-2.5-sunburst', quality: 'high', maxAttempts: 1 });
  assert.ok(Object.isFrozen(NOUR_RENDER_POLICY));
});
