# Retell multi-company Content Lab — implementation plan

**Goal:** Keep the existing Otera library intact, add the researched Retell library, and make company selection independent from the existing Context / Workflow tabs.

**Visual target:** Existing Content Lab composition plus the user's 2026-08-25 reference screens. Reuse only registered `@qianhui/ui` components and `--qh-*` tokens. Use the registered `SegmentedControl` for the two-company switcher; no new design-system component is needed.

**Preservation contract:** `content/otera/**` and `src/data/oteraArtifacts.js` remain byte-identical to branch point `a70aa89`.

## Task 1 — Finish and verify Retell content artifacts

- Produce raw Audience output, decision record, gap matrix, ICP context, persona index and seven evidence-derived dossiers.
- Reconcile the four canonical runs into a report source and claim ledger.
- Verify direct links, uncertainty labels, exact persona decisions, patch hygiene and Otera hashes.
- Commit research before UI changes.

## Task 2 — RED: define multi-company behavior in tests

Update `tests/content.test.mjs` first. Each test names a user-visible break:

1. A Retell catalog exists with twelve nonempty local artifacts and seven dossiers.
2. Otera still has exactly its original ten artifacts and exact content hashes.
3. Company-group filtering includes company, founder and market context but excludes ICP/personas.
4. Retell local Markdown links route to the visible Retell cards.
5. The app exposes an independent, registered two-company switcher while retaining only Context and Workflow as view tabs.
6. Retell header/sidebar/evidence copy is derived from selected-company metadata rather than Otera literals.

Run the focused test file and confirm failure because Retell data/modules/props do not yet exist.

## Task 3 — GREEN: add the Retell catalog and company model

Create:

- `src/data/retellArtifactDefinitions.js`
- `src/data/retellArtifacts.js`
- `src/data/companyCatalog.js`

Requirements:

- Import all twelve Retell Markdown files as raw content.
- Compute real line counts from content.
- Keep stable generic card IDs inside the selected-company page.
- Define per-company label, initials, subtitle, intro, sections, cutoff and evidence copy.
- Do not modify the Otera snapshot module.

Run the focused tests until the data/filter/link tests pass.

## Task 4 — GREEN: wire company switching through existing UI

Modify:

- `src/App.jsx`
- `src/components/AppSidebar.jsx`
- `src/components/CollectionHeader.jsx`
- `src/components/EvidencePanel.jsx`
- `src/data/artifactUtils.js`
- `src/styles.css`

Behavior:

- Default to Otera.
- Render the registered `SegmentedControl` in the top bar with Otera and Retell AI.
- Keep company switching separate from the `Context / Workflow` tablist.
- Reset artifact filter and expanded cards on company change.
- Make identity, title, counts, sections, cutoff and evidence copy company-specific.
- Preserve shared Workflow content.
- Use only `@qianhui/ui` primitives, Phosphor icons already in the project and `--qh-*` tokens.
- Keep wide desktop use, responsive horizontal controls and accessible keyboard/focus behavior.

Run the focused tests, then the full suite.

## Task 5 — Reconcile and verify

- Run `npm test`, `npm run build`, `npm run test:sites`, `git diff --check` and Otera preservation checks.
- Start a separate preview for this worktree without replacing the user's main Otera preview.
- In the in-app browser, test Otera ↔ Retell, Context ↔ Workflow, filters and one expanded dossier.
- Capture desktop and narrow states and check the console.
- Compare the built UI with the existing Content Lab visual reference and workflow screenshot; write project-root `design-qa.md` with comparison history and `final result: passed` only when no P0/P1/P2 remains.
- Keep the verified preview open.
