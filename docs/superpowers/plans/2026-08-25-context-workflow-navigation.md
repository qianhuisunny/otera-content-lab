# Content Lab Context / Workflow Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Otera sidebar's artifact anchors with working `Context` and `Workflow` views, and render the screenshot's seven workflow items through registered Sana Labs Storybook components.

**Architecture:** `App` keeps the existing Context state and adds one local primary-view state. `AppSidebar` becomes an accessible two-tab selector, while a stateless `WorkflowView` maps static screenshot copy into three `IconGridSection` components imported from `@qianhui/ui`. Scoped app CSS supplies only the sidebar control anatomy, page stacking, and responsive collapse missing from the registered pattern.

**Tech Stack:** React 19, Vite 6, `@qianhui/ui`, `@phosphor-icons/react`, plain token-based CSS, Node's built-in test runner, React server rendering for markup tests.

**Spec:** `docs/superpowers/specs/2026-08-25-context-workflow-navigation-design.md`

## Global Constraints

- Preserve the current uncommitted user-requested changes; never reset, discard, or overwrite unrelated diffs.
- Keep the existing Otera Context content, category filtering, per-artifact expansion, top bar, identity block, avatar, footer, and research cutoff.
- Sidebar navigation contains exactly two text tabs in this order: `Context`, `Workflow`.
- Use the screenshot's exact workflow headings, titles, and descriptions; do not substitute Otera-specific workflow content.
- Import `IconGridSection` from the installed `@qianhui/ui` package. Do not import source files from `../UI-library` and do not edit or rebuild that dirty sibling worktree.
- Use existing `--qh-*` tokens and registered `IconGridSection` / `IconTile` styles. Do not recreate tinted bands, menus, pills, arrows, social artwork, or bespoke workflow cards.
- Use Phosphor icons. Do not add custom SVGs, emoji icons, CSS illustrations, generated artwork, or empty asset stand-ins.
- Keep Workflow tiles presentational. Do not add routes, click actions, persistence, editing, execution, approval, review, publishing, authentication, backend, or analytics behavior.
- Preserve Context filter and expanded-card state when switching views.
- Maintain the existing `16rem` desktop sidebar and responsive horizontal navigation below `56rem`.
- Do not claim visual QA passed without a source-and-implementation side-by-side comparison.

---

### Task 1: Registered workflow catalog

**Files:**
- Create: `src/components/WorkflowView.jsx`
- Modify: `tests/content.test.mjs`

**Interfaces:**
- Consumes: `IconGridSection({ heading, description, items })` from `@qianhui/ui`; Phosphor icon components.
- Produces: `WorkflowView(): JSX.Element`, a stateless component containing three phases and seven registered icon tiles.

- [ ] **Step 1: Add a failing SSR test for the exact screenshot content and registered component boundary**

Append this test to `tests/content.test.mjs`:

