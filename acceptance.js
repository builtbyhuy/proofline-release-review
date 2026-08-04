"use strict";

const ALLOWED_STATUSES = new Set(["PASS", "FAIL", "BLOCKED", "NOT_APPLICABLE"]);

function evaluateRelease(gates) {
  if (!Array.isArray(gates) || gates.length === 0) {
    throw new TypeError("gates must be a non-empty array");
  }

  const seenIds = new Set();
  const normalized = gates.map((gate) => {
    if (!gate || typeof gate !== "object") {
      throw new TypeError("each gate must be an object");
    }
    if (typeof gate.id !== "string" || gate.id.trim() === "") {
      throw new TypeError("each gate requires an id");
    }
    if (seenIds.has(gate.id)) {
      throw new Error(`duplicate gate id: ${gate.id}`);
    }
    seenIds.add(gate.id);
    if (!ALLOWED_STATUSES.has(gate.status)) {
      throw new Error(`unsupported gate status: ${gate.status}`);
    }

    const result = {
      id: gate.id,
      label: gate.label || gate.id,
      required: gate.required !== false,
      status: gate.status,
      evidence: typeof gate.evidence === "string" ? gate.evidence.trim() : "",
      reason: typeof gate.reason === "string" ? gate.reason.trim() : "",
    };

    if (result.status === "PASS" && result.evidence === "") {
      result.status = "BLOCKED";
      result.reason = "missing_evidence";
    }
    if (result.status === "NOT_APPLICABLE" && result.reason === "") {
      result.status = "BLOCKED";
      result.reason = "not_applicable_reason_required";
    }
    if (result.required && result.status === "NOT_APPLICABLE") {
      result.status = "BLOCKED";
      result.reason = "required_gate_cannot_be_not_applicable";
    }
    return result;
  });

  const required = normalized.filter((gate) => gate.required);
  const blocking = required.filter((gate) => ["FAIL", "BLOCKED"].includes(gate.status));
  let state = "PASS";
  if (required.some((gate) => gate.status === "FAIL")) {
    state = "FAIL";
  } else if (required.some((gate) => gate.status === "BLOCKED")) {
    state = "BLOCKED";
  }

  return {
    state,
    gates: normalized,
    totalRequired: required.length,
    passed: required.filter((gate) => gate.status === "PASS").length,
    notApplicable: normalized.filter((gate) => gate.status === "NOT_APPLICABLE").length,
    blockingGateIds: blocking.map((gate) => gate.id),
  };
}

module.exports = { ALLOWED_STATUSES, evaluateRelease };
