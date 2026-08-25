import companyOverview from "../../content/otera/company-context.md?raw";
import icpContext from "../../content/otera/icp-context.md?raw";
import personaIndex from "../../content/otera/persona-index.md?raw";
import economicBuyer from "../../content/otera/01-economic-buyer.md?raw";
import executiveChampion from "../../content/otera/02-executive-champion.md?raw";
import functionalChampion from "../../content/otera/03-functional-champion.md?raw";
import technicalEvaluator from "../../content/otera/04-technical-evaluator.md?raw";
import riskApprovalGate from "../../content/otera/05-risk-and-approval-gate.md?raw";
import operationalUser from "../../content/otera/06-operational-user.md?raw";
import transformationPartner from "../../content/otera/07-transformation-partner.md?raw";

import { ARTIFACT_DEFINITIONS } from "./artifactDefinitions";
import { normalizeSearchText } from "./artifactUtils";

const contentById = {
  "company-overview": companyOverview,
  "icp-context": icpContext,
  "persona-index": personaIndex,
  "economic-buyer": economicBuyer,
  "executive-champion": executiveChampion,
  "functional-champion": functionalChampion,
  "technical-evaluator": technicalEvaluator,
  "risk-approval-gate": riskApprovalGate,
  "operational-user": operationalUser,
  "transformation-partner": transformationPartner,
};
export const OTERA_ARTIFACTS = ARTIFACT_DEFINITIONS.map((definition) => {
  const content = contentById[definition.id];
  const facetValues = Object.values(definition.facets);

  return {
    ...definition,
    content,
    searchText: normalizeSearchText([
      definition.title,
      definition.artifactKey,
      definition.description,
      definition.preview,
      definition.tags,
      facetValues,
      definition.sourcePath,
      definition.evidencePosture,
      content,
    ]),
  };
});

export const COLLECTION_STATS = {
  artifacts: OTERA_ARTIFACTS.length,
  lines: OTERA_ARTIFACTS.reduce((total, artifact) => total + artifact.lineCount, 0),
  personas: OTERA_ARTIFACTS.filter(
    (artifact) => artifact.artifactType === "persona_dossier",
  ).length,
  researchCutoff: "2026-08-23",
};
