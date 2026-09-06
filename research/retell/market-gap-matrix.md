# Retell AI — Market Research Gap Matrix

## Scope and evidence rules

- **Entity:** Retell AI, Inc. / `retellai.com`
- **Cutoff:** 2026-09-06
- **Geography:** global market; US-specific treatment where labor, telecom, or state law is jurisdictional; EU, UK, and Canada called out where material
- **Consumes:** verified Company Research output at `research/retell/company-research-output.md`
- **Evidence classes:** `P1` official product, technical, legal, regulatory, or statistical source; `A1` named analyst taxonomy/market model; `I1` independent reporting or specialist market tracking; `V1` company or competitor claim; `C1` review/community/search-language observation; `X` bounded researcher inference
- **Use rule:** market estimates remain separate when they measure different denominators. Vendor claims, review counts, and community comparisons are not market share.

## Claim and gap matrix

| Answer slot | Current answer | Evidence status | Class | Confidence | Limitation / contradiction | Writing or next-query rule |
| --- | --- | --- | --- | --- | --- | --- |
| Broad domain | Enterprise conversational AI and contact-center automation. | Supported | A1/P1 | High | The domain spans voice, chat, agent assist, workflow automation, and full CCaaS. | Name the specific layer before using a market statistic. |
| Specific buying category | Emerging **AI voice-agent / AI phone-agent platform**, nested inside maturing conversational AI and adjacent to CCaaS, CPaaS, AI-agent builders, and customer-service automation. | Supported as synthesis | A1/C1/X | High | No single analyst definition creates a clean voice-only boundary. | Use “AI voice-agent platform” as practical buyer language, not a universally standardized category. |
| Category maturity | Conversational AI is entering early maturity; voice-agent platforms remain fast-moving and fragmented. | Supported | A1 | High | Fast vendor growth does not equal mature procurement, ROI proof, or technical standards. | Pair growth language with evidence on pilots, ROI, trust, and governance. |
| Gartner taxonomy | Gartner's 2026 Conversational AI Platforms MQ covers complex scalable assistants/agents; Retell is not among 14 listed vendors. | Supported | A1 | High | Full definitions, thresholds, scores, strengths, and cautions are paywalled. Absence does not prove rejection. | Say “not included in the published vendor set,” never “failed Gartner.” |
| Forrester taxonomy | Forrester separately covers Conversational AI for Customer Service, CCaaS, Digital Customer Interaction, and the wider contact-center stack. | Supported | A1 | High | Full reports are paywalled and the 2024 CAI Wave predates much 2025–26 voice-agent activity. | Use to show overlapping buying centers, not to rank Retell. |
| Review taxonomy | G2 assigns Retell to AI Voice Assistants and cross-lists it across AI-agent categories; Capterra cross-lists it in four AI categories; TrustRadius places it under AI Agent Builder. | Supported | C1 | High for taxonomy | G2's 772-product category mixes infrastructure, CCaaS, answering services, and point tools; Capterra had zero Retell reviews; TrustRadius had no listed Retell plans and suggested very broad alternatives. | Use category labels as buyer-language evidence, not adoption or quality proof. |
| Buyer problem | Automate high-volume phone workflows without rigid IVR, long queues, manual repetitive labor, or a large custom real-time AI stack. | Supported | P1/A1/X | High | Suitability varies sharply by workflow risk, exception rate, systems access, and human-handoff design. | Describe the workflow, action, exception, and handoff before the model. |
| Table stakes | Natural low-latency speech; interruption/turn-taking; telephony/SIP; transfer/DTMF; multilingual support; KB/RAG; tool calling; integrations; no-code plus API; testing/evals; observability/QA; scale/failover; consent, privacy, RBAC, retention, and auditability. | Supported as repeated competitive bundle | P1/V1/A1/X | High | VPC/on-prem, regional residency, full agent desktop/WFM, and outcome pricing are differentiators rather than universal self-serve features. | Do not call a capability differentiating unless the main alternatives lack it. |
| Owned core platform | Build, test, deploy, monitor voice and chat agents through prompt or node-based flows, telephony, tools, analytics, QA, and APIs. | Supported | P1 | High for feature existence | Quality and performance remain configuration- and workload-dependent. | Attribute performance claims; feature existence is safe. |
| Orchestration layer | Retell supports cascade STT→LLM→TTS and speech-to-speech options, adding endpointing, turn-taking, interruption, backchanneling, telephony functions, provider status checks, and fallback. | Supported | P1 | High for architecture | External model, voice, speech, and carrier providers remain critical dependencies. | Distinguish Retell's control plane from third-party inference and telecom. |
| Conductor | AI copilot that helps build/refine flows, reviews calls, creates tests, proposes graph-aware changes, and requires acceptance. | Supported | V1 | High for feature; low-medium for outcome metrics | Retell's 2.5× readiness and 60% build-time claims are internal tests. | Call it an owned product extension; label speed claims unaudited. |
| Workflows | Native dependency-graph automation for pre/post-call functions and connected systems. | Supported | P1/V1 | High for existence | Connector list is still limited; Stripe, WhatsApp, and Google Calendar were roadmap in the launch article. | Separate live connectors from roadmap. |
| Developer assets | Official Python/TypeScript SDKs, browser client, n8n node, demos, and MCP tooling. | Supported | P1 | High | These are integration scaffolds; core orchestration remains proprietary. | Do not describe Retell as an open-source platform. |
| Partner ecosystem | Solution partners and app partners span agencies, white-label deployment, QA, SIP/global numbers, document ingestion, and integrations. | Supported | P1/V1 | High for directory entries | Certification rigor, active status, partner revenue, and implementation quality are undisclosed; portal functions remained incomplete. | Treat listings as relationships, not endorsements or proven delivery. |
| Acquisitions | No Retell acquisition was found in reliable public material. | Negative evidence | P1/I1 | Medium | Absence from public sources cannot prove none occurred. | Write “no acquisition publicly evidenced,” not “Retell has never acquired.” |
| Owned telecom/model | No owned carrier, full CCaaS suite, CRM system of record, or general-purpose foundation model was publicly evidenced. | Negative evidence / inference | P1/X | Medium-high | Private infrastructure and future plans are unavailable. | Frame as an ownership boundary, not an absolute nonexistence claim. |
| Geographic infrastructure | Personal data is primarily processed in the US; compliance docs and support say Retell does not currently operate services in the EU. Managed number purchase is US/Canada; managed outbound covers 15 countries; SIP/imported telephony extends reach. | Supported | P1 | High | Retell asserts GDPR compliance via transfer mechanisms; that is not physical EU residency. Negotiated enterprise capability may differ. | Separate legal transfer compliance from in-region processing. |
| Direct competitors | Vapi, Bland, Synthflow, Thoughtly, and ElevenAgents; the exact shortlist changes by buyer type. | Supported | P1/C1/X | High | Public pricing is not apples-to-apples; workload quality has no independent common benchmark. | Compare control, packaging, governance, support, and total configured cost—not headline cents/minute alone. |
| Enterprise CAI alternatives | PolyAI, Parloa, Decagon, NICE Cognigy, Kore.ai, Omilia, and others compete for enterprise service automation. | Supported | A1/P1/V1 | High | Scope and pricing differ; some are broader omnichannel or managed enterprise platforms. | Identify whether the buyer wants voice infrastructure or a broader transformation platform. |
| CCaaS/hyperscaler alternatives | NICE, Genesys, Five9, Amazon Connect, Google CCAI, Cisco, Zoom, Talkdesk, and similar installed platforms can bundle automation. | Supported | A1/P1 | High | Direct parity was not independently tested. | Treat installed-base procurement and bundling as a major competitive force. |
| CPaaS/model substitutes | Twilio ConversationRelay and OpenAI Realtime reduce the work needed for a custom stack. | Supported | P1 | High | Neither alone supplies Retell's full production lifecycle. | Describe as upstream compression and DIY enablers, not exact replacements. |
| Open-source DIY | LiveKit Agents and Pipecat provide modular voice-agent orchestration and telephony building blocks. | Supported | P1 | High | Buyer owns hosting, integration, observability, compliance, and reliability operations. | Compare total engineering/operations burden, not license price. |
| Human/manual alternative | In-house agents, IVR, callback queues, and business-process redesign remain substitutes; humans retain complex, sensitive, or licensed work. | Supported | P1/A1/X | High | US BLS occupation includes non-phone work and is not an addressable-spend estimate. | Use labor statistics as operational context, never Retell TAM. |
| BPO alternative | Outsourced contact centers and answering services remain substitutes or hybrid partners. | Supported | I1/X | Medium | Public US outsourced-seat estimate is sponsored trade research with limited methodology visibility. | Treat as a directional operating denominator. |
| Cloud contact-center revenue | $6.2B globally in 2024, +16.3% YoY, per Synergy. | Supported | I1 | High | Measures cloud contact-center software/service revenue, not AI voice agents. | Keep separate and label denominator. |
| CRM service/support software | $43.1B worldwide in 2024, +13.7%, per Gartner. | Supported | A1 | High | Much broader than Retell and methodology is paywalled. | Never present as Retell's market size. |
| Contact-center spending forecast | Gartner projects $47B worldwide by 2028. | Forecast | A1 | Medium-high | Forecast model and included categories are paywalled. | Label as broader spending forecast, not observed revenue. |
| European CCaaS | IDC projects $1.5B in 2024 to $3.7B in 2029. | Forecast | A1 | Medium-high | Europe-specific; full method/paywalled assessment unavailable. | Use only for regional CCaaS context. |
| AI-enabled service spend | IDC modeled $16.7B worldwide in 2024 for broad AI-enabled service/self-service use cases. | Modeled estimate | A1 | Medium-high | Cross-channel and much broader than voice. | Do not combine with CCaaS or CAI estimates. |
| Conversational-AI platform spend | Juniper forecast $14.6B in 2025 to >$23B in 2027. | Forecast | A1 | Medium | Paid definitions/method unavailable; a later $8.5B 2030 “service revenue” figure likely uses a narrower scope. | Present the apparent conflict as a scope change, not a trend reversal. |
| Voice-only market size | No authoritative global or US revenue denominator found. | Unavailable | — | High | Vendor-sponsored reports use inconsistent definitions. | Say unavailable; do not invent or blend adjacent markets. |
| Retell market share | No reliable direct-vendor share data found. | Unavailable | — | High | Customer, call-volume, review, and ARR claims are vendor-reported or noncomparable. | Never infer share from G2 review count or self-reported traffic. |
| Adoption state | Strong exploration and budget pressure, but deployment and proven ROI lag. | Supported | A1 | High | Surveys cover conversational AI or service AI broadly, not voice alone. | Separate exploration, pilot, deployment, and financial return. |
| 2024 deployment signal | Gartner service-leader survey: voicebots 44% exploring, 11% piloting, 5% deployed. | Supported survey | A1 | High | 187 respondents; planned/exploratory interest is not adoption. | Preserve sample and stage labels. |
| 2026 budget signal | Gartner survey: AI spending +38% while total service-function budgets rose 2%. | Supported survey | A1 | High | 199 leaders; no public base-dollar amounts. | Use as budget-priority evidence, not market revenue. |
| ROI signal | Only 24% of surveyed senior leaders demonstrated positive financial returns across service/support AI use cases. | Supported survey | A1 | High | Covers AI broadly; return definition not public. | Use to counter automatic ROI assumptions. |
| Human-access expectation | 87% of surveyed customers said access to a human is essential when companies use GenAI. | Supported survey | A1 | High | Broad GenAI service context, not voice only. | Treat context-preserving handoff as structural, not optional polish. |
| Trust/retry signal | Only 27% said they would retry a chatbot after a negative experience. | Supported survey | A1 | High | Chatbot behavior is directionally relevant, not voice-specific. | Use as a trust-fragility signal, with channel caveat. |
| Demand drivers | Labor/replacement cost, 24/7 coverage, rising interaction volume, speed-to-lead, cloud migration, better real-time models, action expectations, and executive budget shift. | Synthesis | P1/A1/I1/X | High | Importance varies by vertical and geography. | Tie each driver to a named workflow rather than generic “AI adoption.” |
| Adoption barriers | Data/KB readiness, integration, hallucination/unauthorized actions, latency/noise, testing, consent/disclosure, residency, spam filtering, all-in cost, human escalation, and ROI proof. | Synthesis | P1/A1/C1/X | High | Relative prevalence is unquantified. | Do not turn a sampled complaint into a measured top barrier. |
| US telecom law | FCC confirms AI-generated human voice falls under TCPA artificial/prerecorded-voice restrictions; consent, identification, and opt-out duties depend on call type and exemptions. | Supported | P1 | High | Fact-specific; FCC's explicit AI-disclosure proposal was not shown final by cutoff. | State current rule versus proposal separately; not legal advice. |
| US state developments | California healthcare, Utah, and Colorado impose or will impose use-case-specific transparency/safety duties. | Supported | P1 | High | Scope and effective dates differ; Colorado rules were still developing. | Date and scope every state statement. |
| EU transparency | AI Act Article 50 transparency duties applied from 2026-08-02. | Supported | P1 | High | Provider/deployer roles and exceptions are fact-specific. | Treat as procurement/product requirement, not blanket legal conclusion. |
| UK/Canada telecom | Automated marketing and synthesized/prerecorded solicitation rules create consent and identity obligations. | Supported | P1 | High | Interactive GenAI treatment and exemptions require counsel. | Use directional risk segmentation, not legal advice. |
| Community shortlist | Sampled 2026 discussions repeatedly compare Retell, Vapi, Bland, Synthflow, LiveKit, Pipecat, and Telnyx. | Supported for language | C1 | Medium | Affiliations and production experience are unverifiable; comparison spam is common. | Use only for vocabulary and evaluation questions. |
| Community criteria | “Production stable,” interruption, off-script logic, function calling, transfer, fallbacks, logs, handoff, observability, and all-in cost/minute recur. | Supported for language | C1 | Medium | No quantified search-volume or representative panel. | Label as sampled language. |
| Retell strongest opportunity | Neutral, model-flexible orchestration plus testing/operations and native workflows for complex phone operations. | Inference | P1/A1/X | Medium-high | Neutrality weakens if upstream components or bundles absorb the control plane. | Ground the opportunity in owned workflow/test/ops capabilities. |
| Retell biggest threat | Upstream model/CPaaS compression plus CCaaS bundling and direct rivals with regional/VPC or services advantages. | Inference | P1/A1/I1/X | Medium-high | Competitive outcomes are uncertain and buyer-specific. | Present as a pressure set, not a predicted loser/winner. |
| 12–24 month direction | Value shifts from basic voice assembly to evaluation, workflow completion, governance, vertical depth, regional infrastructure, and hybrid human operations. | Inference | A1/P1/I1/X | High directional | Timing and vendor winners are uncertain. | Re-verify after major model releases, acquisitions, regulation, or residency changes. |

