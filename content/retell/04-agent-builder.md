# Retell AI Persona 04 — Agent Builder

## Context metadata

- **Buying and operating role:** Directly turns a call workflow into prompts, conversation flows, tools, tests and controlled releases
- **Representative titles:** AI Engineer, Automation Engineer, Software Engineer, Solutions Engineer, Applied AI Engineer, Conversation Designer, Voice-AI Developer, Technical Consultant
- **Customer motions:** Internal enterprise team, embedded software platform, solution partner/agency, technically led SMB
- **Research cutoff:** 2026-09-06
- **Geography:** Global; carrier, number, language and data-region constraints must be validated by deployment
- **Evidence confidence:** High for documented product interactions; medium for recurring work and role variants; low to medium for exact titles, reporting lines, cadence and private motivations
- **Library index:** [Retell AI Persona Library](persona-index.md)

## Evidence convention

- **Independent customer evidence:** The Pine Park Health interview is identified separately and supports rollout behavior, not a universal builder workflow.
- **Retell or customer evidence:** Retell documentation, releases, job descriptions and customer stories are linked and explicitly attributed. Retell-hosted outcomes are selected vendor evidence and not independent benchmarks.
- **Review or community evidence:** Individual reviews and forum posts reveal vocabulary, tasks and failure modes. They are anecdotal, selection-prone and sometimes incentivized or commercially interested.
- **Researcher inference:** Unless linked or expressly attributed, responsibilities, cadence, emotions, reporting patterns and stakeholder dynamics are working hypotheses inferred from the documented product and deployments.

## Role card

| Dimension | Working definition |
| --- | --- |
| Primary question | Can I encode the real workflow in a controllable agent, prove it with representative calls and iterate without hidden state or brittle workarounds? |
| Core authority | Chooses and implements prompt, flow, tool, test and release details inside an approved architecture and workflow policy |
| Owns | Agent configuration, conversation behavior implementation, functions/tools, test cases, versions, debugging and release changes |
| Does not solely own | Platform architecture, business policy, budget, legal approval, production-quality threshold or human operating model |
| Entry point | Technical evaluation or implementation; remains active through pilot, production fixes and expansion |
| Primary measures | Build-to-test time, test pass rate, escaped defect rate, tool/transfer success, change lead time and rollback safety |
| Strongest proof | A builder can create, inspect, test, release, diagnose and safely change the customer's real agent without vendor-only intervention |

## Persona in one sentence

The Agent Builder needs Retell to make difficult real-time voice behavior fast to implement while keeping prompts, flows, actions, tests and releases understandable enough to operate after the first successful call.

## Source-backed reality

Public evidence supports a direct product user distinct from the architecture owner and from the person who governs production quality.

