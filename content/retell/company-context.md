# Retell AI — Company Context

## Context metadata

- **Company:** Retell AI, Inc.
- **Company type:** Private AI infrastructure and contact-center software company
- **Founded:** 2023; Y Combinator W24; public launch February 2024
- **Primary geography:** United States, with international customers and calling support
- **Category:** AI voice agents, conversational AI infrastructure, and AI contact-center operations
- **Context date:** 2026-09-06
- **Purpose:** Writing-ready company context; use with the separate Founder, Market, ICP, and Persona artifacts
- **Evidence posture:** Product and legal evidence is strong; financial, valuation, retention, and portfolio-wide outcome evidence is limited or self-reported

## Executive context

Retell AI provides the operating stack for AI agents that handle live customer calls. It combines telephony, speech recognition, turn-taking, response generation, speech synthesis, tools and transfers with testing, monitoring, analytics, quality assurance, and production controls. Its product has expanded beyond phone infrastructure into chat, CRM sync, AI-assisted agent maintenance, and pre/post-call workflow orchestration.

The useful description is not “a realistic AI voice.” It is: **a build-and-operate platform for production voice agents and the work around them.** A realistic voice is one component; the buyer pays for reliable execution across messy calls, business systems, exceptions, handoffs, and continuous improvement.

Retell reports exceptional growth and profitability on little external capital, but its own public numbers conflict. Current material ranges from $35M to $80M ARR and from 24 to 50 employees. A live YC-hosted job page claims $80M ARR and a valuation above $1.5B, while retaining stale copy with much lower figures. None of this is backed by audited statements or a disclosed priced financing. Use the latest figures only as date-stamped company claims.

The company’s most credible strengths are its documented product breadth, detailed self-serve pricing, fast release cadence, and named production cases. Its main risks are cost at scale, accuracy and latency across a multi-provider stack, compliance ownership, integration and QA burden, provider dependence, rapid API change, and intense competition from startups, CCaaS incumbents, model providers, and internal builds.

## Origin and evolution

