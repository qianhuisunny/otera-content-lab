# Otera Content Lab — Design QA

## Source visual truth

- Existing wide-layout and chrome-removal feedback remains in force:
  - `/Users/qianhuisun/Desktop/Screenshot 2026-08-25 at 12.00.35 PM.png`
  - `/Users/qianhuisun/Desktop/Screenshot 2026-08-25 at 12.01.38 PM.png`
  - `/Users/qianhuisun/Desktop/Screenshot 2026-08-25 at 12.01.35 PM.png`
  - `/Users/qianhuisun/Desktop/Screenshot 2026-08-25 at 12.01.31 PM.png`
  - `/Users/qianhuisun/Desktop/Screenshot 2026-08-25 at 12.12.31 PM.png`
- New sidebar source: `/Users/qianhuisun/Desktop/Screenshot 2026-08-25 at 12.35.38 PM.png`.
- New Workflow source: `/Users/qianhuisun/Desktop/Screenshot 2026-08-25 at 12.36.50 PM.png`.
- The new sources define the two-tab sidebar and Workflow content/structure. Registered `@qianhui/ui` Storybook styling intentionally takes precedence over custom screenshot tints and cards.
- Source availability blocker: neither new file exists at the canonical Desktop path. Read-only searches by the unique timestamp prefixes `Screenshot 2026-08-25 at 12.35.38` and `Screenshot 2026-08-25 at 12.36.50` also returned no file within three levels of the home directory, the project root, or the visualization root.

## Intended implementation state

- The sidebar exposes exactly two tabs, in order: `Context`, `Workflow`.
- `Context` is selected initially. It retains the existing category filter, individual artifact expansion, research library, and evidence posture.
- `Workflow` replaces the Context cards in place without navigation or reload and contains three ordered phases:
  - `BRIEF`: Video Storyboarding Briefing, Blog Article Briefing, Learning Solution Plan.
  - `WRITE`: Video Storyboard, Long-Form Blog Article, E-Learning Storyboard.
  - `PUBLISH`: Illustration Creation.
- Arrow Left/Right and Up/Down move focus and selection together between the tabs.
- Returning to Context retains the selected category and expanded artifact.
- The removed sidebar labels `Company`, `ICP & market fit`, `Personas`, and `Evidence notes` do not return.

## Browser-rendered implementation evidence

- Local preview: `http://127.0.0.1:4173/`.
- Browser: Codex in-app Browser.
- Desktop Context: `/private/tmp/content-lab-task4-context-desktop-final.jpg`.
  - State: Context selected, All filter, all cards collapsed, top of page.
  - CSS viewport reported by the page: 992 × 1705 at DPR 1.29.
  - Screenshot pixels: 992 × 872. The in-app capture surface capped the vertical bitmap at 872 px; the visible crop contains the complete two-tab sidebar and the Context header/card state.
- Desktop Workflow viewport captures:
  - `/private/tmp/content-lab-task4-workflow-desktop-top.jpg` — BRIEF and start of WRITE, scroll Y 33.
  - `/private/tmp/content-lab-task4-workflow-desktop-middle.jpg` — complete WRITE and start of PUBLISH, scroll Y 490.
  - `/private/tmp/content-lab-task4-workflow-desktop-bottom.jpg` — end of WRITE and complete PUBLISH, scroll Y 710.
  - `/private/tmp/content-lab-task4-workflow-desktop-triptych.jpg` — the three equal-width rendered captures placed together for one review input.
  - CSS viewport: 992 × 697 at DPR 1.29; each source capture is 992 × 698 px and the triptych is 2976 × 698 px.
- Narrow Workflow: `/private/tmp/content-lab-task4-workflow-narrow-final.jpg`.
  - CSS viewport: 697 × 1395 at DPR 1.29; screenshot pixels: 698 × 873 because of the same capture-height cap.
  - State: Workflow selected. Computed layout reports one section column and one tile column for BRIEF, WRITE, and PUBLISH; document width equals viewport width (697 px) and no tile overflows.
- Tablet-edge before/after evidence for the resolved visual defect:
  - Before: `/private/tmp/content-lab-task4-workflow-tablet-edge-before.jpg`, 900 × 872 px.
  - After: `/private/tmp/content-lab-task4-workflow-tablet-edge-after.jpg`, 900 × 872 px.

## Interaction verification

