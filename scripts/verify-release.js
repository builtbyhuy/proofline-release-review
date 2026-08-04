#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { evaluateRelease } = require("../acceptance.js");

const fixturePath = path.resolve(__dirname, "..", "data", "release-08.json");
const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
const result = evaluateRelease(fixture.gates);
const report = {
  releaseId: fixture.release_id,
  expectedState: fixture.expected_state,
  observedState: result.state,
  passedRequiredGates: result.passed,
  totalRequiredGates: result.totalRequired,
  blockingGateIds: result.blockingGateIds,
  truthBoundary: fixture.truth_boundary,
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
process.exitCode = result.state === fixture.expected_state ? 0 : 1;
