import { readFile } from "node:fs/promises";
import path from "node:path";
import { ARTIFACT_DEFINITIONS } from "../src/data/artifactDefinitions.js";
import { RETELL_ARTIFACT_DEFINITIONS } from "../src/data/retellArtifactDefinitions.js";

const companies = { otera: ARTIFACT_DEFINITIONS, retell: RETELL_ARTIFACT_DEFINITIONS };
const coreTypes = new Set(["company_context", "icp_context", "persona_index"]);

export async function loadCompanyContext(companyId, audiences = []) {
  if (!Object.hasOwn(companies, companyId)) throw new Error("Unknown company");
  const definitions = companies[companyId];
  const words = audiences.join(" ").toLowerCase().match(/[a-z]{4,}/g) ?? [];
  const ranked = definitions.filter((item) => !coreTypes.has(item.artifactType))
    .map((item) => ({ item, score: words.filter((word) => `${item.title} ${item.facets.roles.join(" ")}`.toLowerCase().includes(word)).length }))
    .filter(({ score }) => score > 0).sort((a, b) => b.score - a.score).slice(0, 2).map(({ item }) => item);
  const selected = [...definitions.filter((item) => coreTypes.has(item.artifactType)), ...ranked];
  const sources = [];
  let text = "";
  for (const item of selected) {
    // Paths come only from committed registries, never from request data.
    const markdown = await readFile(path.join(process.cwd(), item.contentPath), "utf8");
    const document = `\n\n## ${item.title}\nSource ID: ${item.artifactKey}\nResearch cutoff: ${item.researchCutoff}\n\n${markdown}`;
    if (text.length + document.length > 180000) continue;
    text += document;
    sources.push({ id: item.artifactKey, title: item.title, cutoff: item.researchCutoff });
  }
  if (sources.length < 3) throw new Error("Company context is incomplete");
  return { text, sources };
}
