import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const stylesheet = stripComments(
  await readFile(new URL("../src/writing.css", import.meta.url), "utf8"),
);
const authorRules = parseRules(stylesheet).map((rule, order) => ({
  ...rule,
  order,
  origin: 1,
}));
const userAgentRules = [
  {
    declarations: new Map([["display", { important: false, value: "none" }]]),
    maxWidth: Number.POSITIVE_INFINITY,
    order: -1,
    origin: 0,
    selectors: ["[hidden]"],
  },
];

function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, "");
}

function findClosingBrace(source, openingIndex) {
  let depth = 1;
  for (let index = openingIndex + 1; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return index;
  }
  throw new Error("Unbalanced CSS block");
}

function parseDeclarations(source) {
  return new Map(
    source
      .split(";")
      .map((declaration) => declaration.trim())
      .filter(Boolean)
      .map((declaration) => {
        const colonIndex = declaration.indexOf(":");
        const property = declaration.slice(0, colonIndex).trim();
        const rawValue = declaration.slice(colonIndex + 1).trim();
        const important = /\s*!important\s*$/i.test(rawValue);
        return [
          property,
          {
            important,
            value: rawValue.replace(/\s*!important\s*$/i, "").trim(),
          },
        ];
      }),
  );
}

function parseRules(source, inheritedMaxWidth = Number.POSITIVE_INFINITY) {
  const rules = [];
  let cursor = 0;

  while (cursor < source.length) {
    const openingIndex = source.indexOf("{", cursor);
    if (openingIndex === -1) break;

    const header = source.slice(cursor, openingIndex).trim();
    const closingIndex = findClosingBrace(source, openingIndex);
    const body = source.slice(openingIndex + 1, closingIndex);

    if (header.startsWith("@media")) {
      const maxWidthMatch = header.match(/max-width:\s*([\d.]+)(rem|px)/i);
      const mediaMaxWidth = maxWidthMatch
        ? Number(maxWidthMatch[1]) * (maxWidthMatch[2].toLowerCase() === "rem" ? 16 : 1)
        : inheritedMaxWidth;
      rules.push(...parseRules(body, Math.min(inheritedMaxWidth, mediaMaxWidth)));
    } else if (!header.startsWith("@")) {
      rules.push({
        declarations: parseDeclarations(body),
        maxWidth: inheritedMaxWidth,
        selectors: header.split(",").map((selector) => selector.trim()),
      });
    }

    cursor = closingIndex + 1;
  }

  return rules;
}

function selectorMatches(selector, element) {
  const pseudoElement = selector.match(/::([\w-]+)/)?.[1];
  if ((pseudoElement ?? null) !== (element.pseudoElement ?? null)) return false;

  const pseudoClasses = [...selector.matchAll(/:(?!:)([\w-]+)/g)].map((match) => match[1]);
  if (pseudoClasses.includes("empty") && !element.empty) return false;

  const classes = [...selector.matchAll(/\.([\w-]+)/g)].map((match) => match[1]);
  if (!classes.every((className) => element.classes.includes(className))) return false;

  const attributes = [...selector.matchAll(/\[([\w-]+)(?:[~|^$*]?=[^\]]+)?\]/g)]
    .map((match) => match[1]);
  return attributes.every((attribute) => element.attributes.includes(attribute));
}

function specificity(selector) {
  return [
    (selector.match(/#[\w-]+/g) ?? []).length,
    (selector.match(/\.[\w-]+|\[[^\]]+\]|:(?!:)[\w-]+/g) ?? []).length,
    (selector.match(/::[\w-]+/g) ?? []).length,
  ];
}

function compareSpecificity(left, right) {
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) return left[index] - right[index];
  }
  return 0;
}

function computedProperty(element, property, viewportWidth) {
  const candidates = [...userAgentRules, ...authorRules]
    .filter((rule) => viewportWidth <= rule.maxWidth)
    .flatMap((rule) => rule.selectors
      .filter((selector) => selectorMatches(selector, element))
      .map((selector) => ({
        ...rule.declarations.get(property),
        order: rule.order,
        origin: rule.origin,
        specificity: specificity(selector),
      })))
    .filter(({ value }) => value !== undefined)
    .sort((left, right) => (
      Number(left.important) - Number(right.important)
      || left.origin - right.origin
      || compareSpecificity(left.specificity, right.specificity)
      || left.order - right.order
    ));

  return candidates.at(-1)?.value;
}

test("hidden Activity and Research panels compute to display none", () => {
  for (const className of ["activity-details", "research-summary"]) {
    assert.equal(
      computedProperty(
        { attributes: ["hidden"], classes: [className] },
        "display",
        1280,
      ),
      "none",
      `.${className}[hidden] must override its grid display`,
    );
  }
});

test("the review layout stacks at tablet widths without changing desktop or mobile behavior", () => {
  const layout = { attributes: [], classes: ["review-layout"] };
  const coverage = { attributes: [], classes: ["coverage-panel"] };

  assert.equal(computedProperty(layout, "grid-template-columns", 820), "1fr");
  assert.equal(computedProperty(coverage, "position", 820), "static");

  assert.equal(
    computedProperty(layout, "grid-template-columns", 960),
    "minmax(0, 1fr) minmax(15rem, 19rem)",
  );
  assert.equal(computedProperty(coverage, "position", 960), "sticky");

  assert.equal(computedProperty(layout, "grid-template-columns", 640), "1fr");
  assert.equal(computedProperty(coverage, "position", 640), "static");
});

test("an empty editor surface exposes its data-placeholder text", () => {
  const placeholder = {
    attributes: ["data-placeholder"],
    classes: ["editor-surface"],
    empty: true,
    pseudoElement: "before",
  };

  assert.equal(computedProperty(placeholder, "content", 1280), "attr(data-placeholder)");
  assert.notEqual(computedProperty(placeholder, "color", 1280), "transparent");
});
