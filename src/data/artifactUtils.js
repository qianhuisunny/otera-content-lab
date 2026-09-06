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
      (type === "company" &&
        ["company_context", "founder_context", "market_context"].includes(
          artifact.artifactType,
        )) ||
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
  "company-context.md": "#artifact-retell-company-overview",
  "founder-context.md": "#artifact-retell-founder-context",
  "market-context.md": "#artifact-retell-market-context",
  "icp-context.md": "#artifact-retell-icp-context",
  "persona-index.md": "#artifact-retell-persona-index",
  "01-executive-sponsor.md": "#artifact-retell-executive-sponsor",
  "02-workflow-owner.md": "#artifact-retell-workflow-owner",
  "03-technical-owner.md": "#artifact-retell-technical-owner",
  "04-agent-builder.md": "#artifact-retell-agent-builder",
  "05-conversation-quality-owner.md": "#artifact-retell-conversation-quality-owner",
  "06-governance-approver.md": "#artifact-retell-governance-approver",
  "07-solution-partner-platform-operator.md":
    "#artifact-retell-solution-partner-platform-operator",
};

export function resolveArtifactHref(href = "") {
  if (/^(?:https?:|mailto:|#)/i.test(href)) return href;

  const withoutFragment = href.split("#", 1)[0];
  const filename = decodeURIComponent(withoutFragment).split("/").filter(Boolean).at(-1)?.toLowerCase();

  return artifactAnchorByFilename[filename] ?? "#evidence";
}
