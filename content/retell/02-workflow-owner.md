# Retell AI Persona 02 — Workflow Owner

## Context metadata

- **Buying role:** Owns the target phone workflow, operating policy, handoffs, and outcome; coordinates frontline change with the relevant people manager when that authority is separate
- **Representative titles:** Head or VP of Customer Support, Contact Center, Operations, Collections, Admissions, Sales/Revenue Operations; Product Manager; Growth Product Manager; service-desk or functional operations leader
- **Research cutoff:** 2026-09-06
- **Evidence confidence:** High for recurring work, triggers, handoff needs, and KPI families; medium for exact title and purchase authority; low for representative frontline adoption and renewal data
- **Library context:** [Retell ICP & Buying Context](icp-context.md)

## Evidence convention

- **Independent customer evidence:** A named customer speaking in independent reporting. Pine Park Health supplies the strongest example in the reviewed corpus.
- **Customer statement in a Retell case:** A named customer's statement hosted and selected by Retell. It supports that account-level statement, not a typical result.
- **Vendor claim:** A result, company attribute, or implementation description published by Retell without outside corroboration. It is labeled as such.
- **Product/process evidence:** Retell documentation establishes available tools and required configuration work; it does not prove every customer uses them.
- **Researcher inference:** Titles, cadence, private motivation, or organization patterns inferred from repeated workflows. These are hypotheses for writing, not known biography.

Do not convert end callers or frontline transfer recipients into Retell buyers unless there is direct evidence that they participate in selection or use the Retell workspace.

## Role card

| Dimension | Writing-ready context |
| --- | --- |
| Core mission | Complete more of the target phone work at the required quality while routing exceptions to the right people with useful context. |
| Owns | Intents, workflow policy, scripts or source content, coverage windows, outcome definitions, transfer/escalation rules, frontline-readiness requirements, and operational acceptance; staffing and people management may sit elsewhere. |
| Usually influences | First-use-case scope, pilot design, baseline, test scenarios, source-system requirements, agent behavior, rollout pace, and expansion priority. |
| Does not own alone | Enterprise architecture, API/security design, legal interpretation, vendor contract, budget signature, or final model/provider choice. |
| Enters the journey | When abandonment, slow response, repetitive work, BPO inconsistency, after-hours gaps, or constrained human capacity becomes measurable. |
| Success looks like | More acceptable completed outcomes, lower delay or manual load, clean human handoffs, stable customer experience, and an operating team that can detect and correct failure. |
| Failure looks like | High apparent containment with wrong actions, repeat calls, poor transfers, customer frustration, compliance exceptions, or a growing manual cleanup queue. |

## Persona in one sentence

The Workflow Owner must turn Retell from a natural-sounding agent into a dependable operating path that resolves the right calls, hands off the rest, updates the right systems, and improves the metric the human workflow already owns.

## The evidence-backed reality

Retell's public cases often quote executives and product leaders rather than mid-level contact-center managers. The role is nevertheless visible through repeated work: defining call scope, preparing scripts and data, setting triggers, coordinating frontline readiness, reviewing transcripts, and deciding how humans receive exceptions. The evidence does not establish that the same role line-manages or trains every frontline team.

