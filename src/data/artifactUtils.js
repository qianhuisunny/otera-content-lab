export function normalizeSearchText(parts) {
  return parts
    .flat(Infinity)
    .filter((part) => part !== null && part !== undefined)
    .join(" ")
    .toLocaleLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function filterArtifacts(artifacts, query, type = "all") {
  const normalizedQuery = normalizeSearchText([query]);

  return artifacts.filter((artifact) => {
    const matchesType =
      type === "all" ||
      artifact.artifactType === type ||
      (type === "personas" &&
        ["persona_index", "persona_dossier"].includes(artifact.artifactType));
    const matchesQuery =
      normalizedQuery.length === 0 || artifact.searchText.includes(normalizedQuery);

    return matchesType && matchesQuery;
  });
}

const artifactAnchorByFilename = {
  "otera.md": "#artifact-company-overview",
  "otera icp context.md": "#artifact-icp-context",
  "readme.md": "#artifact-persona-index",
  "01-economic-buyer.md": "#artifact-economic-buyer",
  "02-executive-champion.md": "#artifact-executive-champion",
  "03-functional-champion.md": "#artifact-functional-champion",
  "04-technical-evaluator.md": "#artifact-technical-evaluator",
  "05-risk-and-approval-gate.md": "#artifact-risk-approval-gate",
  "06-operational-user.md": "#artifact-operational-user",
  "07-transformation-partner.md": "#artifact-transformation-partner",
};

export function resolveArtifactHref(href = "") {
  if (/^(?:https?:|mailto:|#)/i.test(href)) return href;

  const withoutFragment = href.split("#", 1)[0];
  const filename = decodeURIComponent(withoutFragment).split("/").filter(Boolean).at(-1)?.toLowerCase();

  return artifactAnchorByFilename[filename] ?? "#evidence";
}
