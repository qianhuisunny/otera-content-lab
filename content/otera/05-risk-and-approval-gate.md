# Otera Persona 05 — Risk and Approval Gate

## Context metadata

- **Buying role:** Sets the security, compliance, privacy, legal, vendor-risk, and commercial conditions for production approval
- **Subroles:** Information Security; Compliance and Model or AI Risk; Legal and Privacy; Procurement and Vendor Management
- **Research cutoff:** 2026-08-23
- **Evidence confidence:** High for control questions and public Otera claims; medium for actual customer approval sequence and organizational ownership
- **Library index:** [Otera Persona Library](README.md)

## Evidence convention

- **Otera or customer evidence:** Linked or explicitly attributed. Metrics hosted by Otera are treated as vendor-published customer evidence unless an independent source is named.
- **External evidence:** Linked to the named analyst, industry body, regulator, or other authoritative source; it supports broader role context, not Otera performance.
- **Researcher inference:** Unless a statement is linked or explicitly attributed, titles and reporting patterns, operating cadence, pains and workarounds, triggers, JTBD, objections, and stakeholder dynamics are working hypotheses inferred from the documented workflow.

## Persona in one sentence

The risk and approval gate is not one generic blocker: it is a group of specialists determining whether autonomous actions can be operated, defended, contracted, monitored, changed, and exited within the enterprise's control framework.

## Role boundary

These subroles overlap, but they do not ask the same question:

| Subrole | Primary question |
| --- | --- |
| Information Security | Can access, data, infrastructure, integrations, and incidents be controlled? |
| Compliance and Model or AI Risk | Are the use case, decision boundaries, validation, oversight, and ongoing behavior acceptable? |
| Legal and Privacy | Is data processing lawful and contractually bounded, and is liability allocated? |
| Procurement and Vendor Management | Can the organization buy, govern, measure, renew, and exit this supplier arrangement responsibly? |

Do not combine their proof requirements into one “security and compliance” paragraph. A certification may help Information Security but does not by itself answer use-case risk, privacy law, contract liability, pricing assumptions, or exit readiness.

## Shared responsibilities

- Classify the use case, data, decisions, and material consequences
- Define required controls and evidence before production
- Review Otera, cloud, model, connector, subprocessor, and partner dependencies
- Establish human authority, exception, override, monitoring, and escalation requirements
- Close material findings or record accepted residual risk
- Negotiate contractual, privacy, audit, support, and exit conditions
- Reassess when the workflow, model, data, country, autonomy, or supplier chain changes materially

## Current workarounds

The following are **researcher inferences about common enterprise approval practices**, not disclosed Otera customer behavior.

| Subrole | Common status-quo workaround | Limitation |
| --- | --- | --- |
| Information Security | Security questionnaires, evidence portals, architecture reviews, manual IAM approvals, network allowlists, penetration-test exchange, and third-party risk spreadsheets | Point-in-time evidence can miss runtime agent authority, new connectors, model changes, and evolving data paths |
| Compliance and Model or AI Risk | Model inventories, risk-classification spreadsheets, validation documents, committee review, manual sampling, policy checklists, and universal human approval | Static review may not show production drift, exception behavior, decision reconstruction, or whether human oversight is meaningful |
| Legal and Privacy | DPA redlines, DPIA templates, data inventories, transfer assessments, email-based subprocessor tracking, and country-by-country legal review | Responsibilities, model routing, retention, and material changes can remain fragmented across documents and teams |
| Procurement and Vendor Management | RFP scorecards, supplier portals, fixed-price or seat-based comparisons, contract trackers, risk registers, and manual renewal reviews | Bespoke outcome and throughput assumptions are difficult to compare or audit without a shared operational baseline |

Across subroles, the most conservative workaround is to keep a human approval at every consequential step. That can reduce perceived risk but may preserve the original labor model and obscure which cases actually require judgment.

## Subrole A — Information Security

### Typical titles and context

- Chief Information Security Officer or Head of Information Security
- Cloud Security Architect
- Identity and Access Management Lead
- Security Assurance or Security Architecture Lead
- Third-Party Cyber Risk Lead
- Security Operations or Incident Response representative

**Inference:** Security approval is usually centralized, though responsibilities may be divided across architecture, IAM, cloud security, assurance, and third-party risk.

### What this subrole owns

- Data flows, classification, storage, transmission, region, tenancy, and isolation
- Identity, SSO, service accounts, permissions, credentials, and secrets
- Network connectivity, allowlisting, APIs, connectors, and system-of-record access
- Encryption, logging, monitoring, vulnerability management, and penetration evidence
- Incident notification, response, business continuity, disaster recovery, and recovery objectives
- Security posture of cloud, model, subprocessor, partner, and Otera dependencies
- Data deletion, account revocation, and secure exit

