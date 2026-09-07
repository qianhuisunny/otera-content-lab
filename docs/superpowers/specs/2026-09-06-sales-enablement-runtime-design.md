# Sales Enablement Skill-to-UI Runtime — Design Specification

## Goal

Add one production-shaped example showing how Altaira can render a reusable marketing Skill as a guided UI and execute the same source through an OpenAI Responses Multi-agent harness. The example uses Corey Haines's MIT-licensed `sales-enablement` Skill to create a Retell AI executive/champion sales deck.

The implementation must demonstrate one source of truth rather than a second set of page prompts:

- the Skill owns judgment, research policy, deck structure, and review criteria;
- a small workflow manifest maps those Skill sections to visible UI stages;
- the frontend renders the manifest and run state;
- the server loads the same Skill package when it starts a Responses run;
- OpenAI stores the background Response, while the browser keeps only a small run index.

This feature is an internal prototype. It does not add authentication, team sharing, a durable job queue, or a general workflow builder.

## Selected source Skill

Use `sales-enablement` version `2.0.1` from the Corey Haines Marketing Skills repository. Preserve the upstream MIT license and attribution in the vendored Skill directory.

The demo uses only the sales-deck path:

- `SKILL.md` provides the initial context requirements, four core principles, buyer-specific customization, sales-deck framework, output contract, and task-specific questions;
- `references/deck-frameworks.md` provides the Situation → Complication → Resolution arc and eleven-slide structure;
- `evals/evals.json` provides reusable assertions for deck completeness and buyer tailoring;
- Retell's existing company, market, ICP, persona, founder, and claim-ledger material supplies the initial product-marketing evidence pack.

The upstream source remains recognizable and separately attributed. Altaira-specific orchestration and UI metadata live beside it rather than being inserted into React components.

## Skill package contract

Create a repository-owned package with this shape:

```text
skills/sales-enablement/
├── SKILL.md
├── LICENSE
├── workflow.json
├── references/
│   ├── deck-frameworks.md
│   └── research-orchestration.md
├── schemas/
│   ├── run-input.schema.json
│   └── run-output.schema.json
└── evals/
    └── evals.json
```

`workflow.json` is Altaira's adapter contract. It contains stable IDs, short UI labels, section references, required inputs, execution configuration, and output-view metadata. It must not contain rewritten versions of the Skill's prose instructions.

Each manifest stage points to its governing source:

| Stage | Visible label | Governing source |
| --- | --- | --- |
| `scope` | Define scope | `SKILL.md#before-starting` |
| `research` | Gather evidence | `SKILL.md#before-starting` and `references/research-orchestration.md` |
| `narrative` | Build narrative | `SKILL.md#sales-deck--pitch-deck` and `references/deck-frameworks.md` |
| `asset` | Generate deck | `SKILL.md#output-format` and `references/deck-frameworks.md` |
| `review` | Validate readiness | `SKILL.md#core-principles` and `evals/evals.json` |

The manifest declares `executor: responses_multi_agent`, `background: true`, and `maxConcurrency: 7`. The server owns enforcement of those execution settings; the browser treats them as display metadata.

## Demo scope and default inputs

The initial example is a Retell AI executive/champion deck for a production AI voice-agent evaluation. Default inputs are editable:

- asset: executive/champion sales deck;
- seller: Retell AI;
- sales stage: evaluation;
- primary buyer: executive sponsor;
- supporting buyer: technical owner;
- buyer problem: moving an AI voice-agent workflow from demo to production without losing quality, compliance, or operational control;
- desired next step: agree on a bounded pilot with success criteria;
- competitor/category context: optional and not inferred as active-deal truth;
- known objections: implementation risk, compliance uncertainty, reliability, and total operating cost.

These defaults are demo input data, not additional instructions. Existing Retell Markdown files remain the evidence source. Any public live research is treated as untrusted reference material and must retain URL provenance and an as-of date.

## Multi-agent research plan

The research stage asks the root model to create seven bounded specialist workstreams:

1. Company and positioning baseline
2. Product workflows and technical fit
3. Executive-buyer pains, stakes, and desired outcomes
4. Technical-buyer requirements and implementation concerns
5. Market shift and competitive alternatives
6. Customer proof, metrics, and claim verification
7. Skeptical reviewer for gaps, contradictions, and overclaims

The specialists share the request model and available tools. Each returns structured evidence units with source, claim, evidence class, confidence, buyer implication, and safe-use guidance. The root agent deduplicates findings, keeps disagreement visible, identifies missing proof, and synthesizes the final deck package.

