# Otera Content Lab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new responsive React/Vite repository that presents all ten Otera context artifacts on one searchable, filterable, expandable page.

**Architecture:** A Product Design Vite prototype imports a repository-local packed snapshot of `@qianhui/ui` for tokens and reusable primitives. Exact Markdown snapshots live inside the repository and are imported as raw strings into a typed metadata manifest; React renders summaries immediately and full GitHub-flavored Markdown on expansion.

**Tech Stack:** React 19, Vite, `@qianhui/ui`, React Markdown, remark-gfm, Phosphor Icons, Node's built-in test runner, plain CSS.

**Spec:** `docs/superpowers/specs/2026-08-25-otera-content-lab-design.md`

## Global Constraints

- Match `/Users/qianhuisun/Desktop/Screenshot 2026-08-25 at 11.05.42 AM.png` as the visual target.
- Consume the compiled `../UI-library` through the repository-local `vendor/qianhui-ui-0.1.0.tgz` package snapshot; do not edit or rebuild the dirty UI-library worktree.
- Import `@qianhui/ui/styles.css` and use existing `--qh-*` tokens for all visual styling.
- Reuse `Button`, `SegmentedControl`, and `StatCard`; add only app-local compositions that the library does not expose.
- Include exactly the ten Otera-specific Markdown artifacts named in the spec; do not include generic research prompt templates.
- Do not add approval, review, publishing, versioning, authentication, backend, or persistence flows.
- Use Phosphor Icons; do not hand-draw SVG, CSS icons, or emoji substitutes.
- Preserve exact source Markdown and distinguish company/customer claims, external evidence, and researcher inference.
- Keep the app single-page and responsive.

---

### Task 1: Repository foundation and exact content snapshot

**Files:**
- Create: `AGENTS.md`
- Create: `package.json`
- Create: `vite.config.mjs`
- Create: `src/main.jsx`
- Create: `content/otera/*.md`
- Create: `vendor/qianhui-ui-0.1.0.tgz`
- Preserve: `worker/index.js`
- Preserve: `scripts/prepare-sites-build.mjs`
- Preserve: `tests/sites-worker.test.mjs`

**Interfaces:**
- Consumes: Product Design `prototype` template and ten source Markdown files listed in the spec.
- Produces: a runnable repository with exact local content snapshots and a reproducible packed dependency on `@qianhui/ui`.

- [ ] **Step 1: Bootstrap the Product Design web prototype**

Run the required bootstrap script with `--dest` pointing at the absolute `content-lab` path. Preserve its Sites-ready worker, build script, and test.

- [ ] **Step 2: Record durable project instructions**

Append the user's explicit constraints to `AGENTS.md`: reuse Storybook components, use existing tokens, compose existing components, add only missing app-local components in the Sana-inspired language, and do not add approval/checking product flows.

- [ ] **Step 3: Copy exact Otera Markdown snapshots**

Create `content/otera/` and copy the ten source files without modifying their bodies. Use stable filenames:

```text
company-context.md
icp-context.md
persona-index.md
01-economic-buyer.md
02-executive-champion.md
03-functional-champion.md
04-technical-evaluator.md
05-risk-and-approval-gate.md
06-operational-user.md
07-transformation-partner.md
```

- [ ] **Step 4: Add dependencies and scripts**

Pack the existing compiled `@qianhui/ui` package into `vendor/qianhui-ui-0.1.0.tgz` without rebuilding the dirty library. Install the packed dependency, `@phosphor-icons/react`, `react-markdown`, and `remark-gfm`. Use Node's built-in test runner so the repository does not require a second browser/test toolchain. Add scripts:

```json
{
  "test": "node --test tests/content.test.mjs",
  "test:sites": "node --test tests/sites-worker.test.mjs"
}
```

- [ ] **Step 5: Install and smoke-test the generated starter**

Run `npm install --prefer-offline --no-audit --no-fund` and `npm run build`. Expect exit code 0 and `dist/client/index.html`.

- [ ] **Step 6: Commit**

```bash
git add AGENTS.md package.json package-lock.json vite.config.mjs src content vendor worker scripts tests index.html
git commit -m "chore: scaffold Otera content lab"
```

### Task 2: Artifact manifest, integrity, search, and filtering

**Files:**
- Create: `src/data/artifactDefinitions.js`
- Create: `src/data/artifactUtils.js`
- Create: `src/data/oteraArtifacts.js`
- Create: `tests/content.test.mjs`

**Interfaces:**
- Consumes: raw Markdown files under `content/otera/`.
- Produces: `ARTIFACT_DEFINITIONS`, `OTERA_ARTIFACTS`, `COLLECTION_STATS`, `filterArtifacts(artifacts, query, type)`, and `normalizeSearchText(parts)`.

- [ ] **Step 1: Write failing manifest and search tests**

Create `tests/content.test.mjs` with Node's built-in runner. It reads exact content snapshots from disk, imports the pure definitions and utility module, and asserts:

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { ARTIFACT_DEFINITIONS } from "../src/data/artifactDefinitions.js";
import { filterArtifacts } from "../src/data/artifactUtils.js";

test("the manifest contains every exact source artifact once", async () => {
  assert.equal(ARTIFACT_DEFINITIONS.length, 10);
  assert.equal(new Set(ARTIFACT_DEFINITIONS.map((artifact) => artifact.id)).size, 10);
  const contents = await Promise.all(
    ARTIFACT_DEFINITIONS.map((artifact) => readFile(new URL(`../${artifact.contentPath}`, import.meta.url), "utf8")),
  );
  assert.equal(contents.every((content) => content.trim().length > 0), true);
});

