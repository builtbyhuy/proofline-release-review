const assert = require("node:assert/strict");
const test = require("node:test");

const { evaluateRelease } = require("../../acceptance.js");


function gate(id, status, evidence = "evidence/test.txt", extra = {}) {
  return { id, label: id, required: true, status, evidence, ...extra };
}


test("all required gates with evidence produce PASS", () => {
  const result = evaluateRelease([
    gate("functional", "PASS"),
    gate("recovery", "PASS"),
  ]);

  assert.equal(result.state, "PASS");
  assert.equal(result.passed, 2);
  assert.equal(result.totalRequired, 2);
});

test("a failed gate produces FAIL even when another gate is blocked", () => {
  const result = evaluateRelease([
    gate("security", "FAIL"),
    gate("performance", "BLOCKED", "", { reason: "benchmark missing" }),
  ]);

  assert.equal(result.state, "FAIL");
  assert.deepEqual(result.blockingGateIds, ["security", "performance"]);
});

test("missing evidence converts an asserted pass into BLOCKED", () => {
  const result = evaluateRelease([gate("performance", "PASS", "")]);

  assert.equal(result.state, "BLOCKED");
  assert.equal(result.gates[0].status, "BLOCKED");
  assert.equal(result.gates[0].reason, "missing_evidence");
});

test("optional not-applicable gate needs a reason but does not block", () => {
  const result = evaluateRelease([
    gate("functional", "PASS"),
    gate("migration", "NOT_APPLICABLE", "", {
      required: false,
      reason: "no persisted data",
    }),
  ]);

  assert.equal(result.state, "PASS");
  assert.equal(result.notApplicable, 1);
});

test("unknown status is rejected instead of being treated as pass", () => {
  assert.throws(
    () => evaluateRelease([gate("security", "MAYBE")]),
    /unsupported gate status/,
  );
});

test("duplicate gate ids are rejected", () => {
  assert.throws(
    () => evaluateRelease([gate("functional", "PASS"), gate("functional", "PASS")]),
    /duplicate gate id/,
  );
});
