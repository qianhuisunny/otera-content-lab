# Otera Content Lab — Writing flow design QA

## Source visual truth

- The four requested screenshots were recovered from the Codex session cache as intact app-resized PNGs after the original Desktop files disappeared:
  - `.superpowers/sdd/2026-08-25-otera-writing-workflow/qa/source-brief-resized.png` — 1657 × 1504.
  - `.superpowers/sdd/2026-08-25-otera-writing-workflow/qa/source-outline-resized.png` — 1606 × 1536.
  - `.superpowers/sdd/2026-08-25-otera-writing-workflow/qa/source-draft-resized.png` — 1694 × 1472.
  - `.superpowers/sdd/2026-08-25-otera-writing-workflow/qa/source-review-resized.png` — 1631 × 1522.
- The recoveries are checksum-verified copies of the images shown in the request. The original 1770 × 1606, 1684 × 1610, 1846 × 1604, and 1698 × 1584 Desktop files were not recoverable, so comparison uses the app-resized derivatives that were actually visible to the model.
- The screenshot workflow is adapted through the existing `content-lab` Sana / `@qianhui/ui` design language. User requirements intentionally override source chrome and behavior: retain Context Library, add a primary `Writing` tab, use Otera context, omit highlight/training behavior, and make Review a frontend-only rich-text editor.

## Rendered implementation evidence

- Local preview: `http://127.0.0.1:4173/` in the Codex in-app Browser.
- Same-width source/implementation comparison inputs:
  - `.superpowers/sdd/2026-08-25-otera-writing-workflow/qa/comparison-matched-top-brief.png`.
  - `.superpowers/sdd/2026-08-25-otera-writing-workflow/qa/comparison-matched-top-outline.png`.
  - `.superpowers/sdd/2026-08-25-otera-writing-workflow/qa/comparison-matched-top-draft.png`.
  - `.superpowers/sdd/2026-08-25-otera-writing-workflow/qa/comparison-matched-top-review.png`.
- The implementation was rendered at the recovered reference CSS widths and heights. The Browser reported DPR 1.29 and these CSS viewports: Brief 1657 × 1504, Outline 1606 × 1535, Draft 1694 × 1472, and Review 1631 × 1521.
- The in-app screenshot surface caps the captured vertical bitmap. The same-width comparison inputs therefore pair the identical top region from each source with the complete captured implementation surface. The full recovered references, original implementation captures, matched captures, and scrolled Review capture were also inspected at original size:
  - `.superpowers/sdd/2026-08-25-otera-writing-workflow/qa/implementation-brief-1770x1606.png`.
  - `.superpowers/sdd/2026-08-25-otera-writing-workflow/qa/implementation-outline-1684x1610.png`.
  - `.superpowers/sdd/2026-08-25-otera-writing-workflow/qa/implementation-draft-1846x1604.png`.
  - `.superpowers/sdd/2026-08-25-otera-writing-workflow/qa/implementation-review-1698x1584.png`.
  - `.superpowers/sdd/2026-08-25-otera-writing-workflow/qa/implementation-review-scrolled.png`.
- Responsive evidence:
  - `.superpowers/sdd/2026-08-25-otera-writing-workflow/qa/implementation-review-820-final.png` — Review header, editor toolbar, and visible empty-editor hint at an actual 820 × 900 CSS viewport.
  - `.superpowers/sdd/2026-08-25-otera-writing-workflow/qa/implementation-review-820-coverage-final.png` — the Coverage panel in normal document flow below the editor at the same 820 × 900 CSS viewport.
  - `.superpowers/sdd/2026-08-25-otera-writing-workflow/qa/implementation-review-mobile-stable.png` — actual CSS viewport 620 × 775.

## Full-view and focused comparison

- Full-view structure matches the requested journey: slim page-creation top bar, three-phase writing rail, wide editorial canvas, explicit next-step actions, Draft activity/research regions, and Review article plus coverage panel.
- Focused comparisons checked the top bar, active/completed/locked step states, page-heading hierarchy, form fields, outline content surface, activity cards, research region, editor toolbar, article typography, coverage state, borders, radii, and action buttons.
- Intentional adaptations are visible and approved by the request:
  - the product's persistent Context / Workflow / Writing primary navigation remains present;
  - Otera insurance-claims content replaces the reference's multi-repo example copy;
  - the source's Workflow Studio / design-tool chrome is excluded;
  - Review excludes the yellow training/highlight instructions and highlighted passages;
  - the Review toolbar exposes real local editing controls instead of annotation/training behavior.
- Remaining density differences are P3 polish: the registered Sana typography and controls are slightly stronger and more spacious than the source's compact gray interface, and programmatic step-heading focus is visibly outlined during automated captures. These preserve the repo design system and keyboard orientation, so they are not P0/P1/P2 fidelity failures.

