# Content Lab Context / Workflow Navigation — Design Specification

## Goal

Replace the sidebar's in-page artifact links with two primary views, `Context` and `Workflow`. `Context` preserves the existing Otera context library. `Workflow` presents the exact workflow content shown in the supplied reference, composed from registered Sana Labs Storybook components and existing `--qh-*` tokens.

## Approved direction

Use registered Storybook composition rather than recreating the screenshot's custom tinted bands and bespoke cards.

- `Context` and `Workflow` are the only sidebar navigation items.
- Selecting `Workflow` replaces the main Context surface within the same single-page application; selecting `Context` restores it.
- The Workflow surface uses the `IconGridSection` and `IconTile` components exported by `@qianhui/ui`.
- The screenshot supplies the workflow information architecture and exact visible copy. Storybook supplies the visual system.
- No workflow tile interaction, routing, persistence, editing, approval, or publishing behavior is added.

## Sources of truth

- Sidebar reference: `/Users/qianhuisun/Desktop/Screenshot 2026-08-25 at 12.35.38 PM.png`
- Workflow content and structure reference: `/Users/qianhuisun/Desktop/Screenshot 2026-08-25 at 12.36.50 PM.png`
- Registered component implementation: `../UI-library/src/patterns/IconGridSection.tsx` and `../UI-library/src/components/IconTile.tsx`
- Consumed package boundary: `@qianhui/ui`
- Visual tokens: `@qianhui/ui/styles.css` and existing `--qh-*` variables

If the screenshot and registered component styling differ, the registered Storybook component styling takes precedence. The implementation must not invent unregistered phase colors, card menus, pills, arrows, or decorative illustrations merely to imitate the reference.

## Navigation architecture

`App` owns one view state:

```ts
type ContentLabView = "context" | "workflow";
```

The default is `context`. `AppSidebar` receives the active view and a view-change callback. Its navigation is a semantic two-item tab list rendered as token-styled text buttons:

1. `Context`
2. `Workflow`

The existing `Company`, `ICP & market fit`, `Personas`, and `Evidence notes` sidebar items are removed. The Otera identity block, `OT` avatar, local-snapshot footer, research cutoff, top bar, and Content Lab mark remain unchanged.

The tab buttons reuse the current sidebar row anatomy and active-state tokens because the Storybook library has no registered vertical sidebar-tab component. This is the only new app-local control treatment. It must support click, keyboard activation, visible focus, `aria-selected`, and a single tab stop for the active tab.

At widths below 56rem, the existing sidebar transformation remains: identity and footer are hidden, while the two view tabs form a compact horizontal row above the main surface.

## Context view

The Context view retains the current behavior and content:

- Otera collection header and summary
- Existing `All`, `Company`, `ICP`, and `Personas` category filter
- Company, market, buying-committee, and persona artifact cards
- Independent inline artifact expansion
- Evidence and usage guidance

Changing the primary view must not reset the category filter or expanded artifact state during the current session.

## Workflow view

Create an app-local `WorkflowView` whose only responsibility is to map static workflow data into three registered `IconGridSection` instances. Each section renders the registered `IconTile` items provided below. Phosphor icons supply the `icon` slots; icons are decorative and use the library's existing tile treatment.

### BRIEF

Description: `Define the objective, audience, and creative direction.`

1. **Video Storyboarding Briefing** — `Define goals, audience, key messages, and visual style for your video storyboard.`
2. **Blog Article Briefing** — `Define topic, angle, audience, keywords, and success metrics for your blog article.`
3. **Learning Solution Plan** — `Define learning objectives, audience, content structure, and success metrics.`

### WRITE

Description: `Turn briefs into structured content and narratives.`

1. **Video Storyboard** — `Transform your brief into a visual storyboard with scene-by-scene breakdown.`
2. **Long-Form Blog Article** — `Craft comprehensive, SEO-optimized long-form blog articles.`
3. **E-Learning Storyboard** — `Design e-learning flows and storyboards for engaging learning experiences.`

### PUBLISH

Description: `Finalize and publish content across channels.`

1. **Illustration Creation** — `Create custom illustrations and social graphics for LinkedIn, Xiaohongshu, and other platforms.`

