import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const css = await readFile(new URL("../src/sales-enablement.css", import.meta.url), "utf8").catch(() => "");

test("sales enablement uses a bounded work/inspector split and stacks responsively", () => {
  assert.match(css, /\.sales-enablement-body\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)\s+minmax\(16rem,\s*20rem\)/s);
  assert.match(css, /@media\s*\(max-width:\s*70rem\)[\s\S]*?\.sales-enablement-body\s*\{[^}]*grid-template-columns:\s*1fr/s);
  assert.match(css, /@media\s*\(max-width:\s*45rem\)[\s\S]*?\.sales-mode-actions\s*\{[^}]*width:\s*100%/s);
});

test("feature CSS uses Qianhui tokens and does not redefine the app sidebar", () => {
  assert.match(css, /var\(--qh-/);
  assert.doesNotMatch(css, /\.app-shell\s*\{/);
  assert.doesNotMatch(css, /grid-template-columns:\s*15rem/);
});