## Source register

### Analyst, review, and market evidence

| Source | Date | Supports | Evidence limit |
| --- | --- | --- | --- |
| [Gartner Magic Quadrant for Conversational AI Platforms](https://www.gartner.com/en/documents/8098097) | 2026-07-07 | Established parent taxonomy, vendor set, market evolution | Abstract only; inclusion criteria and scores paywalled. |
| [Gartner: 4 Imperatives to Outperform the Maturing CAI Market](https://www.gartner.com/en/documents/8088965) | 2026-07-02 | Early maturity, hybrid control, multiagent orchestration, outcome pricing | Abstract only. |
| [Forrester Wave: Conversational AI for Customer Service](https://www.forrester.com/report/the-forrester-wave-tm-conversational-ai-for-customer-service-q2-2024/RES180735?ref_search=3527285_1723018446918) | 2024-Q2 | Customer-service taxonomy | Full report paywalled and predates recent voice-agent growth. |
| [Forrester Contact Center Tech Tide](https://www.forrester.com/report/the-forrester-tech-tide-tm-contact-centers-for-customer-service-q4-2024/RES181674?ref_search=0_1750295250413) | 2024-Q4 | Broader stack boundary | Full taxonomy paywalled. |
| [G2 AI Voice Assistants](https://www.g2.com/categories/ai-voice-assistants) | Updated 2026-09-01 | Review taxonomy, inclusion criteria, 772-product category | Mixed category; rankings/reviews are volatile. |
| [Capterra Retell AI](https://www.capterra.com/p/10026733/Retell-AI/) | Updated 2026-09-04 | Cross-category assignment | Zero Retell reviews; taxonomy only. |
| [TrustRadius Retell AI](https://www.trustradius.com/products/retell-ai/pricing) | Accessed 2026-09-06 | AI Agent Builder breadcrumb and comparison-page structure | No listed Retell plans; suggested alternatives are too broad for a reliable direct shortlist. |
| [Synergy cloud contact-center market](https://www.srgresearch.com/articles/cloud-contact-center-market-accelerates-zoom-cisco-ujet-and-ringcentral-lead-2024-growth) | 2025-04-11 | $6.2B 2024 revenue, 16.3% growth, incumbent share/cloud migration | Cloud contact center, not voice AI. |
| [Gartner CRM service/support share analysis](https://www.gartner.com/en/documents/6815834) | 2025-08-06 | $43.1B 2024 wider market | Methodology/details paywalled. |
| [Gartner contact-center forecast](https://www.gartner.com/en/documents/5451663) | 2024-05-22 | $47B 2028 broader spend forecast | Forecast, not observed revenue. |
| [IDC European CCaaS note](https://www.idc.com/resource-center/blog/idc-publishes-the-first-european-ccaas-marketscape-a-region-that-deserves-its-own-lens/) | 2025-10-13 | $1.5B 2024 to $3.7B 2029 regional forecast | Full method unavailable. |
| [Juniper CAI forecast](https://www.juniperresearch.com/press/conversational-ai-to-generate-57bn/) | 2025-02-18 | $14.6B 2025 to >$23B 2027 platform spend | Paid definitions unavailable. |
| [Juniper 2026–30 report page](https://www.juniperresearch.com/research/telecoms-connectivity/communication-services/conversational-ai-research-report/) | 2026-06-08 | Later narrower $8.5B 2030 service-revenue headline | Not comparable without definition. |

### Retell ecosystem sources

| Source | Status/date | Supports | Evidence limit |
| --- | --- | --- | --- |
| [Retell introduction](https://docs.retellai.com/general/introduction) | Living docs, accessed 2026-09-06 | Build/test/deploy/monitor lifecycle and developer surface | Feature existence, not outcome quality. |
| [Orchestration overview](https://docs.retellai.com/general/orchestration_overview) | Living docs | Cascade/S2S runtime and orchestration | Vendor description. |
| [Pricing](https://www.retellai.com/pricing) | Accessed 2026-09-06 | $0.07–$0.31/minute, component costs, concurrency, enterprise packaging | Configuration-dependent and mutable. |
| [Introducing Conductor](https://www.retellai.com/blog/introducing-conductor) | 2026-06-23 | AI-assisted build/test/production-improvement loop | Improvement metrics internal. |
| [Introducing Workflows](https://www.retellai.com/blog/retell-workflows) | 2026-08-28 | Native pre/post-call automation and connector status | Launch claims; roadmap items may change. |
| [Retell GitHub](https://github.com/RetellAI/) | Accessed 2026-09-06 | SDKs, demos, n8n, MCP and public technical assets | Core product remains closed. |
| [Solution partners](https://www.retellai.com/partners), [app partners](https://www.retellai.com/app-partner), [partner portal](https://partners.retellai.com/) | Accessed 2026-09-06 | Partner ecosystem | Quality, certification, and activity undisclosed. |
| [Purchase numbers](https://docs.retellai.com/deploy/purchase-number), [outbound calling](https://docs.retellai.com/deploy/outbound-call) | Living docs | Managed telephony geography | Imported/SIP paths may differ. |
| [Privacy policy](https://www.retellai.com/legal/privacy-policy), [compliance docs](https://docs.retellai.com/general/compliance) | Updated 2026-07-20 / accessed 2026-09-06 | US processing, transfer mechanisms, no current EU service operation | GDPR compliance is vendor-asserted; negotiated terms may differ. |

### Competitor and substitute sources

| Source | Access/date | Supports | Evidence limit |
| --- | --- | --- | --- |
| [Vapi pricing](https://vapi.ai/pricing), [enterprise](https://vapi.ai/enterprise) | 2026-09-06 | $0.05 hosting, provider pass-through/BYO, concurrency, enterprise controls | Not all-in price; vendor claims. |
| [Bland pricing](https://www.bland.ai/pricing) | 2026-09-06 | Bundled $0.14/$0.12/$0.11 tiers, concurrency, enterprise VPC/on-prem | Vendor packaging; contracts vary. |
| [Synthflow pricing](https://synthflow.ai/pricing) | 2026-09-06 | Enterprise lifecycle, US/EU hosting, $30k/year starting contract | Volume claim unaudited. |
| [Thoughtly docs](https://docs.thoughtly.com/getting-started/introduction), [pricing](https://thoughtly.com/pricing) | 2026-09-06 | No-code scope, plans from $500/month, enterprise data residency | “Unlimited” qualified by terms/overage. |
| [ElevenAgents pricing](https://elevenlabs.io/pricing/agents?price.platform=agents_platform) | 2026-09-06 | Vertically integrated voice/agent packaging | LLM/telephony can be separate. |
| [PolyAI](https://poly.ai/), [Parloa](https://www.parloa.com/platform/), [Decagon Voice](https://decagon.ai/product/voice) | 2026-09-06 | Enterprise CAI/voice alternatives | Vendor claims; no common benchmark. |
| [NICE 2025 annual report](https://www.sec.gov/Archives/edgar/data/1003935/000100393526000010/nice-20251231.htm) | Filed 2026 | $887.3M final Cognigy business-combination consideration | Separate founder holdback is post-combination compensation. |
| [Twilio ConversationRelay](https://www.twilio.com/docs/voice/twiml/connect/conversationrelay) | Living docs | CPaaS-managed voice with customer AI logic | Customer retains application/AI work. |
| [OpenAI Realtime API](https://openai.com/index/introducing-the-realtime-api/) | 2024-10-01 / production update 2025-08-28 | Direct speech/SIP/MCP upstream substitute | Not full agent operations platform. |
| [LiveKit Agents](https://docs.livekit.io/agents/), [Pipecat](https://github.com/pipecat-ai/pipecat) | 2026-09-06 | Open-source/modular DIY alternatives | Buyer owns production operations. |
| [BLS customer-service representatives](https://www.bls.gov/ooh/office-and-administrative-support/customer-service-representatives.htm) | Modified 2026-08-27 | 2.666M US jobs, $21.53/hour, -5% 2025–35, 289,500 replacement openings | Includes non-phone work; not TAM. |

### Adoption and regulatory sources

| Source | Date | Supports | Evidence limit |
| --- | --- | --- | --- |
| [Gartner 2024 service-leader survey](https://www.gartner.com/en/newsroom/press-releases/2024-12-09-gartner-survey-reveals-85-percent-of-customer-service-leaders-will-explore-or-pilot-customer-facing-conversational-genai-in-2025) | 2024-12-09 | Exploration/pilot/deployment and knowledge backlogs | 187 respondents; broad service AI. |
| [Gartner 2026 AI-spending survey](https://www.gartner.com/en/newsroom/press-releases/2026-08-26-gartner-survey-finds-ai-spending-by-customer-service-leaders-has-surged-by-38-percent-despite-overall-service-and-support-function-budgets-rising-by-just-2-percent) | 2026-08-26 | AI budget priority | 199 respondents; no base dollars. |
| [Gartner ROI/channel study](https://www.gartner.com/en/newsroom/press-releases/2026-07-08-gartner-survey-finds-customers-are-three-times-more-likely-to-use-third-party-genai-than-company-provided-chatbots-for-customer-service) | 2026-07-08 | 24% positive financial-return evidence | Broad AI use cases; method details limited. |
| [Gartner human-access survey](https://www.gartner.com/en/newsroom/press-releases/2026-08-04-gartner-survey-finds-87-percent-of-customers-say-companies-using-genai-for-customer-service-must-provide-access-to-a-human-agent0) | 2026-08-04 | 87% human-access expectation | GenAI customer service broadly. |
| [Gartner retry study](https://www.gartner.com/en/newsroom/press-releases/2026-09-02-gartner-finds-only-27-percent-of-customers-would-try-a-chatbot-again-after-a-negative-experience) | 2026-09-02 | Trust/retry fragility | Chatbot, not voice-specific. |
| [Forrester CAI commentary](https://www.forrester.com/blogs/our-new-converstational-ai-wave-genai-and-llms-drive-a-vendor-revolution/) | 2024-05-21 | Cost advantage versus loyalty/hallucination risk | Generalized ratio and analyst commentary. |
| [FCC 24-17](https://docs.fcc.gov/public/attachments/FCC-24-17A1.pdf) | Released 2024-02-08 | AI-generated voices under TCPA | Applicability depends on facts and exemptions. |
| [FTC Telemarketing Sales Rule](https://www.ftc.gov/legal-library/browse/rules/telemarketing-sales-rule) | Current | Disclosures, misrepresentation, DNC, records | TCPA and TSR have different scopes. |
| [California AB 3030](https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202320240AB3030) | Enacted 2024-09-28 | Healthcare AI communication disclosure | Narrow content/use-case scope. |
| [Utah SB 226](https://le.utah.gov/~2025/bills/sbillenr/SB0226.pdf) | Effective 2025-05-07 | Consumer/high-risk service disclosure | Fact-specific. |
| [Colorado AG AI rulemaking](https://coag.gov/ai/) | Current to 2026-09-06 | 2027 ADMT/chatbot obligations and proposed rules | Rulemaking incomplete at cutoff. |
| [EU Article 50 guidelines](https://digital-strategy.ec.europa.eu/en/library/guidelines-transparency-obligations-providers-and-deployers-ai-systems) | 2026-07-20; applies 2026-08-02 | AI-interaction transparency | Role allocation/exceptions need counsel. |
| [ICO direct-marketing guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/direct-marketing-guidance/plan-direct-marketing/?q=consent) | Current | UK automated-call consent/identity rules | Interactive GenAI classification can require interpretation. |
| [CRTC telemarketing rules](https://crtc.gc.ca/eng/phone/telemarketing/tobligations/rules-regles.htm) | Updated 2024-02-19 | Canada registration/DNCL and synthesized-voice consent | Exceptions and provincial law remain relevant. |

## Explicit unresolved gaps

1. No authoritative voice-agent-only global or US market-revenue denominator.
2. No reliable direct-vendor market-share, paid-customer, renewal, churn, or production-volume dataset.
3. No independently audited, apples-to-apples total cost per successful workflow across Retell and direct competitors.
4. No customer-side procurement survey comparing the direct platform shortlist.
5. No quantitative Google autocomplete, People Also Ask, or keyword-volume export; language evidence is sampled.
6. Full Gartner/Forrester definitions, inclusion thresholds, scores, and forecast methods are paywalled.
7. Retell's exact workload-region options, feature-level subprocessor routing, VPC/on-prem roadmap, carrier economics, and enterprise discounts remain undisclosed.
8. Global telecom, recording, biometric-voice, debt-collection, healthcare, finance, sanctions, and privacy rules require use-case-specific legal review.
9. No public evidence of a Retell acquisition, owned carrier, or owned general-purpose foundation model; these are negative-evidence gaps, not proof of nonexistence.
10. Review and community samples are vulnerable to affiliation, spam, survivorship, and rapid product-version drift.
