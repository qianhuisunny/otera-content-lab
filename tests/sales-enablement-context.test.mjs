import assert from "node:assert/strict";
import test from "node:test";
import {
  buildSalesEnablementInput,
  loadSalesEnablementBundle,
} from "../server/sales-enablement-context.js";
import { RETELL_SALES_ENABLEMENT_INPUT } from "../src/data/salesEnablementScenario.js";

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

test("provider input contains the complete inventory but isolates named packets", async () => {
  const bundle = await loadSalesEnablementBundle();
  const input = buildSalesEnablementInput({ bundle, requestInput: RETELL_SALES_ENABLEMENT_INPUT });
  const serialized = JSON.stringify(input);

  assert.match(serialized, /untrusted_reference_data/);
  assert.match(serialized, /company_positioning/);
  assert.match(serialized, /skeptical_review/);
  assert.ok(bundle.sourceInventory.every(({ id }) => serialized.includes(id)));
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