### KPI scorecard — inference

- Number and severity of unresolved findings
- Time to close security evidence and approval
- Privileged-access and segregation-of-duties exceptions
- Security incident, control failure, and access-violation rate
- Third-party concentration or dependency exposure
- Recovery-test and evidence freshness
- Material changes reviewed before production

### Pains and triggers

- Agents can read sensitive data and take actions, increasing the consequence of excess permissions
- Data and model routing may be opaque across cloud regions and subprocessors
- Hidden human fulfillment or shared-model training creates an unapproved exposure path
- Generic AI proofs omit identity, secrets, incident, and recovery design
- A new data class, connector, model, region, payment or claims action, or customer-cloud deployment triggers deeper review

### Jobs to be done

- **Functional:** Bound access and data exposure, verify controls, and ensure incidents can be detected and contained
- **Emotional — inference:** Avoid approving the next material breach or uncontrollable supplier dependency
- **Social — inference:** Enable the business without weakening the enterprise security posture

### Objections and proof required

| Concern | Proof required |
| --- | --- |
| Data crosses an unapproved boundary | Complete data-flow, region, tenancy, model, storage, retention, and subprocessor map |
| Agent or service account has excessive authority | Identity, RBAC, least-privilege, credential, rotation, and revocation test |
| Certifications are marketing | Current reports and certificates with entity, service, period, exceptions, and scope |
| Connector or API creates a weak path | Threat model, authentication, permissions, rate and error behavior, and network design |
| Incident or outage cannot be managed | Incident process, notification terms, logging, support, BCDR, and recovery-test evidence |
| Data remains after termination | Contractual and technical deletion, return, verification, and access-revocation process |

### Buyer-journey role

- Joins during use-case and architecture design, before integration decisions are fixed
- Reviews supplier and platform security evidence
- Tests IAM, credentials, logging, data path, and incident controls before production
- Conditions or blocks approval where findings remain material
- Reassesses new regions, models, connectors, data types, or autonomy levels

### Content and messaging

Provide a security pack and a control-to-evidence matrix. Lead with customer-selectable region, identity, traceability, and clear data boundaries only where supported. Do not use certification logos as a substitute for customer risk assessment or claim universal compliance.

## Subrole B — Compliance and Model or AI Risk

### Typical titles and context

- Chief Risk or Chief Compliance organization
- Head of AI Governance
- Model Risk Management lead
- Operational Risk or Technology Risk lead
- Regulatory Compliance lead
- Internal Audit or Controls Assurance representative

**Inference:** Ownership varies by industry and use case. A document-extraction tool, claims decision, trade-finance compliance step, and material-release workflow may receive different classifications and control requirements.

### What this subrole owns

- Intended use and prohibited use
- Use-case, model, and operational-risk classification
- Business-rule and agent-authority boundaries
- Validation methodology and acceptance thresholds
- Human oversight, escalation, override, and accountability
- Accuracy, error, bias, drift, and exception monitoring
- Versioning, material-change review, rollback, and revalidation
- Decision trace, logging, documentation, and regulator or audit evidence
- Cross-country and local-rule variation

### KPI scorecard — inference

- Validation findings and closure time
- Accuracy and error by material case type
- Exception, override, appeal, and escalation rates
- Policy or authority breaches
- Drift and material-change events
- Audit findings and documentation completeness
- Time to investigate and reconstruct a decision
- Straight-through processing within approved boundaries

### Pains and triggers

- Black-box reasoning and incomplete decision history
- Aggregate accuracy hiding harmful error classes
- Inconsistent local rules or country-specific decisions
- Automation expanding beyond the use originally assessed
- Human oversight that exists only on paper or reviews every case without clear purpose
- High-impact decisions, increased STP, multi-country rollout, regulator attention, or material model and rule changes trigger deeper review

### Jobs to be done

- **Functional:** Permit controlled autonomy with testable decision boundaries and continuing evidence
- **Emotional — inference:** Be able to defend how and why a consequential decision occurred
- **Social — inference:** Demonstrate that innovation and disciplined risk management can coexist

### Objections and proof required

