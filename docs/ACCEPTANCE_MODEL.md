# Acceptance model

## States

- `PASS` — a required gate is satisfied and has a non-empty evidence reference.
- `FAIL` — inspected evidence demonstrates that a required gate is not met.
- `BLOCKED` — the gate cannot be decided, or an asserted pass has no evidence.
- `NOT_APPLICABLE` — an optional gate does not apply and includes a reason.

Unknown states are rejected. Duplicate gate IDs are rejected. A required gate
cannot use `NOT_APPLICABLE` to bypass the release decision.

## Release decision

1. Any required `FAIL` produces release `FAIL`.
2. Otherwise, any required `BLOCKED` produces release `BLOCKED`.
3. Otherwise, all required gates are evidenced `PASS`, so the release is `PASS`.

`data/release-08.json` has four evidenced passes and one blocked performance
gate. The expected and observed release state is therefore `BLOCKED`.

## Rollback boundary

The fictional fixture treats a rollback plan as a required evidenced gate. A
real release record would need the deployed version, owner, trigger condition,
rollback command or procedure, data-compatibility constraint, and verification
after rollback. This repository documents that contract but does not deploy or
roll back any system.

## Verification

```bash
npm run test:unit
npm run release:verify
```

The unit suite covers successful gates, failure precedence, missing evidence,
optional non-applicability, unknown statuses, duplicate IDs, and the committed
fixture's blocked result.
