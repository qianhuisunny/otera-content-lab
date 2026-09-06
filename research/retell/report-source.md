# Retell AI — Reconciled Research Source

## Report metadata

- **Audience:** Content strategists and writing systems that need a durable, citation-aware company context
- **Research cutoff:** 2026-09-06
- **Entity:** Retell AI, Inc. (`retellai.com`)
- **Geographic scope:** Global, with US-specific treatment where calling, consent, privacy, or regulated-use rules differ
- **Purpose:** Reconcile the four canonical research runs into a writing-ready source without erasing conflicts, evidence limits, or role distinctions
- **Raw prompt outputs:** [Company](company-research-output.md), [Founder](founder-research-output.md), [Market](market-research-output.md), [Audience / ICP / Persona](persona-research-output.md)
- **Supporting decisions:** [Persona decisions](persona-decisions.md), [claim ledger](claim-ledger.md)

## Assumptions and evidence policy

This report treats official legal terms and current product documentation as the strongest evidence for contractual and product claims. Named customer and founder statements establish attributed experience, not portfolio averages or audited performance. Independent reporting receives more weight where it directly names the participant and method. Review-site and community material is useful for language and failure-mode discovery but not for prevalence. Researcher inference is labeled and should not be rewritten as company fact.

Public financial claims are date-stamped snapshots. They do not establish audited revenue, valuation, profitability, customer concentration, gross margin, retention, or runway. Public product availability, prices, terms, regional posture, leadership titles, and usage claims should be rechecked before external publication.

## Executive answer

Retell AI is a privately held, five-founder US software company founded in 2023 and accepted into Y Combinator's Winter 2024 batch. It sells a build-test-deploy-operate layer for AI voice agents and, increasingly, chat and adjacent workflows. The useful description is not “a realistic AI voice.” Retell combines telephony, real-time speech orchestration, model and voice choices, tools, transfers, testing, versioning, monitoring, quality assurance, analytics, and workflow automation so a bounded customer interaction can run in production.

The most defensible ICP is an organization with a material volume of repetitive calls, an expensive or volatile human-coverage problem, a bounded first workflow with recoverable exceptions, accessible source systems, measurable baseline outcomes, and accountable owners for testing and operation after launch. This includes direct operators and multiplier businesses such as vertical SaaS companies, BPOs, agencies, and solution partners. Employee count and industry are secondary to workflow economics and operational readiness.

Retell's strongest public evidence is product breadth plus named deployments across support, scheduling, collections, admissions, mobility, insurance, and embedded vertical software. Its weakest evidence is the business reality behind the growth story: multiple first-party pages cite incompatible ARR, staffing, and valuation snapshots, and most customer outcomes are vendor-selected. The safe writing posture is therefore specific about product mechanics and named deployments, explicit about attribution, and cautious about financial scale, market share, retention, and competitive superiority.

Retell's public partner program and customer cases demonstrate agency, reseller, BPO, and embedded-platform motions, but they do not disclose the governing agreements. The standard public Terms restrict reselling, redistributing, or making AI-generated voice outputs available as a standalone product or service under §10.1(e), and separately restrict using the service to build a product, service, or platform that functions as a substitute for, or intermediary layer on top of, the service under §10.1(f). This is not a blanket prohibition on every partner or reseller motion: Retell promotes a partner program, and signed commercial terms may grant rights not visible publicly. Content must not imply that a self-serve license automatically authorizes white-label, OEM, resale, or multi-client delivery; the applicable partner, platform, or order-form rights must be confirmed in writing.

## Company context

### Origin and evolution

The company began with a real-time livestream translation and dubbing product. Bing Wu recounts that roughly seven seconds of delay could be acceptable for that use case, but that the market was small and the prosumer go-to-market path was unattractive. The company redirected the underlying speech work toward live voice interaction, where latency, interruption, endpointing, backchannels, noise, transfers, tool execution, and fallbacks are part of the product rather than implementation details.

