# Otera Content Lab

A single-page, writing-ready library for Otera company research, ICP context, the buying committee, and seven role-level persona dossiers.

## Included context

- Company overview and evidence posture
- ICP, market fit, triggers, disqualifiers, and buying journey
- Buying committee map
- Economic Buyer
- Executive Champion
- Functional Champion
- Technical Evaluator
- Risk & Approval Gate
- Operational User
- Transformation Partner

All ten Markdown files are stored as exact local snapshots in `content/otera/` and rendered inline. Category filters, in-page anchors, and individual inline expansion keep the full research navigable without adding extra workflow.

## UI composition

The app consumes a repository-local packed snapshot of `@qianhui/ui` and its `--qh-*` tokens. It reuses `Button`, `SegmentedControl`, and `StatCard`; app-specific shell, navigation, artifact, and evidence components compose those primitives in the same Sana-inspired language.

## Run locally

```bash
npm install
npm run dev
```

## Verify

```bash
npm test
npm run build
npm run test:sites
```

## Skill-powered Sales Enablement demo

The Retell Sales Enablement Deck is generated from one canonical package at
`skills/sales-enablement`. Its `skills/sales-enablement/workflow.json` maps
Skill sections to the five UI steps; it does not duplicate their prompts. The
server loads the same Skill, the deck framework, the seven-lane research
policy, and every source listed in `context-sources.json`.

`Example run` is deterministic and works offline. `Run live` requires
`OPENAI_API_KEY` and uses `OPENAI_SALES_ENABLEMENT_MODEL`. The live path starts
one stored background Responses Multi-agent run; it is not seven browser API
calls.

Research cutoff: 2026-08-23. Public-source synthesis; reverify time-sensitive facts before publishing.