| Account and evidence | Named role or visible owner | Workflow and trigger | Operating evidence | Important limit |
| --- | --- | --- | --- | --- |
| [Pine Park Health in Healthcare IT News](https://www.healthcareitnews.com/news/pine-park-health-sees-roi-ai-scheduling-tool), 2026-02-06 — independent | COO Michael “Mike” Tadlock performed sponsor and early workflow/quality work; Medical Assistants became operational counterparts | Appointment reminders and proactive scheduling; calls consumed roughly four minutes and distracted MAs from care coordination | Tadlock hand-selected early calls and reviewed every transcript/recording; Retell interviewed staff; MAs learned to review transcripts and handle cancellations, changes, and urgent issues | No separately named scheduling or MA manager; do not assign procurement or technical authority to the MAs |
| [Matic Insurance](https://www.retellai.com/case-study/matic-insurance-ai-call-automation-case-study) — Retell case | Brian Barker, Product Manager | After-hours intake, appointment confirmation/rescheduling, structured lead data, and warm transfer | Telephony established Twilio/API foundations; engineering, QA, and operations meet regularly; a dedicated QA person samples 150+ calls weekly; licensed reps receive qualified transfers | Economic buyer and risk approver are not identified; most metrics are vendor-published |
| [TripleTen](https://www.retellai.com/case-study/tripleten-ai-call-automation-admissions-case-study) — Retell case | Ana Riabova, AI Growth Product Manager | Admissions outreach and booking when inquiry growth exceeded advisor capacity | Small August 2024 prototype, HubSpot triggers, internal testing, small prospect batches, transcript analysis, then broader volume; admissions staff remain human counterparts | Vendor reports 17,000 calls and 200 hours saved monthly; no independent validation or named economic approver |
| [BrightChamps](https://www.retellai.com/case-study/how-brightchamps-unlocking-scale-in-global-edtech-with-ai-powered-sales-calls) — Retell case | Shivam Sharma, Associate Product Manager | Global education sales calls and scaling parent outreach | Supports a product-led workflow owner in a revenue motion | Public case is vendor-selected; do not infer broader authority, reporting line, or outcome typicality |
| [Cents](https://www.retellai.com/case-study/how-cents-transforms-laundry-operations-with-24-7-voice-automation) — Retell case | Francine Dong, Head of Growth Product | White-labeled receptionist for laundromat operators that could not staff every call | Product defined a configurable downstream workflow; one engineer launched in four weeks part-time; later work moved toward tenant self-service and API mass changes | Cents is an embedded-platform buyer; laundromat callers/operators are downstream audiences, not direct Retell buyers |
| [Everise](https://www.retellai.com/case-study/how-everise-contained-65-of-internal-service-desk-tickets-with-retell-ai) — Retell case | Saurabh Sodhani, SVP Digital Transformation; Mindcraft Labs as implementation partner | Internal IT service desk for identity, ticketing, software, and telephony issues across global accents | Requirements, API integrations, prompt trees, global UAT, and human service-desk transfer all appear | A dedicated service-desk workflow owner is not named; title says tickets, while the customer quote says 65% of voice calls contained |
| [ISpeedToLead](https://www.retellai.com/case-study/ispeedtolead-retell-ai-lead-response-case-study) — Retell case | Yuri Saiko, labeled Founder on the card and Head of Sales in body copy; Kevin Hogan/Target Dial implemented | Immediate follow-up for real-estate marketplace leads | CRM and lead-form access, scripts, routing, follow-up, short beta, and QA refinement; partner substituted for internal engineering | Saiko's title is inconsistent; reported speed and conversion results are vendor-hosted |
| [Medical Data Systems](https://www.retellai.com/case-study/how-medical-data-systems-scales-280-000-in-monthly-collections-with-ai-voice-agents-on-retell) — Retell case | CIO Linda Harvard is named; collections owner is not | Patient billing and collections with human handling of appropriate exceptions | Confirms a bounded regulated operations workflow with containment and collection outcomes | Do not invent a collections-director persona from unnamed functional work; all scale/result figures are vendor-hosted |

### What these cases establish

- Workflow ownership is a durable job even when no dedicated title is named.
- Product and growth-product managers recur as visible owners when the agent is treated as a product or growth channel.
- Service, scheduling, admissions, sales, collections, and internal-support workflows use different KPIs but share the same core work: define scope, policy, outcome, handoff, and live operating change.
- The owner supplies domain rules and real edge cases that a technical team cannot infer from APIs or architecture.
- Reviewed Pine Park, Matic, and TripleTen examples use bounded volume, transcript review, cross-functional iteration, or retained human paths. Treat this as a source-backed pattern and prudent rollout guidance, not a measured rule for all successful deployments.

### What the cases do not establish

- A single dominant job title or reporting line
- That the named Product Manager or executive controlled budget or signed the agreement
- How often frontline agents resisted, adopted, or preferred the new workflow
- A representative containment, conversion, CSAT, implementation-time, or staffing outcome
- Who owns renewal in practice

## Authority boundaries

### Decisions this role should own

- Which call intents are in scope for the first release
- What counts as resolved, qualified, booked, collected, transferred, failed, or unsafe
- Which information the agent may state, collect, validate, or write
- Which policy exceptions, licensed actions, complaints, urgent needs, hardship cases, and low-confidence situations require a person
- Coverage windows, languages, retry/callback logic, and caller-routing policy
- What context must accompany a human transfer
- Baseline definitions and operating acceptance criteria
- Frontline-readiness requirements and coordination of transferred or exceptional work; staffing, training delivery, and people management may be shared with a frontline manager
- When a workflow change is operationally acceptable

### Decisions this role influences but does not own alone

- Agent architecture, model, carrier/SIP design, latency target, and source-system implementation
- Data access, retention, sensitive-data handling, and workspace permissions
- Legal interpretation of outbound consent, disclosure, recording, do-not-call, and regulated use
- Budget, contract, commercial terms, and residual executive exposure
- Test tooling, release mechanics, observability, rollback, and incident architecture

### Work that belongs to adjacent roles

| Adjacent role | Distinct responsibility | Handoff with Workflow Owner |
| --- | --- | --- |
| Executive Sponsor | Funds, accepts exposure, and decides production/expansion | Workflow Owner supplies baseline, operating result, adoption burden, and risk boundary |
| Technical Owner | Selects and governs production architecture | Workflow Owner supplies systems, actions, policies, peak demand, and failure consequences |
| Agent Builder | Implements prompts, flows, tools, variables, and releases | Workflow Owner converts policy into examples, acceptance tests, and change approval |
| Conversation Quality Owner | Samples live calls, maintains evaluations, and controls regression | Workflow Owner defines ground truth, severity, and business consequence |
| Governance Approver | Sets security, privacy, legal, compliance, and contractual conditions | Workflow Owner supplies actual call/data/jurisdiction scope and prohibited actions |
| Frontline team / manager | Receives and manages transfers, exceptions, complaints, and outage work | Workflow Owner defines readiness and feedback needs; the frontline manager may own staffing, training delivery, and people management |

One person may perform multiple roles. The distinction is about decision logic, not mandatory headcount.

## Shared responsibilities

- Map the current call journey from trigger through final system state
- Segment volume by intent, hour, day, season, language, geography, and incident peak
- Establish a baseline before changing staffing or routing
- Define the first bounded workflow and explicit exclusions
- Provide scripts, knowledge, policy, real examples, edge cases, and escalation rules
- Define the human transfer, callback, and outage experience
- Validate that CRM, EHR, helpdesk, scheduling, billing, or operations actions reflect business truth
- Coordinate with frontline management on recipient training and capture their feedback
- Participate in pilot review and approve operational volume increases
- Monitor completed outcomes, repeat calls, complaints, handoff quality, and manual cleanup
- Partner with quality and technical owners on regressions, incidents, and change control

## Operating cadence

Public cases show rollout and review activity but not a universal schedule. The cadence below is a **researcher inference** grounded in Pine Park, Matic, TripleTen, Spare, and Retell's QA/testing guidance.

### Daily or per-shift

- Queue, call, transfer, callback, and severe-failure alerts
- Calls that require urgent or regulated human follow-up
- Failed tool actions, missing data, incorrect routing, and repeat callers
- Frontline feedback on missing context or inappropriate escalation
- Volume anomalies, provider incidents, and uncovered periods

### Weekly

- Outcome and failure distribution by intent, cohort, language, campaign, and version
- Sampled calls and transcript clusters, including successful-looking calls that did not complete the job
- Transfer acceptance, context quality, callback completion, and human cleanup
- Prompt, policy, knowledge, routing, and tool-change priorities
- Staffing impact and whether difficult work is accumulating in the human queue

### Monthly or quarterly

- Baseline-to-current service, revenue, cost, and experience outcomes
- Fully loaded cost per acceptable completed outcome
- Scope changes, policy changes, new languages/geographies, and model/provider changes
- Expansion or contraction by intent, team, campaign, or customer segment
- Frontline training, ownership, and operating-capacity review
- Material incidents, complaints, compliance exceptions, and durable regression coverage

## Current-state workflow map

### Inbound service and operations

1. Caller reaches a number or is routed from an existing phone system.
2. Agent identifies intent and, where allowed, authenticates the caller.
3. Agent retrieves policy, account, status, scheduling, billing, ticket, or operational data.
4. Agent answers, creates/updates a record, books or changes an appointment, or initiates another allowed action.
5. Agent transfers or schedules human follow-up for excluded, sensitive, low-confidence, complex, emotional, or urgent cases.
6. Conversation and outcome data enter QA, analytics, exception, and improvement loops.

### Outbound revenue, admissions, scheduling, or collections

1. A consented lead, appointment, account event, or campaign trigger enters from CRM, EHR, scheduling, billing, or another source.
2. Agent calls within allowed hours, destinations, retry rules, and disclosure/consent conditions.
3. Agent verifies the right party where needed, explains the purpose, and follows the approved workflow.
4. Agent qualifies, confirms, books, gathers structured information, navigates a bounded payment/status path, or transfers to a person.
5. Outcome, disposition, transcript-derived fields, and next action return to the source system.
6. Human owners review exceptions, opt-outs, disputes, complaints, urgent needs, and failed actions.

### Tools and systems commonly required

| System or tool | Workflow job | Owner question |
| --- | --- | --- |
| CRM or lead platform | Trigger follow-up, retrieve lead/account context, write disposition, assign human action | Is the record complete and current enough to drive a call safely? |
| EHR or scheduling | Verify permitted identity, confirm/cancel/reschedule, fill openings, write notes | Which data and actions are allowed, and what must become clinical/urgent escalation? |
| Helpdesk/ITSM | Retrieve status, create/check tickets, route incidents | Does “contained” mean the ticket was actually correct and complete? |
| Billing/collections | Retrieve balance/status, document call, navigate bounded payment workflows | Which disputes, hardship, payment, or legal paths must remain human? |
| Calendar/booking | Offer valid times and confirm an appointment or meeting | How are conflicts, time zones, ownership, and no-show follow-up handled? |
| Telephony/SIP/CCaaS | Number, routing, transfer, queue, recording, and capacity | What happens under peak demand, carrier/provider failure, or failed transfer? |
| Knowledge and policy sources | Supply approved answers, eligibility, scripts, and exceptions | Who owns accuracy, effective dates, and conflicting policy? |
| Retell testing/QA/analytics | Simulate, test real audio, inspect calls, score outcomes, and monitor versions | Which sample and ground truth represent acceptable production behavior? |

## Jobs to be done

### Functional jobs

- Answer more calls at the times customers actually call
- Reduce abandonment, voicemail, hold time, and slow follow-up
- Complete repetitive intents without creating rework or repeat calls
- Route complex work to the right person with identity, reason, and context preserved
- Let specialists spend more time on judgment, empathy, negotiation, licensing, or care
- Make call outcomes visible and actionable in the source system
- Define a safe boundary between automation and human work
- Improve the workflow continuously without destabilizing production

### Emotional jobs — researcher inference

- Trust that the agent will follow policy when the owner is not listening
- Avoid discovering a harmful edge case through a customer complaint
- Feel that automation reduces workload rather than creating an opaque exception queue
- Preserve confidence and credibility with frontline employees asked to absorb changed work

### Social and organizational jobs — researcher inference

- Show leadership an operating improvement, not just a technology launch
- Be seen as protecting customers and employees while changing the service model
- Give engineering precise requirements instead of subjective requests for a “more human” agent
- Create shared definitions of success across operations, product, technical, quality, and governance teams

## Buying triggers

- Abandonment, wait time, voicemail, or repeat-call volume crosses an operating threshold
- Leads or applicants arrive outside working hours and response speed affects conversion
- Reminder, status, qualification, or intake work consumes skilled employee time
- A BPO produces inconsistent scripts, high turnover, slow training, or escalating cost
- A launch, campaign, outage, season, or geographic expansion creates demand the team cannot staff
- A sponsor requests an AI production use case and this workflow has measurable baseline data
- The organization has a working prototype but lacks reliable transfer, system completion, QA, or operating ownership
- Frontline teams identify a bounded queue they want removed or redesigned
- A vertical product sees the same receptionist/support/booking need across downstream customers

## Current alternatives and workarounds

| Alternative | Why it persists | Workflow Owner's trade-off |
| --- | --- | --- |
| More frontline hiring or overtime | Familiar and flexible for complex work | Slow, expensive, difficult for nights/peaks, but often safer for novel judgment |
| BPO or contractor team | Outsources recruiting, scheduling, and management | Requires scripts, QA, training, vendor management, and may still struggle with volatility |
| IVR and deterministic routing | Predictable, inexpensive, and easy to govern | Poor fit for variable natural-language requests or tasks that span systems |
| Voicemail and callbacks | Simple overflow path | Adds delay, missed connections, duplicate effort, and weak immediate resolution |
| Forms, chat, SMS, or email | Lower-cost asynchronous capture | Excludes phone-first audiences and may not satisfy urgency or accessibility needs |
| Manual scripts and checklists | Preserves human judgment and policy control | Quality varies; updates and coaching take time; repetitive labor remains |
| Internal voice build | Maximum control over workflow and data | Requires telephony, real-time orchestration, evaluation, observability, and maintenance capacity |
| CCaaS-native bot | Fits incumbent queue and reporting | May be less flexible, less natural, or slower to iterate; must be tested, not assumed |
| Do nothing | Avoids implementation disruption | Leaves the queue, lost outcome, or staffing burden intact |

## Core pains and consequences

### 1. The queue is measured, but the customer job is not

Teams may track calls answered or average handle time while losing sight of whether the appointment, ticket, qualification, payment, or transfer actually succeeded.

**Consequence:** automation optimizes a convenient metric while repeat calls and downstream work grow.

### 2. Human coverage is mismatched to demand

Nights, weekends, incidents, campaigns, and global time zones create gaps or idle peak staffing.

**Consequence:** callers abandon, leads cool, appointments remain unused, or high-value specialists spend time on routine contact.

### 3. Policy lives across people, scripts, and systems

Experienced agents resolve ambiguity using context that may never have been written down.

**Consequence:** an agent built only from a happy-path script fails on real intent variation, conflicting data, exceptions, and outdated policy.

### 4. A transfer can preserve or destroy the experience

Connecting a caller to a person is not enough. The recipient needs the reason, authentication state, collected information, attempted actions, urgency, and next step.

**Consequence:** the caller repeats everything, the human distrusts the automation, and apparent containment hides poor service.

### 5. The hard work moves to humans

Automating simple calls concentrates emotional, regulated, unusual, or high-value cases in the remaining human queue.

**Consequence:** workload may fall while cognitive load, training requirements, handle time, and burnout rise.

### 6. Live behavior changes over time

Policies, products, campaigns, models, integrations, and caller behavior change after launch.

**Consequence:** a successful pilot can regress silently unless ownership, sampling, evaluations, and release control persist.

## KPI scorecard

### Shared KPI logic

| KPI family | Useful measure | Guardrail |
| --- | --- | --- |
| Access | Answer rate, wait time, abandonment, time-to-first-contact, coverage hours | Do not celebrate access if completion or experience falls |
| Completion | Resolution, booking, qualification, ticket/action completion, successful transfer | Define denominator and verify source-system state |
| Quality | Policy adherence, information accuracy, intent/routing accuracy, severe-defect rate | Automated scores require sampling and ground-truth checks |
| Human handoff | Transfer connection, context completeness, callback completion, repeat explanation | A transferred call is not automatically a successful outcome |
| Customer experience | CSAT/NPS where method is known, complaints, repeat calls, opt-outs | Selected testimonials do not prove representative caller acceptance |
| Capacity | Human hours/FTE returned, queue reduction, specialist utilization | Track complexity and burden in the remaining human work |
| Economics | Cost per acceptable completed outcome | Include usage, implementation, QA, fallback, and internal operations |

### Variant A — Service and operations

**Representative functions:** Customer support, contact center, scheduling, internal service desk, transit/driver support, billing, and bounded collections.

| Primary measure | What the owner needs to know |
| --- | --- |
| Containment/resolution | Did the agent complete the permitted job without avoidable human work or repeat contact? |
| Abandonment and wait | Did callers gain timely access, including nights and incident peaks? |
| Transfer success | Did the right human receive the caller with actionable context? |
| Handle time and capacity | Did repetitive work fall without making the remaining queue unsustainably difficult? |
| CSAT/NPS/complaints | Did service quality hold for the relevant caller population and intent? |
| Ticket/record accuracy | Did the source system reflect what actually happened? |

**Observed anchors:** [Pine Park](https://www.healthcareitnews.com/news/pine-park-health-sees-roi-ai-scheduling-tool) reports capacity returned and booking among connected calls through independent reporting. [SWTCH](https://www.retellai.com/case-study/how-swtch-keeps-ev-drivers-moving-with-always-on-voice-support-powered-by-retell), [Spare](https://www.retellai.com/case-study/how-sparelabs-put-ai-voice-on-the-front-line-of-public-transit-and-watched-it-take-off), [Everise](https://www.retellai.com/case-study/how-everise-contained-65-of-internal-service-desk-tickets-with-retell-ai), [MDS](https://www.retellai.com/case-study/how-medical-data-systems-scales-280-000-in-monthly-collections-with-ai-voice-agents-on-retell), [Sunshine](https://www.retellai.com/case-study/sunshine-loans-retell-ai-customer-support-automation), [Matic](https://www.retellai.com/case-study/matic-insurance-ai-call-automation-case-study), and [Anker](https://www.retellai.com/case-study/how-anker-transformed-global-customer-support-with-human-quality-al-voice) supply vendor-hosted account evidence with differing definitions.

### Variant B — Revenue and admissions

**Representative functions:** Sales operations, admissions, growth product, lead response, qualification, meeting/trial booking, and reactivation.

| Primary measure | What the owner needs to know |
| --- | --- |
| Speed-to-lead | How quickly did a consented lead receive useful contact? |
| Pickup/contact | Did the right person answer, and how are retries counted? |
| Qualification | Did the agent capture correct, usable criteria rather than merely finish a script? |
| Booking/trial attendance | Did the booked next step occur, not just appear on a calendar? |
| Conversion/revenue per lead | Did downstream performance hold after cohort and lead-quality differences? |
| Human closer utilization | Did qualified warm transfers increase productive human time? |

**Observed anchors:** [TripleTen](https://www.retellai.com/case-study/tripleten-ai-call-automation-admissions-case-study), [BrightChamps](https://www.retellai.com/case-study/how-brightchamps-unlocking-scale-in-global-edtech-with-ai-powered-sales-calls), [ISpeedToLead](https://www.retellai.com/case-study/ispeedtolead-retell-ai-lead-response-case-study), [Inbounds.com](https://www.retellai.com/case-study/how-inbounds-com-optimize-and-scale-high-ticket-call-campaigns-with-retell-ai), and [Boatzon](https://www.retellai.com/case-study/how-retell-ai-became-boatzons-top-performing-employee) provide vendor-hosted evidence. Their metrics must remain account-specific and should not be generalized across lead sources or sales motions.

### Regulated-workflow modifier

Healthcare scheduling, insurance intake, collections support, and identity/ticket workflows add constraints; they do not create a separate universal persona.

- Separate information gathering and routing from licensed, clinical, underwriting, hardship, dispute, or consequential decisions.
- Define identity verification, permitted data, disclosure, recording, consent, retention, and escalation explicitly.
- Require governance review for actual jurisdictions and use, rather than borrowing a compliance label from another customer.
- Current public [Terms](https://www.retellai.com/legal/terms-of-service) prohibit autodial, AI voice, or prerecorded-message calls to 911 and emergency telephone lines, hospital or healthcare-facility emergency lines, patient rooms in hospitals, healthcare facilities, or elderly homes, and paging services. Separately, §8 says the service is not designed for medical, emergency, aviation, nuclear, or other inherently dangerous or safety-critical environments and disclaims liability for those uses. Ordinary scheduling is not automatically the same category, but still needs workflow-specific review.

## Outcome evidence and interpretation

| Evidence | What can be written | What should not be written |
| --- | --- | --- |
| Pine Park independent interview | The COO reported about 2.1 FTE returned and 55.7% booking among connected proactive calls | Retell typically returns 2.1 FTE or books most healthcare callers |
| Matic Retell case | The account describes cross-functional operation and a dedicated reviewer; Retell reports 85–90% transfer success and other outcomes | Insurance agents universally transfer at 85–90% or preserve NPS automatically |
| TripleTen Retell case | Retell reports 17,000 monthly calls and 200 hours saved after a phased admissions rollout | All admissions deployments launch in one month or match human conversion |
| Cents Retell-hosted case | Cents built an embedded receptionist product; the case includes unnamed downstream-operator feedback about reduced human call load | Cents metrics represent direct Retell SMB customers or one standard resolution definition |
| Everise Retell case | Sodhani says 65% of voice calls were contained in the internal service desk | 65% of tickets were resolved, or this is a typical BPO benchmark |
| ISpeedToLead Retell case | A partner-built lead workflow reportedly cut response time and increased meetings | Every lead-response workflow produces the same conversion lift |

## Decision criteria

1. **Intent boundedness:** Can the team define the allowed job and clear exclusions?
2. **Baseline quality:** Are current volume, timing, abandonment, completion, cost, experience, and human work measured consistently?
3. **System completion:** Can the agent read and write the source systems needed to finish the job?
4. **Policy completeness:** Are scripts, rules, exceptions, effective dates, and ownership explicit?
5. **Human fallback:** Are transfer, callback, outage, complaint, urgent, and regulated paths staffed and testable?
6. **Caller variation:** Do tests represent accents, pacing, interruption, noise, language, ambiguous intent, and real data?
7. **Operational observability:** Can the team identify why a call failed and connect it to a version, prompt, tool, or provider event?
8. **Change ownership:** Who requests, implements, tests, approves, and monitors workflow changes?
9. **Frontline acceptance:** Can humans trust the transferred context and influence the improvement loop?
10. **Outcome economics:** Does value remain after repeat calls, exceptions, QA, and human cleanup are included?

## Objections, failure fears, and proof

| Objection or fear | What it is testing | Required proof |
| --- | --- | --- |
| “It sounds good, but it will say the wrong thing on an edge case.” | Policy coverage and failure boundary | Real edge-case library, severe-defect rubric, safe fallback, sampled results, and regression tests |
| “Containment will just create repeat calls or cleanup.” | Downstream completion | Source-system verification, repeat-contact analysis, exception volume, and human rework |
| “Our customers will hate talking to it.” | Caller acceptance | Representative pilot cohorts, complaint/opt-out data, pacing/interruption tests, and accessible human route |
| “Transfers will fail or arrive without context.” | Hybrid service quality | Live transfer tests, fallback/callback path, context payload, queue ownership, and frontline feedback |
| “Our workflow changes every week.” | Maintainability and release discipline | Named content/policy owner, change log, tests, version control, staged rollout, and rollback |
| “The remaining human calls will be much harder.” | Workforce consequence | Capacity and complexity analysis, staffing/training plan, handle-time and burnout indicators |
| “We cannot automate this regulated step.” | Scope and consequence | Narrowed intake/status/routing boundary, named human decision owner, governance approval, and audit trail |
| “We tried a bot before and it was rigid.” | Natural interaction plus action flexibility | Real conversations, interruptions, tool use, policy variance, and editable workflow demonstration |
| “No one has time to operate another system.” | Ownership and support burden | Weekly operating model, QA capacity, partner/internal responsibilities, alerting, and costed ongoing work |

## Proof hierarchy

1. Representative calls from the buyer's actual workflow with verified downstream outcomes
2. Explicit resolve/transfer/reject policy and human-path testing
3. Baseline-to-pilot cohort results with stable definitions and denominators
4. Source-system action evidence, not transcript quality alone
5. Frontline review of transfer context and changed work
6. Named quality, change, incident, and escalation ownership
7. Comparable customer evidence with source class and workflow similarity
8. Generic demos, voice samples, headline containment, or feature lists

## Buyer journey role

| Stage | Workflow Owner's job | Needed content/evidence | Common stall |
| --- | --- | --- | --- |
| Problem recognition | Quantify the current queue, missed outcome, and human burden | Baseline worksheet, intent/volume map, consequence-of-inaction model | Pain is anecdotal or spread across teams |
| Discovery | Translate the process into an evaluable first scope | Workflow canvas, human-boundary guide, category/build-versus-buy comparison | Team buys “human-like voice” before defining completion |
| Evaluation | Supply real calls, data, edge cases, policies, and handoffs | Representative test pack, outcome rubric, live transfer and tool-action plan | Happy path passes while real variance is absent |
| Approval | Explain actual callers, data, actions, jurisdictions, and exceptions | Data/action map, communications rules, responsibility matrix, prohibited-use boundary | Governance receives generic product claims instead of workflow facts |
| Pilot | Accept or reject operating performance at small volume | Baseline, success/severe-failure criteria, transcript/audio review, rollback and staffing plan | No ground truth, no QA owner, or scope is too broad |
| Implementation | Finalize source systems, scripts, tools, escalation, and frontline process | Detailed workflow, RACI, runbook, training, change log | Missing authentication/data, brittle integration, unclear exception ownership |
| Production adoption | Own day-to-day service and feedback with Quality Owner | Dashboard, daily alerts, weekly review, incident/callback procedure | Bad transfers, missing context, change fatigue, hidden manual cleanup |
| Expansion | Select the next intent only after the first is stable | Outcome cohort, reuse map, new exception/risk analysis, staffing capacity | Easy workflow results are assumed to transfer to harder work |
| Renewal | Compare durable outcome with full operating burden and alternatives | Longitudinal service/revenue, cost, reliability, support, and workload data | Public renewal and retention evidence is unavailable |

### Observed rollout pattern

The named cases support **land narrowly, review heavily, then expand**:

- Pine Park began with hand-selected calls, executive review of every early call, gradual volume, and Medical Assistant training.
- TripleTen moved from a small prototype to internal tests, small prospect batches, transcript analysis, and broader use.
- ISpeedToLead used a partner, short beta, CRM/scripts/routing setup, and QA refinement.
- Matic built shared telephony/API/prompt foundations, then shipped use cases in later sprints with ongoing cross-functional QA.
- Cents launched quickly with one part-time engineer, then addressed repeatability through configuration and API-based bulk changes.

These are examples, not a universal implementation time or success rate.

## Segment variants

### Variant A — Service and contact-center operations

- **Titles:** Head/VP Customer Support, Contact Center Operations, Customer Experience, Service Operations, Support Product, or functional operations leader
- **Primary job:** Resolve a bounded set of inbound needs while protecting escalation and service quality
- **Primary metrics:** Answer, abandonment, wait, resolution, repeat contact, transfer, handle time, CSAT/complaints, and cost per resolution
- **Common triggers:** Queue growth, after-hours gaps, incident spikes, BPO inconsistency, or expensive repetitive Tier-1 work
- **Best proof:** Real caller cohorts, correct system actions, reliable transfer, frontline context, and quality over time

### Variant B — Revenue, growth, and admissions

- **Titles:** Sales/Revenue Operations, Admissions Operations, Growth Product, Product Manager, Head of Sales, or lead-management owner
- **Primary job:** Contact consented demand quickly, qualify consistently, and connect high-value prospects to the right person or next step
- **Primary metrics:** Speed-to-lead, pickup, qualification accuracy, booking, show/trial attendance, conversion, and closer utilization
- **Common triggers:** Leads arrive faster than teams can respond, nights/weekends go uncovered, or humans spend time chasing and scheduling
- **Best proof:** Lead-source cohorts, booking-to-attendance and downstream conversion—not call volume alone

### Variant C — Scheduling, billing, collections, or regulated intake

- **Titles:** Scheduling/Access Operations, Revenue Cycle, Collections Operations, Insurance Operations, Product/Operations leader
- **Primary job:** Automate permitted information, intake, status, confirmation, or routing while preserving high-consequence human decisions
- **Primary metrics:** Booking/show rate, capacity filled, correct identity/data, contact and collection outcome, safe transfer, and complaint/exception rate
- **Common triggers:** Specialist time consumed by routine calls, unused provider capacity, high abandonment, or repetitive data collection
- **Best proof:** Identity and source-system correctness, explicit prohibited actions, audit trail, and tested clinical/licensed/hardship escalation
- **Evidence limit:** Public named functional-title evidence is thinner here than workflow evidence; do not invent a role holder.

### Variant D — Embedded-product workflow owner

- **Titles:** Head of Growth Product, Product Lead, vertical product owner
- **Primary job:** Turn a common downstream-customer phone problem into a configurable product without making every tenant a custom implementation
- **Primary metrics:** Activation, downstream resolution, product revenue, adoption, support load, configuration time, and retention
- **Common triggers:** Repeated customer requests and a product opportunity that the existing engineering team cannot justify building from primitives
- **Best proof:** Tenant configuration, APIs, bulk updates, downstream escalation, reporting, unit economics, and support ownership
- **Boundary:** This variant overlaps with the separate Solution Partner & Platform Operator persona when multi-client operations and commercial packaging dominate.
- **Commercial/legal condition:** named embedded deployments show the motion exists, but default public [Terms](https://www.retellai.com/legal/terms-of-service) restrict certain resale, standalone voice-output, substitute, and intermediary uses. Applicable partner/platform/order-form rights must be confirmed in writing.

## Stakeholder dynamics

### Natural allies

- Executive Sponsor who accepts a realistic human-plus-AI operating model
- Frontline staff who can identify repetitive work and real failure modes
- Technical Owner who can make source-system actions and failure states observable
- Agent Builder who translates policy into editable, testable implementation
- Conversation Quality Owner who maintains evaluation and regression coverage
- Governance Approver engaged with actual workflow facts rather than generic platform claims
- Solution partner when internal implementation or operating capacity is missing

### Likely tension

- Sponsors optimizing labor savings while the owner sees customer or exception risk
- Technical teams asking operations for complete rules that currently live tacitly in experienced people
- Builders optimizing call completion without understanding downstream business completion
- Quality teams blocking volume because ground truth or severe-failure thresholds are missing
- Frontline staff who receive only difficult calls and fear replacement or added scrutiny
- Legal/security teams receiving the workflow late, after outbound, data, or geography assumptions are embedded

## Messaging and content guidance

### Lead with

- The exact queue, intent, trigger, and business outcome
- What the agent resolves, what it transfers, and what it must never do
- The source-system action and the context delivered to humans
- Baseline and denominator, including repeat calls and cleanup
- A credible daily/weekly operating loop after launch
- The effect on frontline work, not only call reduction

### Avoid

- “Replace agents” when the deployment still needs licensed, clinical, complex, emotional, or exception work
- Treating containment, transfer, or answer rate as interchangeable with resolution
- “No code” as “no workflow design, integration, QA, or ongoing ownership”
- Using a single case metric as an expected result
- Promising every caller prefers AI or cannot detect it
- Hiding the need for consent, disclosure, recording, data, or regulated-use review
- Inventing a Head of Contact Center, Collections Director, or frontline quote when the case does not name one

### High-value content formats

- Intent and human-boundary mapping worksheet
- Baseline and KPI-definition guide
- Service-versus-revenue workflow playbooks
- Transfer/context and outage design checklist
- Representative-call acceptance pack
- Frontline change and training plan
- Daily/weekly conversation-operations runbook
- “Containment is not completion” measurement guide
- Regulated-workflow scope and escalation template

## Short customer language

Use exact phrases sparingly and preserve the evidence class.

- **“Operational debt”** — Pine Park COO Michael Tadlock's phrase for accumulated phone-workload burden in a [Retell-hosted customer case](https://www.retellai.com/case-study/how-pine-park-health-elevates-senior-care-with-intelligent-voice-automation).
- **“Side by side”** — the [TripleTen case](https://www.retellai.com/case-study/tripleten-ai-call-automation-admissions-case-study) describes AI working with admissions staff, not replacing the whole team.
- **“Scrappy small-business owners”** — Cents Head of Growth Product Francine Dong's description of laundromat operators in a [Retell-hosted case](https://www.retellai.com/case-study/how-cents-transforms-laundry-operations-with-24-7-voice-automation).
- **“Edge cases”** — a public [Retell community buyer](https://community.retellai.com/t/we-re-currently-looking-for-an-experienced-retell-ai-expert-to-review-our-existing-voice-agent-workflow-and-provide-feedback/2426), 2026-04-22, asked for help with edge cases, failed transfers, IVR navigation, naturalness, reliability, and scale. This is anecdotal, self-reported evidence.

Natural Workflow Owner language to mirror without presenting it as quotation:

- “Which calls are we actually resolving?”
- “What reaches the person when we transfer?”
- “Who owns the calls the agent cannot finish?”
- “How do we know a booked appointment or meeting happened?”
- “What did the automation move into the human queue?”
- “Which failure should stop the rollout?”

## Retell-specific proof and operating requirements

- [Testing guidance](https://docs.retellai.com/test/test-overview) distinguishes text/simulation testing, real audio/phone validation, and production QA. A Workflow Owner supplies scenarios and ground truth even when another role operates the tooling.
- [Access control](https://docs.retellai.com/accounts/access-control) permits Developers to build/test and Admins to control broader settings, billing, members, data, and telephony. Product permissions do not prove organizational title or authority.
- [Concurrency guidance](https://docs.retellai.com/deploy/concurrency) matters for incident spikes, campaigns, and peak queues; normal average volume is not sufficient capacity evidence.
- [Custom-LLM guidance](https://docs.retellai.com/integrate-llm/overview) says most users should prefer Retell's native prompt/flow patterns; custom orchestration shifts latency, uptime, and reconnection responsibility and can remove some testing capabilities.
- Current [Terms of Service](https://www.retellai.com/legal/terms-of-service), effective 2026-06-01, assign key calling, consent, disclosure, recording, content, and legal-compliance duties to the customer and warn that AI output may be inaccurate. They prohibit autodial, AI voice, or prerecorded-message calls to 911 and emergency telephone lines, hospital or healthcare-facility emergency lines, patient rooms in hospitals, healthcare facilities, or elderly homes, and paging services. Separately, §8 says the service is not designed for medical, emergency, aviation, nuclear, or other inherently dangerous or safety-critical environments and disclaims liability for those uses.
- The same Terms permit Retell, when recording is not opted out, to use de-identified and aggregated Communications and User Content for analytics and for developing, training, and improving AI/ML models included in the service. The Workflow Owner must expose the actual call content and data sensitivity so Governance can confirm any narrower written restriction.
- [Data retention](https://docs.retellai.com/accounts/data-retention), [privacy modes](https://docs.retellai.com/accounts/privacy-disable), and [compliance documentation](https://docs.retellai.com/general/compliance) affect what the workflow may capture and how governance can approve it.
- The [partner program](https://www.retellai.com/blog/how-retell-ais-certified-partners-work) supports a multiplier motion, but a workflow owner should not infer white-label, resale, OEM, or multi-client rights from a customer case; the applicable written agreement controls.

## Confidence and gaps

### High confidence

- Workflow scope, policy, outcome, handoff, and frontline change form a role distinct from executive sponsorship and technical implementation.
- Service/operations and revenue/admissions share core ownership but require different KPI definitions.
- A human fallback and an owner for testing/improvement recur across the strongest deployment evidence.
- Narrow rollout, heavy review, and gradual expansion are more defensible than a universal rapid-launch claim.

### Medium confidence

- Product and growth-product leaders recur in the reviewed named product-led deployments; the sample does not establish prevalence.
- Service/contact-center ownership is present even when public cases name only an executive or CIO.
- Workflow Owners influence vendor choice and pilot acceptance in reviewed examples. Researcher inference: they may influence renewal, but public renewal ownership and outcomes are unavailable.

### Low or unavailable

- Distribution of titles, reporting lines, team size, budget, and workspace access
- Representative frontline attitudes, caller acceptance, complaint rates, or change burden
- Typical baseline, time to live, production containment, conversion, cost, or QA staffing
- Failed pilots, rejected workflows, win/loss, renewal ownership, GRR/NRR, churn, and expansion cohorts
- Private scripts, operating dashboards, test suites, incident reviews, and implementation retrospectives

## Sources & coverage

### Named workflow evidence used

- [Pine Park Health independent interview](https://www.healthcareitnews.com/news/pine-park-health-sees-roi-ai-scheduling-tool), 2026-02-06
- [Pine Park Health Retell case](https://www.retellai.com/case-study/how-pine-park-health-elevates-senior-care-with-intelligent-voice-automation), accessed 2026-09-06
- [Matic Insurance](https://www.retellai.com/case-study/matic-insurance-ai-call-automation-case-study), accessed 2026-09-06
- [TripleTen](https://www.retellai.com/case-study/tripleten-ai-call-automation-admissions-case-study), accessed 2026-09-06
- [BrightChamps](https://www.retellai.com/case-study/how-brightchamps-unlocking-scale-in-global-edtech-with-ai-powered-sales-calls), accessed 2026-09-06
- [Cents](https://www.retellai.com/case-study/how-cents-transforms-laundry-operations-with-24-7-voice-automation), accessed 2026-09-06
- [Everise](https://www.retellai.com/case-study/how-everise-contained-65-of-internal-service-desk-tickets-with-retell-ai), accessed 2026-09-06
- [ISpeedToLead](https://www.retellai.com/case-study/ispeedtolead-retell-ai-lead-response-case-study), accessed 2026-09-06
- [Medical Data Systems](https://www.retellai.com/case-study/how-medical-data-systems-scales-280-000-in-monthly-collections-with-ai-voice-agents-on-retell), accessed 2026-09-06
- [SWTCH](https://www.retellai.com/case-study/how-swtch-keeps-ev-drivers-moving-with-always-on-voice-support-powered-by-retell), [Spare](https://www.retellai.com/case-study/how-sparelabs-put-ai-voice-on-the-front-line-of-public-transit-and-watched-it-take-off), [Sunshine Loans](https://www.retellai.com/case-study/sunshine-loans-retell-ai-customer-support-automation), [Anker](https://www.retellai.com/case-study/how-anker-transformed-global-customer-support-with-human-quality-al-voice), [Inbounds](https://www.retellai.com/case-study/how-inbounds-com-optimize-and-scale-high-ticket-call-campaigns-with-retell-ai), and [Boatzon](https://www.retellai.com/case-study/how-retell-ai-became-boatzons-top-performing-employee), accessed 2026-09-06

### Product, process, and role evidence used

- [Retell customer index](https://www.retellai.com/customers), accessed 2026-09-06
- [Retell Senior Strategic Deployment Manager role](https://jobs.ashbyhq.com/retell-ai/72575c9a-5e37-44bf-b9ed-aeca3d6589e3), accessed 2026-09-06 — Retell's intended discovery, business-process, ROI, prototype, launch, and adoption work; not customer-frequency evidence
- [Retell Enterprise Account Executive role](https://jobs.ashbyhq.com/retell-ai/26bbe240-4f9f-4414-8807-ee58270726d8/), accessed 2026-09-06 — intended committee and enterprise sales stages; not proof that every account follows them
- [Testing](https://docs.retellai.com/test/test-overview), [access control](https://docs.retellai.com/accounts/access-control), [concurrency](https://docs.retellai.com/deploy/concurrency), [custom LLM](https://docs.retellai.com/integrate-llm/overview), [data retention](https://docs.retellai.com/accounts/data-retention), [privacy modes](https://docs.retellai.com/accounts/privacy-disable), [compliance](https://docs.retellai.com/general/compliance), and [Terms](https://www.retellai.com/legal/terms-of-service)

## Research-use rules

1. Treat this as a **job-and-authority dossier**, not a demographic stereotype or a promise that every account has a separate Workflow Owner title.
2. Keep service/operations and revenue/admissions variants distinct when choosing metrics and proof.
3. Do not infer purchase, legal, architecture, or budget authority from workflow ownership.
4. Label independent evidence, customer statements in Retell cases, vendor claims, product evidence, anecdotes, and researcher inference accurately.
5. Preserve metric definitions and denominators. Containment, resolution, booking, transfer, conversion, and human capacity are not interchangeable.
6. Keep end callers and frontline recipients visible as affected audiences and operating constraints, not invented Retell buyers.
7. Update time-sensitive product, legal, compliance, geography, price, and customer claims after the 2026-09-06 cutoff.