| Concern | Proof required |
| --- | --- |
| The use case has not been properly classified | Intended use, affected parties, consequence, authority, data, and jurisdiction assessment |
| Aggregate accuracy hides unacceptable cases | Representative ground truth, error taxonomy, segment results, and business consequence |
| Humans cannot meaningfully intervene | Clear timing, information, authority, workload, override, and escalation design |
| Decision reasoning cannot be reconstructed | Source evidence, rule and version, model output, action history, and named accountable owner |
| The system changes without approval | Versioning, change classification, testing, approval, promotion, monitoring, and rollback |
| Autonomy expands faster than evidence | Stage gates tied to performance, exception, incident, and review data |

Otera states that risk owners can define decision boundaries, every agent action is logged, and human checkpoints can be configured. These are vendor claims to be validated in the customer's specific workflow.

### Regulatory context

[Regulation (EU) 2024/1689 — the EU AI Act](https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX%3A32024R1689) contains logging, transparency, documentation, and human-oversight requirements for covered high-risk systems. Classification depends on the specific system and use—not the vendor category alone.

Do not call Otera “EU AI Act certified.” Compliance claims and marketing badges do not replace a use-case-specific legal and risk assessment.

### Buyer-journey role

- Defines permitted use and risk tier during discovery
- Approves validation plan, acceptance thresholds, and human-control design
- Reviews evidence and residual risk before production
- Monitors outcomes, overrides, incidents, and material changes
- Determines whether wider autonomy, new countries, or adjacent workflows require reassessment

### Content and messaging

Provide a use-case risk assessment, validation report, decision-log sample, authority matrix, threshold and override design, change-control process, and applicable regulatory map. Lead with “risk owners set the boundaries”; avoid saying governance is automatic.

## Subrole C — Legal and Privacy

### Typical titles and context

- Data Protection Officer
- Privacy Counsel
- Technology or Commercial Counsel
- Data Governance or Privacy Operations lead
- Product or Regulatory Counsel for the affected workflow

Otera's public privacy notice identifies Otera as a processor for platform-customer data and the customer as controller. The complete contractual relationship still depends on the actual use case and agreement.

### What this subrole owns

- Controller and processor roles, documented instructions, and data-processing agreement
- Lawful basis, purpose limitation, data minimization, and data-subject rights
- Data inventory, sensitive categories, retention, deletion, and return
- Cross-border transfers, residency, subprocessors, and transfer safeguards
- Confidentiality, intellectual property, model or training use, and generated output rights
- Warranty, liability, indemnity, insurance, suspension, termination, and dispute terms
- DPIA or other privacy and legal assessment support

### KPI scorecard — inference

- DPA and contract deviations
- DPIA and privacy-finding closure time
- Retention and deletion compliance
- Data-subject request support
- Transfer and subprocessor risk
- Contracting cycle and unresolved legal exposure
- Material use, data, region, or model changes reviewed

### Pains and triggers

- Claims, invoices, customer emails, trade documents, and employee or supplier records may contain extensive personal or confidential data
- Shared-model training, hidden humans, subprocessors, and cross-border transfers can be unclear
- Teams ask counsel to approve a platform before the data and intended use are defined
- New data categories, countries, models, agent actions, or downstream uses trigger reassessment

### Jobs to be done

- **Functional:** Establish a lawful, bounded, documented processing and commercial relationship
- **Emotional — inference:** Avoid an unseen downstream use or liability that appears after deployment
- **Social — inference:** Remain an enabling and commercially pragmatic adviser without accepting ambiguous risk

### Objections and proof required

| Concern | Proof required |
| --- | --- |
| Processing roles and instructions are unclear | DPA, use-case data inventory, processing purpose, instructions, and responsibility map |
| Customer data may train shared models | Contractual commitment, technical description, and model or data-flow evidence |
| Cross-border processing is uncontrolled | Region, subprocessor, transfer, SCC, residency, and access information |
| Retention and exit are vague | Retention schedule, deletion or return process, verification, and termination obligations |
| Liability is misaligned with autonomous actions | Authority model, warranties, indemnities, caps, insurance, support, and incident terms |
| Security claims are treated as legal compliance | Separate legal basis, DPA, DPIA, rights, and transfer analysis |

