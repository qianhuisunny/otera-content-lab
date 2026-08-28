# Task 6 — Review editor link composer fix

## Problem and root cause

In the Codex in-app Browser, the Review editor's `Add link` control called `window.prompt`, which throws `Error: prompt() is not supported`. The error made a visible core editor control unusable and added a console error.

## Fix

- Replaced the browser prompt with a local, in-editor URL composer; it is closed by default, so the normal Review screenshot state is unchanged.
- The Add link trigger exposes `aria-expanded` and `aria-controls`; the composer is a labeled dialog with URL input, Apply link, Cancel, inline error messaging, visible focus styles, and Escape handling.
- A selection range within the content-editable article is cloned on the link trigger's mouse-down before focus moves to the URL field. A valid submit restores that range, then invokes the existing native `createLink` path. Cancel and Escape restore the selection and refocus the editor.
- The existing `normalizeEditorLink()` allowlist handles validation. Invalid entries display `Enter a valid http(s) URL.` and return before `createLink` runs. `noValidate` ensures invalid values reach this inline validation instead of browser-native form blocking.
- No dependencies, persistence, backend calls, saving, highlights, annotations, training UI, or AI behavior were added.

## TDD evidence

Added focused tests before production changes:

- `link composer is closed by default and exposes an accessible trigger`
- `link selection helpers retain in-editor ranges and restore cloned ranges`

The RED run failed as intended: the old Add link button had no `aria-controls` / `aria-expanded` state and `captureEditorSelection` was not exported. After implementation, the focused test command passed with both matching tests green.

## Verification

```text
Focused link composer/selection tests: 2 passed, 0 failed
npm test: 30 passed, 0 failed
npm run build: passed (existing chunk-size advisory only)
npm run test:sites: 4 passed, 0 failed
git diff --check: passed with no output
```

Browser typing, native undo/redo, and live link application will be re-verified by the controller after this commit, per the task direction.

## Scope

Committed files are limited to the Review editor implementation, Review CSS, writing tests, and this report. User-owned `README.md` and `src/components/CollectionHeader.jsx` changes, untracked `node_modules`, and unrelated workflow/hosting/content files remain untouched.
