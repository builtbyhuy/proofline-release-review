(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ParsingReview = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const fixtures = [
    { id: 'SYN-001', title: 'Quantity not supplied', sourceRef: 'synthetic://enquiry/001', raw: 'Please quote stainless-steel spacers, 12 mm. Unit: pieces. Quantity to follow.', parsed: { item: 'Stainless-steel spacers, 12 mm', quantity: null, unit: 'pieces', requiredBy: null }, flags: ['The source does not supply a quantity. Do not invent one.'] },
    { id: 'SYN-002', title: 'Unit interpreted incorrectly', sourceRef: 'synthetic://enquiry/002', raw: 'Please quote 2 boxes of cable clips. Each box contains 25 clips. Keep the request in boxes.', parsed: { item: 'Cable clips', quantity: 2, unit: 'pieces', requiredBy: null }, flags: ['The prepared draft says pieces, but the source requests boxes. Check the unit before accepting.'] },
    { id: 'SYN-003', title: 'Date format is ambiguous', sourceRef: 'synthetic://enquiry/003', raw: 'Project label: <prototype> & "rev B". Please quote 6 display brackets, in pieces. Needed by 12/10; date format and year are not specified.', parsed: { item: 'Display brackets — <prototype> & "rev B"', quantity: 6, unit: 'pieces', requiredBy: '12/10' }, flags: ['12/10 has no confirmed format or year. Clear the date to unknown or request clarification; do not assume an ISO date.'] }
  ];
  const clone = value => JSON.parse(JSON.stringify(value));
  const keys = ['item', 'quantity', 'unit', 'requiredBy'];
  function createState() {
    return fixtures.map(record => ({ ...clone(record), originalParsed: clone(record.parsed), decision: 'pending', reviewerNote: '', sourceChecked: false }));
  }
  function getRecord(state, id) {
    const record = state.find(value => value.id === id);
    if (!record) throw new Error('Unknown record.');
    return record;
  }
  function updateField(state, id, field, value) {
    if (!keys.includes(field)) throw new Error('Unknown field.');
    const record = getRecord(state, id);
    if (field === 'quantity') record.parsed[field] = value === '' || value === null ? null : Number(value);
    else record.parsed[field] = typeof value === 'string' && value.trim() ? value.trim() : null;
    record.decision = 'pending';
    record.sourceChecked = false;
  }
  function validationErrors(record) {
    const errors = [];
    if (!record.parsed.item) errors.push('Item description is missing.');
    if (!Number.isSafeInteger(record.parsed.quantity) || record.parsed.quantity < 1) errors.push('Quantity must be a positive whole number; missing is not zero.');
    if (!['pieces', 'boxes'].includes(record.parsed.unit)) errors.push('Choose a supported unit.');
    return errors;
  }
  function decide(state, id, decision, note, sourceChecked) {
    const record = getRecord(state, id);
    if (!['accepted', 'revise'].includes(decision)) throw new Error('Choose Accept or Mark for revision.');
    if (!String(note || '').trim()) throw new Error('Add a review note explaining your decision.');
    if (decision === 'accepted') {
      const errors = validationErrors(record);
      if (errors.length) throw new Error(errors.join(' '));
      if (!sourceChecked) throw new Error('Check the source-review box before accepting.');
    }
    record.decision = decision;
    record.reviewerNote = String(note).trim();
    record.sourceChecked = Boolean(sourceChecked);
    return record;
  }
  function buildExport(state) {
    return {
      schema: 'independent-parsing-review/v1',
      data_origin: 'synthetic demonstration fixtures; no BMS customer or application data',
      automated_approval: false,
      notice: 'A human review action is not a guarantee of extraction accuracy or engineering suitability.',
      records: state.map(record => ({
        id: record.id,
        source: { reference: record.sourceRef, raw_text: record.raw, provenance: 'synthetic' },
        original_prepared_draft: clone(record.originalParsed),
        reviewed_fields: clone(record.parsed),
        review_flags: [...record.flags],
        remaining_validation_errors: validationErrors(record),
        decision: record.decision,
        reviewer_note: record.reviewerNote || null,
        source_checked_by_human: record.sourceChecked
      }))
    };
  }
  return { createState, updateField, validationErrors, decide, buildExport };
});