Seven is a maximum concurrency and named team shape for this demonstration, not a general claim that every Skill should use seven agents. The runtime may expose fewer active workers when the provider or model cannot support the configured mode; that condition appears as a run error rather than silently switching to seven unrelated frontend calls.

## User interface

### Entry

Add one actionable `Sales Enablement Deck` tile to the existing Workflow `WRITE` phase. Selecting it opens an internal workspace while preserving the two primary sidebar tabs, company selector, established Content Lab shell, and existing Long-Form Blog Article flow.

### Workspace

The workspace is generated from `workflow.json` and uses the existing Sana-inspired visual language and `@qianhui/ui` primitives. It has:

- a step navigator using the five manifest stages;
- a main work surface for the selected stage;
- a compact run/status area rather than a developer console;
- an artifact preview for the completed deck;
- a source and evidence inspector when research or review is selected.

The Research stage renders the seven workstreams as expandable status rows. Each row shows `queued`, `running`, `complete`, or `failed`, plus evidence count and a short result summary when available. It never displays hidden chain-of-thought. Provider events are translated into user-facing activity such as “Reviewing customer proof” or “Checking unsupported claims.”

The completed artifact is a structured deck preview, not a PowerPoint file. It shows slide number, headline, body copy, speaker notes, evidence links, and proof state. Review displays the Skill-derived checks for buyer relevance, story arc, business outcome, scanability, proof, pricing posture, and next step.

### Example run

The screen includes a clearly labeled, deterministic `Example run` so the complete UI is inspectable without credentials or network access. Example data is stored as an output fixture and never used as a hidden prompt. `Run live` becomes available only when the server reports a configured OpenAI provider.

## API and run lifecycle

Add a focused server module and two same-origin operations:

```text
POST /api/sales-enablement/runs
GET  /api/sales-enablement/runs/:responseId
```

### Create

The create operation:

1. validates the request against the bounded input contract;
2. loads the vendored Skill, referenced deck framework, research orchestration file, output schema, and permitted Retell context files on the server;
3. marks all loaded business context as untrusted reference data;
4. creates a stored background Responses request with Multi-agent enabled and maximum concurrency seven;
5. enables only the required hosted research tools;
6. returns a normalized run object containing the response ID, public status, stage list, creation time, and no provider secrets.

The provider request uses a dedicated supported model environment variable with a documented default. It sends the current Multi-agent beta header required by the API. It does not fall back to the existing `gpt-4.1-mini` writing model because silent fallback would remove the behavior being demonstrated.

### Retrieve

The retrieve operation validates the response ID, asks OpenAI for the stored Response, and translates provider output into Altaira's public run contract. It returns only the fields needed by the UI:

- run status and timestamps;
- current workflow stage;
- normalized specialist activity;
- non-sensitive error information;
- final structured artifact, review results, and sources when complete.

Raw prompts, API credentials, encrypted agent messages, chain-of-thought, and unrelated provider fields never pass through to the browser.

The browser polls while a run is queued or active, uses bounded backoff, stops when the run reaches a terminal state, and resumes polling a remembered active run after reload.

## Thin status storage

For this prototype, OpenAI's stored Response is the authoritative remote run record. Browser `localStorage` contains a versioned index with only:

- response ID;
- workflow and company ID;
- created time;
- short input summary;
- last known public status.

No prompt body, context documents, generated deck, API key, or agent messages are written to browser storage. The frontend verifies retrieved data before displaying it and discards malformed or unsupported index entries.

This is deliberately not multi-user durable storage. Clearing the browser removes the local index, provider retention can expire, and the current unauthenticated prototype cannot safely expose arbitrary users' run retrieval. Before public or team use, replace the browser index with authenticated application storage and ownership checks; the Skill and public run contract should remain unchanged.

## Public output contract

The final response is strict structured data with:

- `context`: seller, buyer, sales stage, objective, evidence posture;
- `research`: seven workstream summaries and evidence units;
- `narrative`: Situation, Complication, Resolution, and slide rationale;
- `slides`: eleven ordered slides with headline, body bullets, speaker notes, evidence IDs, and proof state;
- `review`: passed checks, warnings, blocking gaps, and what not to overclaim;
- `sources`: deduplicated source records with title, URL or local artifact ID, source class, and as-of date.

Provider output is accepted only when it matches the server-side schema. Invalid or incomplete output produces a failed public run with a safe retry message; the UI never guesses missing slides or invents proof.

