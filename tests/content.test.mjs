import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { ARTIFACT_DEFINITIONS } from "../src/data/artifactDefinitions.js";
import {
  filterArtifacts,
  normalizeSearchText,
  resolveArtifactHref,
} from "../src/data/artifactUtils.js";

const expectedHashes = {
  "company-overview": "86f13bb99c0e018787d2ebdc405addf54604c845c84599e035456142975ef2f2",
  "icp-context": "3bbe35c206d563b0aa39c55ac84a36432f1cc8e895e089acfa5cef96fc41bb06",
  "persona-index": "e6b968c8fbf212630ac8dc0af23842c9e1260edad2d078d3b4576d670030388b",
  "economic-buyer": "34da657c10385dcb4d121a3ab8ed99f136ffdffa9e868277610a795afb90d3fd",
  "executive-champion": "e60f214c2679051c147aa1b0c8ff784df66eca036666dada2b9cefad0c20b303",
  "functional-champion": "34d79b01e5b1542a83c177a8d9d47fb8733a1692f133d3223db7fe31d827c48f",
  "technical-evaluator": "2679c283c129aad7e3710c1151cfd28667c9fd44993608f581828b909bb59fac",
  "risk-approval-gate": "d1274bac78375c546330aafa4b33eab426af9524529dc001efcb0ea2d2feaef4",
  "operational-user": "cbb2a7303850c633ee87ebcd5a57439f26802fe888402c9768f07c9e4c7c0389",
  "transformation-partner": "92b1e67c48820c07e1b78bc0dfc644eeea8c076cac0383fa5c1776e2aa675e4d",
};

test("the manifest contains every exact Otera source artifact once", async () => {
  assert.equal(ARTIFACT_DEFINITIONS.length, 10);
  assert.equal(new Set(ARTIFACT_DEFINITIONS.map((artifact) => artifact.id)).size, 10);

  for (const artifact of ARTIFACT_DEFINITIONS) {
    const fileUrl = new URL(`../${artifact.contentPath}`, import.meta.url);
    const content = await readFile(fileUrl, "utf8");
    const digest = createHash("sha256").update(content).digest("hex");

    assert.ok(content.trim().length > 0, `${artifact.id} must not be empty`);
    assert.equal(digest, expectedHashes[artifact.id], `${artifact.id} must remain an exact source snapshot`);
  }
});

test("search is normalized, case-insensitive, and combines with artifact type", () => {
  const artifacts = [
    {
      id: "company-overview",
      artifactType: "company_context",
      searchText: normalizeSearchText(["Otera", "Allianz", "claims"]),
    },
    {
      id: "functional-champion",
      artifactType: "persona_dossier",
      searchText: normalizeSearchText(["Trade finance", "workflow owner"]),
    },
  ];

  assert.deepEqual(filterArtifacts(artifacts, "ALLIANZ", "all").map(({ id }) => id), [
    "company-overview",
  ]);
  assert.deepEqual(
    filterArtifacts(artifacts, "  trade   finance ", "persona_dossier").map(({ id }) => id),
    ["functional-champion"],
  );
  assert.deepEqual(filterArtifacts(artifacts, "trade finance", "company_context"), []);
  assert.deepEqual(filterArtifacts(artifacts, "no-such-result", "all"), []);
});

test("Markdown links keep sources external and route known local dossiers on-page", () => {
  assert.equal(resolveArtifactHref("https://www.otera.ai/security"), "https://www.otera.ai/security");
  assert.equal(resolveArtifactHref("01-economic-buyer.md"), "#artifact-economic-buyer");
  assert.equal(
    resolveArtifactHref("Otera Personas/05-risk-and-approval-gate.md"),
    "#artifact-risk-approval-gate",
  );
  assert.equal(resolveArtifactHref("../Otera ICP context.md"), "#artifact-icp-context");
  assert.equal(resolveArtifactHref("unknown-local-note.md"), "#evidence");
});
