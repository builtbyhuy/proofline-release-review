# Verification

## Install

```bash
npm ci
npx playwright install chromium
```

## Full proof

```bash
npm run verify
```

This runs:

1. Python source, link, state, offline-asset, and document contracts.
2. Node unit tests for acceptance semantics and the release fixture.
3. The release-state CLI, which must report expected and observed `BLOCKED`.
4. Playwright tests in a real Chromium browser for state transitions, accessible
   announcements, retry focus recovery, truth-label visibility, and mobile
   page-level overflow.

## Manual render check

```bash
python3 -m http.server 8765
```

Review `http://127.0.0.1:8765/` at 1280px desktop and 390px mobile. Also inspect
`?state=error`, activate retry by keyboard, and confirm that focus visibly lands
on Loading.

## Build

There is no compilation step: `index.html` is the deployable artifact. CI tests
the exact checked-in file rather than producing a separate unreviewed bundle.

## Environment configuration

No `.env.example` is included because the implementation reads no environment
variable and has no backend credential boundary.

## Reviewer reproduction and handoff

Reproduce the published proof from the immutable `proof-review-2026-08-04` tag rather than
trusting screenshots or a mutable working tree:

```bash
git clone https://github.com/builtbyhuy/proofline-release-review.git
cd proofline-release-review
git checkout proof-review-2026-08-04
npm ci
npx playwright install chromium
npm run verify
```

The expected result is a green source, unit, release-state, and browser test
run. The release-state command must report both expected and observed
`BLOCKED`: the fictional performance gate deliberately has no evidence. A
`PASS` result for the committed fixture is a regression, not a success.

The handoff surface is deliberately small:

- `index.html` is the deployable static interface.
- `acceptance.js` is the executable decision boundary.
- `data/release-08.json` is the fictional input fixture.
- `scripts/verify-release.js` produces the inspectable decision report.
- `tests/` and `.github/workflows/ci.yml` bind the documented contract to CI.

Before adapting this proof to real delivery, the receiving owner must decide
who owns each gate, which system supplies evidence, whether evidence can expire,
who is allowed to override a decision, and what audit retention is required.
Authentication, persistence, imports, role enforcement, production telemetry,
and deployment control are intentionally absent; they are product decisions,
not hidden capabilities.

Rollback is a static-file rollback: redeploy the preceding known-good commit or
tag. There is no database, migration, secret, queue, or remote side effect to
reverse. This repository is a reviewable work sample, not a production release
controller.
