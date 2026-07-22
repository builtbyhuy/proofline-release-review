const assert = require("node:assert/strict");
const test = require("node:test");

const fixture = require("../../data/release-08.json");
const { evaluateRelease } = require("../../acceptance.js");


test("release 08 remains blocked by the missing performance artifact", () => {
  const result = evaluateRelease(fixture.gates);

  assert.equal(result.state, fixture.expected_state);
  assert.equal(result.state, "BLOCKED");
  assert.equal(result.passed, 4);
  assert.deepEqual(result.blockingGateIds, ["performance"]);
});
