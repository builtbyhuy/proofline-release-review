const { spawnSync } = require('node:child_process');
const path = require('node:path');
const checks = [
  ['vhp-catalog-check', 'checker.test.js'],
  ['gotripod-form-qa', 'test.cjs'],
  ['splashsol-intake', 'tests.cjs'],
  ['inventomo-time-preview', 'test.cjs'],
  ['mother-tongue-inbox', 'tests.cjs'],
  ['mastertech-brief', 'tests.cjs'],
  ['facility-link-review', 'tests.mjs'],
  ['lmc-brief-composer', 'test.cjs'],
  ['bms-parsing-review', 'tests.mjs']
];
let failures = 0;
for (const [folder, script] of checks) {
  console.log(`\n${folder}`);
  const result = spawnSync(process.execPath, [script], {
    cwd: path.join(__dirname, folder), encoding: 'utf8'
  });
  process.stdout.write(result.stdout || '');
  process.stderr.write(result.stderr || '');
  if (result.error) console.error(result.error.message);
  if (result.status !== 0) failures++;
}
console.log(`\nSample suites: ${checks.length - failures}/${checks.length} passed.`);
process.exitCode = failures ? 1 : 0;
