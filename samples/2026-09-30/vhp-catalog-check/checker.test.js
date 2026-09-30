const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('./checker.js');

test('normalizes published hyphenated and compact code without using internal IDs', () => {
  assert.equal(C.normalizeCode(' ３５１００ — ０４２００ '), '3510004200');
  assert.equal(C.normalizeCode('35100-04200'), C.normalizeCode('3510004200'));
  assert.equal(C.normalizeCode('ab-012'), 'AB012');
  assert.equal(C.normalizeCode('AB/012'), 'AB/012');
});
test('two public rows produce one review group with separate IDs and preserved raw codes', () => {
  const result = C.analyze(C.SAMPLE_ROWS);
  assert.equal(result.review_groups.length, 1);
  assert.deepEqual(result.review_groups[0].rows.map(row => row.internal_id), ['856', '437']);
  assert.deepEqual(result.rows.map(row => row.code), ['35100-04200', '3510004200']);
  assert.equal(result.review_groups[0].distinct_name_count, 2);
});
test('identical names under a shared code are not different-name conflicts, even with different IDs', () => {
  const result = C.analyze([{ internal_id: '1', name: ' Cụm  bướm ga ', code: 'AB-12' }, { internal_id: '2', name: 'CỤM BƯỚM GA', code: 'AB12' }]);
  assert.equal(result.review_groups.length, 0);
  assert.equal(result.same_name_groups.length, 1);
  assert.equal(result.rows.length, 2);
});
test('same internal ID does not group different codes', () => {
  const result = C.analyze([{ internal_id: '9', name: 'A', code: 'X1' }, { internal_id: '9', name: 'B', code: 'X2' }]);
  assert.equal(result.groups.length, 2);
  assert.equal(result.review_groups.length, 0);
});
test('missing names and codes remain explicit incomplete rows', () => {
  const result = C.analyze([{ name: '', code: 'X1' }, { name: 'A', code: '' }]);
  assert.equal(result.incomplete_rows.length, 2);
  assert.equal(result.groups.length, 0);
});
test('CSV parser handles BOM, quoted commas, quotes and multiline cells', () => {
  const rows = C.parseDelimited('\ufeffinternal_id,name,code\r\n7,"Bộ phận, ""mẫu""\nDòng hai",AB-01\r\n');
  assert.equal(rows[0].name, 'Bộ phận, "mẫu"\nDòng hai');
  assert.equal(rows[0].internal_id, '7');
  assert.equal(rows[0].code, 'AB-01');
});
test('TSV paste and optional columns work', () => {
  const rows = C.parseDelimited('name\tcode\nCụm bướm ga\t35100-04200');
  assert.equal(rows.length, 1);
  assert.equal(rows[0].internal_id, '');
});
test('malformed or ambiguous CSV is rejected with useful errors', () => {
  assert.throws(() => C.parseDelimited('name,code\n"unterminated,AB'), /ngoặc kép/);
  assert.throws(() => C.parseDelimited('name,code\n"closed"x,AB'), /ngoặc kép/);
  assert.throws(() => C.parseDelimited('name,name,code\nA,B,C'), /trùng/);
  assert.throws(() => C.parseDelimited('name\nA'), /name và code/);
  assert.throws(() => C.parseDelimited('name,code\nA,B,C'), /nhiều ô/);
});
test('export preserves separate rows and uses UTF-8 BOM for Vietnamese spreadsheets', () => {
  const csv = C.exportCsv(C.analyze(C.SAMPLE_ROWS));
  assert.ok(csv.startsWith('\ufeff'));
  assert.equal(C.parseDelimited(csv).length, 2);
  assert.ok(csv.includes('Cần đối chiếu'));
});
test('CSV export neutralizes formula-like cells including leading whitespace', () => {
  for (const value of ['=1+1', '+SUM(A1)', '-1+2', '@SUM(A1)', '  =1+1', '\tvalue']) assert.ok(C.csvCell(value).startsWith('"\''));
  assert.equal(C.csvCell('35100-04200'), '"35100-04200"');
  assert.equal(C.csvCell('A "quoted" name'), '"A ""quoted"" name"');
});
test('untrusted names remain plain strings and dangerous source links are rejected', () => {
  const value = '<img src=x onerror=alert(1)>';
  const result = C.analyze([{ name: value, code: 'A' }, { name: 'B', code: 'A' }]);
  assert.equal(result.rows[0].name, value);
  assert.equal(C.safeSourceUrl('javascript:alert(1)'), null);
  assert.equal(C.safeSourceUrl('data:text/html,<script>alert(1)</script>'), null);
  assert.equal(C.safeSourceUrl('https://name:password@example.com/'), null);
  assert.equal(C.safeSourceUrl(C.SAMPLE_ROWS[0].source_url), C.SAMPLE_ROWS[0].source_url);
});
test('limits prevent an accidental huge import and sample copy is independently analyzable', () => {
  assert.throws(() => C.analyze(Array(2001).fill({ name: 'A', code: '1' })), /2.000/);
  assert.throws(() => C.parseDelimited('x'.repeat(2 * 1024 * 1024 + 1)), /2 MB/);
  assert.equal(C.analyze(C.parseDelimited(C.sampleCsv())).review_groups.length, 1);
});
