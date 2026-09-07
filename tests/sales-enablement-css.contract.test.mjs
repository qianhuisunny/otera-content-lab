import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const css = await readFile(new URL("../src/sales-enablement.css", import.meta.url), "utf8").catch(() => "");
const writingCss = await readFile(new URL("../src/writing.css", import.meta.url), "utf8").catch(() => "");

test("sales uses the Blog review split and its 56rem responsive breakpoint", () => {
  assert.match(writingCss, /\.review-layout\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)\s+minmax\(15rem,\s*19rem\)/s);
  assert.match(writingCss, /@media\s*\(max-width:\s*56rem\)[\s\S]*?\.review-layout\s*\{[^}]*grid-template-columns:\s*1fr/s);
  assert.doesNotMatch(css, /\.sales-enablement-body\s*\{|@media\s*\(max-width:\s*70rem\)/s);
  const inspectorRule = css.match(/\.sales-enablement-inspector\s*\{([^}]*)\}/)?.[1] ?? "";
  assert.doesNotMatch(inspectorRule, /position:|top:|padding:/);
});

test("feature CSS uses Qianhui tokens and does not redefine the app sidebar", () => {
  assert.match(css, /var\(--qh-/);
  assert.doesNotMatch(css, /\.app-shell\s*\{/);
  assert.doesNotMatch(css, /grid-template-columns:\s*15rem/);
  assert.doesNotMatch(css, /\.sales-steps\s|\.sales-enablement-header\s/);
});

test("research rows keep their three-pixel keyboard focus outline inside the clipped container", () => {
  const focusRule = css.match(/\.sales-enablement-shell\s+\.sales-workstream\s+summary:focus-visible\s*\{([^}]*)\}/)?.[1] ?? "";
  const inset = Number(focusRule.match(/outline-offset:\s*(-?\d+)px/)?.[1]);
  assert.ok(inset <= -3, "The research row focus outline needs at least three pixels of inset clearance.");
});
