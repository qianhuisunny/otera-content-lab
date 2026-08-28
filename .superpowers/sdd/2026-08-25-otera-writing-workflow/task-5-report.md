# Task 5 — Integrated Otera writing workflow

## Commit

- Requested message: `feat: integrate Otera writing workflow`
- Base supplied for this task: `cd01195`
- Final commit SHA is reported in the task handoff because a commit cannot contain its own SHA.

## Delivered integration

- `src/App.jsx` — preserves the existing lazy App-level writing reducer, conditionally swaps in the Writing top bar, routes the Writing view through the full workspace, passes explicit step actions to the sidebar, and applies the writing-only main layout without changing Context or Workflow composition.
- `src/components/AppSidebar.jsx` — preserves the three-tab roving keyboard behavior and mounts nested Writing phases only in the Writing view.
- `src/components/writing/WritingSidebar.jsx` — renders the three approved phases and all nested steps with active, completed-history, locked, and fixture-disabled states; implemented unlocked steps navigate through `go-to-step`.
- `src/components/writing/WritingTopbar.jsx` — renders Exit, the approved Otera article title, `OT-18`, and `STATUS: Reviewing`; Exit delegates to App, which returns to Workflow.
- `src/components/writing/WritingWorkspace.jsx` — maps the session's Brief, Outline, Draft, and Review states to the prior screen components with the exact reducer actions required by the plan.
- `src/styles.css` — adds only the shared `.content-library.writing-main` shell override.
- `src/writing.css` — adds the writing top bar, phase/sidebar states, focus treatment, fixed shell geometry, sticky editor offsets, and responsive two-row navigation.
- `tests/content.test.mjs` — replaces the obsolete Brief-only checkpoint with the full initial Writing workspace-shell contract while retaining the existing Context, Workflow, and three-tab assertions.
- `tests/writing.test.mjs` — covers all four workspace routes, sidebar state semantics, top-bar scenario content, and Exit delegation.

`src/main.jsx` already imported `writing.css` after `styles.css` at the supplied base, so Task 5 reused that integration and did not create a duplicate import. The existing App-level reducer and third primary tab were likewise adapted rather than duplicated.

## TDD evidence

### RED

The full shell and integration assertions were written before the three integration components existed. The first `npm test` run preserved 20 passing prior tests and produced four expected failures:

- the App Writing-shell test could not find `Exit` in the temporary Brief-only composition;
- Vite could not load `WritingWorkspace.jsx`;
- Vite could not load `WritingSidebar.jsx`;
- Vite could not load `WritingTopbar.jsx`.

### GREEN

After the minimal integration and token-based layout were implemented, `npm test` passed all 24 tests with zero failures in the shared worktree. That result includes the protected, user-owned, unstaged `CollectionHeader.jsx` change; it is not a clean-commit result. The new checks exercise each routed screen, the initial integrated App shell, active/completed/locked/disabled sidebar output, and the top bar's Exit callback.

## Independent review

An initial read-only reviewer inspected the Task 5 working-tree diff against the brief, design specification, implementation plan, current-state adaptation, and protected-file constraints. It reported no issues. A later controller review found the focus-transfer and verification-provenance gaps documented in Fix round 1 below.

## Original Task 5 verification provenance

### Shared worktree

```text
npm test            24 passed, 0 failed
npm run build       passed; 4,856 modules transformed; Sites build prepared
npm run test:sites  4 passed, 0 failed
git diff --check    passed with no output
```

### Clean committed artifacts

The shared-worktree full-suite result above depends on the protected unstaged `src/components/CollectionHeader.jsx` change and must not be attributed to commit `8137995` alone.

- A controller independently verified clean archives at base `cd01195` and Task 5 head `8137995`. The base passed 20 of 21 tests; `8137995` passed 23 of 24 tests.
- This task reproduced the `8137995` clean-archive result. The sole failure is the identical pre-existing Context test, `the collection chrome keeps the user-requested clutter out of the initial page`, because committed `CollectionHeader.jsx` still renders `Agentic operations`.
- The clean failure exists at the supplied base and remains unchanged by Task 5. The protected `CollectionHeader.jsx` change makes that unrelated assertion pass in the shared worktree, but it is intentionally not copied, modified, staged, or committed here.