```js
test("the workflow view uses registered sections and exact screenshot content", async (t) => {
  const vite = await createServer({
    appType: "custom",
    logLevel: "silent",
    root: new URL("..", import.meta.url).pathname,
    server: { middlewareMode: true },
  });
  t.after(() => vite.close());

  const source = await readFile(
    new URL("../src/components/WorkflowView.jsx", import.meta.url),
    "utf8",
  );
  const { WorkflowView } = await vite.ssrLoadModule("/src/components/WorkflowView.jsx");
  const markup = renderToStaticMarkup(React.createElement(WorkflowView));

  assert.match(source, /import \{ IconGridSection \} from "@qianhui\/ui";/);
  assert.equal((markup.match(/<section/g) ?? []).length, 3);
  assert.equal((markup.match(/class="qh-icon-tile"/g) ?? []).length, 7);

  for (const heading of ["BRIEF", "WRITE", "PUBLISH"]) {
    assert.match(markup, new RegExp(`aria-label="${heading}"`));
  }

  for (const title of [
    "Video Storyboarding Briefing",
    "Blog Article Briefing",
    "Learning Solution Plan",
    "Video Storyboard",
    "Long-Form Blog Article",
    "E-Learning Storyboard",
    "Illustration Creation",
  ]) {
    assert.ok(markup.includes(title), `${title} must be rendered`);
  }

  for (const description of [
    "Define the objective, audience, and creative direction.",
    "Define goals, audience, key messages, and visual style for your video storyboard.",
    "Define topic, angle, audience, keywords, and success metrics for your blog article.",
    "Define learning objectives, audience, content structure, and success metrics.",
    "Turn briefs into structured content and narratives.",
    "Transform your brief into a visual storyboard with scene-by-scene breakdown.",
    "Craft comprehensive, SEO-optimized long-form blog articles.",
    "Design e-learning flows and storyboards for engaging learning experiences.",
    "Finalize and publish content across channels.",
    "Create custom illustrations and social graphics for LinkedIn, Xiaohongshu, and other platforms.",
  ]) {
    assert.ok(markup.includes(description), `${description} must be rendered`);
  }
});
```

- [ ] **Step 2: Run the test and verify the missing component is the failure**

Run:

```bash
npm test
```

Expected: FAIL because `src/components/WorkflowView.jsx` does not exist. Existing five tests should still run or remain unchanged before that module error.

- [ ] **Step 3: Implement the stateless Workflow view with the exact approved data**

Create `src/components/WorkflowView.jsx` with:

