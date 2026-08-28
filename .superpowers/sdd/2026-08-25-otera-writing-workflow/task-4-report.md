# Task 4 — Frontend-only rich text review editor

## Commit

- `5068013 feat: add writing review editor`
- Base supplied for this task: `7a3c1b2`

## Delivered files

- `src/components/writing/RichTextEditor.jsx` — browser-native, local rich-text surface; formatting toolbar; plain-text paste; link validation; selection-state handling.
- `src/components/writing/CoveragePanel.jsx` — static read-only Otera coverage and review criteria.
- `src/components/writing/ReviewStep.jsx` — article editor and coverage grid, wired to `set-article-html`.
- `src/writing.css` — review grid, sticky toolbar/coverage panel, responsive stacking, editor typography, table, link, blockquote, focus, and token styling.
- `tests/writing.test.mjs` — review SSR composition contract.

## TDD evidence

### RED

Added `review screen renders an editable article toolbar and read-only coverage` before production files existed. Ran:

```text
node --test --test-name-pattern="review screen" tests/writing.test.mjs
```

It failed as intended with Vite `ERR_LOAD_URL`: `ReviewStep.jsx` did not exist.

### GREEN

Implemented the three scoped components and CSS, then reran the focused command. It passed: 1 matching test passed, 0 failed (11 non-matching tests skipped).

## Full verification

Fresh verification after the final refactor:

```text
npm test            20 passed, 0 failed
npm run build       passed; Sites build prepared
npm run test:sites  4 passed, 0 failed
git diff --check    passed with no output
```

The production build reports the repository's existing Rollup chunk-size advisory for a minified JavaScript chunk over 500 kB; it is a warning, not a build failure.

## Accessibility and interaction self-review

- The editable surface uses `role="textbox"`, `aria-multiline="true"`, and the persistent name `Article editor`.
- Every toolbar control has the required accessible name. Formatting controls expose `aria-pressed` from `queryCommandState` for bold, italic, underline, bulleted list, and numbered list.
- `selectionchange` listener setup is guarded for SSR and is removed in the effect cleanup.
- Toolbar commands refocus the content-editable surface before executing browser-native commands. The link prompt uses the exact `Enter an https:// URL` copy and calls `createLink` only after `normalizeEditorLink()` accepts an HTTP(S) URL.
- Pasted clipboard content is normalized to plain text before `insertText`, so pasted markup is not imported.
- Browser-only `document` and `window` paths are guarded around mount-time/editor command behavior; SSR renders the static editor shell safely.
- The toolbar, select, and editor surface have visible token-based focus treatment. The narrow layout wraps the toolbar and stacks Coverage beneath the editor.

## Scope review

- No editor framework or dependencies added.
- No backend, persistence, AI calls, save action, dynamic coverage analysis, highlight/annotation/training UI, or status UI added.
- `dangerouslySetInnerHTML` is used only for the local trusted article fixture/user-edit value in the content-editable surface; static labels use normal React children.
- Existing Context, Workflow, Brief, Outline, and Draft code were not changed. App integration is intentionally left to Task 5.
- User-owned unstaged changes in `README.md` and `src/components/CollectionHeader.jsx` were preserved and were not staged or committed. `node_modules/` remains untracked and unstaged.

## Deviations

- None. The coverage panel is also sticky on wide screens, aligning with the broader approved design specification while retaining its required static/read-only behavior.

## Fix round 1 — contentEditable lifecycle

### Root cause

`RichTextEditor` supplied a newly constructed `dangerouslySetInnerHTML` object from the current `value` prop on every render. A parent echo after `onInput`, or a toolbar-state render after `selectionchange`, could therefore cause React to replace the editable DOM. Replacing that DOM risks losing the caret, native text nodes, and browser undo history mid-edit.

### Regression evidence

Added the deterministic test `editor value synchronization preserves matching DOM and applies external changes`. It uses the production synchronization boundary with a write-counting editor object: a matching local HTML value must perform zero writes, while a genuinely changed external value must write once.

The focused RED run failed as intended because `synchronizeEditorValue` was not exported:

```text
TypeError: synchronizeEditorValue is not a function
```

After the lifecycle fix, the focused synchronization test and existing review SSR test each passed.

### Fix

- The editor now seeds `dangerouslySetInnerHTML` once from a stable `useRef` object.
- `synchronizeEditorValue()` runs in an effect for incoming values and writes only when `editor.innerHTML !== value`; a parent echo of the current local input is therefore a no-op.
- The selection-command setter returns the previous state object when all command states are unchanged, avoiding needless React renders.
- This does not add dependencies, persistence, backend behavior, or browser automation. The end-to-end typing/undo/redo interaction check remains intentionally deferred to Task 6, once Review is reachable.

### Verification

```text
Focused sync regression: passed
Focused review SSR: passed
npm test: 21 passed, 0 failed
npm run build: passed (existing chunk-size advisory only)
npm run test:sites: 4 passed, 0 failed
git diff --check: passed with no output
```
