# Final CSS/browser fixes

## Delivered

- Hidden Activity detail and Research summary panels now override their grid declarations and compute to `display: none` while the native `hidden` attribute is present.
- The Review editor and Coverage panel stack at the existing `56rem` tablet breakpoint; Coverage returns to normal document flow there while the wide-screen two-column/sticky presentation remains intact.
- An empty editor surface now generates muted placeholder text from its `data-placeholder` attribute, including the browser-cleared state represented by one child `<br>`.
- `tests/writing-css.contract.test.mjs` evaluates the stylesheet cascade at desktop, 820px tablet, and mobile widths without adding a dependency.

## TDD evidence

The focused contract was added before the production change:

```text
node --test tests/writing-css.contract.test.mjs
3 tests, 0 passed, 3 failed
```

The failures matched the reviewed defects: hidden Activity resolved to `grid`, the 820px Review grid retained two columns, and the editor pseudo-element had no `content` value. After the minimal CSS patch, the same command passed all 3 tests with 0 failures.

### Follow-up lone-line-break regression

A subsequent review identified that `:empty` does not match the single `<br>` commonly retained when a contentEditable surface is cleared. The focused contract was extended first with that exact child shape and a real paragraph control case:

```text
node --test tests/writing-css.contract.test.mjs
3 tests, 2 passed, 1 failed
```

The new assertion failed because the lone-`<br>` editor computed no pseudo-element `content`. Sharing the existing declarations with `.editor-surface:has(> br:only-child)::before` made all 3 focused contracts pass while the paragraph control continued to compute no placeholder content.

## Verification

Fresh verification after the concurrent component cleanup settled:

```text
node --test tests/writing-css.contract.test.mjs  3 passed, 0 failed
npm test                                          39 passed, 0 failed
npm run build                                     passed; Sites build prepared
npm run test:sites                                4 passed, 0 failed
git diff --cached --check                         passed with no output
```

The production build retains the repository's existing Rollup advisory for a minified JavaScript chunk over 500 kB; it is a warning and does not fail the build.

## Scope

- No dependency, JSX, runtime behavior, hosting metadata, or product copy was changed in this fix.
- `README.md`, `src/components/CollectionHeader.jsx`, `node_modules/`, `design-qa.md`, `progress.md`, and all unrelated concurrent work remain unstaged by this fix.
