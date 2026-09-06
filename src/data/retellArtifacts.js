import companyOverview from "../../content/retell/company-context.md?raw";
import founderContext from "../../content/retell/founder-context.md?raw";
import marketContext from "../../content/retell/market-context.md?raw";
import icpContext from "../../content/retell/icp-context.md?raw";
import personaIndex from "../../content/retell/persona-index.md?raw";
import executiveSponsor from "../../content/retell/01-executive-sponsor.md?raw";
import workflowOwner from "../../content/retell/02-workflow-owner.md?raw";
import technicalOwner from "../../content/retell/03-technical-owner.md?raw";
import agentBuilder from "../../content/retell/04-agent-builder.md?raw";
import conversationQualityOwner from "../../content/retell/05-conversation-quality-owner.md?raw";
import governanceApprover from "../../content/retell/06-governance-approver.md?raw";
import solutionPartner from "../../content/retell/07-solution-partner-platform-operator.md?raw";

import { normalizeSearchText } from "./artifactUtils";
import { RETELL_ARTIFACT_DEFINITIONS } from "./retellArtifactDefinitions";

const contentById = {
  "retell-company-overview": companyOverview,
  "retell-founder-context": founderContext,
  "retell-market-context": marketContext,
  "retell-icp-context": icpContext,
  "retell-persona-index": personaIndex,
  "retell-executive-sponsor": executiveSponsor,
  "retell-workflow-owner": workflowOwner,
  "retell-technical-owner": technicalOwner,
  "retell-agent-builder": agentBuilder,
  "retell-conversation-quality-owner": conversationQualityOwner,
  "retell-governance-approver": governanceApprover,
  "retell-solution-partner-platform-operator": solutionPartner,
};

export const RETELL_ARTIFACTS = RETELL_ARTIFACT_DEFINITIONS.map((definition) => {
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

export const RETELL_COLLECTION_STATS = {
  artifacts: RETELL_ARTIFACTS.length,
  lines: RETELL_ARTIFACTS.reduce((total, artifact) => total + artifact.lineCount, 0),
  personas: RETELL_ARTIFACTS.filter(
    (artifact) => artifact.artifactType === "persona_dossier",
  ).length,
  researchCutoff: "2026-09-06",
};
