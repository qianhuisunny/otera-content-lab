# Otera Content Lab — Design Specification

## Goal

Create a new, self-contained `content-lab` repository that presents every Otera-specific context artifact on one responsive page. The page should let a writer or researcher understand the collection at a glance, find the right artifact quickly, and read the full Markdown inline without entering an approval, publishing, or review workflow.

## Source of truth

- Visual reference: `/Users/qianhuisun/Desktop/Screenshot 2026-08-25 at 11.05.42 AM.png`
- UI system: `../UI-library`, consumed through a repository-local packed snapshot of the built `@qianhui/ui` package
- Tokens: `@qianhui/ui/styles.css`, including all `--qh-*` color, spacing, radius, type, shadow, and motion tokens
- Content cutoff: `2026-08-23`

## Content scope

The page includes these ten Otera-specific artifacts and excludes generic reusable research-prompt templates:

1. `content-library/company-contexts/otera.md`
2. `content-library/company-contexts/Otera ICP context.md`
3. `content-library/company-contexts/Otera Personas/README.md`
4. `content-library/company-contexts/Otera Personas/01-economic-buyer.md`
5. `content-library/company-contexts/Otera Personas/02-executive-champion.md`
6. `content-library/company-contexts/Otera Personas/03-functional-champion.md`
7. `content-library/company-contexts/Otera Personas/04-technical-evaluator.md`
8. `content-library/company-contexts/Otera Personas/05-risk-and-approval-gate.md`
9. `content-library/company-contexts/Otera Personas/06-operational-user.md`
10. `content-library/company-contexts/Otera Personas/07-transformation-partner.md`

Exact source Markdown is copied into `content-lab/content/otera/` so the new repository remains usable without reading files outside its root. Each copied file retains its exact body; filenames are normalized to the stable names listed in the implementation plan. The app's metadata manifest records the original source path.

## Page architecture

The experience is a desktop application shell, not a marketing page.

### App chrome

- A 56px top bar contains the `Content Lab` brand, the active company `Otera`, collection status, and two existing `Button` actions: expand all and collapse all.
- A 216px left sidebar contains the Otera workspace identity and anchor links for Overview, Company, ICP & buying journey, Personas, and Evidence & usage.
- At widths below 900px the sidebar becomes a compact horizontal anchor bar; below 720px the main grid becomes a single column.

### Main content

- Main content begins with `Otera context artifacts`, a concise evidence-aware subtitle, collection tags, and four existing `StatCard` components: 10 artifacts, 3,164 source lines, 7 personas, and the research cutoff.
- A search field searches full artifact body, title, description, tags, role, industries, workflows, geography, journey stage, and evidence metadata.
- An existing `SegmentedControl` filters `All`, `Company`, `ICP`, and `Personas`.
- `Company & market fit` contains the company overview and ICP cards.
- `Buying committee` contains the persona index card.
- `Persona deep dives` contains seven role cards.
- `Evidence & usage` explains claim attribution, inference labeling, time-sensitive re-verification, and the public-source limitation.

## Artifact card

No generic card exists in the UI library, so `ArtifactCard` is an app-local composition using existing tokens and typography. It is intentionally not added to `UI-library` because its metadata and Markdown behavior are product-specific.

Each card contains:

- Title and one-sentence description
- Monospace artifact key chip
- A two-to-three-line preview panel
- Tags and source metadata
- `Open context` / `Close context` interaction
- Full Markdown rendered inline when open, including GitHub-flavored tables, links, headings, lists, and blockquotes

Cards use a 1px `--qh-color-border`, `--qh-color-surface`, `--qh-radius-tile`, and no heavy shadow. The grid has two equal columns with a 20px gap at desktop widths.

## Data model

```ts
type ArtifactType = "company_context" | "icp_context" | "persona_index" | "persona_dossier";

type OteraArtifact = {
  id: string;
  artifactType: ArtifactType;
  title: string;
  artifactKey: string;
  sourcePath: string;
  description: string;
  preview: string;
  tags: string[];
  researchCutoff: "2026-08-23";
  evidencePosture: "public-source synthesis";
  lineCount: number;
  content: string;
  searchText: string;
  facets: {
    roles: string[];
    industries: string[];
    workflows: string[];
    geographies: string[];
    journeyStages: string[];
    evidenceTypes: string[];
  };
};
```

`searchText` is derived by normalizing all visible metadata and raw Markdown to lowercase. No backend, database, persistence, or network request is required.

## Reused Storybook components

- `Button`: expand all, collapse all, and per-card open/close actions
- `SegmentedControl`: artifact-type filter
- `StatCard`: collection summary metrics
- `.qh-ui` and typography classes: global type behavior
- All visual decisions use `--qh-*` tokens imported from `@qianhui/ui/styles.css`

`RecordNavigator`, `ChangeRate`, and `ArtifactDiffReview` are not used because their public APIs encode edit-review semantics that do not match a context library. `MarketingNav` is not used because the reference is application chrome rather than pill-shaped marketing navigation.

The exact compiled UI package is stored as `vendor/qianhui-ui-0.1.0.tgz`. This keeps `content-lab` reproducible while avoiding edits or dependency traversal inside the dirty sibling UI-library worktree.

## Icons and assets

Use `@phosphor-icons/react` for all standard interface icons: sidebar navigation, search, document, users, evidence, expand, collapse, and repository metadata. Do not hand-draw SVGs or create CSS icons. The workspace mark is a typographic Otera monogram inside a token-styled avatar, not a logo substitution.

The reference contains no photographic, illustrative, or decorative raster assets that must be generated.

## Interactions

- Search updates results as the user types and is case-insensitive.
- Type filter and search combine with AND logic.
- Anchor navigation scrolls to the relevant section and reflects native focus behavior.
- Each artifact can be opened independently.
- Expand all opens every currently visible artifact; collapse all closes all artifacts.
- Empty search results show a clear reset action.
- External Markdown links open in a new tab with safe `rel` attributes.

There is no authentication, editing, versioning, approval, publishing, comment, diff, or validation flow.

## Accessibility

- Semantic header, aside, nav, main, section, article, and footer regions
- Visible keyboard focus using `--qh-color-focus`
- Search input has a persistent label
- Segmented control retains its existing keyboard behavior
- Expansion buttons expose `aria-expanded` and `aria-controls`
- Decorative icons use `aria-hidden`; icon-only controls have labels
- Color is never the only indicator of state
- Motion respects the UI library's reduced-motion foundation

## Error handling

- The content is statically bundled, so runtime load failure is avoided.
- The manifest integrity test fails when an expected artifact is missing, duplicated, or empty.
- Search safely returns an empty result for unmatched terms.
- Markdown rendering treats embedded HTML as text; no raw HTML plugin is enabled.

## Verification

- Node unit tests cover exact content snapshots, manifest completeness, case-insensitive search, combined filters, and empty results.
- In-app Browser verification covers the ten-artifact render, filtering, per-card expansion, expand-all, collapse-all, and reset.
- `npm run test`, `npm run build`, and `npm run test:sites` must pass.
- Browser verification covers sidebar anchors, search, filters, open/close, expand/collapse, responsive layout, and console errors.
- `design-qa.md` compares the rendered implementation with the supplied screenshot and must end with `final result: passed` before handoff.
