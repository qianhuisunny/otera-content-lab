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

All ten Markdown files are stored as exact local snapshots in `content/otera/` and rendered inline. Search indexes titles, metadata, facets, and the complete Markdown body.

## UI composition

The app consumes a repository-local packed snapshot of `@qianhui/ui` and its `--qh-*` tokens. It reuses `Button`, `SegmentedControl`, and `StatCard`; app-specific shell, navigation, artifact, and evidence components compose those primitives in the same Sana-inspired language.

## Run locally

```bash
npm install
npm run dev
```

## Verify

```bash
npm run verify
```

## Deploy to Vercel

Import `qianhuisunny/otera-content-lab` and use the Vite framework preset. The repository uses Vercel's conventional settings:

- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install` (Vercel default)

No environment variables are required. `vercel.json` keeps direct links and refreshed application routes inside the single-page app.

Research cutoff: 2026-08-23. Public-source synthesis; reverify time-sensitive facts before publishing.