- Retell's [access-control documentation](https://docs.retellai.com/accounts/access-control) gives the Developer role permission to build agents, run tests, inspect raw logs and manage API keys and webhooks, while reserving billing, team and some administrative control for Admins. Product permissions are not a customer org chart, but they document the direct work surface.
- The [documentation introduction](https://docs.retellai.com/general/introduction) organizes the product around build, test, deploy, monitor and analyze. It includes single-prompt and conversation-flow agents, voices and models, dynamic variables, knowledge bases, functions, transfers, simulations, versions, telephony, call history, analytics and QA. This is first-party capability evidence, not proof that every feature is equally mature for every configuration.
- Retell's [Customer Success Engineer posting](https://jobs.ashbyhq.com/retell-ai/0e0849a2-2ca7-4b03-9a50-900d344d0881?embed=true) says Retell engineers build agents alongside customer engineering teams and troubleshoot prompts/flows, APIs, webhooks, SIP, telephony, authentication, integrations and latency. Its [Senior Strategic Deployment Manager posting](https://jobs.ashbyhq.com/retell-ai/72575c9a-5e37-44bf-b9ed-aeca3d6589e3) similarly describes configuring and testing agents, translating workflows and iterating before and after production. Accessed 2026-09-06; these are intended service motions, not customer headcount data.
- Cents' Retell-hosted story says one part-time engineer launched an embedded receptionist in four weeks after the company rejected a more complex internal build. [Cents case](https://www.retellai.com/case-study/how-cents-transforms-laundry-operations-with-24-7-voice-automation), accessed 2026-09-06. The implementation time is customer-attributed vendor evidence and should not be generalized.
- TripleTen's development team connected HubSpot triggers, prompts and call workflows, then used small batches and transcript review to improve admissions outreach. [TripleTen case](https://www.retellai.com/case-study/tripleten-ai-call-automation-admissions-case-study), accessed 2026-09-06; vendor-hosted customer evidence.
- Matic's case separates early telephony/API/prompt foundations from ongoing engineering delivery and dedicated weekly QA. [Matic case](https://www.retellai.com/case-study/matic-insurance-ai-call-automation-case-study), accessed 2026-09-06; vendor-hosted evidence. This supports the builder-versus-quality distinction even if one small team performs both jobs.
- A G2 reviewer identified as an AI Engineer at a 51–1,000-person company praised flow building, function calls, transfers, batch calls and Twilio/Telnyx integrations. [G2 reviews](https://www.g2.com/products/retell-ai/reviews), review dated 2026-04-30. The review was marked incentivized, so it supports vocabulary and role activity, not comparative performance.

## Role boundary

The builder translates an approved workflow into working agent behavior. They should neither invent policy nor silently become the sole owner of architecture, quality and compliance.

| Neighboring role | Agent Builder's boundary |
| --- | --- |
| Workflow Owner | Receives intents, rules, content, escalation and acceptance criteria; returns concrete ambiguity and edge cases rather than making business policy alone |
| Technical Owner | Works within the approved carrier, model, integration, identity, environment and reliability pattern; escalates when agent needs expose architectural problems |
| Conversation Quality Owner | Implements tests and fixes; does not unilaterally define the production sample, rubric, severe-defect threshold or expansion decision |
| Governance Approver | Configures required data, retention, disclosure and access controls; does not decide that a regulated use is lawful or contractually approved |
| Executive Sponsor | Demonstrates feasibility and implementation economics; does not authorize budget or accept reputational exposure |
| Solution Partner | May be employed by the partner or customer; responsibility for source code, prompts, credentials, support and change approval must remain explicit |

In a small business or agency, one person may perform Builder, Technical Owner and Quality Owner work. That is role compression, not evidence that architecture, test ownership or post-launch QA disappears.

## Typical titles and reporting context

### Internal enterprise or mid-market builder

- AI or Applied AI Engineer
- Automation or Integration Engineer
- Software or Product Engineer
- Solutions Engineer or Technical Consultant
- Conversation Designer paired with engineering
- Contact-Center or Digital Automation Developer

**Inference:** This variant may report through engineering, AI/data, automation, product, contact-center technology or digital transformation and work daily with a Workflow Owner.

### Embedded-platform builder

- Product Engineer
- Platform or Backend Engineer
- Voice/Conversational-AI Engineer
- Technical Product Lead who also builds

This builder packages Retell into a downstream product. They care about configuration templates, API-driven changes, tenant-specific variables, lifecycle compatibility and support load in addition to one agent's behavior.

### Agency or solution-partner builder

- Voice-AI Developer
- Automation Consultant
- Solutions Architect who also implements
- n8n/Make/CRM Integration Specialist
- Agency founder in a small delivery team

The G2 interface showed a large agency/consultant review presence at the cutoff, but the counts overlap and the review-acquisition channel is selection-prone. It supports an agency variant, not a claim that agencies are most of Retell's revenue or customers.

### Founder-led operator-builder

An owner or operations lead may use the visual flow surface directly and rely on ChatGPT, videos, community advice or a contractor for harder functions. G2 includes such accounts, but anonymous and incentivized reviews cannot establish their prevalence or long-term production success.

## What this person owns

- Agent type selection: single prompt, conversation flow or customer-hosted/custom LLM implementation within the Technical Owner's architecture
- System prompt, node instructions, transitions, deterministic branches and reusable components
- Voice, model, language, responsiveness and turn-taking settings within approved limits
- Dynamic variables, knowledge sources and context passed into each call
- Data minimization, retention-aware configuration, and escalation when recordings, transcripts, variables, knowledge, or tool payloads exceed the approved data boundary
- Functions/tools, request/response schema, validation, error handling and caller-facing waiting behavior
- Authentication, lookup, booking, write, transfer, DTMF, voicemail and end-call behavior as implemented in the agent
- Simulation cases, audio tests, manual calls and regression cases supplied with the Quality and Workflow Owners
- Post-call extraction, success fields, dispositions, webhook outputs and connected workflows
- Agent versions, comparison, staged release, rollback and implementation change notes
- First-line diagnosis using transcripts, recordings, event timelines, latency and tool logs
- Converting observed production defects into reproducible cases and fixes
- Implementation documentation sufficient for another builder to understand and change the agent

## Day-to-day workflow and tools

### 1. Translate workflow into agent behavior

- Shadow or interview the Workflow Owner and frontline staff.
- Identify intents, required information, authoritative rules, actions, prohibited behavior and human escalation.
- Separate conversational guidance from deterministic business logic and system validation.
- Define success, failure and severe-defect examples before writing a polished prompt.

### 2. Assemble the agent

- Choose a [single-prompt or conversation-flow agent](https://docs.retellai.com/general/introduction).
- Configure voice, language, model and interaction settings.
- Load knowledge and map dynamic variables.
- Build nodes, transitions, tools/functions, transfers, voicemail/IVR and end-call behavior.
- Connect CRM, EHR, helpdesk, scheduling or custom systems using native integrations, APIs, webhooks, MCP or middleware.

### 3. Test the conversation and the business action

- Use text/LLM playgrounds for fast logic iteration when the selected agent type supports them.
- Use audio/manual tests for interruption, endpointing, noise, pronunciation, accents, silence and pacing.
- Run simulation and batch cases for normal, edge and adversarial paths where the chosen integration is supported.
- Verify the downstream read/write/booking/transfer outcome instead of accepting the transcript alone.
- Compare versions and turn every important production failure into a reproducible regression.

### Architecture-specific testing and transfer limits

The test plan must follow the selected agent and telephony architecture rather than assume one universal Retell workflow.

- Retell's [Custom LLM overview](https://docs.retellai.com/integrate-llm/overview) and [Testing overview](https://docs.retellai.com/test/test-overview) say custom LLM agents are tested through web or phone calls; the Test LLM control is hidden, simulation and batch testing reject the configuration, and a custom LLM cannot be an agent-transfer destination. Customer-owned tool calls appear in the transcript only when the customer reports them to Retell. Builders need a separate external test harness and logging plan for this path.
- The same testing documentation limits speech-to-speech agents to audio tests. Text-playground and batch assumptions must not be carried over from prompt or flow agents.
- With [custom telephony](https://docs.retellai.com/deploy/custom-telephony), elastic SIP trunking can use Retell transfer only when the provider supports and is configured for it. Dial-to-SIP cannot use Retell's native transfer because Retell does not control the number/provider; the builder must call a customer-owned telephony function to transfer or end the call.

### Data-use and retention boundary

Retell's [data-retention documentation](https://docs.retellai.com/accounts/data-retention) exposes a 1–730-day configurable window with indefinite as the public default, while some basic metadata may remain. The current [Terms](https://www.retellai.com/legal/terms-of-service), effective 2026-06-01, permit certain de-identified and aggregated Communications and User Content to be used for analytics and included-model development, training, and improvement when recording is not opted out. The builder must implement the approved recording, retention, redaction, and privacy-mode configuration and escalate any desired narrower data-use commitment for written contractual confirmation.

### 4. Release carefully

- Record configuration and dependency changes.
- Promote a version into a bounded pilot or staged traffic allocation.
- Confirm monitoring, human fallback and rollback before increasing volume.
- Coordinate with the Technical Owner on carrier/model/provider changes and Governance on data or policy changes.

### 5. Diagnose and improve

- Inspect recordings, transcripts, tool events, latency and post-call fields.
- Classify failure as audio/STT, turn-taking, prompt/flow, model, tool/schema, customer API, telephony, transfer, data or human-process issue.
- Fix the correct layer, rerun the regression set and seek Quality/Workflow acceptance.
- Watch whether local fixes create new loops, latency, prompt conflicts or cross-workflow regressions.

## Desired outcomes and KPI scorecard

| KPI | What it tests | Boundary |
| --- | --- | --- |
| Time from requirement to representative test | Builder speed | A demo is not production acceptance |
| Test pass rate by scenario and version | Reproducible behavior | Preserve scenario severity and real-world representativeness |
| Severe-defect escape rate | Release discipline | Quality Owner defines the production threshold with Workflow/Governance |
| Tool and workflow completion rate | Action implementation | Verify durable downstream outcome, not just tool invocation |
| Transfer completion and context rate | Human fallback | Include barge-in, unavailable destination and caller abandonment |
| Prompt/flow change lead time | Iteration speed | Measure through tested release, not edit completion |
| Rollback success and time | Safe change | Requires version and traffic control |
| Root-cause time | Debuggability | Separate product, provider, configuration and customer-system failures |
| Repeat failure rate | Learning loop quality | A fixed production defect should become a regression test |
| Conversation latency introduced by tools/logic | Usability | Technical Owner owns architecture target; builder controls implementation contribution |
| Builder hours per agent/workflow | Delivery scalability | Important for embedded platforms and agencies |
| Documentation/hand-off completeness | Maintainability | Another authorized builder should be able to operate the agent |

The business outcome—containment, booking, collections, support cost or conversion—belongs primarily to the Workflow Owner and Sponsor. The Builder affects it but should not optimize a proxy such as call completion or average duration without the business consequence.

## Core pains

### 1. Making an agent speak is easier than making it finish the job

Retell's original Launch HN post described developers stitching together ASR, LLM and TTS and underestimating turn-taking, latency, interruption and backchannel behavior. [Launch HN](https://news.ycombinator.com/item?id=39453402), 2024-02-21. That post describes the early product and founder framing; it remains useful for the underlying builder job but not for current performance comparison.

### 2. Business policy can become tangled across prompt, graph and code

A builder must decide whether a rule belongs in natural-language instruction, a flow transition, function description, deterministic service or system of record. A community restaurant builder explicitly sought help separating prompt rules from function/backend behavior after reaching a self-estimated 80% success level. [Restaurant production-tuning request](https://community.retellai.com/t/restaurant-voice-agent-production-tuning-scalable-pos-playbook-paid-project/2677), 2026-05-12. The percentage is unverified; the boundary problem is directly described.

### 3. Tool calls create asynchronous and partial failure

Lookup, booking, payment, ticket, CRM and transfer paths can time out, return malformed data, duplicate, succeed after the caller leaves or fail after the agent verbally confirms success. The builder needs schema discipline, caller-safe waiting language, idempotency and downstream verification—not only a correct happy-path function call.

### 4. Text tests do not reproduce voice behavior

Interruption, endpointing, noise, accents, silence, pronunciation, carrier delay and voicemail are audio and telecom phenomena. A custom-LLM transfer in one community case was canceled by caller barge-in after the transfer instruction had been emitted. [Transfer-race thread](https://community.retellai.com/t/issue-while-transferring-and-getting-a-new-response-required-afterwards/2969), 2026-06-01–02. This is one incident, not a failure rate.

### 5. Test surfaces may not match the production integration

A German restaurant operator reported MCP tools working in live/UI calls but failing in simulation and batch testing. [MCP simulation thread](https://community.retellai.com/t/simulation-environment-mcp-errors-for-single-prompt-agents-tool-response-not-connected/253/2), 2026-02-10. The issue is architecture-specific and anecdotal, but it shows why the builder must prove test parity early.

### 6. Ease of first build can hide a steep edge-case curve

G2's machine-generated review topics included ease of use alongside missing features, learning curve, limited features, poor understanding and price. [G2 pros and cons](https://www.g2.com/products/retell-ai/reviews?qs=pros-and-cons), accessed 2026-09-06. Counts and summaries changed during research, and some reviews were incentivized; they are directional vocabulary only.

### 7. A fast product cadence moves the ground under the build

New models, voices, Conductor, Workflows, connectors and fixes can shorten work, but also change behavior, cost and recommended patterns. Retell's [changelog](https://www.retellai.com/changelog) documents both additions and fixes. The builder needs explicit versions and regression coverage rather than relying on remembered dashboard behavior.

## Current tools and alternatives

- Hand-coded services around carrier/SIP, STT, LLM, TTS and business APIs
- LiveKit, Pipecat, Vocode or another lower-level real-time framework
- Vapi, Bland, Synthflow, Thoughtly or another managed voice-agent platform
- CCaaS-native bot/flow tools from an installed contact-center suite
- Twilio Studio, IVR trees or deterministic scripts for narrower tasks
- n8n, Make, Zapier, serverless functions or custom middleware for CRM and pre/post-call work
- Prompt documents, spreadsheets, manual call scripts and human QA outside a formal agent-release system
- Certified partner or contractor when the customer lacks a builder
- Human receptionist, SDR, support or BPO process where reliable automation is not yet economical or safe

## Buying and implementation triggers

- A Technical Owner approves Retell and a funded workflow creates a build backlog.
- An internal prototype sounds robotic or fails on interruption, transfer, latency or telephony.
- A Workflow Owner needs after-hours coverage, immediate follow-up or repetitive call containment.
- A platform or agency must deliver similar agents across many clients without rebuilding the real-time stack.
- A legacy IVR cannot handle variable language or complete actions in modern systems.
- A production incident reveals missing tests, observability, fallback or rollback.
- A new integration, language, geography or model requires an agent redesign and regression pass.
- The team needs business users to review or propose changes without silently modifying production.

## Jobs to be done

### Functional jobs

- Convert workflow policy, content and exceptions into a controllable conversation design.
- Make the agent collect, validate, retrieve, write, book, route, transfer or end correctly.
- Balance natural interaction with deterministic control where consequences demand it.
- Create representative tests for happy paths, edge cases, abuse, noise and system failure.
- Diagnose whether failure belongs to prompt, graph, model, speech, tool, carrier or customer system.
- Release changes with a version, approval path, monitoring and rollback.
- Reduce repeated manual tuning by building reusable functions, tests and patterns.
- Hand off an understandable agent to quality and operations owners.

### Emotional jobs — researcher inference

- Get from idea to a credible live call without becoming trapped in a fragile prototype.
- Feel confident that a change fixes the cause rather than merely changing one transcript.
- Avoid being blamed for policy, architecture or model behavior outside the builder's control.

### Social and organizational jobs — researcher inference

- Be trusted by operations because the agent reflects the real workflow, not a technical abstraction.
- Show engineering peers that low-code and prompt work still follows release discipline.
- Become the person who can turn ambiguous AI requests into testable production behavior.

## Decision criteria

### Build and control

- Single-prompt and structured conversation-flow fit
- Clarity of prompt, node, transition, variable and function boundaries
- Voice/model/language selection and fine control over responsiveness
- Reusable components, templates and environment separation
- Ability to use custom logic without recreating the full voice runtime

### Tools and integrations

- Native CRM/helpdesk/calendar coverage versus custom API/webhook/MCP work
- Schema expressiveness, authentication, secret handling and test fixtures
- Caller-safe waiting, timeout, retry, idempotency and error branches
- Pre-call context and post-call structured outputs
- System-of-record verification and reconciliation

### Testing and release

- The supported mix of text, audio, manual-call, simulation, batch and external-harness coverage for the actual agent architecture
- Version comparison, staged traffic, approval and rollback
- Ability to convert a production trace into a reproducible test
- Mocking or safe sandbox behavior for consequential actions
- Separation of builder editing from production release authority where needed

### Debugging and operations

- Full event timeline, audio, transcript, latency and tool response visibility
- Component-level failure attribution
- Search, filters, alerts and collaboration with Retell support
- Support for transfer, voicemail, IVR, silence, interruption and caller disconnect
- Cost visibility during development, simulation and production

### Learning and maintainability

- Documentation accuracy and depth for complex configurations
- Reference implementations and working SDK/API examples
- Stable identifiers, schemas and migration guidance
- Partner/community expertise when internal skill is insufficient
- Readable configuration and change history for another builder

## Objections and proof requirements

| Objection or fear | What it tests | Proof required |
| --- | --- | --- |
| “The visual builder will box me in.” | Expressiveness and escape hatches | Implement one difficult branch using flows, tools and custom logic; document the resulting ownership |
| “A giant prompt will become impossible to debug.” | Structure and maintainability | Prompt/flow/function decomposition, version diff and scenario-level regression evidence |
| “The API or tool works in testing but not on real calls.” | Environment parity | Same integration exercised across every supported test surface, a manual call, and a controlled pilot with downstream verification; custom LLM paths require an external harness because Retell simulation/batch is unavailable |
| “The agent will say an action succeeded before it did.” | System integrity | Delayed, malformed, failed and duplicate-action scenarios with caller-safe language and reconciliation |
| “Transfers break under interruption or carrier differences.” | Human fallback | Barge-in, warm/cold transfer, unavailable destination, context and callback tests on the real telephony path |
| “I cannot tell whether the model, speech, Retell or my code failed.” | Debuggability | Event-timeline walkthrough with component timing, inputs, outputs and escalation route |
| “Non-English or noisy calls will invalidate the demo.” | Workload fit | Representative speakers, devices, audio conditions, names, numbers and language switching |
| “Every fix will break another path.” | Regression and change control | Versioned test suite, severity gates, staged release and rollback exercise |
| “Testing and premium components will consume the margin.” | Builder economics | Cost by model, voice, telephony, simulation, failed call and client workload |
| “We need an expert forever.” | Learnability and ownership | New-builder onboarding, runbook and independent change-and-release exercise |

## Proof hierarchy

1. Builder creates the customer's real workflow and completes its downstream action in a production-like environment
2. Representative audio and edge-case suite, including interruption, silence, noise, language, transfer and tool failure
3. Trace from bad call through root-cause classification, fix, regression and controlled release
4. Version comparison, staged traffic and rollback performed by the customer or named partner
5. Maintainable prompt/flow/function boundary and implementation documentation
6. Full configured development and production cost evidence
7. Feature tour, sample prompt, generic demo, review rating or “no-code” claim

## Buyer-journey role

| Stage | Agent Builder's contribution | Required content or evidence | Common stall |
| --- | --- | --- | --- |
| Problem framing | Advises whether the proposed behavior is buildable and where ambiguity remains | Workflow examples, prohibited actions and system inventory | Stakeholders describe “an AI receptionist” rather than intents and outcomes |
| Discovery | Compares build surfaces and estimates implementation work | Agent pattern, integration inventory and prototype plan | Demo convenience hides custom functions and operations |
| Evaluation | Builds representative proof and exposes technical limitations | Test agent, call set, logs, integration and cost notes | Happy path passes; audio, transfers or system writes do not |
| Approval | Supplies configured data/action evidence to Technical and Governance owners | Data fields, tools, retention, access and change model | Prompt or provider behavior is undocumented |
| Pilot | Implements bounded scope and fixes reviewed failures | Versioned agent, acceptance suite, human fallback and rollback | No test owner or authoritative edge cases |
| Production | Releases controlled changes and diagnoses defects | Change log, regression results, trace and support handoff | Fixes are made directly in production or ownership is unclear |
| Optimization | Converts recurring failures into reusable logic and tests | Failure taxonomy, improvement queue and version comparison | Local prompt patches accumulate conflict and latency |
| Expansion | Adapts reusable pattern to new workflow, tenant, language or geography | Template, integration contract and delta test plan | “Reuse” becomes a bespoke rebuild for each variant |

## Stakeholder dynamics

### Natural allies

- Workflow Owner who supplies policy, realistic calls, edge cases and acceptance
- Technical Owner who makes architecture and dependency decisions explicit
- Conversation Quality Owner who provides failure evidence and release thresholds
- Frontline staff who know caller language, workarounds and escalation reality
- Governance Approver who states prohibited data/actions and review conditions early
- Retell or partner engineers who can distinguish product behavior from customer configuration

### Likely tension — researcher inference

- Stakeholders who expect a prompt to compensate for missing data, policy or human capacity
- Technical Owner who standardizes before representative conversation behavior is understood
- Quality Owner who reports defects without reproducible traces or severity definitions
- Sponsor who interprets a fast prototype as permission for broad production traffic
- Business editor who wants direct production access without tests or version review
- Partner implementation whose custom code and support ownership are invisible to the customer
- Builder who optimizes naturalness or containment while ignoring legal, brand or system-completion constraints

## Messaging and content guidance

### Lead with

- The actual build loop: workflow → agent → connected action → representative test → controlled release → production trace → regression
- How to choose among single prompt, conversation flow, custom tools and custom LLM
- Concrete examples of interruption, tool, transfer and error handling
- Debug visibility and the path from a failed call to a safe fix
- Reusable patterns and clear ownership across Retell, provider, customer and partner
- Time saved relative to building orchestration, paired with the work that remains

### Prove

- Build a nontrivial customer flow live, including one system write and one human fallback
- Show event-level logs, tool payloads, latency and downstream outcome
- Run normal, edge and failure scenarios rather than one scripted call
- Compare two versions and roll back a deliberately bad change
- Explain prompt-versus-flow-versus-code boundaries
- Show current documentation, SDK examples and migration guidance
- Provide a cost breakdown for development tests and expected production calls

### Avoid

- “No code” as a synonym for no implementation, testing or production ownership
- “Just write a prompt” for an agent that performs consequential actions
- Universal low-latency, naturalness, multilingual or reliability claims
- Treating tool invocation as verified business completion
- Blaming every defect on prompt engineering without inspecting speech, model, carrier and system traces
- Saying Conductor or AI-generated tests remove human review; Retell says proposed changes remain accept/reject decisions
- Using G2/Trustpilot praise as technical proof
- Implying a community workaround is a supported product contract

### High-value content formats

- Annotated build of one real call flow
- Prompt/flow/function decision tree
- Tool and transfer failure cookbook
- Representative audio and adversarial test pack
- Debugging guide organized by component and symptom
- Version, staging and rollback walkthrough
- CRM/EHR/helpdesk integration reference implementation
- Custom LLM versus hosted-agent builder guide
- Model/voice/telephony cost calculator for test and production
- Builder onboarding checklist and implementation runbook

## Short attributable language

Use as source language, not universal proof.

- Cents Head of Growth Product Francine Dong: **“The capabilities, the UI, the workflow editor, the API”** distinguished Retell in its evaluation. [Retell-hosted Cents case](https://www.retellai.com/case-study/how-cents-transforms-laundry-operations-with-24-7-voice-automation), accessed 2026-09-06. Vendor-selected customer attribution.
- AccioJob Head of Engineering Neeraj Sharma said its team integrated call scheduling in **“hardly two days.”** [Retell-hosted AccioJob case](https://www.retellai.com/case-study/how-acciojob-saw-a-70-reduction-in-false-positive-assessments-with-retell-ai), accessed 2026-09-06. Not a representative timeline.
- A community restaurant-platform builder wrote that the agent worked **“~80% of the time on real calls”** and sought help reaching 95%. [Retell community](https://community.retellai.com/t/restaurant-voice-agent-production-tuning-scalable-pos-playbook-paid-project/2677), 2026-05-12. Self-estimated, anonymous and unaudited.
- G2 AI Engineer Rishav K. highlighted **“real-time function calling and call transfers.”** [G2](https://www.g2.com/products/retell-ai/reviews), 2026-04-30. Incentivized review; vocabulary only.

## Variants and role compression

### Enterprise internal builder

- **Distinct work:** implements one or more governed workflows inside an installed carrier, CRM/EHR/helpdesk and release process
- **Proof emphasis:** environment parity, access boundaries, system writes, change approval and support handoff
- **Likely collaborators:** separate Technical, Workflow, Quality and Governance owners

### Embedded-platform builder

- **Distinct work:** exposes Retell-powered capability to many downstream tenants or users
- **Proof emphasis:** API-driven configuration, templates, tenant variables, bulk changes, version compatibility and support tooling
- **Risk:** one upstream behavior or pricing change propagates across the customer product

### Agency or solution-partner builder

- **Distinct work:** launches and maintains agents across different clients, carriers, CRMs, languages and business rules
- **Proof emphasis:** reusable delivery playbook, workspace isolation, observability, margin and clear escalation
- **Risk:** manual client customization and support time erase the apparent platform leverage

### Founder or no-code operator-builder

- **Distinct work:** combines workflow knowledge, administration and basic flow/prompt work without a dedicated engineering team
- **Proof emphasis:** guided onboarding, templates, simple integration, transparent testing cost and access to expert help
- **Risk:** an easy first demo obscures telephony, integration, QA, billing-alert and compliance ownership

These are variants of the same direct creation-and-release job. Do not infer that every builder is a software engineer or that every visual-builder user is nontechnical.

## Retell-specific evidence

- [Retell introduction](https://docs.retellai.com/general/introduction) — build, test, deploy, monitor and analyze surface; accessed 2026-09-06
- [Agent handbook](https://docs.retellai.com/build/agent-handbook) — agent design, guardrail and operating guidance; accessed 2026-09-06
- [Orchestration overview](https://docs.retellai.com/general/orchestration_overview) — turn-taking and provider architecture; accessed 2026-09-06
- [Custom LLM overview](https://docs.retellai.com/integrate-llm/overview) — customer-built response service boundary; accessed 2026-09-06
- [Testing overview](https://docs.retellai.com/test/test-overview) — agent-type-specific playground, simulation, batch, audio, transfer and tool-log constraints; accessed 2026-09-06
- [Custom telephony](https://docs.retellai.com/deploy/custom-telephony) — elastic SIP and dial-to-SIP transfer boundaries; accessed 2026-09-06
- [Access control](https://docs.retellai.com/accounts/access-control) — Developer versus Admin permissions; accessed 2026-09-06
- [Data retention](https://docs.retellai.com/accounts/data-retention), [privacy modes](https://docs.retellai.com/accounts/privacy-disable), and [Terms](https://www.retellai.com/legal/terms-of-service) — retention default, configurable privacy controls, public data-use permission, and contractual baseline; accessed 2026-09-06
- [GitHub organization](https://github.com/RetellAI/) — SDKs, examples, browser/client, MCP and automation assets; accessed 2026-09-06
- [Conductor launch](https://www.retellai.com/blog/introducing-conductor), 2026-06-23 — vendor description of graph reading, proposed edits and simulations
- [Workflows launch](https://www.retellai.com/blog/retell-workflows), 2026-08-28 — vendor description of pre/post-call automation and integrations
- [Changelog](https://www.retellai.com/changelog) — feature, migration and defect history; accessed 2026-09-06
- [Customer Success Engineer](https://jobs.ashbyhq.com/retell-ai/0e0849a2-2ca7-4b03-9a50-900d344d0881?embed=true) and [Strategic Deployment Manager](https://jobs.ashbyhq.com/retell-ai/72575c9a-5e37-44bf-b9ed-aeca3d6589e3) — first-party implementation role descriptions; accessed 2026-09-06
- Retell-hosted customer cases for [Cents](https://www.retellai.com/case-study/how-cents-transforms-laundry-operations-with-24-7-voice-automation), [TripleTen](https://www.retellai.com/case-study/tripleten-ai-call-automation-admissions-case-study), [Matic](https://www.retellai.com/case-study/matic-insurance-ai-call-automation-case-study), [AccioJob](https://www.retellai.com/case-study/how-acciojob-saw-a-70-reduction-in-false-positive-assessments-with-retell-ai) and [ISpeedToLead](https://www.retellai.com/case-study/ispeedtolead-retell-ai-lead-response-case-study) — selected builder and rollout evidence; accessed 2026-09-06
- [Healthcare IT News on Pine Park Health](https://www.healthcareitnews.com/news/pine-park-health-sees-roi-ai-scheduling-tool), 2026-02-06 — independent evidence of a manually reviewed, gradually expanded rollout
- [G2 reviews](https://www.g2.com/products/retell-ai/reviews) and [pros/cons](https://www.g2.com/products/retell-ai/reviews?qs=pros-and-cons) — role and vocabulary signals only; accessed 2026-09-06
- Retell community threads linked under core pains — individual implementation incidents, not prevalence evidence

## Confidence and gaps

- **High confidence:** The direct product work—prompt/flow construction, variables, knowledge, tools, transfers, tests, versions, logs and release—is documented by Retell.
- **Medium confidence:** Builder as a distinct recurring role. Named cases, product permissions, job descriptions and reviews support it, but small accounts often combine several roles.
- **Low to medium confidence:** Representative title, reporting line, weekly cadence, preferred learning channel and emotional/social motivations.
- **Unknown:** Typical number of builders per account, build hours, test coverage, defect rate, time-to-proficiency, documentation satisfaction, frequency of partner use, release cadence, custom-code share and builder influence on platform selection.
- **Evidence bias:** Vendor cases select successful projects; G2 has changing counts and incentivized/anonymous reviews; community posters and commercial responders are not verified.
- **Contradiction to preserve:** “Easy to start” appears alongside complex telephony, integration, debugging and specialist-help requests. Both can be true at different stages and workflow complexity.

## Sources & coverage

### Used

- Retell product documentation, GitHub assets, releases, access controls and changelog linked above
- Retell enterprise implementation job descriptions
- Independent Pine Park Health rollout evidence
- Named Retell-hosted Cents, TripleTen, Matic, AccioJob and ISpeedToLead cases
- Selected G2 and community material for role language and test cases only
- [Persona research output](../../research/retell/persona-research-output.md) and [persona decisions](../../research/retell/persona-decisions.md)

### Limited

- No private implementation tickets, customer repositories, agent configurations, release history, support logs, user interviews or representative call corpus was available.
- Public pages cannot prove feature maturity for a specific model, carrier, integration or language.
- Review counts and themes must not be used to infer role or problem prevalence.

### Coverage

This dossier covers the person who directly creates and changes Retell agents. It does not imply that the Builder selects the enterprise architecture, owns the business outcome, sets QA thresholds or approves legal and security risk.

## Research-use rules

1. Attribute every implementation result and retain its date, customer and denominator.
2. Separate build speed from production readiness and initial test success from durable task completion.
3. Treat review and community language as hypotheses or test cases, not performance proof.
4. Do not call Retell no-code without acknowledging tools, telephony, systems, testing and operating work.
5. Distinguish agent configuration, customer code, third-party provider behavior and Retell platform capability.
6. Mark titles, reporting patterns and motivations as inference unless directly sourced.
7. Re-verify current documentation, feature behavior and limits before publishing external technical guidance.