```jsx
import {
  Article,
  FileText,
  FilmSlate,
  GraduationCap,
  ImageSquare,
  MonitorPlay,
  VideoCamera,
} from "@phosphor-icons/react";
import { IconGridSection } from "@qianhui/ui";

const iconProps = { size: 24, weight: "regular" };

const workflowPhases = [
  {
    heading: "BRIEF",
    description: "Define the objective, audience, and creative direction.",
    items: [
      {
        icon: <FilmSlate {...iconProps} />,
        name: "Video Storyboarding Briefing",
        description: "Define goals, audience, key messages, and visual style for your video storyboard.",
      },
      {
        icon: <FileText {...iconProps} />,
        name: "Blog Article Briefing",
        description: "Define topic, angle, audience, keywords, and success metrics for your blog article.",
      },
      {
        icon: <GraduationCap {...iconProps} />,
        name: "Learning Solution Plan",
        description: "Define learning objectives, audience, content structure, and success metrics.",
      },
    ],
  },
  {
    heading: "WRITE",
    description: "Turn briefs into structured content and narratives.",
    items: [
      {
        icon: <VideoCamera {...iconProps} />,
        name: "Video Storyboard",
        description: "Transform your brief into a visual storyboard with scene-by-scene breakdown.",
      },
      {
        icon: <Article {...iconProps} />,
        name: "Long-Form Blog Article",
        description: "Craft comprehensive, SEO-optimized long-form blog articles.",
      },
      {
        icon: <MonitorPlay {...iconProps} />,
        name: "E-Learning Storyboard",
        description: "Design e-learning flows and storyboards for engaging learning experiences.",
      },
    ],
  },
  {
    heading: "PUBLISH",
    description: "Finalize and publish content across channels.",
    items: [
      {
        icon: <ImageSquare {...iconProps} />,
        name: "Illustration Creation",
        description: "Create custom illustrations and social graphics for LinkedIn, Xiaohongshu, and other platforms.",
      },
    ],
  },
];

export function WorkflowView() {
  return (
    <div aria-label="Content workflow" className="workflow-view">
      {workflowPhases.map((phase) => (
        <IconGridSection {...phase} key={phase.heading} />
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run the complete content test suite and verify GREEN**

Run:

```bash
npm test
```

Expected: 6 tests pass, 0 fail. The rendered markup contains three registered section surfaces and seven `qh-icon-tile` roots.

- [ ] **Step 5: Commit the workflow catalog without staging unrelated files**

Run:

```bash
git add src/components/WorkflowView.jsx tests/content.test.mjs
git commit -m "feat: add registered workflow catalog"
```

### Task 2: Accessible Context / Workflow view switching

**Files:**
- Modify: `src/App.jsx:1-115`
- Modify: `src/components/AppSidebar.jsx:1-39`
- Modify: `src/styles.css:176-207,769-782`
- Modify: `tests/content.test.mjs`

**Interfaces:**
- Consumes: `WorkflowView()` from Task 1 and the existing Context components/state.
- Produces: `AppSidebar({ activeView, onViewChange, researchCutoff })` and a working `activeView: "context" | "workflow"` state in `App`.

- [ ] **Step 1: Replace the old sidebar SSR test with a failing two-tab contract test**

Replace the existing `the sidebar navigation is text-only and starts with Context` test with:

```js
test("the sidebar exposes only Context and Workflow as accessible view tabs", async (t) => {
  const vite = await createServer({
    appType: "custom",
    logLevel: "silent",
    root: new URL("..", import.meta.url).pathname,
    server: { middlewareMode: true },
  });
  t.after(() => vite.close());

  const { AppSidebar } = await vite.ssrLoadModule("/src/components/AppSidebar.jsx");
  const sidebarMarkup = renderToStaticMarkup(
    React.createElement(AppSidebar, {
      activeView: "context",
      onViewChange: () => {},
      researchCutoff: "2026-08-23",
    }),
  );
  const navigationMarkup = sidebarMarkup.match(/<nav[\s\S]*?<\/nav>/)?.[0] ?? "";

  assert.match(navigationMarkup, /role="tablist"/);
  assert.equal((navigationMarkup.match(/role="tab"/g) ?? []).length, 2);
  assert.ok(navigationMarkup.indexOf("Context") < navigationMarkup.indexOf("Workflow"));
  assert.match(navigationMarkup, /aria-selected="true"/);
  assert.doesNotMatch(navigationMarkup, /<a /);
  assert.doesNotMatch(navigationMarkup, /Company|ICP &amp; market fit|Personas|Evidence notes/);
  assert.doesNotMatch(navigationMarkup, /<svg/);
});
```

Append a default-view assertion:

```js
test("the app defaults to Context while exposing the Workflow tab", async (t) => {
  const vite = await createServer({
    appType: "custom",
    logLevel: "silent",
    root: new URL("..", import.meta.url).pathname,
    server: { middlewareMode: true },
  });
  t.after(() => vite.close());

  const { App } = await vite.ssrLoadModule("/src/App.jsx");
  const pageMarkup = renderToStaticMarkup(React.createElement(App));

  assert.match(pageMarkup, /role="tabpanel"/);
  assert.match(pageMarkup, /Otera context artifacts/);
  assert.match(pageMarkup, />Workflow</);
  assert.doesNotMatch(pageMarkup, /Video Storyboarding Briefing/);
});
```

- [ ] **Step 2: Run the tests and verify the old anchor navigation fails the contract**

Run:

```bash
npm test
```

Expected: FAIL because the current sidebar contains five anchors, no tablist, and `App` has no tabpanel view state.

- [ ] **Step 3: Convert `AppSidebar` to two keyboard-operable text tabs**

Replace `src/components/AppSidebar.jsx` with:

```jsx
import { useRef } from "react";

const viewItems = [
  { id: "context", label: "Context" },
  { id: "workflow", label: "Workflow" },
];