[EDPB Guidelines 07/2020](https://www.edpb.europa.eu/documents/guideline/guidelines-072020-on-the-concepts-of-controller-and-processor-in-the-gdpr_en) reinforce that controller–processor responsibilities and processing instructions must be documented contractually.

### Buyer-journey role

- Reviews data, intended use, and processing roles during solution design
- Negotiates privacy, IP, liability, and commercial protections
- Supports DPIA or other legal assessment before production
- Reassesses expansion into new countries, data categories, models, or use cases
- Protects termination, deletion, return, and exit rights

### Content and messaging

Provide a processing map, DPA, retention schedule, transfer and subprocessor pack, no-shared-training statement, DPIA inputs, and contract responsibility map. Do not present security certification as proof of lawful processing.

## Subrole D — Procurement and Vendor Management

### Typical titles and context

- Strategic Sourcing or IT Procurement leader
- Software or AI Category Manager
- Vendor Manager or Supplier Relationship Manager
- Third-Party Risk Management lead
- Commercial Manager
- ICT third-party oversight role in regulated financial services

### What this subrole owns

- Supplier selection and competition
- Commercial model, pricing assumptions, commitments, and total cost
- Scope, acceptance, delivery RACI, support, and service obligations
- Security, privacy, legal, financial, resilience, and subprocessor diligence coordination
- Marketplace, reseller, partner, and subcontractor route
- Consumption, outcome, renewal, expansion, and supplier-performance review
- Audit, termination, transition, data return, and exit readiness
- Concentration, lock-in, and vendor-viability risk

### KPI scorecard — inference

- Sourcing and contracting lead time
- Total cost and unit economics against baseline
- Usage or throughput versus commitment
- Outcome realization versus commercial assumptions
- Open supplier-risk findings
- Service and implementation performance
- Renewal, expansion, and exit readiness
- Supplier concentration and dependency

### Pains and triggers

- Bespoke outcome pricing creates attribution and baseline questions
- Throughput commitments can become shelfware if adoption lags
- Otera, partner, cloud, model, and subcontractor responsibility may be unclear
- AI urgency can compress competition and diligence
- Approved use case, defined workload, incumbent renewal, marketplace availability, or DORA review triggers formal sourcing

### Jobs to be done

- **Functional:** Buy measurable operating capacity with enforceable delivery, risk, and exit accountability
- **Emotional — inference:** Avoid a fashionable but underused or difficult-to-exit AI contract
- **Social — inference:** Demonstrate commercial discipline while enabling a strategic program

### Objections and proof required

| Concern | Proof required |
| --- | --- |
| Outcome pricing cannot be audited | Workload baseline, metric definition, attribution method, exclusions, and reporting |
| Scope and responsibility are ambiguous | RACI across customer, Otera, partner, cloud, model, and system owners |
| The contract creates lock-in | Data and configuration portability, termination, transition, knowledge transfer, and exit plan |
| Partner and Otera roles overlap | Prime and subcontractor structure, support escalation, liability, and account ownership |
| Vendor claims do not become obligations | Acceptance criteria, milestones, service levels, remedies, and review cadence |
| A reference is not comparable | Reference calls matched by use case, scale, industry, geography, and delivery model |

Otera says current engagements use individualized, outcome-oriented commercial structures rather than standard seat pricing. Do not infer minimum commitments, discounts, guarantees, or “pay only for outcomes” terms that are not publicly disclosed.

### Regulated financial-services context

[Regulation (EU) 2022/2554 — DORA](https://eur-lex.europa.eu/eli/reg/2022/2554/oj/eng) retains financial-entity accountability for ICT third-party risk and includes due-diligence, contractual, audit, cooperation, termination, and exit considerations for covered arrangements.

### Buyer-journey role

- Structures the sourcing and selection process
- Coordinates supplier diligence and contracting
- Converts business and technical claims into measurable acceptance terms
- Onboards and monitors the supplier
- Reviews consumption, service, risk, outcome, renewal, expansion, or exit

### Content and messaging

Provide transparent workload and outcome assumptions, pricing scenarios, delivery RACI, support model, supplier chain, risk evidence, and exit plan. Do not use “risk-free,” imply undisclosed guarantees, or invent partner economics.

## Shared approval sequence

| Stage | Gate activity | Exit condition |
| --- | --- | --- |
| Use-case framing | Define decision, data, consequence, jurisdiction, system action, and human authority | Scope is specific enough to classify and assess |
| Initial diligence | Review Otera, deployment, model, connector, partner, and supplier chain | No unidentified material dependency |
| Design | Define identity, data, rules, validation, oversight, logging, operations, and exit | Control responsibilities are allocated |
| Evidence review | Test representative cases and review certifications, contracts, architecture, and validation | Findings are closed, mitigated, or explicitly accepted |
| Contract and production approval | Agree scope, service, liability, DPA, audit, acceptance, and transition | Approval conditions are documented and operational |
| Ongoing oversight | Monitor performance, exceptions, incidents, changes, suppliers, and outcomes | Material changes trigger reassessment |

## Stakeholder dynamics

### Natural allies

- Technical evaluator who can turn requirements into architecture and test evidence
- Functional champion who defines rules, consequence, and operational ownership
- Executive champion who can resolve cross-functional priorities
- Internal audit and control owners seeking inspectable evidence
- Procurement coordinating commercial and supplier responsibilities

### Likely tension

- Business sponsors compressing approval to meet a promised go-live
- Vendors using certifications, logos, or generic compliance claims instead of evidence
- Technology teams treating risk as a final checklist rather than design input
- Risk teams requiring universal manual review without evaluating differentiated case risk
- Procurement optimizing unit price while the business case depends on outcome and delivery capacity
- Partners and Otera disagreeing over who owns a finding, incident, or customer obligation

## Content strategy

### Lead with

- Use-case-specific decision, data, consequence, and authority
- Control-to-evidence mapping
- Complete dependency and responsibility chain
- Representative validation and exception behavior
- Ongoing change, monitoring, incident, and exit process

### Avoid

- One generic “security and compliance” persona
- “Fully compliant,” “risk-free,” or “EU AI Act certified” language
- Certification badges without scope and current evidence
- Treating human-in-the-loop as meaningful without information and authority design
- Inventing contract, SLA, pricing, guarantee, or liability terms
- Waiting until procurement to introduce risk functions

### High-value content formats

- Use-case risk and data-classification brief
- Security architecture and control-to-evidence matrix
- Model or agent validation report
- Human-authority and exception map
- Data-processing and subprocessor pack
- Supplier RACI and commercial-assumption model
- Material-change and ongoing-monitoring plan
- Termination, transition, and exit checklist

## Otera-specific evidence

- [Otera security](https://www.otera.ai/security) — stated SOC 2 Type II, ISO 27001, encryption, regional deployment, tenancy, RBAC, audit, retention, and human-control posture
- [Otera privacy notice](https://www.otera.ai/legal/privacy-notice) — public controller and processor framing
- [Otera ground truth](https://docs.otera.ai/docs/overview/agentic-skills/skill-configuration/ground-truth/index.html) — evaluation-set and performance comparison
- [Otera system roles](https://docs.otera.ai/docs/overview/get-started/user-management/roles-guide/index.html) and [custom roles](https://docs.otera.ai/docs/overview/get-started/user-management/custom-roles/index.html) — access and permissions
- [Otera pricing](https://www.otera.ai/pricing) — individualized outcome-oriented commercial model and delivery shapes
- [HFS on Allianz Partners](https://www.hfsresearch.com/research/otera-allianz-partners-profit-increase/) — early legal and compliance involvement, explainability, traceability, reversibility, and production rollout
- [ADIB evaluation](https://www.otera.ai/blog/otera-crowned-winner-of-adibs-industry-shaping-innovation-programme) — multistage committee evaluation in regulated banking
- [EU AI Act](https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX%3A32024R1689), [EDPB controller–processor guidelines](https://www.edpb.europa.eu/documents/guideline/guidelines-072020-on-the-concepts-of-controller-and-processor-in-the-gdpr_en), and [DORA](https://eur-lex.europa.eu/eli/reg/2022/2554/oj/eng) — authoritative external legal and regulatory context, not Otera assurance

## Confidence and gaps

- **High confidence:** Questions each subrole must answer and the broad control evidence required
- **Medium confidence:** Exact customer approval sequence, internal ownership, and the weight of each gate by vertical
- **Unknown or unavailable publicly:** Full Otera assurance reports, penetration test, incident SLA, BCDR targets, subprocessor and model-flow inventory, standard DPA and contract, liability terms, pricing minimums, audit rights, and exit obligations

## Sources & Coverage

### Used

- Otera security, privacy, documentation, pricing, customer, and evaluation sources linked above
- EU AI Act, EDPB guidance, and DORA for authoritative external context

### Limited

- Public marketing and documentation cannot establish that Otera has passed a particular customer's security, legal, model-risk, procurement, or regulatory assessment.
- The applicability of specific laws and controls depends on use case, geography, data, decision, and contractual role.

### Coverage

This dossier separates four approval subroles relevant to Otera's enterprise motion. It is not legal advice and does not claim a universal approval workflow.

## Research-use rules

1. Select the relevant subrole and use case before writing.
2. Distinguish vendor claims from customer diligence and legal conclusions.
3. Do not call Otera universally compliant or certified under a law based on marketing material.
4. Do not invent contract, pricing, SLA, liability, or approval terms.
5. Re-verify assurance, legal, privacy, and regulatory evidence before publication or procurement use.
