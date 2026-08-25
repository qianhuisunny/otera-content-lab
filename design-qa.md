# Otera Content Lab — Design QA

## Source and implementation

- Visual reference: `/Users/qianhuisun/Desktop/Screenshot 2026-08-25 at 11.05.42 AM.png`
- Reference dimensions: 1654 × 1604 px, desktop app shell, collapsed artifact-card state
- Implementation: `qa/implementation-desktop-final.jpg`
- Desktop capture: 1116 × 872 px; browser viewport reported 1116 × 1077 CSS px at DPR 1.29
- Narrow capture: `qa/implementation-narrow-final.jpg`, 403 × 698 px; browser viewport reported 403 × 697 CSS px at DPR 1.29
- State compared: default filters, all cards collapsed, top of page

## Comparison inputs

- Full composition: `qa/reference-vs-implementation-final.png`
- Focused card comparison: `qa/focused-card-comparison.png`

The comparison was judged from the combined reference/implementation images, not from isolated screenshots. The implementation preserves the reference's compact product shell, pale side rail, restrained monochrome palette, thin borders, two-column artifact rhythm, muted monospace previews, and low-shadow Sana-inspired density. The implementation intentionally replaces design-tool chrome with a real Content Lab top bar and adds collection metrics plus search/filter controls required by the library task.

## Required surfaces

- Sticky Content Lab top bar with collection-level expand/collapse controls
- Otera workspace identity and in-page navigation
- Collection title, themes, four compact summary cards, search, and type filter
- Two-column company and ICP artifact cards
- Buying-committee index and seven persona dossier cards
- Inline full-Markdown reader with tables, links, lists, quotes, and source notes
- Evidence-posture panel
- Horizontal narrow-screen navigation and single-column responsive cards

All required surfaces are present.

## Interaction verification

- Initial collection: 10 of 10 artifacts visible
- Full-text search for `Trade finance`: 5 relevant artifacts visible
- Personas filter from a clean state: 8 artifacts visible (index plus seven dossiers)
- Company card: expands inline and exposes the `Executive context` section
- Internal dossier link: resolves to `#artifact-economic-buyer`
- Expand all: 10 expanded cards; Collapse all: 0 expanded cards
- Empty search: empty state and reset control present; reset restores 10 artifacts and the All filter
- Browser error/warning log: empty
- Narrow viewport: one card column, static horizontal sidebar, no document-level horizontal overflow

## Accessibility and resilience

- Semantic banner, complementary navigation, main, section, article, and heading structure
- Skip link and visible focus treatment
- Search input has an accessible label
- Segmented filter exposes pressed state and an accessible group label
- Artifact controls expose unique labels, `aria-expanded`, and `aria-controls`
- Result count and empty state use polite live regions
- External source links open separately with safe `rel` handling; local dossier links stay on-page
- Reduced-motion preferences inherit the UI library's motion override

## Findings and fixes

- P0: none
- P1: none
- P2 resolved: single-artifact sections left excess whitespace. Company and ICP were grouped into the reference's two-column artifact rhythm.
- P2 resolved: collapsed cards were too tall. Redundant description and topic chips now stay out of the collapsed state, producing a 233 px desktop card height while retaining complete searchable metadata and expanded content.
- P2 resolved: narrow top-bar labels caused a small horizontal overflow. The same controls now keep accessible text while rendering as compact icon buttons below the breakpoint.
- P2 resolved: card actions wrapped onto two lines. The action was tightened to a compact `Read` button with a full per-artifact accessible label.
- P2 resolved in final code review: the starter's 320 px body minimum could overflow below 320 CSS px. The minimum is now 0; a 302 px browser viewport reports no horizontal overflow.

No unresolved P0, P1, or P2 visual or interaction issues remain.

final result: passed
