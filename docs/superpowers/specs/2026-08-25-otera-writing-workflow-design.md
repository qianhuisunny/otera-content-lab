# Otera Writing Workflow — Design Specification

## Goal

Extend the existing Otera Content Lab with a new `Writing` workspace that recreates the four supplied editorial-workflow screenshots in the repository's Sana-inspired visual language. The current Context Library remains available and unchanged as the source of truth for Otera company, ICP, and persona material.

The result is a frontend-only, interactive prototype. It demonstrates the complete writing journey from brief through editing without calling an AI service, saving to a backend, or publishing content.

## Approved product direction

The existing application shell gains two top-level destinations in the left navigation:

- `Context` opens the current Context Library and preserves its existing anchors, filters, artifact cards, and inline expansion.
- `Writing` opens a focused editorial workspace. In this mode, the sidebar shows the three workflow phases and their nested steps.

The application uses local React state rather than adding a routing dependency. Switching between Context and Writing does not discard the current writing session. Refreshing the page resets the writing prototype to its supplied fixture data.

## Visual sources and interpretation

The structural references are these four screenshots:

1. `/Users/qianhuisun/Desktop/Screenshot 2026-08-25 at 12.39.23 PM.png`
2. `/Users/qianhuisun/Desktop/Screenshot 2026-08-25 at 12.39.30 PM.png`
3. `/Users/qianhuisun/Desktop/Screenshot 2026-08-25 at 12.39.56 PM.png`
4. `/Users/qianhuisun/Desktop/Screenshot 2026-08-25 at 12.40.09 PM.png`

The screenshots define information architecture, density, component anatomy, and workflow state. The repository's `@qianhui/ui` package defines the final styling: calm monochrome surfaces, warm neutrals, generous spacing, rounded panels, pill actions, restrained shadows, Inter/system sans typography, and all `--qh-*` tokens.

The `Workflow Studio` toolbar and property controls above the product frame in screenshot 4 belong to the screenshot host. They are not part of the Content Lab product and will not be reproduced.

No raster images or custom illustration assets are required. Standard interface icons come from the existing `@phosphor-icons/react` dependency.

## Otera writing scenario

The four states use one coherent Otera article scenario rather than the AI-coding copy shown in the reference:

- Working title: `How governed AI agents automate insurance claims across legacy systems`
- Primary keyword: `agentic claims automation`
- Audience: Operations Leader, Enterprise Architect, Transformation Lead
- Format: Explainer
- Intent: Help regulated insurance teams understand how governed agents coordinate document intake, rules, exceptions, human review, and system-of-record updates without replacing core claims systems.
- Target length: 2,500–3,200 words

The scenario is synthesized from the existing Otera company context, ICP context, executive champion, and technical evaluator artifacts. Copy must preserve their evidence posture: company claims remain labeled, inferences are not presented as facts, and time-sensitive claims retain dates or re-verification language.

## Application architecture

`App` becomes a thin workspace coordinator. It owns the top-level `activeWorkspace` state and renders either the existing Context Library composition or the new `WritingWorkspace`.

`AppSidebar` receives the active workspace and workspace-change callback. Its Otera identity and existing footer remain stable. The body changes by workspace:

- Context mode shows the existing five text-only in-page anchors.
- Writing mode shows `01 BRIEF IT`, `02 WRITE IT`, and `03 SHIP IT` with nested steps, active bullets, completed checks, descriptions, and available-step navigation.

`WritingWorkspace` owns the writing session and the current step. It composes a writing-specific top bar, workflow sidebar state, and one of four focused screen components. Business data is passed down as props; visual components do not import Otera source files directly.

No code in the dirty sibling `../UI-library` worktree is edited. The app continues to consume its repository-local packed `@qianhui/ui` snapshot and imports `@qianhui/ui/styles.css` once at the root.

## Workflow states

### 1. Pick angle & format

The first screen is a centered form with the same sequence as the reference:

1. Linked opportunity
2. Article format
3. Audience chips
4. Primary keyword
5. Search intent
6. Additional directions
7. Target length

