import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const stylesheet = stripComments(
  (await Promise.all([
    readFile(new URL("../src/styles.css", import.meta.url), "utf8"),
    readFile(new URL("../src/writing.css", import.meta.url), "utf8"),
  ])).join("\n"),
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
  if (
    /:has\(\s*>\s*br:only-child\s*\)/.test(selector)
    && (element.children?.length !== 1 || element.children[0] !== "br")
  ) return false;

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
test("the desktop workspace matches the approved 240px sidebar split", () => {
  const shell = { attributes: [], classes: ["app-shell"] };

  assert.equal(
    computedProperty(shell, "grid-template-columns", 1470),
    "15rem minmax(0, 1fr)",
  );
});

test("the automatic Inspector uses the approved desktop split and stacks below it", () => {
  const layout = {
    attributes: ["data-has-inspector"],
    classes: ["writing-shell"],
  };
  const inspector = { attributes: ["data-writing-inspector"], classes: ["writing-inspector"] };

  assert.equal(
    computedProperty(layout, "grid-template-columns", 1470),
    "minmax(0, 36.5625rem) minmax(0, 1fr)",
  );
  assert.equal(computedProperty(inspector, "position", 1470), "sticky");

  for (const viewportWidth of [1100, 820, 640]) {
    assert.equal(computedProperty(layout, "grid-template-columns", viewportWidth), "1fr");
    assert.equal(computedProperty(inspector, "position", viewportWidth), "static");
  }
});

test("empty and browser-cleared editor surfaces expose their data-placeholder text", () => {
  const editor = {
    attributes: ["data-placeholder"],
    classes: ["editor-surface"],
    pseudoElement: "before",
  };

  assert.equal(
    computedProperty({ ...editor, children: [], empty: true }, "content", 1280),
    "attr(data-placeholder)",
  );
  assert.equal(
    computedProperty({ ...editor, children: ["br"], empty: false }, "content", 1280),
    "attr(data-placeholder)",
  );
  assert.equal(
    computedProperty({ ...editor, children: ["p"], empty: false }, "content", 1280),
    undefined,
  );
});
