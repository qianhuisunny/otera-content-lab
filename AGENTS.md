# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Otera Content Lab constraints

- Treat `/Users/qianhuisun/Desktop/Screenshot 2026-08-25 at 11.05.42 AM.png` as the visual reference.
- Prefer Storybook components exported by `../UI-library` and consume them through the `@qianhui/ui` package boundary.
- Import `@qianhui/ui/styles.css`; use the existing `--qh-*` tokens for visual styling.
- Compose new product behavior from existing components. Add an app-local component only when the library does not expose the needed semantic component.
- Keep any app-local component in the existing Sana-inspired visual language.
- Do not edit, rebuild, or clean the dirty `../UI-library` worktree.
- Do not add approval, review, publishing, versioning, authentication, backend, or persistence flows.
- Keep all Otera content on one responsive page with filtering, anchors, and individual inline expansion.
- On wide and ultrawide screens, expand and center the main library instead of leaving a large unused right gutter; preserve the established two-column artifact grid.
- Keep the collection hero free of theme chips, the Evidence summary stat, and full-text search. Keep the top bar free of artifact counts and bulk expand/collapse controls unless the user explicitly asks to restore them.
- Keep the desktop sidebar at `16rem`. Its primary navigation contains exactly two text-only view tabs, `Context` and `Workflow`; retain the OT identity avatar, local-snapshot status dot, and top-bar Content Lab icon.
- The Workflow view uses the exact content from `/Users/qianhuisun/Desktop/Screenshot 2026-08-25 at 12.36.50 PM.png` and composes registered `IconGridSection` / `IconTile` styles. Do not recreate its tinted bands or add unregistered workflow-card chrome.
