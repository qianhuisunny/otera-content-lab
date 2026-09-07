export async function generateWriting(session, stage, { signal, fetchImpl = fetch } = {}) {
  let response;
  try {
    response = await fetchImpl("/api/writing/generate", {
      method: "POST", signal, headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyId: session.companyId, stage, brief: session.brief,
        outline: stage === "draft" ? session.outline : undefined }),
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new Error("Could not reach the writing server. Check your connection and try again.");
  }
  if (!response.headers.get("content-type")?.includes("application/json")) {
    throw new Error("The writing backend is unavailable in this preview. Use the Vercel site or a local preview with the backend configured.");
  }
  let result;
  try { result = await response.json(); }
  catch { throw new Error("The writing server returned an invalid response. Please try again."); }
  if (!response.ok) throw new Error(result?.error?.message || "Generation failed. Please try again.");
  if (result?.companyId !== session.companyId || result.stage !== stage || typeof result.markdown !== "string" || !result.markdown.trim() || result.markdown.length > 100000 || !Array.isArray(result.sources)) {
    throw new Error("The writing server returned an invalid result. Your existing edits have been kept.");
  }
  return result;
}

export function liveWritingScenario(fixture, session) {
  const result = session.draftResult;
  const sources = result?.sources ?? session.outlineResult?.sources ?? [];
  const sourceNotes = sources.map((source) => `${source.title} (${source.id}; research cutoff ${source.cutoff})`);
  const researchSummary = "Uses saved company and audience documents, not newly collected evidence. No live web research or automatic fact-checking was performed. Reverify time-sensitive facts and source attribution before publishing.";
  const words = session.articleHtml.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return {
    ...fixture,
    title: session.brief.opportunity || session.brief.keyword || "New article",
    articleId: "Unsaved draft",
    status: session.generation?.status === "generating" ? "Generating" : ({ brief: "Brief", outline: "Outline", draft: "Draft ready", review: "Editing" }[session.currentStep] ?? "Draft"),
    draftMeta: result ? `${Math.round(result.durationMs / 1000)}s · ${sources.length} context documents · ${words} words · ${result.model}` : "No article generated yet",
    researchTitle: "Saved context used for this draft",
    researchSummary,
    researchMarkdown: `# Saved writing context\n\n${researchSummary}\n\n${sourceNotes.map((note) => `- ${note}`).join("\n")}\n\nGenerated: ${result?.generatedAt ?? "Not generated"}\nModel: ${result?.model ?? "Not generated"}\n`,
    exportFilename: `${session.companyId}-writing-context.md`,
    activityItems: result ? [
      { id: "context", title: "Loaded saved company context", description: `${sources.length} context documents supplied to the model.`, details: sourceNotes },
      { id: "writing", title: "Generated article", description: `Written by ${result.model} from your brief and approved outline.`, details: ["Formatted Markdown for the editor. Editorial checks and live source verification are still pending."] },
    ] : [],
    coverageItems: [{ label: "Editorial checks pending — not automatically assessed", covered: false }],
  };
}