Retell launched publicly in February 2024 as a developer-facing conversational-speech API. A 2024-01-31 changelog entry records a real product reset: the bundled Retell LLM and phone features were removed from the API in favor of a customer-hosted model interface. The company later rebuilt a broader managed platform around prompt and flow agents, knowledge, telephony, tests, releases, monitoring, AI QA, Conductor, and pre/post-call Workflows. This is a move from a speech component to an operating layer for AI-run phone work.

### Business model and financial posture

Retell charges primarily by connected voice minute and component usage, with separate model, voice, telephony, optional-feature, number, concurrency, and enterprise terms. Public voice estimates are $0.07–$0.31 per minute, but the only responsible comparison is configured cost per completed outcome after implementation, testing, human exceptions, transfers, and operations.

Public financial materials are incompatible snapshots rather than a verified monotonic trajectory:

- 2024 company material claimed more than $3M annualized revenue.
- An OpenAI partner story published 2025-06-26 reported $14M revenue within 16 months.
- Retell's About timeline labels November 2025 at $40M annualized revenue, 25 people, and fully profitable.
- A Retell-issued release dated 2026-01-29 said $40M ARR and more than 40M calls per month.
- A company post dated 2026-05-07 said $60M ARR and 35 people; six days later, Bing Wu's 2026-05-13 interview described roughly $55M.
- Bing's 2026-06-25 post said roughly $60M ARR, about 50 people, and profitability.
- At the cutoff, one live YC recruiting page simultaneously claimed $80M ARR, 50 staff, and valuation above $1.5B while retaining stale $35M ARR and 24-person boilerplate.

Retell's own seed announcement documents a $4.6M round led by Alt Capital with YC, Carya Venture, and more than 20 founders, executives, and operators. TechCrunch independently reported approximately $4.53M in total capital and mentioned YC, but did not corroborate every round term. No public priced round or audited statement verifies the recruiting-page valuation, profitability, or revenue claims.

### Product and operating reality

Retell offers single-prompt and flow-based agents, model and voice options, knowledge and tools, managed or custom telephony, inbound and outbound calling, transfers, web voice, chat and SMS, simulations, versioning and A/B tests, live monitoring, transcripts, analytics, post-call extraction, AI QA, alerts, access controls, integrations, APIs/SDKs, Conductor, and Workflows. Customers may bring a custom LLM or SIP path, but they then own more latency, uptime, reconnection, feature, and testing risk.

Reliability must remain contract-specific. Retell's [Reliability Overview](https://docs.retellai.com/reliability/reliability-overview) claims greater than 99.9% uptime, while the public [Terms](https://www.retellai.com/legal/terms-of-service) require commercially reasonable efforts to maintain at least 99.5% uptime, excluding scheduled maintenance of up to six hours per month and force majeure. Under §17, the Terms control a conflict with an order form, proposal, or SLA unless the order form or SLA expressly states otherwise. At the cutoff, the [status page](https://status.retellai.com/) showed 99.94% trailing-90-day phone uptime and 99.95% end-to-end calling uptime, alongside a 2026-09-05 calling disruption resolved the same day. Documentation and status history are not an SLA.

### Customer and risk reality

Named customers describe meaningful results, including Pine Park Health returning 2.1 FTE of capacity and booking appointments on 55.7% of connected proactive calls; Medical Data Systems reporting roughly 70% containment and about $280,000 in monthly collections; Spare Labs reporting around 70% average resolution; and Everise's named executive saying 65% of voice calls were contained in an internal service desk. The Everise page title/card instead says tickets, so the denominator conflict must remain visible. Pine Park has the strongest independent corroboration reviewed; the other figures are vendor-hosted and unaudited.

Current Terms place calling, consent, and workflow compliance responsibility on the customer and specifically prohibit autodial, AI voice, or prerecorded-message calls to enumerated emergency lines, patient rooms in hospitals, healthcare facilities, or elderly homes, and paging services. The Terms also permit certain de-identified and aggregated Communications and User Content to be used for analytics and included-model development or training when recording is not opted out, subject to negotiated terms. That current standard-contract language conflicts with an older generic support answer and should be treated as the public contractual baseline; sensitive deployments still require review of the signed terms. Public compliance documentation says Retell does not currently operate services within the EU; broad GDPR marketing must not be interpreted as EU hosting or residency.

