# Retell AI Persona 06 — Governance Approver

## Context metadata

- **Buying role:** Sets the security, privacy, legal, compliance, procurement, and commercial conditions for production use
- **Representative functions:** Information Security, Privacy, Legal, Compliance, AI or Model Risk, Third-Party Risk, Procurement, and Vendor Management
- **Research cutoff:** 2026-09-06
- **Geography:** Global, with US calling rules and EU/UK/Canada requirements called out where material
- **Evidence confidence:** High for the questions and public Retell terms/control surface; medium-high that this is a distinct enterprise gate; low for typical customer title, sequence, cycle time, and final signatory
- **Parent context:** [Retell ICP & Buying Context](icp-context.md)
- **Library index:** [Retell Persona Library](persona-index.md)

## Evidence convention

- **Public contract or regulatory evidence:** Linked and dated where available. It supports the public baseline, not legal advice or a conclusion about a specific deployment.
- **Retell product/compliance evidence:** Establishes Retell's stated controls or posture. Certifications, badges, documentation, and trust materials remain vendor claims until the relevant report, scope, exception, and contract are inspected.
- **Named customer evidence:** Retell-hosted cases are vendor-selected. They establish that a workflow was publicly described, not that the full approval process or compliance outcome was independently verified.
- **Community evidence:** Used only to expose a diligence question or one reported block; never treated as a general rejection rate.
- **Researcher inference:** Titles, operating cadence, KPIs, emotional jobs, approval sequence, and internal ownership not directly documented are working hypotheses.

## Role card

| Dimension | Working profile |
| --- | --- |
| Core question | Can this configured use case reach production with explicit data, calling, access, accountability, and commercial controls? |
| Primary responsibility | Convert an attractive AI workflow into an approved, enforceable, monitorable, and revisitable risk decision |
| Decision authority | Can condition, narrow, defer, or block production; may accept residual risk only within delegated authority |
| Evidence required | Use-case map, data flow, provider chain, access model, retention, security reports, DPA/BAA, consent/disclosure design, incident terms, testing, RACI, and exit plan |
| Does not inherently own | Business value, product configuration, architecture implementation, or day-to-day conversation quality |
| Primary measures | Material findings, control coverage, approval cycle, residual risk, incidents, evidence freshness, contract deviation, and change review |
| Natural collaborators | Technical Owner, Workflow Owner, Conversation Quality Owner, Executive Sponsor, Agent Builder, Procurement, and solution partner |
| Common failure mode | Treating a platform certification or generic “compliant” claim as approval of the customer's specific caller, data, action, geography, and contract |

## Persona in one sentence

The Governance Approver enables a legitimate voice-agent use case only when the data path, caller rights, system authority, human accountability, vendor obligations, and change process are explicit enough to defend.

## Evidence-backed reality

The role is strongly supported as a **decision function**, but public Retell cases do not name a customer security, privacy, legal, compliance, or procurement approver. Do not turn this dossier into a claim that every account has one person with this title.

### Public Retell baseline

- Retell's [access-control documentation](https://docs.retellai.com/accounts/access-control) describes role-based workspace permissions. Full administrative control includes billing, users, settings, and raw call data; functional builder access can include agents, tests, developer settings, raw logs, transcripts, recordings, and analytics while excluding billing and user administration. This is product documentation, not evidence that a customer's least-privilege design is appropriate.
- Retell's [data-retention documentation](https://docs.retellai.com/accounts/data-retention) says retention can be configured from 1 to 730 days or left indefinite, with indefinite as the public default; recordings, transcripts, logs, and variables follow the configured window while some basic metadata may remain. This is a mutable product setting and must be checked against the contract and actual agent configuration.
- Retell's [compliance page](https://docs.retellai.com/general/compliance) claims SOC 2 Type I and II, GDPR support through a DPA/SCC posture, and HIPAA support when a BAA is signed. The underlying audit reports and customer contract were not reviewed. The same documentation says Retell does not currently operate services in the EU.
- Retell's [privacy policy](https://www.retellai.com/legal/privacy-policy), updated 2026-07-20, says personal information is primarily stored and processed in the United States. A DPA or SCC transfer mechanism is not physical EU residency.
- Retell's public [Terms of Service](https://www.retellai.com/legal/terms-of-service), effective 2026-06-01, place material calling, consent, disclosure, recording, content, and legal-compliance duties on the customer. PHI requires an executed BAA; payment-card and biometric data are restricted absent applicable authorization; emergency lines and patient rooms are prohibited destinations; and the service may produce unintended or erroneous output.
- Under those public Terms, if the customer does not opt out of recording, Retell receives permission to process Communications and User Content for AI-powered analytics and for development, training, and improvement of service models after de-identification and aggregation. A buyer requiring narrower use should obtain it in writing rather than rely on an older support answer or an assumed “no training” posture.
- Retell's current [agent handbook](https://docs.retellai.com/build/agent-handbook) describes configurable disclosure and scope-boundary behavior. Public defaults and customer configuration may not satisfy every law or policy; the customer remains responsible for the final agent.

