# Otera + Retell Content Lab — Design QA

## Visual target

- Existing approved Otera implementation: `qa/implementation-desktop-final.jpg`.
- The earlier user screenshots are no longer present at their original Desktop paths, so the approved Otera implementation is the durable source visual truth for this incremental multi-company change.
- Required intentional change: preserve the Otera experience, add an Otera/Retell AI company switcher, and render Retell through the same registered Sana Labs Storybook components and `--qh-*` tokens.
- Required preserved navigation: exactly `Context` and `Workflow`; no sidebar icons or removed Company/ICP/Personas/Evidence-note navigation.

## Matched comparison input

- Combined comparison: `qa/reference-vs-implementation-retell-final.png`.
- Quadrants, in reading order:
  1. approved Otera source state;
  2. current Otera state with company switcher;
  3. current Retell Context state;
  4. current Retell Workflow state.
- Each source capture is exactly 1116 × 872 pixels before combination. The four captures were scaled uniformly into one 1488 × 1162 review input.
- Current standalone captures:
  - `qa/implementation-multi-company-otera.png`
  - `qa/implementation-multi-company-retell.png`
  - `qa/implementation-multi-company-workflow.png`

## Visible comparison

- Chrome and spacing: the current Otera and Retell states preserve the approved top bar, sidebar, main-canvas alignment, card width, border, radius, and typography rhythm. The company control occupies the former right-side chrome area without adding a second header row.
- Width use: the three-stat grid and two-column artifact grid occupy the available main canvas; there is no excessive empty right column. At a 720 × 1000 override, document width equals viewport width and no horizontal overflow is present.
- Company state: Otera remains visually and structurally unchanged inside the main canvas. Retell reuses the same hierarchy and components, with only company-specific copy, counts, paths, and cards changing.
- Navigation: the left rail contains only Context and Workflow, with a clear registered selected state and no icons. Company switching remains visually separate from view navigation.
- Workflow: all seven required tiles remain grouped under BRIEF, WRITE, and PUBLISH using the registered icon-tile language. The visible capture shows the top of the long view; browser verification confirms the full ordered set.
- Assets: the implementation uses the existing Phosphor icon set and registered components. No placeholder image, custom SVG, div art, emoji, or approximate asset was introduced.

## Interaction verification

- Initial load defaults to Otera and Context.
- Otera renders 10 artifacts, 3,164 source lines, and 7 personas.
- Retell renders 12 artifacts, 4,635 source lines, and 7 evidence-derived personas.
- Company switching updates sidebar identity, header, stats, cards, paths, and evidence text without an Otera copy leak.
- All, Company, ICP, and Personas filters work; the Retell Personas filter yields 8 cards because it includes the committee map plus seven dossiers.
- Executive Sponsor expands to the complete local Markdown content and changes its accessible control name to Close.
- Workflow remains selected when switching company, proving that company choice and view choice are independent.
- Workflow exposes exactly 7 registered icon tiles and the ordered BRIEF, WRITE, and PUBLISH phases.
- Narrow-state inspection reports `clientWidth: 558`, `scrollWidth: 558`, both company buttons present, and only Context/Workflow tabs.
- The live development log contains only expected hot updates and no build/runtime error.

## Accessibility and state

- Company switching uses the registered segmented control with two explicit button names.
- Context/Workflow uses tab semantics with `aria-selected`, one controlled panel, keyboard focus styling, and the existing arrow-key behavior.
- Filters remain named buttons with pressed state.
- Artifact expansion retains a specific accessible name per dossier and exposes the full source content in place.

## Findings

- No P0, P1, or P2 visual mismatch remains in the matched comparison.
- The old source's removed search, evidence card, tags, expand/collapse controls, and extra sidebar entries are intentionally absent because they reflect the user's approved cleanup requests.
- The Otera/Retell switcher is the only new chrome. It follows existing control sizing, neutral surfaces, typography, focus treatment, and spacing tokens.
- Retell's longer content changes page length, not the layout system.

## Result

passed
