import { validatePublicSalesEnablementRun } from "./salesEnablementContract.js";

const asOf = "2026-09-06";
const source = (id, title, locator, sourceClass = "local_context") => ({
  id, title, locator, sourceClass, asOf,
});
const evidence = (id, claim, sourceIds, evidenceClass, buyerImplication, safeUse) => ({
  id, claim, sourceIds, evidenceClass, confidence: "bounded", buyerImplication, safeUse,
});

const sources = [
  source("retell-technical-owner", "Retell technical owner context", "content/retell/03-technical-owner.md"),
  source("retell-market-context", "Retell market context", "content/retell/market-context.md"),
  source("retell-market-research", "Retell market research", "research/retell/market-research-output.md", "third_party"),
  source("retell-company-context", "Retell company context", "content/retell/company-context.md"),
  source("retell-claim-ledger", "Retell claim ledger", "research/retell/claim-ledger.md", "company_source"),
  source("retell-governance-approver", "Retell governance approver context", "content/retell/06-governance-approver.md"),
  source("retell-audience-gap-matrix", "Retell audience gap matrix", "research/retell/audience-gap-matrix.md", "inference"),
];

const slideRecords = [
  ["problem", "Production exposes the gaps a demo can hide", "verified", ["retell-technical-owner"], ["Production readiness adds observability, handoffs, and operational ownership.", "A pilot should surface the controls a demo does not exercise."], "Frame the deal around operating a workflow, not merely demonstrating a conversation."],
  ["cost", "Fragmented tooling turns every call into an operations problem", "inference", ["retell-market-context"], ["Disconnected systems create more handoffs to diagnose and govern.", "Measure the effort around the call as well as the call outcome."], "This is a bounded operating-model inference, not a quantified savings claim."],
  ["shift", "Voice AI is moving from experiments to governed workflows", "company_claim", ["retell-market-research"], ["Evaluation should include governance and repeatability from the beginning.", "The buyer needs a path from experiment to accountable production use."], "Use the market context to explain why the evaluation criteria have changed."],
  ["approach", "Treat the agent as a production system, not a voice demo", "verified", ["retell-company-context"], ["Define one workflow, its owners, and the controls required to run it.", "Keep scope narrow enough to review evidence before expansion."], "Position the approach as a practical production discipline."],
  ["workflow", "Build, observe, and improve one bounded workflow", "verified", ["retell-company-context"], ["Start with a single call path and explicit handoffs.", "Review observations with the people who own quality and operations."], "Make the pilot sequence concrete without implying unsupported product capabilities."],
  ["proof", "Proof must stay attached to the claim it supports", "company_claim", ["retell-claim-ledger"], ["Use source-linked claims in the evidence review.", "Mark claims that still need customer or pilot validation."], "Keep proof provenance visible rather than converting it into generic marketing language."],
  ["case_study", "Use a verified workflow story before naming an outcome", "unresolved", [], ["Do not name a customer outcome until a verified source is approved.", "Prepare the story structure while the evidence gap remains open."], "This slide deliberately preserves the case-study evidence gap."],
  ["implementation", "Start with a pilot that has owners and exit criteria", "inference", ["retell-governance-approver"], ["Assign technical, operational, and governance owners before launch.", "Set exit criteria that can be reviewed from pilot evidence."], "Present implementation as a bounded recommendation derived from governance concerns."],
  ["roi", "Measure containment, quality, and operating effort together", "unresolved", [], ["Agree on measurement definitions before baselining the pilot.", "Do not claim ROI until the buyer validates inputs and outcomes."], "The ROI framework is intentionally unquantified until pilot data exists."],
  ["pricing", "Validate usage and support assumptions against the pilot", "unresolved", [], ["Review actual usage assumptions with the appropriate commercial owner.", "Keep price and support statements out of the deck until validated."], "Pricing is a validation topic, not a quoted commitment in this example."],
  ["cta", "Agree on the pilot scope and evidence review", "verified", ["retell-audience-gap-matrix"], ["Confirm the workflow, owners, success criteria, and review date.", "Bring unresolved proof, ROI, and pricing questions to the next conversation."], "Close with the bounded next step requested by the buyer."],
].map(([purpose, headline, proofState, evidenceIds, bodyBullets, speakerNotes], index) => ({
  id: "slide-" + (index + 1), number: index + 1, purpose, headline, bodyBullets,
  speakerNotes, evidenceIds, proofState,
}));

