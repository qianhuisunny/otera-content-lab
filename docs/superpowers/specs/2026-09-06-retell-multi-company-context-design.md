# Retell.ai Multi-Company Context Library — Design Specification

## Goal

Extend the existing Content Lab from one company to two without changing the established Context/Workflow experience. Otera remains intact. Retell.ai becomes a separately selectable company with writing-ready, evidence-backed company, founder, market, ICP, buying-committee, and persona context. Retell context must be produced through all four canonical research system prompts in the content library, not through an ad hoc one-pass synthesis.

The primary audience is a writing skill or human writer who needs reliable context for positioning, briefs, articles, and other company-specific content. The page must make it impossible to confuse Otera evidence with Retell evidence.

## Approved direction

- Preserve every Otera Markdown artifact and its current presentation.
- Add `Otera` and `Retell` as company choices through the registered `SegmentedControl` component.
- Keep `Context` and `Workflow` as the existing primary view tabs.
- Keep Workflow shared; changing company affects the identity and Context library, not the workflow catalog.
- Store Retell research in its own `content/retell/` directory and registry entry.
- Determine Retell persona count from ICP and buying-committee evidence. Do not force the existing seven Otera persona categories onto Retell.
- Continue consuming `@qianhui/ui` and existing `--qh-*` tokens. Do not create a parallel visual system or modify `../UI-library`.

## Canonical four-prompt research pipeline

Both Otera and Retell are governed by the same four large research prompts. The prompts are reusable templates; the company, date, geography, and prior-stage context change between runs.

### Run 1 — Company Research System Prompt

- Canonical source: `../content-library/The company context.md`
- Repository snapshot: `prompts/company-research-system.md`
- Inputs: company name and domain, research date, relevant geography, and any supplied source material.
- Purpose: establish origin, founders, funding and business reality, product and technology, market position, customer reality, people, problems, and recent context.
- Required raw output: `research/<company-id>/company-research-output.md`
- Display output: `content/<company-id>/company-context.md`

Run 1 is completed and evidence-checked before the three specialist runs begin. Its complete output becomes shared context for Founder, Market, and Audience research.

### Run 2 — Founder Research System Prompt

- Canonical source: `../content-library/About the founder.md`
- Repository snapshot: `prompts/founder-research-system.md`
- Inputs: company name, research date, relevant geography, and the full verified Company Research output from Run 1.
- Purpose: establish founder background, formative experiences, career and founding journey, communication patterns, values, leadership style, customer philosophy, industry vision, blind spots, and evidence limitations.
- Required raw output: `research/<company-id>/founder-research-output.md`
- Display output: `content/<company-id>/founder-context.md`

### Run 3 — Market Research System Prompt

- Canonical source: `../content-library/About the market.md`
- Repository snapshot: `prompts/market-research-system.md`
- Inputs: company name, research date, relevant geography, and the full verified Company Research output from Run 1.
- Purpose: establish market domain, buying category, ecosystem map, direct and adjacent competition, alternatives, size and dynamics, company position, and recent market context.
- Required raw output: `research/<company-id>/market-research-output.md`
- Display output: `content/<company-id>/market-context.md`

Founder and Market research may run in parallel after Company Research because neither depends on the other.

### Run 4 — Audience / ICP / Persona Research System Prompt

- Canonical source: `../content-library/About the audience.md`
- Repository snapshot: `prompts/persona-research-system.md`
- Inputs: company name, research date, relevant geography, and the full verified Company, Founder, and Market outputs from Runs 1–3.
- Purpose: derive the observed ICP, buying committee, JTBD, buyer journey, customer language, blockers, and only as many personas as the evidence supports.
- Required raw output: `research/<company-id>/persona-research-output.md`
- Display outputs: `content/<company-id>/icp-context.md`, `content/<company-id>/persona-index.md`, and the evidence-supported persona dossiers.

Run 4 first produces one coherent audience research output. That output is then split into the ICP, buying-committee index, and individual persona Markdown files without changing the underlying claims, confidence labels, or citations. Focused source follow-ups may close evidence gaps, but they do not introduce a fifth system prompt or bypass any canonical run.

## Research scope

Across those four prompt runs, research is current through the execution date, initially `2026-09-06`, and covers:

1. Company origin, founders, funding, ownership, trajectory, and business model.
2. Product catalog, pricing model, technical architecture, integrations, deployment model, security, reliability, and limitations.
3. Market domain, buying category, ecosystem, competitors, differentiation, market growth, and defensibility.
4. Customer segments, concrete use cases, positive outcomes, complaints, operational failure modes, and retention or satisfaction signals where public evidence exists.
5. ICP firmographics, technographics, workflow characteristics, triggers, disqualifiers, geographic constraints, and buying journey.
6. Buying-committee roles, decision authority, influence, approval gates, implementation ownership, and daily users.
7. One deep-dive artifact for each evidence-supported persona.
8. Leadership, hiring/culture signals, controversies, failed or withdrawn initiatives, and recent developments that materially affect positioning.

