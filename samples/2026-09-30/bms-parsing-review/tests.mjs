import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const api = require('./review-core.js');
const read = name => readFileSync(new URL(name, import.meta.url), 'utf8');

test('all three synthetic records begin pending, never auto-accepted', () => {
  const state = api.createState();
  assert.equal(state.length, 3);
  assert.ok(state.every(r => r.decision === 'pending' && !r.sourceChecked));
  assert.ok(state.every(r => r.sourceRef.startsWith('synthetic://')));
});
test('missing, zero, negative and fractional quantities cannot be accepted', () => {
  for (const value of ['', 0, -1, 1.5]) {
    const state = api.createState(); api.updateField(state, 'SYN-001', 'quantity', value);
    assert.throws(() => api.decide(state, 'SYN-001', 'accepted', 'Checked', true), /Quantity/);
    assert.equal(state[0].decision, 'pending');
  }
});
test('missing data may be marked for revision without fabrication', () => {
  const state = api.createState();
  api.decide(state, 'SYN-001', 'revise', 'Ask sender for quantity.', false);
  assert.equal(state[0].parsed.quantity, null);
  assert.equal(state[0].decision, 'revise');
});
test('both decision routes require a meaningful review note', () => {
  const state = api.createState();
  for (const decision of ['accepted', 'revise']) assert.throws(() => api.decide(state, 'SYN-002', decision, '  ', true), /note/);
});
test('acceptance requires an explicit source-review acknowledgement', () => {
  const state = api.createState();
  assert.throws(() => api.decide(state, 'SYN-002', 'accepted', 'Checked', false), /box/);
});
test('unit correction and human acceptance preserve original draft and raw source', () => {
  const state = api.createState(); const raw = state[1].raw;
  api.updateField(state, 'SYN-002', 'unit', 'boxes');
  api.decide(state, 'SYN-002', 'accepted', 'Source requests two boxes; no conversion.', true);
  const out = api.buildExport(state).records[1];
  assert.equal(out.reviewed_fields.unit, 'boxes');
  assert.equal(out.original_prepared_draft.unit, 'pieces');
  assert.equal(out.source.raw_text, raw);
  assert.equal(out.decision, 'accepted');
});
test('editing an accepted field revokes the decision and acknowledgement', () => {
  const state = api.createState();
  api.decide(state, 'SYN-002', 'accepted', 'Human checked', true);
  api.updateField(state, 'SYN-002', 'quantity', 3);
  assert.equal(state[1].decision, 'pending'); assert.equal(state[1].sourceChecked, false);
});
test('ambiguous date can stay explicitly unknown; special characters survive JSON', () => {
  const state = api.createState(); const original = state[2].raw;
  api.updateField(state, 'SYN-003', 'requiredBy', '');
  api.decide(state, 'SYN-003', 'revise', 'Clarify date format and year.', true);
  const result = JSON.parse(JSON.stringify(api.buildExport(state))).records[2];
  assert.equal(result.reviewed_fields.requiredBy, null);
  assert.equal(result.original_prepared_draft.requiredBy, '12/10');
  assert.equal(result.source.raw_text, original);
  assert.ok(result.source.raw_text.includes('<prototype> & "rev B"'));
});
test('exports include pending records and cannot mutate source state', () => {
  const state = api.createState(); const out = api.buildExport(state);
  assert.equal(out.records.length, 3); assert.equal(out.automated_approval, false);
  out.records[0].reviewed_fields.item = 'changed export';
  assert.notEqual(state[0].parsed.item, 'changed export');
  assert.deepEqual(api.buildExport(api.createState()), api.buildExport(api.createState()));
});
test('reset fixtures are isolated and unknown records/fields are rejected', () => {
  const first = api.createState(); first[0].raw = 'changed';
  assert.notEqual(api.createState()[0].raw, 'changed');
  assert.throws(() => api.updateField(first, 'missing', 'item', 'x'), /Unknown record/);
  assert.throws(() => api.updateField(first, 'SYN-001', 'raw', 'x'), /Unknown field/);
});
test('runtime has no network, automatic submission or unsafe HTML insertion API', () => {
  const scripts = read('app.js') + read('review-core.js');
  assert.doesNotMatch(scripts, /\bfetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|\.innerHTML\s*=|insertAdjacentHTML|localStorage|eval\s*\(/);
  const html = read('index.html');
  assert.doesNotMatch(html, /<form\b|<(?:script|link)[^>]+(?:src|href)=["']https?:/i);
  assert.match(html, /synthetic/i);
  for (const asset of ['styles.css', 'review-core.js', 'app.js']) assert.ok(read(asset).length > 100);
});