const research = [
  ["company_positioning", "The company context supports a production-oriented evaluation posture.", "retell-company-context"],
  ["product_technical", "Technical ownership centers on production controls and workflow observability.", "retell-technical-owner"],
  ["executive_buyer", "The executive case is a bounded pilot with clear business and operating ownership.", "retell-audience-gap-matrix"],
  ["technical_buyer", "Technical reviewers need implementation owners and evidence review criteria.", "retell-technical-owner"],
  ["market_alternatives", "Market context supports comparing operating approaches without public competitor claims.", "retell-market-context"],
  ["proof_claims", "The claim ledger distinguishes sourced statements from claims that need validation.", "retell-claim-ledger"],
  ["skeptical_review", "Governance concerns make the unresolved proof, ROI, and pricing gaps material.", "retell-governance-approver"],
].map(([id, summary, sourceId]) => ({
  id, summary,
  evidence: [evidence(id + "-evidence", summary, [sourceId], "local_reference",
    "Use this to guide the pilot discussion.", "Keep the claim linked to its cited local reference.")],
}));

const reviewChecks = [
  ["buyer_relevance", "Buyer relevance", "passed", "The deck addresses executive and technical ownership of a production pilot."],
  ["story_arc", "Story arc", "passed", "The narrative moves from production risk to a bounded next step."],
  ["business_outcome", "Business outcome", "warning", "Outcome measures are framed for pilot validation rather than promised."],
  ["scanability", "Scanability", "passed", "Each slide keeps one message and one or two supporting bullets."],
  ["proof", "Proof posture", "blocked", "A verified case-study outcome has not been selected."],
  ["pricing_posture", "Pricing posture", "blocked", "Usage and support assumptions require commercial validation."],
  ["next_step", "Next step", "passed", "The call to action is a scoped pilot and evidence review."],
].map(([id, label, status, detail]) => ({ id, label, status, detail }));

export const RETELL_SALES_ENABLEMENT_EXAMPLE_RUN = validatePublicSalesEnablementRun({
  id: "example_retell_sales_deck_v1",
  workflowId: "sales-enablement",
  companyId: "retell",
  status: "completed",
  stageId: "review",
  stages: ["scope", "research", "narrative", "asset", "review"].map((id) => ({ id, status: "complete" })),
  createdAt: "2026-09-06T00:00:00.000Z",
  updatedAt: "2026-09-06T00:00:00.000Z",
  workstreams: research.map(({ id, summary, evidence: items }) => ({
    id, status: "complete", evidenceCount: items.length, summary,
  })),
  artifact: {
    context: {
      seller: "Retell AI", primaryBuyer: "Executive sponsor", supportingBuyer: "Technical owner",
      salesStage: "Evaluation", objective: "Agree on a bounded pilot and evidence review.",
      evidencePosture: "Source-linked local context; unresolved proof remains explicit.",
    },
    research,
    narrative: {
      situation: "The buyer needs to move an AI voice-agent workflow from demo to production.",
      complication: "Production raises quality, compliance, reliability, operating-cost, and ownership questions.",
      resolution: "Run a bounded pilot with owners, success criteria, and an evidence review.",
      slideRationale: slideRecords.map(({ id, purpose }) => ({
        slideId: id,
        rationale: "Advance the " + purpose.replace("_", " ") + " part of the bounded pilot story.",
      })),
    },
    slides: slideRecords,
    review: {
      checks: reviewChecks,
      warnings: ["Business outcomes are a pilot measurement framework, not a promised result."],
      blockingGaps: [
        "Verified case-study outcome is not yet selected.",
        "ROI requires buyer-approved pilot baselines and outcomes.",
        "Pricing and support assumptions require commercial validation.",
      ],
      doNotOverclaim: [
        "Do not name a customer outcome without a verified case-study source.",
        "Do not claim ROI or savings before pilot inputs are validated.",
        "Do not quote prices or support terms before commercial validation.",
      ],
    },
    sources,
  },
  error: null,
});