### Evidence hierarchy

Prioritize sources in this order:

1. Retell website, product documentation, API reference, pricing, security/trust material, terms, customer stories, engineering posts, and official founder interviews.
2. Customer-authored material and named implementation evidence.
3. Funding announcements, regulatory or corporate records, and high-quality independent reporting.
4. Analyst/category sources, review platforms, and credible market comparisons.
5. Reddit, Hacker News, developer forums, GitHub discussions, and social posts as explicitly labeled anecdotal signals.

Consequential claims require first-party support or corroboration. Time-sensitive facts must carry an as-of date. Company claims, customer claims, independent evidence, community anecdotes, and researcher inference must remain visibly distinguishable.

## Persona derivation rules

Persona count is an output of the research, not an input.

A role receives its own deep-dive file only when the evidence indicates that it has at least two of the following:

- distinct decision authority or approval responsibility;
- materially different jobs, success measures, incentives, or risks;
- distinct objections or evidence requirements during evaluation;
- distinct implementation, operational, or expansion ownership;
- repeated appearance across Retell use cases, customer stories, documentation, or market evidence.

Closely overlapping titles are grouped as subroles in one persona. A stakeholder mentioned only speculatively remains in the buying-committee map with an inference label and does not receive a standalone dossier. The persona index records why roles were split, grouped, or excluded.

Each resulting persona dossier contains:

- role scope and common titles;
- company/workflow context in which the role appears;
- jobs to be done and current alternatives;
- goals, KPIs, incentives, fears, and organizational tensions;
- triggers, objections, disqualifiers, and evidence requirements;
- role in discovery, evaluation, approval, implementation, adoption, renewal, and expansion;
- language patterns and writing guidance;
- sourced facts, confidence notes, contradictions, and open evidence gaps.

## Content artifacts

Retell always includes five foundation files:

1. `content/retell/company-context.md`
2. `content/retell/founder-context.md`
3. `content/retell/market-context.md`
4. `content/retell/icp-context.md`
5. `content/retell/persona-index.md`

Persona dossiers use stable ordinal filenames after the buying committee is established:

```text
content/retell/01-<persona-slug>.md
content/retell/02-<persona-slug>.md
...
```

The final Retell artifact count is therefore `5 + evidence-supported persona count`. Each displayed file includes descriptive hyperlinks near consequential claims and a compact evidence/limitations section. The four raw prompt outputs remain the canonical stage records. Retain the reconciled synthesis at `research/retell/report-source.md` and its claim-to-source ledger at `research/retell/claim-ledger.md`; none of the research-stage files appears as a Context card.

## Multi-company data architecture

Replace the Otera-only import boundary with a company registry:

```ts
type CompanyId = "otera" | "retell";

type CompanyLibrary = {
  id: CompanyId;
  name: string;
  domainLabel: string;
  avatarText: string;
  libraryTitle: string;
  libraryDescription: string;
  researchCutoff: string;
  artifacts: ContextArtifact[];
  sections: ArtifactSection[];
  stats: CollectionStats;
};
```

`App` owns `activeCompanyId` and resolves the active library from `COMPANY_REGISTRY`. Otera and Retell have separate content modules and metadata definitions; shared helpers derive normalized search text, statistics, and filters without branching on company names.

Every new Retell artifact ID and key is prefixed with `retell-` / `retell.` so expansion controls, anchors, and tests cannot collide with the existing Otera identifiers. Otera's current internal IDs remain unchanged. Changing company resets the Context category filter to `All` and collapses open artifacts; the selected primary view remains unchanged. This produces predictable switching without carrying an Otera-specific role filter or expansion into Retell.

No routes, query parameters, persistence, backend, or runtime content fetching are introduced.

## Interface design

### Company selector

- Reuse `SegmentedControl` from `@qianhui/ui` with `Otera` and `Retell` items.
- Place it in the sidebar as a separate company control, not inside the primary `Context / Workflow` tab list.
- Keep it visible and keyboard-accessible in the narrow responsive layout even when the full company identity block is hidden.
- The dynamic identity uses `OT` or `RT` text in the existing token-styled monogram; no unofficial logo is introduced.

### Dynamic company chrome

Changing company updates:

- sidebar identity and accessible labels;
- top-bar library subtitle;
- Context heading, description, statistics, source depth, persona count, and cutoff;
- section descriptions, artifact cards, evidence notes, and empty-state copy.

The Workflow catalog and `Content Lab` brand remain unchanged.

### Context surface