## Founder context

Retell should be presented as a five-founder operating team: Bing Wu (CEO), Todd Li (President), Evie Wang (officially listed as CMO), Weijia Yu (COO), and Zexia Zhang (CTO). Some public employee or intern material refers to Evie as CPO, but current company and YC identity sources support CMO; the conflict should not be silently collapsed.

Researcher synthesis across the uneven public corpus finds a recurring operating doctrine: production usage matters more than a polished demo; voice agents require orchestration and an operating lifecycle around the model; contact-center depth beats chasing every use case; founders should learn important functions before delegating them; and a small, automated organization can create high operating leverage. Bing supplies the deepest interview record; Todd and Evie have meaningful public writing; Zexia has a narrower technical corpus; Weijia's first-person corpus is thin. A writing system should not fabricate equal depth or private personality profiles.

Preserve the tensions. Reliability and honesty rhetoric coexist with incompatible growth claims. Human-AI collaboration language coexists with forceful predictions about BPO automation. Public celebrations of ownership and speed include late-night intensity that may not represent the wider employee experience. Researcher assessment: an early Launch HN response entertaining an AI-therapy/crisis use case showed weaker risk framing than the later Terms, agent handbook, and Bing Wu interviews; current defaults still leave disclosure and scope-boundary choices to customer configuration. These are context for critical writing, not grounds for invented motives.

## Market context

The defensible category label is **AI voice-agent platform**, nested inside conversational AI and contact-center automation. Buyers may compare a developer orchestration API, a no-code automation product, a managed AI service, a CCaaS add-on, a vertical receptionist, an answering service, or an internal stack. Category language must therefore name the decision, not imply one settled analyst taxonomy.

Direct platform comparisons include Vapi, Bland, Synthflow, Thoughtly, and ElevenAgents. Broader alternatives include CCaaS or conversational-AI suites such as Genesys, NICE, Five9, Amazon Connect, Google CCAI, Microsoft, Salesforce, and Cognigy; telephony and model components; internal engineering; BPOs; human teams; and simpler IVR, forms, callback, or voicemail. Researcher assessment: Retell's relative advantage is the breadth of one production lifecycle across telephony, agent building, tests, release, live operations, QA, and workflows. Defensibility is plausible but unproven because suppliers, incumbents, startups, and customers can assemble overlapping layers.

Published market numbers refer to different denominators: cloud contact centers, CRM service/support software, wider contact-center spend, AI-enabled service, or conversational-AI platforms. None is a clean Retell addressable-market or voice-only share figure. Keep each denominator separate and do not divide Retell's unaudited ARR by a broad market forecast to claim share.

Demand is driven by costly phone coverage, staffing volatility, 24/7 and multilingual expectations, poor IVR experiences, model improvement, and pressure to complete work rather than merely answer questions. Barriers include fragile edge cases, latency and telephony variability, integration ownership, all-in usage cost, fraud, caller trust, human handoff, consent and recording law, data processing, residency, security review, and the ongoing QA burden.

## ICP and buying committee

### Best-fit organization

A strong fit has a valuable, repetitive phone workflow; measurable baseline pain; a controlled first scope; system access; safe fallback; technical and governance capacity; a post-launch owner; and enough economic value to absorb usage plus operating costs. Common trigger events are call growth outpacing hiring, unpredictable spikes, missed or slow lead response, expensive outsourced coverage, new time zones or languages, a failed internal prototype, and a mandate for a production AI proof point.

Poor fits include very low or irregular volume; workflows dominated by novel judgment; no trusted source of truth; no integration access; no accountable owner; no safe human escalation; unsupported destinations; incompatible data-residency requirements; prohibited or legally unresolved use; a demand for fully managed outcomes without implementation capacity; or an expectation that Retell replaces every CCaaS and workforce-management function.

