import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { relative } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  buildSalesEnablementInput,
  loadSalesEnablementBundle,
} from "../server/sales-enablement-context.js";
import { RETELL_SALES_ENABLEMENT_INPUT } from "../src/data/salesEnablementScenario.js";

const repoRoot = fileURLToPath(new URL("../", import.meta.url));
const RUNTIME_METADATA_PATHS = new Set([
  "skills/sales-enablement/workflow.json",
  "skills/sales-enablement/context-sources.json",
  "skills/sales-enablement/schemas/run-input.schema.json",
  "skills/sales-enablement/schemas/run-output.schema.json",
]);
const SALES_DECK_JUDGMENT_PATHS = [
  "skills/sales-enablement/runtime/common-principles.md",
  "skills/sales-enablement/skills/sales-deck/SKILL.md",
  "skills/sales-enablement/skills/sales-deck/references/deck-frameworks.md",
  "skills/sales-enablement/skills/sales-deck/evals/evals.json",
];
const SIBLING_ASSET_HEADINGS = /## (?:One-Pagers \/ Leave-Behinds|Objection Handling Docs|ROI Calculators & Value Props|Demo Scripts & Talk Tracks|Case Study Briefs \(Sales Format\)|Proposal Templates|Sales Playbooks|Buyer Persona Cards)/;

test("the server reads all 24 allowlisted sources and builds seven packets", async () => {
  const bundle = await loadSalesEnablementBundle();

  assert.equal(bundle.sourceInventory.length, 24);
  assert.equal(Object.keys(bundle.lanePackets).length, 7);
  for (const source of bundle.sourceInventory) {
    assert.ok(source.lanes.some((lane) =>
      bundle.lanePackets[lane].includes('<source id="' + source.id + '"')),
    source.path + " must appear in at least one routed packet");
  }
  assert.match(bundle.lanePackets.skeptical_review, /prompt-provenance/);
  assert.doesNotMatch(bundle.lanePackets.company_positioning, /prompt-provenance/);
  assert.match(bundle.skillPacket, /"id":\s*1/);
});

test("the server loads only common principles and the sales-deck leaf package", async () => {
  const reads = [];
  const bundle = await loadSalesEnablementBundle({
    repoRoot,
    readFileImpl: async (path, encoding) => {
      reads.push(relative(repoRoot, String(path)));
      return readFile(path, encoding);
    },
  });
  const judgmentReads = reads.filter((path) =>
    path.startsWith("skills/sales-enablement/") && !RUNTIME_METADATA_PATHS.has(path));

  assert.deepEqual(judgmentReads, SALES_DECK_JUDGMENT_PATHS);
  assert.match(bundle.skillPacket, /<common-sales-principles[^>]*>/);
  assert.match(bundle.skillPacket, /<sales-deck-skill[^>]*>/);
  assert.match(bundle.skillPacket, /<deck-reference[^>]*>/);
  assert.match(bundle.skillPacket, /<deck-evaluation-reference[^>]*>/);
  assert.match(bundle.skillPacket, /Sales Uses What Sales Trusts/);
  assert.match(bundle.skillPacket, /10-12 Slide Framework/);
  assert.match(bundle.skillPacket, /Slide-by-Slide Template/);
  assert.match(bundle.skillPacket, /"id":\s*1/);
  assert.doesNotMatch(bundle.skillPacket, SIBLING_ASSET_HEADINGS);
  assert.doesNotMatch(bundle.skillPacket, /"id":\s*[2-6]\b/);
});

test("the server rejects a sales-deck eval packet whose IDs are not exactly one", async () => {
  for (const evals of [[], [{ id: 1 }, { id: 2 }]]) {
    await assert.rejects(loadSalesEnablementBundle({
      repoRoot,
      readFileImpl: async (path, encoding) => {
        if (relative(repoRoot, String(path)) === SALES_DECK_JUDGMENT_PATHS[3]) {
          return JSON.stringify({ skill_name: "sales-deck", evals });
        }
        return readFile(path, encoding);
      },
    }), /sales-deck evals must contain exactly eval id 1/i);
  }
});

test("provider input contains the complete inventory but isolates named packets", async () => {
  const bundle = await loadSalesEnablementBundle();
  const input = buildSalesEnablementInput({ bundle, requestInput: RETELL_SALES_ENABLEMENT_INPUT });
  const serialized = JSON.stringify(input);

  assert.match(serialized, /untrusted_reference_data/);
  assert.match(serialized, /company_positioning/);
  assert.match(serialized, /skeptical_review/);
  assert.ok(bundle.sourceInventory.every(({ id }) => serialized.includes(id)));
  const providerInput = JSON.parse(input[0].content);
  assert.equal(providerInput.skillPacket, bundle.skillPacket);
  assert.doesNotMatch(providerInput.skillPacket, SIBLING_ASSET_HEADINGS);
  assert.doesNotMatch(providerInput.skillPacket, /"id":\s*[2-6]\b/);
  assert.doesNotMatch(bundle.skillPacket, /\bsk-[A-Za-z0-9]{20,}\b/);
});

test("manifest paths cannot escape the approved Retell directories", async () => {
  const fakeRead = async (path) => {
    if (String(path).endsWith("context-sources.json")) {
      return JSON.stringify({ sources: [{
        id: "escape", path: "../.env", sourceType: "raw_research",
        lanes: ["proof_claims"],
      }] });
    }
    return "{}";
  };

  await assert.rejects(
    loadSalesEnablementBundle({ readFileImpl: fakeRead }),
    /approved Retell directories/i,
  );
});