Reuse the current `CollectionHeader`, `ArtifactGrid`, `ArtifactCard`, and `EvidencePanel`. Generalize only company-specific strings and data inputs. Otera must render the same artifacts, labels, previews, and research cutoff as before.

Retell uses the same two-column artifact grid, category filter, anchors, independent inline expansion, Markdown renderer, evidence treatment, responsive behavior, and Sana-inspired token language.

## State and interaction flow

1. The app opens on `Otera / Context`, preserving current default behavior.
2. Selecting `Retell` updates the active company registry entry without a page reload.
3. If the user is in Context, the Retell collection immediately replaces the Otera collection.
4. If the user is in Workflow, the shared catalog remains visible while the selected company identity changes; returning to Context opens Retell.
5. Company changes reset Context filtering and inline expansion only. Context/Workflow selection is preserved.
6. Existing tab keyboard behavior and SegmentedControl keyboard behavior remain intact.

## Failure and uncertainty behavior

- All Markdown remains statically bundled, so no runtime network or loading state is required.
- Manifest tests fail on empty files, duplicate IDs/keys, mismatched metadata, missing content, or incorrect artifact counts.
- Unsupported financial, retention, market-share, customer, or persona claims are labeled unavailable or inferred rather than invented.
- Conflicting evidence is preserved with source/date context and a confidence judgment.
- If research does not support a distinct persona, the role stays merged or is omitted; the UI accepts any nonzero persona count.

## Accessibility

- The company selector has an explicit accessible label and uses the registered control's roving keyboard behavior.
- Company selection and Context/Workflow tabs remain separate control groups.
- The active company's Context heading labels the main collection.
- Expansion buttons, anchors, skip link, main landmark, and tab-panel relationships retain their current semantics.
- Visible focus continues to use `--qh-color-focus`; color is not the only selection indicator.

## Verification

Automated tests must demonstrate:

- the repository contains exact snapshots of all four canonical system prompts;
- each company registry entry records the same four-prompt provenance in the correct order;
- both companies exist exactly once in the registry;
- Otera retains all ten existing artifacts unchanged;
- every Retell Markdown file is nonempty and represented exactly once;
- Retell artifact count equals five foundation artifacts plus the researched persona set;
- all artifact IDs, keys, and anchors are unique across companies;
- Otera remains the default company and Context remains the default view;
- company selection updates identity, Context content, statistics, and research cutoff;
- switching companies resets Context filter/expansion while retaining the active primary view;
- Workflow remains shared and unchanged;
- the company selector and primary tabs expose correct accessibility semantics;
- `npm test`, `npm run build`, and `npm run test:sites` pass.

Browser verification must cover company switching in Context and Workflow, Retell filtering and expansion, Otera regression behavior, keyboard access, desktop and narrow layouts, overflow, and console errors. Visual QA compares the implementation with the existing Content Lab visual language rather than inventing a new Retell-branded design.

## Expected files in scope

- Create: `prompts/company-research-system.md` as an exact snapshot of `../content-library/The company context.md`
- Create: `prompts/founder-research-system.md` as an exact snapshot of `../content-library/About the founder.md`
- Create: `prompts/market-research-system.md` as an exact snapshot of `../content-library/About the market.md`
- Create: `prompts/persona-research-system.md` as an exact snapshot of `../content-library/About the audience.md`
- Create: `research/retell/company-research-output.md`
- Create: `research/retell/founder-research-output.md`
- Create: `research/retell/market-research-output.md`
- Create: `research/retell/persona-research-output.md`
- Create: `research/retell/report-source.md` and `research/retell/claim-ledger.md`
- Create: `content/retell/*.md`
- Create: `src/data/retellArtifacts.js`
- Create or refactor: a generic company registry module
- Modify: `src/App.jsx`
- Modify: `src/components/AppSidebar.jsx`
- Modify: company-specific props in `CollectionHeader` and `EvidencePanel` as needed
- Modify: shared artifact definitions/utilities only where required for multi-company support
- Modify: `src/styles.css` for the registered selector's placement and responsive composition
- Modify: `tests/content.test.mjs`
- Modify: `README.md`, `AGENTS.md`, and `design-qa.md`

Exact file boundaries may be tightened by the implementation plan after research determines the persona set.

## Non-goals

- Rewriting, deleting, or re-researching Otera
- Predetermining a seven-persona Retell structure
- Replacing the four canonical system-prompt runs with a direct report-writing pass
- Mixing evidence from the two companies
- Company-specific Workflow catalogs
- Retell brand redesign, logo recreation, custom company colors, or new card anatomy
- Editing or rebuilding `../UI-library`
- Adding search restoration, routes, authentication, persistence, backend storage, content editing, approval, publishing, analytics, or external CMS integration
- Deploying or sharing the site without a separate explicit request