export function AppSidebar({ activeView, onViewChange, researchCutoff }) {
  const tabRefs = useRef([]);

  const handleTabKeyDown = (event, index) => {
    let nextIndex = null;

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + viewItems.length) % viewItems.length;
    } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % viewItems.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = viewItems.length - 1;
    }

    if (nextIndex === null) return;
    event.preventDefault();
    onViewChange(viewItems[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <aside className="app-sidebar" aria-label="Otera content navigation">
      <div className="workspace-identity">
        <span className="workspace-avatar" aria-hidden="true">
          OT
        </span>
        <span>
          <strong>Otera</strong>
          <small>Company context</small>
        </span>
      </div>

      <nav aria-label="Content Lab views">
        <div aria-label="Content Lab views" className="sidebar-nav" role="tablist">
          {viewItems.map((item, index) => {
            const selected = activeView === item.id;
            return (
              <button
                aria-controls="content-library"
                aria-selected={selected}
                id={`${item.id}-tab`}
                key={item.id}
                onClick={() => onViewChange(item.id)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                role="tab"
                tabIndex={selected ? 0 : -1}
                type="button"
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="sidebar-footer">
        <span className="sidebar-status">
          <span aria-hidden="true" />
          Local snapshot
        </span>
        <small>Research cutoff {researchCutoff}</small>
      </div>
    </aside>
  );
}
```

- [ ] **Step 4: Add the primary-view state and conditional main surface to `App`**

Make these focused changes in `src/App.jsx`:

```jsx
import { WorkflowView } from "./components/WorkflowView";
```

At the start of `App`, before the existing filter and expansion state:

```jsx
const [activeView, setActiveView] = useState("context");
```

Pass the controlled state to the sidebar:

```jsx
<AppSidebar
  activeView={activeView}
  onViewChange={setActiveView}
  researchCutoff={COLLECTION_STATS.researchCutoff}
/>
```

Keep one main panel and render Workflow or the unchanged Context surface inside it:

```jsx
<main
  aria-labelledby={`${activeView}-tab`}
  className="content-library"
  id="content-library"
  role="tabpanel"
  tabIndex={-1}
>
  {activeView === "workflow" ? (
    <WorkflowView />
  ) : (
    <>
      <CollectionHeader
        filter={filter}
        onFilterChange={setFilter}
        stats={COLLECTION_STATS}
        visibleCount={visibleArtifacts.length}
      />
      {visibleArtifacts.length ? (
        <div className="artifact-sections">
          {sectionDefinitions.map((section) => (
            <ArtifactGrid
              {...section}
              artifacts={visibleArtifacts.filter((artifact) =>
                section.artifactIds.includes(artifact.id),
              )}
              expandedIds={expandedIds}
              key={section.id}
              onToggle={toggleArtifact}
            />
          ))}
        </div>
      ) : (
        <section className="empty-state" aria-live="polite">
          <Target size={28} weight="regular" aria-hidden="true" />
          <h2>No matching context</h2>
          <p>Try a broader role, workflow, evidence type, or artifact category.</p>
          <Button variant="secondary" size="sm" type="button" onClick={resetFilters}>
            Reset filters
          </Button>
        </section>
      )}
      <EvidencePanel researchCutoff={COLLECTION_STATS.researchCutoff} />
    </>
  )}
</main>
```

Change the skip-link label from `Skip to context library` to `Skip to active content`; keep its `href="#content-library"` target.

- [ ] **Step 5: Convert the existing sidebar anchor styles to tab-button styles**

In `src/styles.css`, replace the `.sidebar-nav a` rules with:

```css
.sidebar-nav button {
  display: flex;
  width: 100%;
  min-height: 2.5rem;
  align-items: center;
  gap: var(--qh-space-3);
  border: 0;
  border-radius: calc(var(--qh-radius-tile) - var(--qh-space-2));
  background: transparent;
  color: var(--qh-color-text-muted);
  padding: var(--qh-space-2) var(--qh-space-3);
  font-size: var(--qh-text-caption);
  font-weight: 560;
  text-align: left;
  cursor: pointer;
  transition:
    background-color var(--qh-motion-fast) var(--qh-ease-standard),
    color var(--qh-motion-fast) var(--qh-ease-standard);
}

.sidebar-nav button[aria-selected="true"],
.sidebar-nav button:hover {
  background: var(--qh-color-control-muted);
  color: var(--qh-color-text);
}

.sidebar-nav button:focus-visible,
.artifact-card:focus-within {
  outline: 3px solid var(--qh-color-focus);
  outline-offset: 2px;
}
```

At the `56rem` breakpoint, replace `.sidebar-nav a` with:

```css
.sidebar-nav button {
  width: auto;
  flex: 0 0 auto;
}
```

- [ ] **Step 6: Run tests and verify the navigation contract is GREEN**

Run:

```bash
npm test
```

Expected: 7 tests pass, 0 fail. The default App SSR contains Context content and the Workflow tab, but not Workflow tiles.

- [ ] **Step 7: Commit only the view-switching files**

Run:

```bash
git add src/App.jsx src/components/AppSidebar.jsx src/styles.css tests/content.test.mjs
git commit -m "feat: add context workflow navigation"
```

### Task 3: Responsive Storybook composition and durable prototype rules

**Files:**
- Modify: `src/styles.css:750-835`
- Modify: `AGENTS.md`

**Interfaces:**
- Consumes: `.workflow-view`, `.qh-icon-grid-section`, and `.qh-icon-grid-section__grid` from Tasks 1–2 and `@qianhui/ui/styles.css`.
- Produces: a full-width desktop Workflow surface, a single-column section below `56rem`, and a single-column tile list below `45rem`.

- [ ] **Step 1: Establish the responsive failure state from the registered pattern**

Inspect the unmodified registered pattern at a narrow viewport. Its default structure remains a two-column section with a three-column item grid, so the expected RED condition is cramped or overflowing workflow copy below `56rem`.

Record this as the pre-fix responsive finding in `design-qa.md` only during Task 4, when implementation evidence is available. Do not mark the visual result passed from source inspection alone.

- [ ] **Step 2: Add only page-level stacking and scoped responsive overrides**

Add the following desktop rules near the existing `.content-library` layout styles:

```css
.workflow-view {
  display: grid;
  width: 100%;
  gap: var(--qh-space-6);
}

.workflow-view .qh-icon-grid-section {
  max-width: none;
}
```

Inside `@media (max-width: 56rem)`, add:

```css
.workflow-view .qh-icon-grid-section {
  grid-template-columns: minmax(0, 1fr);
  gap: var(--qh-space-6);
  padding: var(--qh-space-6);
}
```

Inside `@media (max-width: 45rem)`, add:

```css
.workflow-view .qh-icon-grid-section__grid {
  grid-template-columns: minmax(0, 1fr);
}
```

Do not override registered colors, radii, icon-tile anatomy, typography, or internal desktop grid values.

- [ ] **Step 3: Replace the superseded sidebar rule and record the Workflow composition rule**

In `AGENTS.md`, replace the final five-link sidebar constraint with these durable rules:

```markdown
- Keep the desktop sidebar at `16rem`. Its primary navigation contains exactly two text-only view tabs, `Context` and `Workflow`; retain the OT identity avatar, local-snapshot status dot, and top-bar Content Lab icon.
- The Workflow view uses the exact content from `/Users/qianhuisun/Desktop/Screenshot 2026-08-25 at 12.36.50 PM.png` and composes registered `IconGridSection` / `IconTile` styles. Do not recreate its tinted bands or add unregistered workflow-card chrome.
```

- [ ] **Step 4: Run automated regression and production checks**

Run:

```bash
npm test
npm run build
npm run test:sites
```

Expected: 7 content tests pass, the Vite production build exits 0 and produces the Sites bundle, and 4 Sites worker tests pass.

- [ ] **Step 5: Commit the responsive and durable-rule update**

Run:

```bash
git add AGENTS.md src/styles.css
git commit -m "style: align workflow with Sana patterns"
```

### Task 4: Interaction verification and source-aligned visual QA

**Files:**
- Modify: `design-qa.md`
- Modify: implementation files from Tasks 1–3 only if the verification exposes a P0, P1, or P2 defect

**Interfaces:**
- Consumes: the running Content Lab at `http://127.0.0.1:4173/`, both supplied screenshots, and the completed implementation.
- Produces: verified Context / Workflow behavior, fresh automated results, and an evidence-honest `design-qa.md` status.

- [ ] **Step 1: Verify the local preview is serving the latest build**

Use the existing development server when it reflects the current source. If it is no longer running, start it with:

```bash
npm run dev -- --host 127.0.0.1 --port 4173
```

Expected: the local preview is available at `http://127.0.0.1:4173/` and hot reloads the current implementation.

- [ ] **Step 2: Verify the primary interaction path**

In the user's permitted browser, verify this exact sequence:

1. Load the page and confirm `Context` is selected.
2. Set the category filter to `Personas` and expand one persona card.
3. Select `Workflow`; confirm the Context cards disappear and all three workflow phases appear without a reload.
4. Use Left/Right and Up/Down arrow keys to move between the two tabs; confirm focus and selection move together.
5. Return to `Context`; confirm the `Personas` filter and expanded persona remain selected.
6. Confirm the removed `Company`, `ICP & market fit`, `Personas`, and `Evidence notes` sidebar labels do not return.
7. Confirm no console error or warning is introduced by the new view.

- [ ] **Step 3: Capture equal-state implementation evidence**

Capture these implementation states in the user's permitted browser:

- Desktop Context view, showing the complete two-tab sidebar.
- Desktop Workflow view, showing `BRIEF`, `WRITE`, and `PUBLISH` together.
- Narrow Workflow view at or below 720 CSS px, showing one-column tile reflow without horizontal overflow.

Use the same visible page state and comparable crop when pairing the implementation with each source screenshot. If browser policy prevents captures, record the policy failure and keep `final result: blocked`; do not substitute source inspection for rendered evidence.

- [ ] **Step 4: Compare source and implementation side by side**

Place these source/implementation pairs together for review:

1. Sidebar source `/Users/qianhuisun/Desktop/Screenshot 2026-08-25 at 12.35.38 PM.png` beside the desktop implementation sidebar.
2. Workflow source `/Users/qianhuisun/Desktop/Screenshot 2026-08-25 at 12.36.50 PM.png` beside the desktop Workflow implementation.
3. Desktop Workflow implementation beside the narrow Workflow implementation for responsive continuity.

Inspect tab labels, active state, content order, exact copy, section hierarchy, registered component styling, main-width usage, wrapping, focus, borders, radii, and overflow. Fix every actionable P0, P1, or P2 mismatch in the scoped implementation files, then recapture and compare again.

- [ ] **Step 5: Update `design-qa.md` with the new evidence and honest status**

Add both new source references, the two-tab intended state, exact Workflow composition, interaction results, responsive results, screenshot evidence paths when available, comparison history, findings, and completed checklist items.

Set exactly one terminal line:

```text
final result: passed
```

only when rendered screenshots were compared and no actionable P0/P1/P2 findings remain. Otherwise retain:

```text
final result: blocked
```

and name the precise missing evidence or policy restriction.

- [ ] **Step 6: Run fresh completion verification**

Run:

```bash
npm test
npm run build
npm run test:sites
git diff --check
```

Expected: 7 content tests pass, build exits 0, 4 Sites tests pass, and `git diff --check` emits no output.

- [ ] **Step 7: Commit only QA evidence and any scoped fixes**

When `design-qa.md` is the only remaining scoped file:

```bash
git add design-qa.md
git commit -m "test: verify context workflow experience"
```

If Task 4 required scoped implementation fixes, stage each exact changed implementation path alongside `design-qa.md`; do not stage unrelated dirty files.