The production build emits the repository's existing Rollup advisory for a minified JavaScript chunk over 500 kB. It remains a warning and does not fail the build.

## Accessibility and state review

- The existing primary tabs retain their IDs, `aria-controls`, roving `tabIndex`, and Left/Right/Up/Down/Home/End behavior.
- Writing workflow navigation is outside the primary tablist and has its own labeled landmark.
- The active step uses `aria-current="step"`; locked and unavailable steps use native `disabled`; completed/current/locked/available state is present as text in addition to styling.
- Active and completed markers use aria-hidden Phosphor `Circle` and `Check` icons. Every Writing step and Exit has visible token-based focus treatment.
- Completion uses valid implemented indices below `furthestStepIndex`, with the active state taking precedence, so completion history survives backward navigation.
- The reducer remains mounted in App, preserving Brief, Outline, and article edits across top-level view switches.

## Scope review

- No dependency, route, backend, persistence, save, AI call, dynamic coverage, highlighting, annotation, training, or publishing behavior was added.
- Context and Workflow rendering remain unchanged; `WorkflowView.jsx` was not modified.
- No writing fixture/data module was changed. Fix round 1 changes only the shared writing page heading needed for explicit focus transfer.
- Protected user changes in `README.md` and `src/components/CollectionHeader.jsx` remain unstaged. `node_modules/` remains untracked and unstaged.
- No file under `content/otera`, `vendor`, or `.openai/hosting.json` was modified or staged.

## Deviations

- No product-scope deviation. The only adaptation was reusing the temporary reducer, third tab, and stylesheet import already present at the supplied base.

## Fix round 1 — focus continuity and narrow active-step visibility

### Root cause

- Brief, Outline, and Draft actions unmount the focused control as the next screen renders, but `WritingWorkspace` did not observe step transitions or provide a programmatically focusable destination.
- Writing Exit unmounts the top bar, while the persistent primary navigation did not observe the Writing-to-destination transition.
- The sub-`56rem` workflow navigation was horizontally scrollable, but it did not retain a reference to the active step or bring that step into view.

### Regression evidence

Four deterministic tests were written before the fixes. They failed for the intended reasons: the screen `h1` lacked `tabIndex="-1"`, and the three transition helpers did not exist. The tests cover:

- a programmatically focusable writing-screen heading;
- heading focus after a real step change, with no focus on ordinary initial rendering;
- primary-tab focus only when leaving Writing;
- active-step scrolling only when the `56rem` media query matches, with an SSR-safe viewport guard.

### Fix

- `WritingPageHeader` marks its `h1` as the programmatic focus destination and gives it token-based focus treatment.
- `WritingWorkspace` tracks the previous step and focuses the newly rendered heading only when the step value changes.
- `AppSidebar` tracks the previous top-level view and focuses the selected primary tab only when leaving Writing, including Exit to Workflow.
- `WritingSidebar` tracks the active step and uses `scrollIntoView({ block: "nearest", inline: "nearest" })` only in the narrow navigator.
- The writing SSR tests share one lifecycle-scoped Vite server with an isolated temporary cache, preventing server teardown or a parallel test file from cancelling a later module transform.

### Shared-worktree verification

```text
node --test tests/writing.test.mjs  20 passed, 0 failed
npm test                            28 passed, 0 failed
npm run build                       passed; Sites build prepared
npm run test:sites                  4 passed, 0 failed
git diff --check                    passed with no output
```

### Clean fix-head verification

A clean archive containing committed files only produced the following results:

```text
node --test tests/writing.test.mjs  20 passed, 0 failed
npm run build                       passed; Sites build prepared
npm run test:sites                  4 passed, 0 failed
npm test                            27 passed, 1 failed
```

The sole full-suite failure is the same inherited Context-header assertion documented above: committed `CollectionHeader.jsx` renders `Agentic operations`. All 20 writing tests pass in the clean archive, and the protected user-owned fix remains outside this commit.

The full live-browser focus journey remains intentionally assigned to Task 6; this round adds deterministic logic and SSR coverage without introducing a browser-test dependency.
