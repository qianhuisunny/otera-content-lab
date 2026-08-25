export const WRITING_STEP_ORDER = ["brief", "outline", "draft", "review"];

export const WRITING_PHASES = [
  {
    number: "01",
    label: "BRIEF IT",
    steps: [
      { id: "brief", label: "Pick angle & format", description: "Intent, format, audience" },
      { id: "outline", label: "Plan outline", description: "Sketch the structure" },
    ],
  },
  {
    number: "02",
    label: "WRITE IT",
    steps: [
      { id: "draft", label: "Drafted first version", description: "Agent's first draft" },
      { id: "review", label: "Review & edit", description: "Edit the article" },
      { id: "polish", label: "Polish", description: "Wordsmith, restructure, refine", disabled: true },
      { id: "feedback", label: "Invite feedback", description: "Optional teammate reviews", disabled: true },
    ],
  },
  {
    number: "03",
    label: "SHIP IT",
    steps: [
      { id: "meta", label: "Adjust title & meta", description: "Title, slug, meta, cover", disabled: true },
      { id: "publish", label: "Publish", description: "Export and ship", disabled: true },
    ],
  },
];

export const WRITING_SCENARIO = {
  articleId: "OT-18",
  title: "How governed AI agents automate insurance claims across legacy systems",
  status: "Reviewing",
  researchCutoff: "2026-08-23",
  brief: {
    opportunity: "Governed claims automation for regulated insurers",
    format: "Explainer",
    audiences: ["Operations Leader", "Enterprise Architect", "Transformation Lead"],
    keyword: "agentic claims automation",
    intent:
      "An insurance operations or technology leader wants to understand how governed agents coordinate document intake, rules, exceptions, human review, and system-of-record updates without replacing core claims systems.",
    directions:
      "Separate company claims from independently corroborated evidence. Reverify time-sensitive product and customer facts before external publication.",
    targetLength: "2,500–3,200",
  },
  outline: `1. [Intro: Why claims automation stalls when documents, rules, exceptions, and legacy systems meet. 2–3 sentences.]

2. h2: What agentic claims automation changes [Define the operating problem and distinguish governed workflow execution from extraction-only tools.]

3. h2: How governed agents move a claim across systems [Describe intake, classification, validation, business rules, system writes, and exception handling.]
   • h3: Document and email intake
   • h3: Validation, confidence, and business rules
   • h3: Human review and exception recovery

4. h2: Why legacy claims systems stay in place [Explain the operating-layer model, integration boundaries, credentials, logs, and rollback.]

5. h2: Evidence an insurer should require [Representative ground truth, error taxonomy, end-to-end integration tests, and operational ownership.]

6. h2: What Otera publicly claims—and what still needs verification [Attribute company-reported customer outcomes and flag open diligence questions.]

7. h2: A production-readiness checklist [Architecture, governance, support, and measurable operational outcomes.]

8. h2: FAQ [Accuracy, human review, core-system replacement, integration maturity, and evaluation.]`,
  researchTitle: "Governed claims automation research",
  researchSummary:
    "A source-aware synthesis of Otera product context, insurance ICP signals, technical evaluation criteria, and public customer evidence. Company-reported outcomes require attribution and time-sensitive facts must be reverified before publication.",
  articleHtml: `<h1>How governed AI agents automate insurance claims across legacy systems</h1>
<p>Claims automation rarely fails because a team cannot extract another field from a document. It fails when emails, PDFs, business rules, approvals, exceptions, and legacy claims systems must behave like one governed process.</p>
<h2>What agentic claims automation changes</h2>
<p>Agentic claims automation coordinates classification, validation, decision support, system updates, and human review across an end-to-end workflow. The useful distinction is not whether a model is present; it is whether the operating process remains observable, reversible, and accountable.</p>
<h2>How governed agents move a claim across systems</h2>
<p>A production design starts with representative intake, applies rules and confidence thresholds, writes only through approved permissions, and sends consequential exceptions to a reviewer with the evidence needed to decide.</p>
<blockquote>Human review is a control only when the reviewer receives context, authority, and a manageable exception load.</blockquote>
<h2>Evidence an insurer should require</h2>
<ul><li>A benchmark using representative ground truth</li><li>An error taxonomy tied to business consequence</li><li>An end-to-end test including failure recovery</li><li>Clear ownership for monitoring, change, and rollback</li></ul>
<h2>Public claims and verification</h2>
<p>Otera and its partners publish customer outcomes, including claims-processing improvements. These are company-reported outcomes and should be attributed to the original dated source. Reverify product capabilities, customer status, leadership, and integration counts before external publication.</p>
<table><thead><tr><th>Dimension</th><th>Extraction-only automation</th><th>Governed agent workflow</th></tr></thead><tbody><tr><td>Exceptions</td><td>Manual queue after extraction</td><td>Context, confidence, routing, and recovery path</td></tr><tr><td>Core systems</td><td>Point integration</td><td>Controlled writes across an orchestrated process</td></tr></tbody></table>`,
};

export const ACTIVITY_ITEMS = [
  { id: "questions", title: "Generating research questions", description: "Turning the approved Otera outline into evidence-aware research questions." },
  { id: "research", title: "Researching the topic", description: "Reviewing Otera context, insurance workflow evidence, and technical diligence criteria." },
  { id: "writing", title: "Writing the draft", description: "Composing the article from the approved outline and source posture." },
  { id: "post", title: "Post-processing", description: "Formatting the article, checking attribution, and reviewing editorial voice.", details: ["Formatting headings, links, and the comparison table.", "Checking company claims for source attribution.", "Flagging facts that require re-verification before publication."] },
];

export const COVERAGE_ITEMS = [
  { label: "governed claims automation", covered: true },
  { label: "human review and exceptions", covered: true },
  { label: "legacy system integration", covered: true },
  { label: "independent customer evidence", covered: false },
];
