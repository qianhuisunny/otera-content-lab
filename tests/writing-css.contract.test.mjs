import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const stylesheet = stripComments(
  (await Promise.all([
    readFile(new URL("../src/styles.css", import.meta.url), "utf8"),
    readFile(new URL("../src/writing.css", import.meta.url), "utf8"),
    readFile(new URL("../src/writing-generation.css", import.meta.url), "utf8"),
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

function attributeValue(element, name) {
  if (Array.isArray(element.attributes)) {
    return element.attributes.includes(name) ? "" : undefined;
  }
  if (Object.hasOwn(element.attributes ?? {}, name)) {
    return String(element.attributes[name]);
  }
  return undefined;
}

function attributeMatches(actual, operator, expected) {
  if (actual === undefined) return false;
  if (!operator) return true;
  if (operator === "=") return actual === expected;
  if (operator === "~=") return actual.split(/\s+/).includes(expected);
  if (operator === "|=") return actual === expected || actual.startsWith(`${expected}-`);
  if (operator === "^=") return actual.startsWith(expected);
  if (operator === "$=") return actual.endsWith(expected);
  if (operator === "*=") return actual.includes(expected);
  return false;
}

function compoundMatches(compound, element) {
  if (!compound) return false;
  const classes = [...compound.matchAll(/\.([\w-]+)/g)].map((match) => match[1]);
  if (!classes.every((className) => element.classes.includes(className))) return false;

  const attributes = [...compound.matchAll(
    /\[([\w-]+)(?:\s*([~|^$*]?=)\s*(?:"([^"]*)"|'([^']*)'|([^\]\s]+)))?\]/g,
  )];
  return attributes.every((match) => attributeMatches(
    attributeValue(element, match[1]),
    match[2],
    match[3] ?? match[4] ?? match[5],
  ));
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

  const structuralSelector = selector
    .replace(/::[\w-]+/g, "")
    .replace(/:has\([^)]*\)/g, "")
    .replace(/:[\w-]+/g, "")
    .replace(/\s*>\s*/g, " > ")
    .trim();
  const tokens = structuralSelector.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return false;
  let current = element;
  let tokenIndex = tokens.length - 1;

  if (!compoundMatches(tokens[tokenIndex], current)) return false;
  tokenIndex -= 1;

  while (tokenIndex >= 0) {
    if (tokens[tokenIndex] === ">") {
      tokenIndex -= 1;
      current = current.parent;
      if (!current || !compoundMatches(tokens[tokenIndex], current)) return false;
      tokenIndex -= 1;
      continue;
    }

    const ancestorSelector = tokens[tokenIndex];
    current = current.parent;
    while (current && !compoundMatches(ancestorSelector, current)) current = current.parent;
    if (!current) return false;
    tokenIndex -= 1;
  }

  return true;
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

  const value = candidates.at(-1)?.value;
  if (value === undefined && property.startsWith("--") && element.parent) {
    return computedProperty(element.parent, property, viewportWidth);
  }
  return value;
}

function remToPixels(value) {
  const match = value?.match(/^([\d.]+)rem$/);
  assert.ok(match, `Expected a rem length, received ${value}`);
  return Number(match[1]) * 16;
}

function resolveVariables(value, element, viewportWidth) {
  return value?.replace(/var\((--[\w-]+)\)/g, (_, name) => {
    const resolved = computedProperty(element, name, viewportWidth);
    assert.ok(resolved, `Missing CSS variable ${name}`);
    return resolved;
  });
}

function evaluateInlineStart(value, containerWidth) {
  if (value === "0" || value === "0rem") return 0;
  const railMatch = value?.replace(/\s+/g, " ").trim().match(
    /^max\(\s*0rem,\s*calc\(\(100%\s*-\s*([\d.]+rem)\)\s*\/\s*2\)\s*\)$/,
  );
  assert.ok(railMatch, `Unsupported inline-start expression: ${value}`);
  return Math.max(0, (containerWidth - remToPixels(railMatch[1])) / 2);
}

function usedWidth(element, containerWidth, viewportWidth) {
  const width = resolveVariables(
    computedProperty(element, "width", viewportWidth),
    element,
    viewportWidth,
  );
  const maxWidth = resolveVariables(
    computedProperty(element, "max-width", viewportWidth),
    element,
    viewportWidth,
  );
  const requestedWidth = !width || width === "auto" || width === "100%"
    ? containerWidth
    : remToPixels(width);
  return maxWidth && maxWidth !== "none"
    ? Math.min(requestedWidth, remToPixels(maxWidth))
    : requestedWidth;
}

function usedInlineStart(element, containerWidth, viewportWidth) {
  const inlineMargin = computedProperty(element, "margin-inline", viewportWidth);
  const start = resolveVariables(
    computedProperty(element, "margin-inline-start", viewportWidth) ?? inlineMargin,
    element,
    viewportWidth,
  );
  const end = resolveVariables(
    computedProperty(element, "margin-inline-end", viewportWidth) ?? inlineMargin,
    element,
    viewportWidth,
  );
  if (start === "auto" && end === "auto") {
    return Math.max(0, (containerWidth - usedWidth(element, containerWidth, viewportWidth)) / 2);
  }
  return evaluateInlineStart(start, containerWidth);
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

test("non-Inspector Writing pages share the generation notice start rail", () => {
  const runtime = { attributes: [], classes: ["writing-runtime"] };
  const notice = {
    attributes: [],
    classes: ["writing-generation-notice"],
    parent: runtime,
  };
  const layout = {
    attributes: { "data-has-inspector": "false" },
    classes: ["writing-shell"],
    parent: runtime,
  };
  const detail = { attributes: [], classes: ["writing-detail"], parent: layout };
  const page = { attributes: [], classes: ["writing-page"], parent: detail };

  assert.equal(computedProperty(page, "--writing-message-max-width", 1470), "72rem");
  assert.equal(computedProperty(page, "--writing-content-canvas-max-width", 1470), "62rem");
  assert.equal(computedProperty(notice, "margin-inline", 1470), "auto");
  assert.equal(
    resolveVariables(computedProperty(notice, "max-width", 1470), notice, 1470),
    "72rem",
  );
  assert.equal(
    resolveVariables(computedProperty(page, "max-width", 1470), page, 1470),
    "62rem",
  );
  assert.equal(computedProperty(page, "margin-inline-end", 1470), "auto");

  for (const containerWidth of [1230, 1152, 1000]) {
    assert.equal(
      usedInlineStart(page, containerWidth, 1470),
      usedInlineStart(notice, containerWidth, 1470),
    );
  }
});

test("the automatic Inspector uses the approved desktop split and stacks below it", () => {
  const layout = {
    attributes: { "data-has-inspector": "true" },
    classes: ["writing-shell"],
  };
  const inspector = {
    attributes: ["data-writing-inspector"],
    classes: ["writing-inspector"],
    parent: layout,
  };
  const detail = { attributes: [], classes: ["writing-detail"], parent: layout };
  const page = {
    attributes: [],
    classes: ["writing-page"],
    parent: detail,
  };

  assert.equal(
    computedProperty(layout, "grid-template-columns", 1470),
    "minmax(0, 36.5625rem) minmax(0, 1fr)",
  );
  assert.equal(computedProperty(inspector, "position", 1470), "sticky");
  assert.equal(computedProperty(page, "margin-inline-start", 1470), "0");
  assert.equal(computedProperty(page, "margin-inline-end", 1470), "0");
  assert.equal(usedWidth(page, remToPixels("36.5625rem"), 1470), 585);

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