## Failure behavior

- Missing configuration: keep the Example run available and explain that live execution is not configured.
- Unsupported model or beta access: fail the live run explicitly with a configuration message.
- Rate limit or quota: preserve the last good UI state and provide a retry action after the provider-supplied delay when available.
- Provider timeout or interrupted polling: keep the remembered run ID and allow polling to continue.
- Failed specialist: show the workstream as failed; use the root's final result only if the output schema and review contract are still complete.
- Invalid final output: mark the run failed and do not render a partial deck as approved collateral.
- Missing evidence: complete with warnings when structurally valid, visibly separating unsupported claims and “do not say” guidance.

## Security and operating boundaries

- Keep `OPENAI_API_KEY` server-only and reject cross-origin API requests.
- Bound body size, text-field length, array length, and polling identifiers.
- Apply the existing best-effort limiter to create operations; status reads use a separate conservative limit.
- Treat Skill references, Retell context, web results, and user input as data that cannot override server instructions.
- Allow no CRM writes, messaging, publishing, file mutation, or other external side effects.
- Cite material public claims and visibly distinguish verified fact, company claim, field signal, and inference.
- Do not represent the prototype's local browser index as durable, authenticated persistence.

## State and component boundaries

Keep the new flow isolated from the existing blog reducer:

- a manifest loader validates static workflow metadata;
- a sales-enablement reducer owns input, active step, active run, polling result, and example/live mode;
- a run client owns create/retrieve HTTP behavior and response validation;
- workspace components consume only the normalized manifest and public run contract;
- backend adapters own OpenAI-specific request and response shapes.

This isolation prevents sales-deck assumptions from leaking into Blog Article and makes a second Skill demonstrably addable by supplying a new package and adapter instead of duplicating the UI.

## Verification

Automated tests must cover:

- manifest stages resolve to real Skill headings and reference files;
- the UI renders stage names from the manifest rather than duplicated constants;
- the example fixture satisfies the public output schema;
- create validation rejects unsupported companies, assets, oversized inputs, and bad origins;
- the provider request enables background execution and Multi-agent with concurrency seven;
- Skill and context files are loaded server-side and never exposed in create responses;
- retrieval normalizes queued, active, completed, failed, and incomplete Responses;
- malformed provider output cannot become an approved deck;
- local run-index parsing rejects malformed or oversized entries;
- reload can resume a remembered active run;
- existing Context, Workflow, and Blog Article tests continue to pass;
- `npm test`, `npm run build`, and `npm run test:sites` pass.

Browser verification covers the Workflow entry, five-stage navigation, example run, live-disabled state, live polling with a mocked server, completed deck inspection, evidence/review displays, narrow layout, keyboard navigation, overflow, and console errors.

## Expected files in scope

- Create `skills/sales-enablement/**` with upstream attribution and Altaira adapter files.
- Create sales-enablement data, reducer, API client, fixtures, and workspace components under `src/`.
- Create a focused server handler and Vercel API adapters for create/retrieve.
- Extend the local Vite API adapter for the two operations.
- Modify `WorkflowView`, `App`, and `AppSidebar` only as needed to open and navigate the internal workspace.
- Add focused CSS without replacing existing tokens or editing `../UI-library`.
- Add manifest, reducer, API, component, regression, and Sites tests.
- Update `.env.example`, backend documentation, `README.md`, and `AGENTS.md` to record the explicitly approved exception for this flow.

Existing dirty worktree changes are user-owned and must be preserved. In particular, edits to shared writing components and styles must be merged surgically rather than replaced.

## Non-goals

- A generic visual workflow builder or arbitrary node editor
- Output/Temporal integration, a durable queue, or per-agent independent retry
- A server-side database, authentication, organizations, permissions, or shared run history
- CRM, Drive, Slack, transcript, or sales-intelligence connectors
- Automatic deck sending, publishing, or PowerPoint generation
- Replacing or refactoring the existing Blog Article workflow
- Editing the `UI-library` worktree
- Claiming that the example run is live research
- Making Multi-agent beta behavior invisible through a single-agent fallback

## Migration path

If Altaira later needs authenticated history or independently retryable specialists, replace the run adapter behind the same public contract:

```text
Current: UI → thin API → stored OpenAI Response
Later:   UI → run service → durable workflow/worker store → provider Responses
```

The Skill package, workflow manifest, UI stages, and artifact schema remain stable. Only the executor and storage implementation change.