## Required fidelity surfaces

- Fonts and hierarchy: existing `@qianhui/ui` / Inter hierarchy is used consistently; headings, labels, metadata, helper copy, and body copy remain legible at desktop, tablet, and mobile widths.
- Spacing and layout rhythm: the reference's narrow rail / broad canvas relationship is preserved inside the existing app shell. No horizontal overflow was found at 1631, 852, or 620 CSS px.
- Colors and tokens: neutral surfaces, light borders, dark actions, muted metadata, green completion states, and the registered focus accent use existing `--qh-*` tokens.
- Image quality and assets: the Writing workflow contains no photographic or illustrative assets. Controls use the supplied Phosphor icon library; there are no custom SVGs, emoji substitutes, gradients, CSS drawings, or placeholders.
- Copy and content: realistic Otera claims-automation context populates Brief, Outline, Draft, Research, Review, and Coverage. Company-reported claims remain attributed and time-sensitive facts are explicitly marked for reverification.
- Accessibility and state: primary tabs expose selected state and keyboard roving selection; step transitions focus the new H1; narrow navigation scrolls the active step into view; form controls are labeled; accordions expose expanded state; the editor exposes toolbar, textbox, dialog, validation, error, and focus states.

## Interaction verification

- Context Library remains the initial view and continues to render its existing artifacts.
- Context, Workflow, and Writing tabs switch in place; Arrow Left/Right moves focus and selection between them.
- Brief → Outline → Draft → Review completes without route changes or backend calls.
- Brief validation focuses the first invalid control; keyword and audience errors clear immediately after correction, including the explicit `No audiences selected` state.
- Outline empty-state validation clears immediately after the first valid section is entered.
- Heading focus moves after each step transition; Exit returns to Workflow and focuses its tab.
- Outline edits persist while switching to Context or Workflow and back during the current in-memory session.
- Draft Inspect expands all activity cards and restores the default state; Research export remains local.
- Collapsed Activity and Research content retain their semantic `hidden` attribute and compute to `display: none` in the rendered browser.
- Rich editor checks passed in the real browser: native typing, toolbar undo/redo, italic formatting, plain-text paste without HTML injection, and selection restoration.
- Clearing the editor exposes `Start writing your article…`; the stylesheet also covers the single-`<br>` state commonly left by contentEditable browsers without rewriting editor HTML.
- Link composer checks passed:
  - `javascript:` is rejected with `Enter a valid http(s) URL.` and creates no anchor;
  - `https://www.otera.ai/product` creates anchors with the expected href;
  - Cancel and Escape restore the editor selection and focus;
  - Escape is handled from the composer form, including action controls.
- Final clean-tab console result after the link interactions: 0 warnings, 0 errors.
- Review stacks to one column by 820 CSS px, Coverage is non-sticky there, and the active writing step remains visible in the horizontal narrow navigator.

## Comparison history and findings

- Initial QA was blocked because the four Desktop source files were absent.
- A read-only cache recovery found the exact app-resized image data; those images were extracted into the QA directory and used for the comparison inputs above.
- Browser QA found one P1 functional defect: Add link used `window.prompt`, which the in-app Browser does not support. Commit `30b0ca7` replaced it with an accessible in-editor URL composer.
- Review then found one Important keyboard gap: Escape worked only from the URL input. Commit `9c2dbb1` moved handling to the composer form and added regression coverage.
- Final branch review found two responsive/cascade issues: hidden grid panels could still render, and Review stayed two-column too long. Commit `92a692f` corrected both and added stylesheet contracts at desktop, 820px, and mobile widths.
- The same review found minor form/error, empty-audience, editor-hint, and static-markup issues. Commit `a2353f4` fixed those with focused component tests.
- A follow-up review caught the contentEditable lone-`<br>` placeholder edge. Commit `2c3038a` added a non-mutating CSS treatment and regression contract; the normal `npm test` command now runs all Writing regression files.
- Final source/implementation comparison found no open P0, P1, or P2 visual issues. The scoped link review also reports 0 Critical, 0 Important, and 0 Minor findings.

## Completion checklist

- [x] All four source visuals are available as intact app-resized derivatives.
- [x] All four source and implementation states were opened and compared in shared comparison inputs.
- [x] Primary flow and editor interactions pass in the in-app Browser.
- [x] Desktop, tablet, and mobile implementation evidence exists.
- [x] Browser console has no final warnings or errors.
- [x] All discovered P1/P2 interaction issues are fixed and re-reviewed.
- [x] Review is single-column and non-sticky at 820 CSS px; collapsed Draft panels and empty-editor hints were verified in the browser.
- [x] The default test command includes all Writing regression suites.
- [x] Remaining differences are intentional product-context changes or P3 design-system polish.

final result: passed