Retell was founded in 2023 by five active founders and joined Y Combinator’s W24 batch. The company says it entered YC in November 2023 and launched publicly in February 2024. [YC](https://www.ycombinator.com/companies/retell-ai) and Retell’s [About page](https://www.retellai.com/about-us) support that timeline.

The founding problem was the gap between an impressive speech demo and a usable phone agent. Combining speech-to-text, an LLM, and text-to-speech still left developers to solve latency, turn-taking, interruption, endpointing, noise, and conversational timing. In its [Launch HN post](https://news.ycombinator.com/item?id=39453402), Retell described proprietary conversation orchestration between those components and launched as a developer-facing speech API with a dashboard.

The product then evolved quickly:

- **Early 2024:** conversational speech engine and BYO-LLM API
- **January 2024 API refocus:** removed bundled LLM and phone features from the API, open-sourced example layers, and centered the API on custom LLM WebSocket integration
- **2024–2025:** fuller managed agents, conversation flows, telephony, tools, knowledge, testing, analytics, and enterprise controls
- **2026:** versioning, AI QA, live supervision, built-in CRM, Conductor, and Retell Workflows

The [changelog](https://www.retellai.com/changelog) shows a company moving from developer infrastructure to a contact-center operating layer. It also records migration and reliability work, so it is useful evidence of both momentum and technical debt.

## Founders and leadership

| Founder | Current disclosed role | Relevant background |
| --- | --- | --- |
| Bing Wu | CEO | Former ByteDance/TikTok product manager; previously founded two college startups, according to YC. |
| Todd Li | President | Pre-Retell background remains thin in reviewed primary sources; re-verify through founder-specific research. |
| Evie Wang | CMO | Former ByteDance product designer; involved in launch positioning and customer narrative. |
| Weijia Yu | COO | Former Meta product/technical lead; earlier voice/NLP-related work at ObEN. |
| Zexia Zhang | CTO | Former Google engineer working on speech translation and call-analysis NLP. |

The biographies above are company/founder-supplied through the [YC profile](https://www.ycombinator.com/companies/retell-ai). Treat them as credible professional summaries, not independently verified employment records.

## Funding and financial reality

### Funding

- Retell announced a **$4.6M seed** led by Alt Capital, with Y Combinator, Carya Venture, and more than 20 operators and angels. [Official announcement](https://www.retellai.com/blog/seed-announcement); [TechCrunch corroboration](https://techcrunch.com/2024/05/09/retell-ai-lets-companies-build-agents-to-answer-their-calls/).
- Some databases and founder wording place total funding around **$5M–$5.1M**. The additional amount is not transparently documented.
- Founder ownership, investor percentages, voting control, board composition, and option pool are **undisclosed**.

### Revenue, profitability, and valuation

Public statements form a dated sequence but do not reconcile cleanly:

- 2024 company claim: more than $3M annualized revenue shortly after launch
- 2025 partner story: $14M revenue within 16 months
- November 2025 company milestone: $40M annualized revenue, fully profitable, 25 people
- 2026 founder/company statements: roughly $60M ARR and profitability
- Current YC recruiting claim accessed 2026-09-06: $80M ARR, 50 people, valued above $1.5B
- Stale text on that same recruiting page: $35M ARR, $4.7M seed, 24 people

The likely explanation is fast growth plus stale page fragments, but this is an inference. There are no public audited financial statements, investor confirmation, or priced financing that validate ARR, GAAP revenue, profitability, gross margin, burn, runway, or valuation. [Current YC job page](https://www.ycombinator.com/companies/retell-ai/jobs/G99Indu-founding-content-marketing-storytelling); [About page](https://www.retellai.com/about-us); [OpenAI customer story](https://openai.com/index/retell-ai/).

## Business model and pricing

Retell combines self-serve metered infrastructure with enterprise contracts and optional implementation support.

As of 2026-09-06, [public pricing](https://www.retellai.com/pricing) shows:

- Voice agents: estimated **$0.07–$0.31 per connected minute**
- Chat agents: **$0.002+ per AI message**
- Base voice infrastructure: **$0.055/minute**, then LLM, TTS, telephony, and add-ons
- Separate charges for features such as knowledge retrieval, batch calling, branded caller ID, denoising, guardrails, PII removal, QA, SMS, numbers, and extra concurrency
- 20 concurrent calls included in self-serve
- Enterprise: custom volume pricing, higher concurrency, RBAC, SSO, custom MSA/DPA/BAA, dedicated support, a stable-server track, and optional implementation

Billing depends on usage and configuration, not seats. Connected silence is billable. The AI charge stops after transfer, but telephony may continue. This creates natural expansion through minutes, agents, departments, geographies, and QA, but it can make unit economics hard to predict.

[Stripe’s Retell case study](https://stripe.com/customers/retell-ai) says early manual usage calculation caused limited invoice transparency, complaints, and unpaid balances. That history explains the current component-level billing detail and is a concrete example of operational scaling pressure.

## Product and technology

### Current product surface

The current [documentation](https://docs.retellai.com/general/introduction) supports four core jobs:

1. **Build:** prompt agents, node-based flows, tools, knowledge, voices, languages, dynamic variables, guardrails, custom LLMs.
2. **Test:** text/audio playgrounds, simulations, batch tests, version comparisons, A/B traffic, Conductor-assisted testing.
3. **Deploy:** Retell or imported phone numbers, inbound/outbound calls, SIP, batch campaigns, web calls, chat, SMS, voicemail, IVR, transfers, and international routes.
4. **Operate:** live monitoring, recordings/transcripts, latency and error detail, webhooks, analytics, dashboards, post-call extraction, alerts, AI QA, and release versioning.

Additional operating layers:

- **Conductor:** AI copilot that inspects agent graphs, creates tests, proposes edits, and leaves accept/reject control with the operator. [Launch](https://www.retellai.com/blog/introducing-conductor).
- **Retell Workflows:** native pre- and post-call dependency graphs and integrations for the work around a call. [Launch](https://www.retellai.com/blog/retell-workflows).
- **CRM and integration layer:** Salesforce, HubSpot, helpdesk, calendar, file, communications, and automation connections, plus partner tooling.

### How it works under the hood

A typical call uses:

`telephony/SIP → transcription → turn-taking/orchestration → LLM and tools → speech synthesis → caller`

Retell coordinates when to listen, respond, interrupt, discard an obsolete model response, transfer, press digits, detect voicemail, handle call screening, and recover from provider failures. It supports conventional cascades and speech-to-speech models.

Customers can use Retell-hosted prompt/flow agents or bring a response server over WebSocket. With a [custom LLM](https://docs.retellai.com/integrate-llm/overview), Retell retains telephony, transcription, turn-taking, and TTS; the customer streams back replies and actions. That gives model and compliance control but shifts latency, uptime, reconnection, and some testing responsibility to the customer.

The [custom telephony layer](https://docs.retellai.com/deploy/custom-telephony) connects imported numbers and SIP/CCaaS infrastructure. It supports TLS/mTLS and SRTP, but feature availability depends on connection mode and provider. For example, dial-to-SIP cannot use Retell’s native transfer.

### Reliability and security posture

- Retell docs claim **>99.9% uptime** and describe autoscaling, monitoring, provider fallbacks, and a delayed-rollout enterprise stable server.
- Public [Terms](https://www.retellai.com/legal/terms-of-service) promise commercially reasonable efforts toward only **99.5% uptime**, unless another SLA overrides them.
- At the cutoff, the [status page](https://status.retellai.com/) reported trailing-90-day phone uptime of 99.94% and end-to-end calling of 99.95%; a calling disruption occurred on 2026-09-05.
- Retell claims SOC 2 Type I/II, GDPR alignment, and HIPAA support when a BAA is signed. The underlying audit reports were not reviewed. [Compliance docs](https://docs.retellai.com/general/compliance).
- Per-agent retention can be 1–730 days or indefinite; **indefinite is the default**. Recordings, transcripts, logs, and variables are deleted after a configured window, while some basic metadata may remain. [Retention docs](https://docs.retellai.com/accounts/data-retention).
- The current [Terms](https://www.retellai.com/legal/terms-of-service), updated 2026-06-01, grant Retell permission when recording is not opted out to use de-identified and aggregated Communications and User Content for analytics and for developing, training, and improving AI/ML models included in the service. This supersedes an older support answer saying calls were not used for training. Any narrower data-use commitment must be confirmed in the buyer’s actual DPA, order form, or other written agreement.

Do not turn vendor certification language into a blanket statement that every customer deployment is compliant. Architecture, model providers, consent, configuration, and contracts determine the actual posture.

## Target customers and use cases

Retell’s observed customer forms are:

- Mid-market and enterprise teams with high call volume
- Vertical software companies embedding voice into their own product
- Agencies, BPOs, and solution partners operating agents for multiple customers
- Smaller businesses using self-serve receptionist, appointment, support, or lead workflows

Common workflows:

- Inbound customer support and tier-one containment
- Appointment booking, rescheduling, and reminders
- Reception and answering services
- Lead qualification, follow-up, and transfer
- Collections and billing support
- Dispatch, logistics, ride status, and operational notifications
- Insurance service and intake
- Admissions and enrollment
- Internal help desk
- Surveys and structured information gathering

Strong fit usually requires meaningful call volume, repetitive jobs with bounded exceptions, systems that tools can access, clear escalation, measurable outcomes, and sufficient value per call to absorb usage and implementation cost.

## Customer evidence

Retell’s [customer index](https://www.retellai.com/customers) claims 3,000+ businesses and publishes named cases. The strongest available evidence is attributable, but usually selected and vendor-hosted.

| Customer | Reported result | Evidence quality |
| --- | --- | --- |
| Spare Labs | ~30% of calls automated in week one, ~70% average resolution, up to 100% for simpler operations, ~1 month initial integration | [Named COO in vendor-hosted case](https://www.retellai.com/case-study/how-sparelabs-put-ai-voice-on-the-front-line-of-public-transit-and-watched-it-take-off); medium confidence. |
| Medical Data Systems | 30,000 calls/month, ~70% containment, ~$280,000 monthly collections | [Named CIO in vendor-hosted case](https://www.retellai.com/case-study/how-medical-data-systems-scales-280-000-in-monthly-collections-with-ai-voice-agents-on-retell); medium confidence. |
| Pine Park Health | 2.1 FTE of capacity returned; appointments on 55.7% of connected proactive calls | [Healthcare IT News](https://www.healthcareitnews.com/news/pine-park-health-sees-roi-ai-scheduling-tool) with named customer executive; relatively strong corroboration. |
| Everise | 65% internal-ticket containment and 600 staff-hours/month saved | [Retell-hosted case](https://www.retellai.com/case-study/how-everise-contained-65-of-internal-service-desk-tickets-with-retell-ai); no raw measurement reviewed. |
| SWTCH | More than 50% support-cost reduction | Customer-attributed quote in a [Retell-issued press release](https://www.globenewswire.com/news-release/2026/01/29/3228780/0/en/Upgraded-Retell-AI-Voice-Platform-Enables-Corporate-Call-Centers-to-Deploy-Infinite-AI-Sales-and-Support-Agents-Across-Voice-Chat-Email-and-SMS-Company-Revenue-Now-Exceeds-40M-ARR.html); not independently audited. |

These examples establish that Retell reaches production. They do not establish an average customer result, causal effect, retention, or total cost.

## Customer sentiment and limitations

G2’s [Retell review corpus](https://www.g2.com/products/retell-ai/reviews) showed a high aggregate rating at the cutoff. Repeated praise:

- Natural-sounding voices and relatively low latency
- Fast setup compared with assembling the stack
- Usable flow builder and API/integration surface
- Strong value for missed-call, receptionist, qualification, and support automation

Repeated complaints:

- Cost can compound quickly at call volume
- Learning curve for non-technical operators
- Limited low-level control for advanced or niche logic
- Difficult debugging across complex, multi-step flows
- Missing features, documentation gaps, pronunciation and understanding edge cases
- More telephony setup for international deployments

Evidence caveats: review counts change, some G2 reviews are incentivized, aggregate summaries are AI-generated, and open-review platforms may not reflect enterprise users. Individual comments are signals, not prevalence estimates.

No public churn, GRR, NRR, cohort expansion, or representative satisfaction dataset was found. Selected CSAT/NPS claims and growing call volume are not substitutes for retention data.

## Competitive position

Retell competes with:

- **Voice-agent platforms:** Vapi, Bland AI, Synthflow, Thoughtly
- **Enterprise AI agents:** PolyAI, Sierra, Decagon, Parloa, Cognigy
- **CCaaS suites:** Genesys, NICE, Five9, Amazon Connect, Microsoft and Google contact-center stacks
- **Internal builds:** telephony + ASR + LLM + TTS + custom orchestration/observability
- **Operational alternatives:** BPOs, in-house agents, legacy IVR, and channel deflection

Its intended edge is an integrated path from prototype to governed production: natural conversation, flexible model/provider choice, telephony, testing, versioning, QA, monitoring, and workflows in one system.

Potential defenses include proprietary turn-taking, large-scale failure/evaluation data, reliability engineering, accumulated workflow knowledge, enterprise integrations, compliance work, and switching cost once phone routing and production tests are embedded. The moat is not settled. Many components come from third parties, frontier-model improvements are broadly available, and incumbents already own contact-center distribution.

There is no defensible public Retell market-share estimate. Do not blend forecasts for voice AI, conversational AI, contact-center AI, and CCaaS into one market number.

## People and culture

The company remains founder-led. Its [careers page](https://www.retellai.com/careers) describes:

- Intentional in-office work in Redwood City
- Small teams, few layers, broad ownership
- Rapid shipping without long planning cycles
- Scope and promotion tied to impact
- A goal above $1M revenue per employee
- TypeScript/Python backend and React frontend

This is employer-authored culture positioning. Representative employee-review data is unavailable. Candidate complaints about interview cancellations are anonymous and insufficient to infer employee culture.

Team-size evidence changes quickly. The best current public estimate is approximately 50 employees, but recent first-party pages also contain 24, 25, and a [35-person snapshot](https://www.linkedin.com/posts/retellai_retell-crossed-60m-arr-and-is-now-emerging-activity-7458171277539717120-3jx2). Always attach an as-of date.

## Problems and open questions

### Product and operational risks

- Multi-provider dependencies across telephony, ASR, models, TTS, and customer systems
- Latency-versus-accuracy tradeoffs
- Hallucination, wrong actions, false completion, and imperfect escalation
- Cost volatility and difficult unit economics at high volume
- Complex debugging, prompt/flow maintenance, regression testing, and human QA
- API, model, and pricing migrations in a fast release cycle
- Feature loss or added reliability burden with custom LLM/telephony paths
- Toll fraud, spam labeling, credential abuse, and carrier pickup behavior

### Legal and trust risks

Retell’s [Terms](https://www.retellai.com/legal/terms-of-service) place significant responsibility on the customer for TCPA, TSR, FCC, Do-Not-Call, consent, recording, and AI disclosure compliance. PHI requires a BAA; payment-card and biometric data are restricted; emergency and safety-critical uses are excluded. AI outputs may be inaccurate.

The same Terms permit model development/training use of recorded Communications and User Content after de-identification and aggregation unless recording is opted out. This is a material procurement issue, especially for regulated or confidential calls; do not repeat the older blanket claim that customer calls are never used for training.

Global language and calling capability does not equal local legal readiness. Validate consent, disclosure, number registration, recording law, and data location by country and state.

### Unavailable or unverified facts

- Audited revenue, profitability, margin, burn, runway, and customer concentration
- Verified post-money valuation and cap table
- GRR, NRR, churn, and pilot-to-production conversion
- Representative production quality and failure metrics
- Independent confirmation for most customer outcomes and marquee logos
- Complete employee experience and retention data
- Defensible market share
- Full SOC audit scope, exceptions, and penetration-test detail

## Recent direction and international strategy

Retell is becoming an AI-native contact-center operations platform, not staying a narrow phone API. Its 2026 releases cover guardrails, QA, alerting, versioning, live monitoring, CRM, Conductor, and Workflows. The strategic center is continuous execution and improvement across the full call lifecycle.

Internationally, Retell sells through multilingual models, supported international destinations, SIP/custom telephony, CCaaS connections, and solution partners. [Retell-managed numbers support 15 outbound countries](https://docs.retellai.com/deploy/outbound-call); imported-number reach depends on the carrier. Language quality and feature support depend on the ASR/TTS/model combination.

At the cutoff, official material still indicated US-only infrastructure/no EU operation, with support identifying AWS `us-west-2` as the sole data region. That matters for EU procurement even when a DPA/SCC is available. Re-verify before any claim about EU hosting.

## Working thesis for writing

Write Retell as a production infrastructure and operations story:

> Retell turns a fragile chain of phone, speech, model, and workflow components into an environment where teams can build, test, deploy, monitor, and improve AI agents handling real calls.

Avoid these shortcuts:

- “The voice is indistinguishable from human” — company/customer perception claim, not universal fact
- “$80M ARR / $1.5B valuation” without “Retell says,” source, and date
- “HIPAA/GDPR compliant” without configuration, BAA/DPA, and data-region context
- “Saves 80%” or “70% containment” as a generic outcome
- “3,000 customers” without noting it is a company-defined count
- A precise market-share claim

## Evidence posture and re-verification triggers

**High confidence:** identity, founding year, founder set, disclosed seed, public pricing mechanics, documented product interfaces, current legal terms, documented feature availability.

**Medium confidence:** current team size, profitability, call volume, customer count, vendor-hosted outcomes, broad review themes, culture characterization.

**Low or unavailable confidence:** audited financials, priced valuation, ownership, retention, market share, representative error/quality metrics, employee sentiment, investor expectations.

Re-verify the live pricing page, Terms, Privacy Policy, documentation, changelog, status history, YC metadata, and customer attribution whenever content is published after this cutoff. Trigger a deeper refresh after a financing, material incident, EU-region launch, major model-architecture change, pricing change, or new audited/customer-confirmed metrics.
