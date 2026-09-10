# Debugging case study: retry hid the focused control

> **Provenance:** Independent technical sample with fictional data. AI assistance was used for the implementation, debugging, regression tests, and this write-up. This is not a report of research with disabled users or a human accessibility audit.

## Reproduction

1. Open `?state=error`.
2. Move keyboard focus to **Retry evidence request**.
3. Activate the button.

The page changed to the loading view, which hid the retry button. Focus did not
move to another visible element. This contradicted the interface's own fictional
“Restore focus after error review” evidence and left keyboard users without a
visible location.

## Root cause

The retry handler called `showState("loading")` and stopped. `showState` updated
visibility, pressed states, and the live-region message, but it did not manage
focus for a control that was about to become hidden.

## Regression test

The Playwright test `error retry moves focus to a visible control` starts in the
error query state, focuses and activates Retry, verifies the loading region is
visible, and asserts the visible Loading state control owns focus. Before the
fix, the assertion failed because focus was inactive.

## Fix

The retry handler now changes state and then focuses the Loading control. Ordinary
state-picker clicks keep their native focus behavior unchanged.

## Remaining risk

This targeted test does not replace a full keyboard and screen-reader audit. A
production application would also need focus restoration after asynchronous
success/failure completion and route changes.