All fields are controlled. Audience chips can be removed and restored from a small suggestion menu. The format card opens a compact selection menu. `Plan outline` validates the required format, audience, keyword, and target length before advancing. Validation appears inline and moves focus to the first invalid field.

`Regenerate outline` restores the supplied Otera outline fixture. It does not simulate a network request.

### 2. Plan outline

The second screen presents the numbered Otera outline in a large, text-first editing surface. It preserves numbered H2 entries, nested H3 bullets, bracketed editorial guidance, generous line height, and the helper note explaining heading syntax.

The outline is editable as plain text. `Draft first version` stores the current outline in session state and advances to the drafting screen. A secondary action returns to the brief without discarding edits.

### 3. Drafted first version

The third screen mirrors the reference's progress dashboard:

- Header metadata for duration, sources, word count, and target length
- Collapsible `Activity` section
- Four completed activity cards
- Expanded post-processing substeps
- Collapsible `Research` section with an Otera research-report summary
- Primary action to open the review editor

Accordions, `Inspect`, and `Export` are interactive. `Inspect` expands every activity card. `Export` downloads the static research fixture as a local Markdown file. There is no background generation or delayed fake loading sequence.

### 4. Review editor

The fourth screen keeps the reference's article-and-coverage composition but replaces the annotation-training interaction with a frontend-only rich text editor.

The yellow training instructions, passage highlighting, selection annotations, notes, and agent-learning copy are removed. The main article begins with the supplied Otera draft and is directly editable.

The editor toolbar supports:

- Paragraph, H1, H2, and H3 block styles
- Bold, italic, and underline
- Links
- Block quotes
- Bulleted and numbered lists
- Undo and redo

The editor uses a focused `contentEditable` surface and browser-native formatting commands so the prototype does not add a heavy editor framework. The current HTML is held in React state and is not sanitized for server submission because it never leaves the local prototype. Paste is normalized to plain text to avoid importing arbitrary markup.

The right Coverage panel remains read-only for structural fidelity. It shows static Otera topic coverage, evidence posture, and differentiation criteria. It does not call an analysis service or change in response to editor content.

## Shared components

The new workflow is split into small app-local components:

- `WritingWorkspace`: session and step coordinator
- `WritingTopbar`: title, article ID, and status
- `WritingSidebar`: phase and nested-step navigation
- `WritingPageHeader`: shared title and supporting copy
- `BriefStep`: controlled setup form
- `OutlineStep`: editable outline
- `DraftStep`: activity and research accordions
- `ReviewStep`: editor and coverage layout
- `RichTextEditor`: toolbar, editable surface, and formatting behavior
- `CoveragePanel`: read-only coverage summary

Existing `Button` components are reused for primary and secondary actions. Existing semantic tokens style every new local component. Phosphor supplies arrows, chevrons, checks, text-format controls, status symbols, and coverage icons.

Product-specific workflow objects remain in `content-lab`; they are not promoted to the shared UI library until a second real product needs the same API.

## Data model

One writing fixture module holds the approved Otera scenario and keeps long copy out of component files.

```ts
type WritingStep = "brief" | "outline" | "draft" | "review";

type WritingSession = {
  currentStep: WritingStep;
  brief: {
    opportunity: string;
    format: string;
    audiences: string[];
    keyword: string;
    intent: string;
    directions: string;
    targetLength: string;
  };
  outline: string;
  articleHtml: string;
};
```

Activity, research, coverage, and sidebar definitions are immutable fixture data. Only brief fields, outline text, current step, accordion state, and editor HTML change during a session.

## Visual system and layout

