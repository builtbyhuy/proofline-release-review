# 120-second demo script

## 0:00–0:20 — Problem

Open the live interface. Explain that Proofline makes the missing release gate
visible instead of turning a partial review into a vague green status. Point to
the always-visible fictional independent-sample label.

## 0:20–0:45 — Ready state

Show the acceptance queue and the 4/5 decision. The performance artifact is
missing, so the displayed decision is conditional rather than “ready.”

## 0:45–1:10 — Failure and recovery

Switch to Error. Explain that the last synchronized snapshot remains visible in
the copy. Keyboard-focus the retry button, activate it, and show focus moving to
the visible Loading control while the polite status announces the new state.

## 1:10–1:35 — Executable acceptance model

Run:

```bash
npm run release:verify
```

Show four passed required gates, one blocking gate ID, and observed state
`BLOCKED`. Explain that a `PASS` without evidence is converted to `BLOCKED`.

## 1:35–1:55 — Verification

Run:

```bash
npm run verify
```

Point out unit semantics, local-link/offline contracts, real browser state and
focus checks, and the 390px overflow check.

## 1:55–2:00 — Limitation

State that this is a static fictional proof—not a release backend, production
deployment, client result, or measured 10k-row performance claim.