test("search is case-insensitive and combines with type", () => {
  const sample = [
    { id: "company", artifactType: "company_context", searchText: "otera allianz claims" },
    { id: "functional-champion", artifactType: "persona_dossier", searchText: "trade finance owner" },
  ];
  assert.deepEqual(filterArtifacts(sample, "ALLIANZ", "all").map(({ id }) => id), ["company"]);
  assert.deepEqual(filterArtifacts(sample, "trade finance", "persona_dossier").map(({ id }) => id), ["functional-champion"]);
  assert.deepEqual(filterArtifacts(sample, "no-such-result", "all"), []);
});
```

- [ ] **Step 2: Run the tests and verify RED**

Run `npm test`. Expect failure because `src/data/artifactDefinitions.js` and `src/data/artifactUtils.js` do not exist.

- [ ] **Step 3: Implement the manifest and pure filtering functions**

Define all ten metadata records in `artifactDefinitions.js`, implement pure normalization/filter functions in `artifactUtils.js`, then import each Markdown file with `?raw` in `oteraArtifacts.js`, derive `searchText`, and export the named interfaces. Keep all three modules free of React.

- [ ] **Step 4: Run the tests and verify GREEN**

Run `npm test`. Expect two passing tests and no warnings.

- [ ] **Step 5: Commit**

```bash
git add src/data tests/content.test.mjs
git commit -m "feat: add Otera artifact manifest and search"
```

### Task 3: Single-page application shell and artifact interactions

**Files:**
- Create: `src/components/AppSidebar.jsx`
- Create: `src/components/ArtifactCard.jsx`
- Create: `src/components/ArtifactGrid.jsx`
- Create: `src/components/CollectionHeader.jsx`
- Create: `src/components/EvidencePanel.jsx`
- Modify: `src/App.jsx`
- Modify: `src/main.jsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `OTERA_ARTIFACTS`, `COLLECTION_STATS`, and `filterArtifacts` from Task 2; `Button`, `SegmentedControl`, and `StatCard` from `@qianhui/ui`.
- Produces: a single-page application with search, type filtering, per-card expansion, expand-all, collapse-all, empty state reset, and anchor navigation.

- [ ] **Step 1: Verify the starter does not satisfy the browser acceptance scenario**

Start the blank generated app and confirm in the in-app Browser that it has no Otera heading, artifact cards, search, filters, or expansion controls. This is the RED state for the visible feature.

- [ ] **Step 2: Implement the smallest accessible component composition**

Implement the named components, use React state for query, filter, and expanded artifact IDs, and render full content through `ReactMarkdown` with `remarkGfm`. External links use `target="_blank"` and `rel="noreferrer"`. Do not add routes.

- [ ] **Step 3: Apply the reference layout using UI tokens**

Implement the 56px header, 216px sidebar, 1144px main content width, 43px desktop padding, 20px two-column grid gap, compact card typography, 10px borders/radii, responsive sidebar-to-anchor transition below 900px, and one-column cards below 720px. Use only `var(--qh-*)` for the core palette, typography, spacing, radii, shadows, and motion.

- [ ] **Step 4: Verify the visible feature in the in-app Browser**

Confirm the ten-artifact summary, live search, type filtering, one-card expansion, expand all, collapse all, empty-state reset, and anchor navigation all work without console errors.

- [ ] **Step 5: Run tests and verify GREEN**

Run `npm test`. Expect the content and manifest tests to pass without warnings.

- [ ] **Step 6: Commit**

```bash
git add src
git commit -m "feat: build searchable Otera context library"
```

### Task 4: Browser verification and visual QA

**Files:**
- Create: `design-qa.md`
- Create: `qa/implementation-desktop-final.jpg`
- Create: `qa/implementation-narrow-final.jpg`
- Modify: app files only when a P0, P1, or P2 issue is found

**Interfaces:**
- Consumes: the rendered app and supplied visual reference.
- Produces: a verified local preview, passing tests/build, and `design-qa.md` with `final result: passed`.

- [ ] **Step 1: Start the local preview**

Run the app on a stable local port with the in-app Browser selected. Keep the server running through handoff.

- [ ] **Step 2: Verify primary interactions in the browser**

Test sidebar anchors, live search, segmented type filters, one-card expansion, expand all, collapse all, empty-state reset, external links, keyboard focus, desktop layout, and narrow responsive layout. Check the browser console for errors.

- [ ] **Step 3: Capture same-state screenshots**

Capture the desktop page at the reference's app-owned width and a representative mobile/narrow state. Save both under `qa/`.

- [ ] **Step 4: Run design QA against the reference**

Open the source screenshot and implementation screenshot together. Compare typography, layout rhythm, colors/tokens, assets/icons, copy, interaction states, responsiveness, and accessibility. Write `design-qa.md`, fix every actionable P0/P1/P2 issue, recapture, and repeat until `final result: passed`.

- [ ] **Step 5: Run fresh completion verification**

Run:

```bash
npm test
npm run build
npm run test:sites
```

Expect all commands to exit 0. Confirm `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json` exist.

- [ ] **Step 6: Commit**

```bash
git add design-qa.md qa src
git commit -m "test: verify Otera content lab experience"
```