- Use `--qh-color-bg`, `--qh-color-surface`, `--qh-color-surface-muted`, `--qh-color-control-muted`, `--qh-color-border`, `--qh-color-text`, `--qh-color-text-muted`, and the existing action colors.
- Keep the existing 56px app top bar and 16rem desktop sidebar.
- Writing content uses a centered reading/form column of approximately 56–64rem, depending on the screen.
- Brief fields and activity panels use 1px borders, token radii, and little or no shadow.
- The outline screen favors open whitespace over cards.
- The editor screen uses a wider grid with the editor as the flexible column and a roughly 17–18rem sticky Coverage panel.
- Active and completed workflow states use text weight, bullets, checks, and muted surfaces rather than saturated color blocks.
- The supplied screenshot spacing is matched structurally, while tokenized radii and controls preserve the repository's Sana-inspired identity.

## Responsive behavior

At wide desktop widths, the top bar, 16rem sidebar, central content, and optional Coverage panel remain visible together.

Below approximately 900px:

- The persistent sidebar becomes a compact workspace bar followed by a horizontally scrollable step navigation.
- Main content uses smaller horizontal padding.
- The editor and Coverage panel stack vertically.

Below approximately 680px:

- Form action rows stack.
- Tags and metadata wrap.
- Activity card copy and controls move to separate rows.
- The editor toolbar wraps while preserving labeled tooltips and keyboard access.

The current Context Library breakpoints and behavior remain intact.

## Accessibility

- Workspace navigation is a labeled `nav` with buttons exposing the active destination.
- Workflow steps expose current and completed states in text and with `aria-current` where appropriate.
- Every form field has a persistent label and associated error message.
- Accordion buttons expose `aria-expanded` and control stable panel IDs.
- Editor toolbar buttons have accessible names, pressed state where applicable, and visible focus styles.
- The rich text surface has an accessible label, correct multiline semantics, and an empty-state hint.
- Color is never the only state signal.
- All motion respects `prefers-reduced-motion` through the existing UI foundations.

## Error handling and state boundaries

There are no remote requests, authentication checks, AI jobs, saves, or publishing actions, so network error states are out of scope.

Expected local cases are handled explicitly:

- Required brief fields block forward navigation and show inline errors.
- Removing every audience shows a clear empty state and prevents continuation.
- An empty outline is allowed to be edited but cannot advance until it contains text.
- Rich-text paste is converted to plain text before insertion.
- Export failure shows a compact inline message without leaving the drafting screen.
- Switching back to Context preserves the current in-memory Writing session.

## Verification

Automated checks cover:

- Existing Context Library content and navigation remain present.
- `Context` and `Writing` workspace controls render and switch correctly.
- The Writing sidebar contains the approved phases and four implemented steps.
- Required brief validation and step transitions work.
- Outline edits flow into the session state.
- Activity and research accordions respond to controls.
- The editor fixture, formatting toolbar, and read-only Coverage panel render.
- Otera scenario content and evidence labels are present.
- Existing `npm test`, `npm run build`, and `npm run test:sites` checks pass.

Browser verification covers the full journey from Context to Writing and through all four screens, primary and secondary controls, editor formatting, responsive behavior, keyboard focus, and console errors.

Visual QA compares each implemented state with its corresponding reference at a matching viewport. The comparison judges shell geometry, hierarchy, spacing, typography, control anatomy, and responsive behavior while allowing the approved Sana-style token translation. All P0, P1, and P2 findings are fixed before handoff; remaining P3 polish can be recorded as follow-up notes. Existing `design-qa.md` content is preserved when the writing-workflow QA results are added.

## Files expected to change

- `src/App.jsx`
- `src/components/AppSidebar.jsx`
- New writing components under `src/components/writing/`
- New writing fixture data under `src/data/`
- `src/styles.css`
- `tests/content.test.mjs`
- Additional focused tests if state helpers are extracted
- `design-qa.md`

The Otera Markdown snapshots, Sites worker, hosting manifest, build preparation script, sibling UI library, and vendor package remain untouched.

## Non-goals

- Real AI generation, research, or post-processing
- Backend storage or autosave
- Authentication, permissions, or assignments
- Collaboration, comments, annotations, or training behavior
- Publishing, approval, version history, or CMS integration
- Dynamic coverage analysis
- Editing the shared UI library
- Reproducing screenshot-host chrome
