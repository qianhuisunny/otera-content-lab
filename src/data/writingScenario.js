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

const OTERA_SCENARIO = {
  companyId: "otera",
  companyName: "Otera",
  articleId: "OT-18",
  title: "How governed AI agents automate insurance claims across legacy systems",
  status: "Reviewing",
  researchCutoff: "2026-08-23",
  exportFilename: "otera-governed-claims-research.md",
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
  activityItems: [
    { id: "questions", title: "Generating research questions", description: "Turning the approved Otera outline into evidence-aware research questions." },
    { id: "research", title: "Researching the topic", description: "Reviewing Otera context, insurance workflow evidence, and technical diligence criteria." },
    { id: "writing", title: "Writing the draft", description: "Composing the article from the approved outline and source posture." },
    { id: "post", title: "Post-processing", description: "Formatting the article, checking attribution, and reviewing editorial voice.", details: ["Formatting headings, links, and the comparison table.", "Checking company claims for source attribution.", "Flagging facts that require re-verification before publication."] },
  ],
  coverageItems: [
    { label: "governed claims automation", covered: true },
    { label: "human review and exceptions", covered: true },
    { label: "legacy system integration", covered: true },
    { label: "independent customer evidence", covered: false },
  ],
};

const RETELL_SCENARIO = {
  companyId: "retell",
  companyName: "Retell AI",
  articleId: "RA-01",
  title: "How to deploy production AI voice agents without losing control of quality or compliance",
  status: "Reviewing",
  researchCutoff: "2026-09-06",
  exportFilename: "retell-production-voice-agents-research.md",
  brief: {
    opportunity: "Production voice-agent operations for high-volume customer workflows",
    format: "Technical guide",
    audiences: ["Workflow Owner", "Technical Owner", "Governance Approver"],
    keyword: "production AI voice agents",
    intent:
      "An operations or technical leader wants a practical model for selecting, testing, deploying, monitoring, and improving an AI voice agent while preserving safe handoffs and accountable controls.",
    directions:
      "Lead with the workflow, exception, handoff, and measurable outcome. Distinguish official product and legal documentation, vendor-selected customer evidence, community language, and researcher inference. Reverify pricing, product capabilities, geography, and contract terms before publication.",
    targetLength: "2,500–3,200",
  },
  outline: `1. [Intro: A voice demo proves that an agent can talk; production proves that the whole operating system can recover when real calls go wrong. 2–3 sentences.]

2. h2: Start with the phone workflow, not the voice [Define the business outcome, boundaries, high-risk actions, and safe human handoff.]

3. h2: Map the production stack [Explain telephony, speech, turn-taking, models, tools, transfers, and the systems of record around the call.]
   • h3: Conversation behavior and latency
   • h3: Business-system actions and retries
   • h3: Transfers, exceptions, and fallback

4. h2: Test what customers will actually say [Use representative calls, audio simulation, adversarial cases, regression suites, and outcome-level scoring.]

5. h2: Release and monitor as an operating team [Cover versioning, traffic control, live monitoring, QA, alerts, incident diagnosis, and ownership.]

6. h2: Make compliance configuration-specific [Inventory data, geography, consent, recording, disclosure, retention, model use, prohibited workflows, and contract terms.]

7. h2: Measure cost per completed outcome [Include connected minutes, telephony, models, voices, QA, concurrency, implementation, and human cleanup.]

8. h2: Production-readiness checklist [Workflow, architecture, test evidence, governance conditions, economics, and operating ownership.]`,
  researchTitle: "Production AI voice-agent operations research",
  researchSummary:
    "A source-aware synthesis of Retell AI product documentation, company and founder context, ICP and buying-committee evidence, public customer cases, market alternatives, and legal constraints. Customer outcomes are vendor-selected, compliance depends on configuration and contract terms, and time-sensitive facts must be reverified before publication.",
  articleHtml: `<h1>How to deploy production AI voice agents without losing control of quality or compliance</h1>
<p>A convincing voice demo proves that an agent can complete one clean conversation. Production requires something harder: a system that can handle interruptions, latency, tool failures, off-script requests, transfers, and policy boundaries across thousands of real calls.</p>
<h2>Start with the phone workflow, not the voice</h2>
<p>Define the business outcome, the systems the agent may update, the actions it must never take, and the exact conditions for handing work to a person. “Human-like” is not an operating metric; completed outcomes and safe exception handling are.</p>
<h2>Map the production stack</h2>
<p>A deployed agent coordinates telephony, speech recognition, turn-taking, response generation, speech synthesis, tools, and transfers. Retell AI provides a build-and-operate layer across that stack, while model, voice, carrier, and customer-system dependencies still shape end-to-end performance.</p>
<blockquote>A handoff is only safe when the receiving person gets the context, authority, and time needed to finish the call.</blockquote>
<h2>Test what customers will actually say</h2>
<ul><li>Build representative audio and text scenarios from the intended workflow</li><li>Turn failures into repeatable regression tests</li><li>Score business outcomes, action accuracy, transfers, latency, and recovery</li><li>Test the fully configured stack before moving production traffic</li></ul>
<h2>Make compliance configuration-specific</h2>
<p>Security attestations and product controls do not make every calling workflow compliant by default. Teams still need to review consent, disclosure, recording, retention, data routing, model use, prohibited destinations, and the contract that applies to their deployment.</p>
<table><thead><tr><th>Production question</th><th>Evidence to require</th></tr></thead><tbody><tr><td>Will the workflow recover?</td><td>Representative failure cases, retry rules, transfer paths, and rollback</td></tr><tr><td>Can the team operate it?</td><td>Monitoring, QA, alerts, ownership, and a repeatable improvement loop</td></tr><tr><td>Is the use permitted?</td><td>Workflow-specific legal review, data map, controls, and contract terms</td></tr></tbody></table>`,
  activityItems: [
    { id: "questions", title: "Generating research questions", description: "Turning the Retell AI production-lifecycle outline into evidence-aware questions." },
    { id: "research", title: "Researching the topic", description: "Reviewing Retell AI company, founder, market, ICP, product, and legal context." },
    { id: "writing", title: "Writing the draft", description: "Composing a workflow-first guide from the approved outline and source posture." },
    { id: "post", title: "Post-processing", description: "Checking attribution, configuration-dependent claims, and editorial voice.", details: ["Formatting headings, the readiness checklist, and the evidence table.", "Separating official documentation from vendor-selected customer outcomes.", "Flagging pricing, geography, and contract details for re-verification."] },
  ],
  coverageItems: [
    { label: "workflow and production stack", covered: true },
    { label: "testing, monitoring, and recovery", covered: true },
    { label: "human handoff and compliance", covered: true },
    { label: "independent reliability benchmark", covered: false },
  ],
};

export const WRITING_SCENARIOS = {
  otera: OTERA_SCENARIO,
  retell: RETELL_SCENARIO,
};

export function getWritingScenario(companyId) {
  return WRITING_SCENARIOS[companyId] ?? OTERA_SCENARIO;
}

export const WRITING_SCENARIO = OTERA_SCENARIO;
export const ACTIVITY_ITEMS = OTERA_SCENARIO.activityItems;
export const COVERAGE_ITEMS = OTERA_SCENARIO.coverageItems;