- Initial load: `Context` selected; 10 Context cards rendered.
- Personas filter: 8 cards rendered.
- Economic Buyer: expanded and exposed `aria-expanded="true"` before switching views.
- Workflow switch: URL remained `http://127.0.0.1:4173/`; Context-card count became 0; phase order was exactly BRIEF, WRITE, PUBLISH.
- Keyboard roving selection:
  - Arrow Left: focus and selection moved to `context-tab`.
  - Arrow Right: focus and selection moved to `workflow-tab`.
  - Arrow Up: focus and selection moved to `context-tab`.
  - Arrow Down: focus and selection moved to `workflow-tab`.
- Return to Context: Personas remained pressed, 8 artifacts remained, and Economic Buyer remained expanded.
- Sidebar inspection: rendered labels were exactly `Context` and `Workflow`; no removed sidebar label was present.
- Browser console: zero warnings or errors after the complete post-fix sequence.

## Required fidelity surfaces

- Fonts and typography: rendered `@qianhui/ui`/Inter hierarchy is intact. The 900 px regression exposed unreadable overlap before the fix; post-fix measurement reports zero overflowing tiles. Exact source-font comparison is blocked by the missing source files.
- Spacing and layout rhythm: registered section surfaces, padding, gaps, borders, radii, and desktop sidebar rhythm remain intact. At 900 CSS px, Workflow now stacks the section header above a two-column tile grid; at 697 CSS px, tiles reflow to one column.
- Colors and tokens: the rendered implementation continues to use the registered `--qh-*` neutral, border, focus, and surface tokens, as required. Exact source/token comparison is blocked by the missing sources and is intentionally subordinate to registered Storybook styling.
- Image quality and asset fidelity: Workflow uses the supplied Phosphor icon library and contains no raster imagery, placeholder art, custom SVG, div art, gradient substitute, or generated asset.
- Copy and content: all three phase headings, phase descriptions, seven tile titles, and seven tile descriptions match the required Workflow composition. The app-specific text is coherent and no prompt or implementation language leaks into the UI.
- Icons: all seven registered tiles render an aligned Phosphor icon at the intended size; no icon is missing at desktop, tablet edge, or narrow width.
- Accessibility and state: the tablist exposes selected state and a single tab stop, focus is visibly indicated, keyboard selection follows focus, and the tabpanel label follows the active view.

## Comparison evidence and history

- Full-view implementation comparison: the three equal-width Workflow viewport captures were inspected together in `content-lab-task4-workflow-desktop-triptych.jpg`; the desktop Context capture and narrow Workflow capture were also inspected at original size.
- Required source/implementation side-by-side comparison: blocked. The two canonical new source screenshots could not be opened because the files are absent, so no honest source/implementation pair can be produced.
- Focused source-region comparison: not possible for the same missing-source reason. Focused implementation checks covered the two-tab active/focus states, phase headers, tile icons/copy, and responsive grid edges.
- P1 found at 900 CSS px: the registered three-column tile grid remained inside a two-column section after the main canvas became too narrow. Each tile collapsed to about 39 px, all seven tile rows overflowed, copy overlapped, and document width grew from 900 to 933 px.
- Fix: `src/styles.css` now lets tile-copy flex children shrink and wrap, stacks Workflow section headers above their grids at or below 80rem, uses two tile columns there, and preserves the existing one-column tile override at or below 45rem.
- Post-fix evidence at the same 900 CSS px state: one section column, two tile columns, zero overflowing tiles, and document width equal to the 900 px viewport. At 697 CSS px: one section column, one tile column, zero overflow.

## Findings

- Resolved P1 — Workflow copy overlapped and caused horizontal overflow at the tablet/compact-desktop edge.
  - Evidence: the 900 px before/after captures and computed layout metrics above.
  - Impact: all Workflow choices became difficult to read and the viewport acquired horizontal overflow.
  - Resolution: responsive section/grid reflow plus shrinkable, breakable tile copy.
- Evidence blocker — canonical source screenshots are missing.
  - Impact: tab labels, source active state, exact source hierarchy, width usage, wrapping, borders, radii, and source-to-implementation fidelity cannot be certified side by side.
  - Required resolution: restore the two exact canonical files, pair them with the Context and Workflow implementation captures, inspect the combined inputs, and repeat the P0/P1/P2 loop if a mismatch appears.

## Completion checklist

- [x] Local preview renders the latest source at the required URL.
- [x] Exact primary interaction sequence passes.
- [x] Arrow-key focus and selection behavior passes.
- [x] Context filter and expansion state persist across view switches.
- [x] Removed sidebar labels remain absent.
- [x] Browser console has no new warnings or errors.
- [x] Desktop Context, desktop Workflow, and narrow Workflow implementation evidence captured.
- [x] Responsive P1 fixed and recaptured.
- [ ] Canonical sidebar and Workflow source files available.
- [ ] Required source/implementation side-by-side comparisons completed.

final result: blocked
