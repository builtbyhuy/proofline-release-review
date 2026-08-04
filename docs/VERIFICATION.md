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
