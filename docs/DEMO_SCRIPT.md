# 120-second demo script

## 0:00–0:18 — Problem and reviewer

Open the live interface. Explain that Proofline makes the missing release gate
visible instead of turning a partial review into a vague green status. Point to
the always-visible fictional independent-sample label and name the intended
reviewer: an engineering manager, delivery owner, or release lead.

## 0:18–0:35 — Architecture in one view

Show the README diagram: fictional gate records → validation → pure acceptance
evaluator → `FAIL`, `BLOCKED`, or `PASS`, with counts and gate IDs returned for
traceability. State that the browser is a separate static view of that contract.

## 0:35–0:55 — Ready state

Show the acceptance queue and the 4/5 decision. The performance artifact is
missing, so the displayed decision is conditional rather than “ready.”

## 0:55–1:15 — Failure and recovery

Switch to Error. Explain that the last synchronized snapshot remains visible in
the copy. Keyboard-focus the retry button, activate it, and show focus moving to
the visible Loading control while the polite status announces the new state.

## 1:15–1:35 — Executable acceptance model

Run:

```bash
npm run release:verify
```

Show four passed required gates, one blocking gate ID, and observed state
`BLOCKED`. Explain that a `PASS` without evidence is converted to `BLOCKED`.

## 1:35–1:50 — Verification

Run:

```bash
npm run verify
```

Point out unit semantics, local-link/offline contracts, real browser state and
focus checks, and the 390px overflow check.

## 1:50–2:00 — Limitation and CTA

State that this is a static fictional proof—not a release backend, production
deployment, client result, or measured 10k-row performance claim. Offer a bounded
release-evidence review and ask for one unresolved gate plus its acceptance rule.