The headings remain uppercase because that is visible content in the reference; no CSS text transformation is introduced. Tiles remain noninteractive because the registered `IconTile` API is presentational and the user requested view navigation, not workflow execution.

## Layout and responsive behavior

- The Workflow surface uses the same main content container, full-width behavior, and desktop padding as Context.
- Three `IconGridSection` surfaces are stacked vertically with spacing from the existing token scale.
- The library's section background, typography, radii, icon tiles, grid, and internal spacing remain untouched.
- App CSS may only add page-level stacking and responsive overrides scoped to `.workflow-view`.
- At or below 56rem, each registered section collapses from its two-column section layout to one column.
- At or below 45rem, each section's three-column tile grid collapses to one column.
- No fixed heights are used; copy wraps naturally without horizontal overflow.

## Component boundaries

### `App`

- Owns `activeView`, the existing artifact filter, and expanded artifact IDs.
- Renders exactly one main surface based on `activeView`.
- Preserves Context state when switching views.

### `AppSidebar`

- Renders identity, the two semantic view tabs, and the local-snapshot footer.
- Emits only `context` or `workflow` through its callback.
- Contains no knowledge of Workflow content.

### `WorkflowView`

- Owns no state.
- Imports `IconGridSection` from `@qianhui/ui`.
- Maps a static phase definition array into the registered component.
- Uses Phosphor icons without custom SVGs, emoji, or CSS illustrations.

No changes are made to `../UI-library`, its Storybook stories, or the packed dependency.

## Data flow and failure behavior

The feature is entirely local and synchronous:

1. A sidebar tab activates a view through React state.
2. Context reuses the already-loaded Otera artifact data.
3. Workflow maps an in-repository constant to presentational registered components.

There are no network requests, async loading states, empty states, or recoverable runtime errors for Workflow. The app exposes only the two constant view values through its internal controls, and `context` remains the initialization fallback.

## Accessibility

- The sidebar exposes a labelled tab list with `Context` and `Workflow` tabs.
- The active tab exposes `aria-selected="true"` and controls the main view panel.
- Arrow-key movement between the two tabs is supported, matching the keyboard expectations of a tab interface.
- The main surface is a labelled tab panel and receives focus only when navigation requires it.
- Existing skip-link behavior continues to target the active main surface.
- Decorative workflow icons are hidden from assistive technology by `IconTile`.
- Focus indication uses `--qh-color-focus`; color is not the sole state indicator.

## Verification and acceptance criteria

Automated verification must demonstrate that:

- the sidebar contains only `Context` and `Workflow` in that order;
- the removed sidebar labels are absent;
- Context is the default view;
- Workflow renders all three phase headings and all seven referenced tile titles;
- the exact phase and tile descriptions above are present;
- Workflow uses `IconGridSection` from the installed `@qianhui/ui` package;
- existing Otera content integrity, filtering, expansion, build, and Sites tests continue to pass.

Manual in-app Browser verification must demonstrate that:

- selecting each tab changes the visible main surface without a page reload;
- the active state and keyboard behavior are clear;
- Context state survives a round trip through Workflow;
- desktop and narrow layouts do not overflow;
- the implementation is compared side by side with the supplied sidebar and workflow references;
- `design-qa.md` records any remaining visual limitation. A QA pass cannot be claimed without implementation screenshots.

Required commands remain:

```text
npm test
npm run build
npm run test:sites
```

## Files in scope

- Modify: `src/App.jsx`
- Modify: `src/components/AppSidebar.jsx`
- Create: `src/components/WorkflowView.jsx`
- Modify: `src/styles.css`
- Modify: `tests/content.test.mjs`
- Modify: `AGENTS.md` to replace the superseded five-link sidebar constraint with the approved two-view navigation constraint
- Modify: `design-qa.md` with the new visual comparison status

## Non-goals

- Rebuilding or changing the UI library
- Recreating the screenshot's colored phase bands or bespoke workflow cards
- Making workflow tiles clickable
- Adding per-card menus, type pills, arrows, external-channel artwork, or social-platform logos
- Adding routes, deep links, URL persistence, backend storage, workflow execution, editing, publishing, approval, validation, authentication, or analytics
- Reworking existing Context content or artifact interactions beyond what is required to preserve them across view switches
