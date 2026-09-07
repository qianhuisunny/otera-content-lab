import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  validatePublicSalesEnablementRun,
  validateSalesEnablementArtifact,
  validateSalesEnablementInput,
} from "../src/data/salesEnablementContract.js";
import { RETELL_SALES_ENABLEMENT_EXAMPLE_RUN } from "../src/data/salesEnablementExample.js";
import { RETELL_SALES_ENABLEMENT_INPUT } from "../src/data/salesEnablementScenario.js";

test("the bounded Retell input is accepted and unsupported requests are rejected", () => {
  assert.deepEqual(validateSalesEnablementInput(RETELL_SALES_ENABLEMENT_INPUT),
    RETELL_SALES_ENABLEMENT_INPUT);
  assert.equal(validateSalesEnablementInput({
    ...RETELL_SALES_ENABLEMENT_INPUT,
    salesStage: "discovery",
    primaryBuyer: "workflow_owner",
    supportingBuyer: "governance_approver",
  }).salesStage, "discovery");
  assert.throws(() => validateSalesEnablementInput({
    ...RETELL_SALES_ENABLEMENT_INPUT, companyId: "otera",
  }), /supported company/i);
  assert.throws(() => validateSalesEnablementInput({
    ...RETELL_SALES_ENABLEMENT_INPUT, knownObjections: Array(11).fill("risk"),
  }), /objections/i);
  assert.throws(() => validateSalesEnablementInput({
    ...RETELL_SALES_ENABLEMENT_INPUT, assetType: "public_comparison_page",
  }), /public comparison.*competitors workflow/i);
});

test("the example is a complete eleven-slide, seven-workstream public run", () => {
  const run = validatePublicSalesEnablementRun(RETELL_SALES_ENABLEMENT_EXAMPLE_RUN);
  assert.equal(run.status, "completed");
  assert.equal(run.workstreams.length, 7);
  assert.equal(run.artifact.slides.length, 11);
  assert.deepEqual(run.artifact.slides.map(({ number }) => number),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  assert.deepEqual(new Set(run.artifact.slides.map(({ purpose }) => purpose)),
    new Set(["problem", "cost", "shift", "approach", "workflow", "proof",
      "case_study", "implementation", "roi", "pricing", "cta"]));
  assert.ok(run.artifact.slides
    .filter(({ purpose }) => ["proof", "case_study", "roi"].includes(purpose))
    .every(({ evidenceIds, proofState }) => evidenceIds.length > 0 || proofState === "unresolved"));
  assert.doesNotMatch(JSON.stringify(run), /chain.of.thought|reasoning_content|api[_-]?key/i);
});

test("invalid artifacts never pass as approved collateral", () => {
  const invalid = structuredClone(RETELL_SALES_ENABLEMENT_EXAMPLE_RUN.artifact);
  invalid.slides.pop();
  assert.throws(() => validateSalesEnablementArtifact(invalid), /11 slides/i);
});

test("evidence uses the canonical classifications and schema-matched bounds", () => {
  const invalidClass = structuredClone(RETELL_SALES_ENABLEMENT_EXAMPLE_RUN.artifact);
  invalidClass.research[0].evidence[0].evidenceClass = "local_reference";
  assert.throws(() => validateSalesEnablementArtifact(invalidClass), /evidence class/i);
  const invalidConfidence = structuredClone(RETELL_SALES_ENABLEMENT_EXAMPLE_RUN.artifact);
  invalidConfidence.research[0].evidence[0].confidence = "bounded";
  assert.throws(() => validateSalesEnablementArtifact(invalidConfidence), /confidence/i);

  const schema = JSON.parse(readFileSync(new URL(
    "../skills/sales-enablement/schemas/run-output.schema.json", import.meta.url), "utf8"));
  const evidence = schema.$defs.evidence.properties;
  assert.deepEqual(evidence.evidenceClass.enum,
    ["verified_fact", "company_claim", "field_signal", "inference"]);
  assert.deepEqual(evidence.confidence.enum, ["high", "medium", "low"]);
  assert.equal(evidence.sourceIds.minItems, 1);
  assert.equal(evidence.sourceIds.maxItems, 20);
  assert.equal(evidence.sourceIds.uniqueItems, undefined);
  const headline = schema.$defs.slide.properties.headline;
  assert.equal(schema.$defs[headline.$ref.slice("#/$defs/".length)].maxLength, 500);
});

test("local validation rejects duplicate source and evidence references independently of wire constraints", () => {
  const duplicateSources = structuredClone(RETELL_SALES_ENABLEMENT_EXAMPLE_RUN.artifact);
  const sourceIds = duplicateSources.research[0].evidence[0].sourceIds;
  sourceIds.push(sourceIds[0]);
  assert.throws(() => validateSalesEnablementArtifact(duplicateSources), /duplicate.*source ID/i);

  const duplicateEvidence = structuredClone(RETELL_SALES_ENABLEMENT_EXAMPLE_RUN.artifact);
  const evidenceIds = duplicateEvidence.slides.find((slide) => slide.evidenceIds.length).evidenceIds;
  evidenceIds.push(evidenceIds[0]);
  assert.throws(() => validateSalesEnablementArtifact(duplicateEvidence), /duplicate.*evidence ID/i);
});
