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

After the minimal integration and token-based layout were implemented, `npm test` passed all 24 tests with zero failures. The new checks exercise each routed screen, the initial integrated App shell, active/completed/locked/disabled sidebar output, and the top bar's Exit callback.

## Independent review

A read-only reviewer inspected the Task 5 working-tree diff against the brief, design specification, implementation plan, current-state adaptation, and protected-file constraints. It reported no Critical, Important, or Minor issues and assessed the change as ready to commit.

## Fresh final verification

```text
npm test            24 passed, 0 failed
npm run build       passed; 4,856 modules transformed; Sites build prepared
npm run test:sites  4 passed, 0 failed
git diff --check    passed with no output
```

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
- No prior writing screen or fixture/data module was changed.
- Protected user changes in `README.md` and `src/components/CollectionHeader.jsx` remain unstaged. `node_modules/` remains untracked and unstaged.
- No file under `content/otera`, `vendor`, or `.openai/hosting.json` was modified or staged.

## Deviations

- No product-scope deviation. The only adaptation was reusing the temporary reducer, third tab, and stylesheet import already present at the supplied base.