### External legal context

This section is market context, not legal advice.

- The [FCC Declaratory Ruling 24-17](https://docs.fcc.gov/public/attachments/FCC-24-17A1.pdf), released 2024-02-08, confirms that AI-generated human voices fall within TCPA restrictions on artificial or prerecorded voice. Consent, identification, opt-out, exemption, and written-consent requirements depend on call purpose and facts.
- [California AB 3030](https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202320240AB3030) creates scoped disclosure and human-contact duties for certain AI-generated clinical-information communications, while administrative scheduling/billing and human-reviewed messages are treated differently.
- [Utah SB 226](https://le.utah.gov/~2025/bills/sbillenr/SB0226.pdf), effective 2025-05-07, creates request-based disclosure for covered consumer interactions and stronger treatment for regulated high-risk services.
- Colorado's amended ADMT and Chatbot Safety Acts take effect 2027-01-01; rulemaking was still underway at the cutoff. See the [Colorado Attorney General's AI page](https://coag.gov/ai/).
- EU AI Act Article 50 transparency obligations applied from 2026-08-02. See the [European Commission guidelines](https://digital-strategy.ec.europa.eu/en/library/guidelines-transparency-obligations-providers-and-deployers-ai-systems). Provider/deployer roles and exceptions remain fact-specific.
- UK ICO guidance says automated marketing calls require consent specifically covering automated calls and imposes identity/contact and UK GDPR/PECR duties. Canadian CRTC rules similarly impose registration, do-not-call, identity, and generally prior express consent requirements for synthesized or prerecorded solicitation. Applicability to a configured generative agent requires counsel.

The key distinction is **platform posture versus deployment approval**. A healthcare scheduling workflow, insurance intake flow, debt-collection call, sales campaign, and internal help desk present different affected people, data, consequences, and legal duties even if they use the same Retell workspace.

## Role boundary

### Shared governance responsibilities

- Define intended use, prohibited use, callers, data, actions, consequences, and geography
- Classify security, privacy, legal, regulatory, operational, model, reputational, and vendor risk
- Map Retell, carrier, model, voice, cloud, integration, partner, and customer-system responsibilities
- Establish required evidence, control owners, approval conditions, residual risk, and exceptions
- Negotiate DPA, BAA, MSA, SLA, subprocessor, security, liability, audit, support, deletion, and exit terms as applicable
- Validate consent, disclosure, recording, suppression, retention, access, incident, human-handoff, and change controls
- Reassess material changes to use case, data, model, voice, carrier, tool, country, autonomy, or supplier chain

### What this role does not own by default

- Whether the workflow has enough business value — Executive Sponsor
- The exact business policy, caller outcome, and human operating model — Workflow Owner
- Architecture implementation and production reliability — Technical Owner
- Prompt, graph, tool, or test configuration — Agent Builder
- Day-to-day quality sampling and regression operations — Conversation Quality Owner
- Retell's underlying platform controls — Retell, subject to contract

### Governance subroles

| Subrole | Primary question | Distinct evidence |
| --- | --- | --- |
| Information Security / Third-Party Risk | Can access, infrastructure, providers, integrations, and incidents be controlled? | Security reports, architecture, data flow, IAM, encryption, logging, vulnerability, BCDR, incident and subprocessor evidence |
| Privacy / Legal | Is processing lawful, minimized, contractually bounded, and exit-ready? | DPA/BAA, purposes, roles, rights, retention, transfers, training/use terms, liability, deletion and return |
| Compliance / AI or Model Risk | Is the use case, authority, validation, oversight, and ongoing behavior acceptable? | Use-case classification, prohibited actions, validation, human control, monitoring, change and decision evidence |
| Telecom / Marketing Compliance | Are calling, consent, disclosure, recording, timing, identity, suppression, and revocation lawful? | Campaign/call-purpose map, jurisdiction, consent proof, scripts, DNC/suppression, recording and opt-out tests |
| Procurement / Vendor Management | Can the organization buy, measure, support, renew, and exit responsibly? | Commercial model, total cost, RACI, SLA, support, acceptance, financial viability, portability and exit plan |

Do not collapse these into one “security review.” A SOC report does not answer consent, data use, medical scope, contract liability, unit economics, or caller disclosure.

## Authority matrix

| Decision | Governance Approver | Main counterpart |
| --- | --- | --- |
| Whether a use case is in policy and legally supportable | Approves or blocks within authority | Workflow Owner defines actual use and action |
| Whether architecture meets security/privacy requirements | Sets conditions and reviews evidence | Technical Owner implements and demonstrates |
| Whether calls meet quality and policy thresholds | Sets high-risk/control requirements | Quality Owner operates measurement |
| Whether consent/disclosure/recording logic is correctly configured | Approves requirement and evidence | Builder implements; Workflow Owner owns process |
| Whether contract risk is acceptable | Negotiates/recommends/approves per delegation | Sponsor owns business trade-off; Procurement coordinates |
| Whether a material change requires reassessment | Defines trigger and gate | Technical/Builder/Quality teams report changes |
| Whether expansion economics justify the risk | Supplies residual-risk decision | Sponsor makes investment decision |

## Typical titles and reporting context

- Chief Information Security Officer or Security Assurance Lead
- Privacy Counsel, Data Protection Officer, or Privacy Operations Lead
- Product, Technology, Commercial, or Regulatory Counsel
- Chief Compliance Officer, Telecom Compliance Lead, or Industry Compliance Lead
- AI Governance, Model Risk, Operational Risk, or Technology Risk Lead
- Third-Party Risk, Strategic Sourcing, IT Procurement, or Vendor Manager
- Enterprise Architect or Security Architect representing a control function

**Researcher inference:** responsibility is more likely distributed across several functions in a regulated or large enterprise and compressed into one executive, counsel, or outside adviser in an SMB. The persona is united by gate authority and proof needs, not a fixed title or reporting line.

## Variants

### Variant A — Enterprise security and privacy gate

- Focuses on data inventory, provider routing, tenancy, access, encryption, logs, retention, deletion, incidents, and evidence scope
- May require SSO/RBAC, raw-data restrictions, customer-managed architecture, or negotiated terms
- Main blocker: an incomplete provider/data map or control claim that cannot be inspected

### Variant B — US outbound and marketing compliance gate

- Focuses on call purpose, number type, consent level, seller identity, disclosure, time windows, DNC/suppression, revocation, recording, and evidence retention
- Requires campaign logic and agent behavior to match jurisdiction and purpose
- Main blocker: treating a purchased lead, phone number, or generic opt-in as sufficient consent

### Variant C — Regulated-data or high-consequence gate

- Covers healthcare, collections, financial, insurance, public-sector, or other sensitive workflows
- Narrows agent authority and preserves licensed, clinical, underwriting, hardship, complaint, or consequential decisions for humans
- Main blocker: scope creep from administrative intake into advice or decision-making

### Variant D — International and residency gate

- Tests service location, subprocessor/model route, transfer mechanism, caller law, number/carrier constraints, language quality, and local contracting
- Distinguishes GDPR paperwork from physical data residency
- Main blocker: an in-region requirement the current architecture cannot meet

### Variant E — Commercial and vendor-risk gate

- Tests usage economics, vendor viability, support, SLA, change rights, liability, audit, renewal, portability, and exit
- Main blocker: uncertain all-in cost or responsibility spread across Retell, a partner, providers, and the customer

These are governance lenses, not necessarily five separate people.

## Jobs to be done

### Functional jobs

- Determine whether the exact caller, data, action, geography, and deployment pattern are permitted
- Translate law, policy, risk appetite, and contract into technical and operational controls
- Make customer, Retell, carrier, model, partner, and human responsibility explicit
- Verify that access, retention, consent, disclosure, recording, handoff, monitoring, incident, and change controls work
- Close findings or document a time-bound, accountable residual-risk decision
- Preserve audit, regulator, customer, and incident evidence
- Reassess expansion and material change rather than granting permanent approval to a moving system

### Emotional jobs — researcher inference

- Avoid discovering an unapproved use, data flow, or liability only after harm or enforcement
- Feel able to defend why the deployment was approved and what conditions applied
- Avoid being forced into a false choice between blanket blockage and unbounded experimentation

### Social and organizational jobs — researcher inference

- Enable useful automation while protecting the institution and affected callers
- Be seen as a practical control partner rather than a late-stage checkbox
- Demonstrate that AI governance creates clearer ownership and safer scale

## Trigger events

- Customer or employee data enters a live agent
- Outbound dialing, AI-generated voice, recording, SMS, or batch campaigns enter scope
- PHI, payment, biometric, identity, debt, insurance, or other sensitive data appears
- An agent gains write access, payment/scheduling authority, or a consequential tool
- A pilot crosses into production, new geography, new brand, or larger traffic
- A partner or BPO operates the workflow for the customer
- A new model, voice, carrier, subprocessor, API, integration, or data region is introduced
- A severe quality incident, complaint, consent revocation, data event, or regulator question occurs
- Enterprise contracting requires custom DPA, BAA, MSA, SLA, SSO/RBAC, or support terms

## Current alternatives and their limits

| Current approach | Why teams use it | Limitation |
| --- | --- | --- |
| Block the deployment | Removes immediate exposure | Preserves the original cost/problem and pushes experimentation outside governance |
| Keep every call or action human | Familiar accountability | May eliminate the value case and still leaves privacy/telecom risk |
| Restrict the agent to FAQ or routing | Bounds authority | Can create a talking layer that does not complete the workflow |
| Use an incumbent CCaaS/cloud vendor | Existing procurement and controls | Bundling does not automatically approve the configured AI behavior |
| Use a private/custom LLM or telephony stack | More architectural control | Shifts uptime, testing, integration, and evidence burden to the customer |
| Rely on certifications and vendor questionnaires | Efficient initial diligence | Point-in-time scope may miss caller law, data route, configuration, and material change |
| Use spreadsheets/email for review | Flexible and familiar | Weak lineage between finding, control, owner, evidence, version, and reassessment |
| Retain no recordings | Reduces some data exposure | Can weaken quality, investigation, and dispute evidence; basic metadata may still remain |

## Core pains

### 1. The vendor and customer control the risk together

Retell controls its service; the customer chooses the use, data, prompts, tools, campaign, consent, and human fallback. Partners and upstream providers add more boundaries. Generic responsibility language is not enough.

### 2. Public posture and contract posture differ

Marketing, documentation, Terms, negotiated agreements, enterprise SLA, and actual configuration can produce different answers. The signed contract and deployed system must be checked.

### 3. “GDPR ready” can hide a residency mismatch

The public DPA/SCC posture does not change Retell's stated lack of an EU service region. Buyers with physical in-region requirements need architecture and contract evidence.

### 4. Data-use assumptions can be wrong

The current public Terms describe conditional recording and de-identified and aggregated model-development use. A stricter no-use requirement must be explicit.

### 5. Calling compliance is configuration-dependent

Purpose, consent, seller, disclosure, recording, time, number, suppression, and jurisdiction can change the requirement. Retell does not obtain customer consent on the customer's behalf under its public Terms.

### 6. Natural voice increases trust and deception risk

A convincing agent can produce an erroneous statement or obscure that it is automated. Disclosure and scope-boundary behavior must be deliberately configured and tested.

### 7. Retention defaults may exceed policy

Indefinite retention is useful for operations but inappropriate for many policies. Deletion scope, legal hold, metadata, backups, and downstream systems must be reconciled.

### 8. High-impact scope creep is easy

Administrative scheduling or intake can drift into clinical advice, underwriting, debt hardship, or another consequential decision unless authority is explicit.

### 9. Fast product and provider change ages evidence

Model, voice, carrier, feature, subprocessor, and contract changes can invalidate a prior assessment. Governance needs change triggers, not a one-time approval.

### 10. Public customer evidence omits rejection

No public Retell corpus shows security losses, legal redlines, procurement duration, failed approval, or accepted residual-risk records.

## Desired outcomes and KPI scorecard

These are **researcher-inferred governance measures**, not a published Retell standard.

| KPI | What it tests | Important caveat |
| --- | --- | --- |
| Material findings by severity | Whether risk is understood and closed | Low finding count can mean weak testing |
| Time to evidence-complete decision | Governance efficiency | Do not reward rushed approval |
| Control-owner and evidence coverage | Whether each duty has an accountable owner and proof | Paper ownership must match operation |
| Residual-risk exceptions | Accepted deviations, expiry, compensating control, and owner | Count without severity/context misleads |
| Consent/disclosure/recording test pass | Configured calling behavior by purpose/jurisdiction | Legal interpretation still requires counsel |
| Privileged/raw-data access exceptions | Least privilege and sensitive-call exposure | Product role names do not equal customer job titles |
| Retention/deletion compliance | Configured window, downstream deletion, and verification | Basic metadata and backups need separate treatment |
| Incident notification and closure | Detection, containment, notice, remediation, and evidence | Contract definitions and severity matter |
| Material changes reviewed before traffic | Change-governance effectiveness | Define model/provider/configuration triggers |
| Contract deviations and open obligations | Commercial/legal exposure | Signed enterprise terms may differ from public Terms |
| Vendor concentration and exit readiness | Continuity and portability | Custom integrations and phone-number ownership matter |

## Governance workflow

1. **Intake the actual use case.** Identify callers, purpose, direction, channel, data, action, failure consequence, countries, and human fallback.
2. **Classify.** Determine prohibited, sensitive, regulated, high-consequence, marketing, recording, employment, or vendor-risk dimensions.
3. **Map the system.** Trace audio, transcript, variables, metadata, knowledge, model, voice, carrier, tools, integrations, storage, logs, and people.
4. **Allocate responsibility.** Build a RACI across customer, Retell, partner, carrier, model provider, system owner, and human team.
5. **Set evidence requirements.** Security reports, privacy terms, BAA/DPA, consent proof, scripts, access, retention, tests, incident, support, SLA, and exit.
6. **Validate controls.** Test actual roles, deletion, disclosure, revocation, suppression, tool limits, handoff, outage, monitoring, and high-risk cases.
7. **Negotiate and decide.** Close findings, narrow scope, record residual risk, set conditions, and obtain delegated approval.
8. **Gate production.** Confirm configuration and contract match the approved design before traffic.
9. **Monitor obligations.** Review incidents, complaints, policy misses, access, retention, evidence expiry, and vendor changes.
10. **Reassess change.** Reopen review for new use, data, model, provider, geography, authority, partner, or material volume.
11. **Exit cleanly.** Revoke access, transfer numbers/configuration where possible, return/delete data, and verify ongoing obligations.

## Working tools and artifacts

### Retell evidence surface

- [Access control](https://docs.retellai.com/accounts/access-control): role-based permissions and raw-data access
- [Data retention](https://docs.retellai.com/accounts/data-retention): configurable window and public default
- [Compliance documentation](https://docs.retellai.com/general/compliance): SOC, HIPAA/BAA, GDPR/DPA/SCC, and service-region claims
- [Privacy policy](https://www.retellai.com/legal/privacy-policy): processing and privacy posture
- [Terms of Service](https://www.retellai.com/legal/terms-of-service): customer duties, data-use baseline, prohibited use, service commitments, liability, and telecom addendum
- [Agent handbook](https://docs.retellai.com/build/agent-handbook): disclosure and scope-boundary configuration
- [Custom telephony](https://docs.retellai.com/deploy/custom-telephony) and [custom LLM](https://docs.retellai.com/integrate-llm/overview): responsibility shifts at architecture boundaries
- Trust Center, DPA, BAA, MSA, SLA, subprocessor and audit material where contractually available; availability is not proof of sufficiency

### Minimum customer-side artifacts

- Use-case and prohibited-use statement
- Caller/purpose/jurisdiction matrix
- Data, provider, and subprocessor flow
- System-authority and least-privilege matrix
- Consent, disclosure, recording, suppression, and revocation design
- Retention, deletion, legal-hold, and exit schedule
- Human-oversight, quality, incident, and outage runbook
- Customer–Retell–partner–provider RACI
- Contract deviations and residual-risk register
- Material-change and reapproval standard

## Objections and proof required

| Objection | Proof required |
| --- | --- |
| “Show exactly where every call artifact goes.” | Data-flow diagram covering audio, transcript, variables, logs, models, voices, carriers, tools, storage, region, retention, and deletion |
| “SOC 2 does not approve our use case.” | Current report scope/exceptions plus configuration-specific control mapping |
| “We require no training or secondary use.” | Signed language, recording choice, data-use description, and technical verification consistent with the requirement |
| “Indefinite retention is not acceptable.” | Per-agent settings, policy-matched window, downstream deletion, metadata treatment, and verification |
| “We cannot prove valid consent.” | Purpose-specific consent record, seller identity, number/source, timestamp, disclosure, revocation, and suppression process |
| “The agent may cross into advice or a licensed decision.” | Explicit allowed/prohibited actions, tests, human escalation, monitoring, and domain-owner acceptance |
| “The AI could claim an action succeeded when it failed.” | Tool-result validation, truthful response logic, source-system evidence, QA, incident, and rollback |
| “Our policy requires EU processing.” | Current service-region and provider evidence; negotiated architecture; otherwise a documented no-go |
| “A partner makes accountability unclear.” | Contract and RACI across client, partner, Retell, carrier, model, and system owner |
| “Public uptime claims and contract terms differ.” | Signed SLA, scope, exclusions, remedies, status history, BCDR, and customer-side fallback |
| “We cannot exit.” | Number/data/configuration portability, deletion, revocation, transition support, and termination obligations |

## Proof hierarchy

1. Signed agreement and configuration-specific control evidence for the exact use case
2. Tested consent, disclosure, access, retention, human-control, incident, and deletion behavior
3. Current audit reports, architecture, provider/data map, and evidence of finding closure
4. Representative quality and failure evidence with accountable owners
5. Comparable named reference with matching workflow, data, geography, and architecture
6. Public documentation, trust badges, and vendor assurances
7. Generic claims that a product or deployment is “secure,” “compliant,” or “enterprise-ready”

## Buyer-journey role

| Stage | Governance contribution | Required output | Common stall |
| --- | --- | --- | --- |
| Problem recognition | Flags prohibited or high-risk scope before solution momentum hardens | Early risk screen | Governance invited after design is fixed |
| Discovery | Defines evidence and contract requirements | Diligence plan | Buyer cannot describe actual use/data |
| Evaluation | Reviews architecture, controls, calling design, and representative failures | Findings register | Demo avoids production providers or sensitive paths |
| Approval | Negotiates terms and records conditions/residual risk | Approval memo, contract, RACI | Residency, data use, consent, or liability unresolved |
| Pilot | Validates controls on limited traffic | Control-test evidence | Pilot bypasses production policies |
| Implementation | Confirms configuration, access, retention, and operations match approval | Production checklist | Drift between approved and deployed design |
| Production | Monitors obligations, incidents, complaints, evidence expiry, and change | Governance dashboard/review | No material-change notification |
| Renewal | Reassesses controls, price, support, incidents, providers, and exit | Renewal risk record | No comparable outcome or current evidence |
| Expansion | Reclassifies new data, actions, countries, brands, and workflows | Expansion approval | Old approval reused outside scope |

## Stakeholder dynamics

### Natural allies

- Technical Owner who can make data and failure boundaries inspectable
- Quality Owner who can demonstrate policy, disclosure, handoff, and severe-failure behavior
- Workflow Owner willing to bound agent authority and preserve human escalation
- Executive Sponsor who values a defensible production win over an indefinite demo
- Procurement and counsel when requirements are surfaced before negotiation
- Partner with a clear RACI and evidence pack

### Likely tension

- Business urgency versus complete data, consent, and responsibility mapping
- Builder preference for flexible defaults versus least privilege and change control
- Sponsor focus on containment or conversion versus caller rights and severe-tail risk
- Retell/partner/customer ambiguity over who operates consent, support, incident, and deletion
- Global marketing language versus local carrier, law, and residency constraints
- Procurement desire for standard terms versus a novel, metered, multi-provider service

## Short attributable language

Use these as evidence-backed phrases, not invented persona quotations:

- **“artificial or prerecorded voice”** — the statutory category applied to AI-generated voices in [FCC 24-17](https://docs.fcc.gov/public/attachments/FCC-24-17A1.pdf), released 2024-02-08
- **“prior express written consent”** — language used in Retell's public [telecom Terms/addendum](https://www.retellai.com/legal/terms-of-service) for covered telemarketing/advertising calls; effective 2026-06-01
- **“as is” and “as available”** — the public [Terms](https://www.retellai.com/legal/terms-of-service) warranty posture; enterprise agreements may differ
- **“does not currently operate services within the EU”** — Retell's public [compliance documentation](https://docs.retellai.com/general/compliance), accessed 2026-09-06
- **“Not connected”** — one operator's reported simulation error in a [Retell community thread](https://community.retellai.com/t/simulation-environment-mcp-errors-for-single-prompt-agents-tool-response-not-connected/253/2), dated 2026-02-10; one incident, relevant because approval tests must match production architecture

Do not invent a governance approver saying “I will never approve AI” or “SOC 2 is enough.” The public corpus contains no named customer approver interview.

## Content and messaging guidance

### Lead with

- The exact use case, affected caller, data, action, geography, and human boundary
- Clear responsibility across customer, Retell, partner, carrier, model, and system owner
- Configurable controls plus evidence of how the customer will configure and operate them
- Current contract and architecture facts, including unresolved constraints
- Tested change, incident, deletion, and exit processes

### Avoid

- “Compliant by default,” “fully compliant,” or “certified for every regulated use”
- Treating SOC 2, HIPAA support, GDPR language, or a signed DPA as the full decision
- Equating SCC/DPA transfer safeguards with physical EU residency
- Claiming customer data is never used for model improvement without contract-specific proof
- Implying Retell obtains consent or legal approval for the customer
- Describing a healthcare, insurance, collections, or outbound-sales workflow without its authority boundary
- Hiding public-Term limitations behind broad enterprise language
- Inventing procurement cycles, contract values, approval rates, or blocker prevalence

### Useful message frames

- **Scope:** “Approve the configured workflow, not the category label.”
- **Responsibility:** “Make every caller, data, action, provider, and human owner explicit.”
- **Evidence:** “Pair each control claim with its current artifact and tested configuration.”
- **Change:** “Reopen approval when the model, provider, data, geography, or authority changes.”
- **Honesty:** “State what the public contract permits and what must be negotiated.”

### High-value content formats

- Voice-agent governance intake template
- Customer–Retell–partner responsibility matrix
- Data/provider/subprocessor map
- US outbound consent, disclosure, suppression, and revocation checklist
- Healthcare administrative-versus-clinical scope guide
- Retention, recording, and model-data-use decision guide
- EU residency versus GDPR-transfer explainer
- Configuration-to-control test plan
- Material-change and reapproval standard
- Vendor-risk, incident, SLA, and exit checklist

## Sources & coverage

### Primary sources used

- [Retell access control](https://docs.retellai.com/accounts/access-control) — role permissions; accessed 2026-09-06
- [Retell data retention](https://docs.retellai.com/accounts/data-retention) — retention configuration/default/deletion scope; accessed 2026-09-06
- [Retell compliance](https://docs.retellai.com/general/compliance) — vendor security, HIPAA, GDPR, and EU-region posture; accessed 2026-09-06
- [Retell privacy policy](https://www.retellai.com/legal/privacy-policy) — updated 2026-07-20
- [Retell Terms of Service](https://www.retellai.com/legal/terms-of-service) — effective 2026-06-01
- [Retell agent handbook](https://docs.retellai.com/build/agent-handbook) — disclosure/scope configuration; accessed 2026-09-06
- [FCC 24-17](https://docs.fcc.gov/public/attachments/FCC-24-17A1.pdf) — released 2024-02-08
- [California AB 3030](https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202320240AB3030), [Utah SB 226](https://le.utah.gov/~2025/bills/sbillenr/SB0226.pdf), [Colorado AG AI rulemaking](https://coag.gov/ai/), and [EU Article 50 guidelines](https://digital-strategy.ec.europa.eu/en/library/guidelines-transparency-obligations-providers-and-deployers-ai-systems)
- [UK ICO telephone-marketing guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/electronic-and-telephone-marketing/telephone-marketing/) — automated-call consent, identification, and PECR/UK GDPR duties; accessed 2026-09-06
- [Canadian CRTC telemarketing rules](https://crtc.gc.ca/eng/phone/telemarketing/tobligations/rules-regles.htm) — registration, do-not-call, identification, and synthesized/prerecorded solicitation requirements; accessed 2026-09-06

### Supporting evidence

- [Retell Enterprise Account Executive role](https://jobs.ashbyhq.com/retell-ai/26bbe240-4f9f-4414-8807-ee58270726d8/) — intended enterprise committee includes IT, security, procurement, legal, and executives; seller-process evidence, accessed 2026-09-06
- [Retell Founding Sales Engineer role](https://jobs.ashbyhq.com/retell-ai/f42bd206-6764-4eca-ae9d-127829238a8b) — intended architecture, technical-validation, and security-discussion work; accessed 2026-09-06
- Named regulated-use cases including [Pine Park Health](https://www.healthcareitnews.com/news/pine-park-health-sees-roi-ai-scheduling-tool), [Medical Data Systems](https://www.retellai.com/case-study/how-medical-data-systems-scales-280-000-in-monthly-collections-with-ai-voice-agents-on-retell), and [Matic](https://www.retellai.com/case-study/matic-insurance-ai-call-automation-case-study); only Pine Park has independent named reporting in the reviewed set
- [EU residency thread](https://community.retellai.com/t/eu-client-gdpr-compliance-data-residency-subprocessors-dpa-full-breakdown-questions-for-the-team/2332), dated 2026-04-14–30, and [NIS2 follow-up](https://community.retellai.com/t/retell-nis2-is-full-eu-data-residency-actually-possible/2541/3), dated 2026-05-01; community evidence, not a prevalence measure

### Material gaps

- No named customer security, privacy, legal, compliance, telecom, or procurement approver interview
- No public security questionnaire, audit report, DPA/BAA/enterprise MSA, negotiated SLA, DPIA, residual-risk memo, or customer control test
- No representative security/procurement cycle, rejection reason, contract deviation, or approval rate
- No complete public feature-level provider/subprocessor/data-routing map
- No authoritative date for an EU service-region roadmap
- No public Retell-specific enforcement case was identified; absence is not proof of compliance
- Public Terms may be superseded by signed customer agreements that were unavailable

## Research-use rules

1. Start with the exact use case, call purpose, data, action, geography, and human boundary.
2. Distinguish law, public contract, product configuration, vendor claim, customer evidence, and researcher inference.
3. Never say a certification approves the customer's configured deployment.
4. Date fast-changing terms, product controls, service regions, and laws.
5. State contradictory or incomplete evidence, especially data use, residency, and service commitment.
6. Do not infer a named approver, budget, reporting line, private fear, or approval outcome.
7. Treat this dossier as structured diligence context, not legal advice.