### Evidence-derived committee

The research tested eleven candidate roles and retained seven standalone personas because they recur with materially different authority, jobs, proof, and lifecycle ownership:

1. **Executive Sponsor** — funds the initiative, accepts strategic and reputational exposure, and decides whether a pilot can scale.
2. **Workflow Owner** — owns the current process, team, policies, handoffs, and business outcome.
3. **Technical Owner** — owns architecture, integration, reliability, maintainability, security implementation, and production standards.
4. **Agent Builder** — configures prompts or flows, tools, knowledge, tests, and releases.
5. **Conversation Quality Owner** — samples live interactions, maintains evaluation and regression coverage, and controls behavior quality after launch.
6. **Governance Approver** — sets legal, privacy, security, procurement, data, and contract conditions and can block production.
7. **Solution Partner & Platform Operator** — builds or operates agents for multiple downstream clients and optimizes repeatability, margin, and support load.

Finance/procurement is merged into Governance Approver with commercial authority also represented under the Executive Sponsor. Frontline human agents are affected participants but merge into Workflow and Quality contexts because public evidence does not show a stable, distinct Retell-buying or workspace job. Revenue/admissions ownership is a Workflow Owner variant. End callers remain an index-level audience and design constraint, not a buyer persona.

## Persona decisions and journey implications

One person may hold several roles in a smaller company; role separation describes jobs and authority, not required headcount. In an embedded or partner motion, the Solution Partner may also perform Technical Owner, Agent Builder, and Quality Owner jobs, while the downstream customer retains workflow, economic, and governance decisions.

The typical journey is problem recognition, workflow and baseline definition, shortlist and architecture review, contract/security review, bounded pilot, integration and test, controlled production, operating cadence, and expansion. Content should make the decision stage explicit. Early-stage material can teach category and workflow selection; mid-stage material must expose architecture, pricing, data, compliance, test, and handoff detail; late-stage proof must show a baseline, scope, version, timeframe, denominator, exceptions, and who measured the result.

## Limitations and unresolved disagreements

- ARR, profitability, valuation, headcount, customer count, and monthly call volume are unaudited and conflict across first-party pages.
- Founder ownership, board, voting control, investor rights, customer concentration, gross margin, burn, runway, retention, churn, NRR, and renewal outcomes are undisclosed.
- Evie Wang's current official role is CMO; isolated CPO references remain unresolved and should not override official identity sources.
- Product uptime documentation, standard Terms, and enterprise contracts describe different commitments.
- EU marketing language does not prove EU service operation, hosting, or residency.
- Most customer outcomes are selected Retell stories; Pine Park is one independent implementation, not representative portfolio evidence.
- Review and community samples are self-selected and sometimes incentivized or invited; they support vocabulary and failure modes, not frequency claims.
- No clean public Retell market-share or voice-only TAM exists.
- Competitive parity for conversation quality, reliability, implementation burden, and total cost lacks an independent, methodologically transparent benchmark.
- Competitive losses, failed deployments, security incidents under NDA, renewal, contraction, and customer-level cost curves are largely unavailable.

## Writing implications

1. Describe the completed workflow and operating lifecycle before describing voice realism.
2. Attribute every customer result and never imply it is a portfolio average.
3. Date-stamp growth claims and label the $1.5B figure as an unverified recruiting-page claim.
4. Treat “fully profitable,” “enterprise-ready,” “secure,” “compliant,” and “human-level” as claims requiring scope and evidence.
5. Separate product capability, documentation, contractual commitment, named deployment, independent corroboration, and researcher inference.
6. Keep human escalation, caller disclosure, recording/consent, ongoing QA, and accountable ownership visible.
7. Compare configured cost per completed outcome, not headline price per minute.
8. Do not turn broad adjacent-market forecasts into Retell's TAM or market share.
9. Use the seven persona dossiers as distinct writing lenses, while allowing one real person to hold multiple roles.
10. Reverify current terms, pricing, product availability, regions, leadership, and financial claims before publication.
