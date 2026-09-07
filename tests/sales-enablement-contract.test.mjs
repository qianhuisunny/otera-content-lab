import assert from "node:assert/strict";
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
