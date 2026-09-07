# Upstream provenance

- Repository: https://github.com/coreyhaines31/marketingskills
- Commit: `5b2c0007766c6a1cf1d53fd8fc73e979e0821022`
- Snapshot date: 2026-09-04
- Marketplace version: 2.11.1
- Skill version: 2.0.1
- Skill last updated: 2026-06-16
- License: MIT, Copyright © 2025 Corey Haines

The provenance snapshot allowlist is `LICENSE`, `SKILL.md`,
`references/deck-frameworks.md`, and `evals/evals.json`. To update, review a new
upstream commit, copy only these four files byte-for-byte, update the commit and
versions here, then update the pinned hashes in
`tests/sales-enablement-manifest.test.mjs`.

These snapshot files are not runtime prompt inputs. Content Lab's scoped,
derived runtime sources are:

- `runtime/common-principles.md`;
- `skills/sales-deck/SKILL.md`;
- `skills/sales-deck/references/deck-frameworks.md`;
- `skills/sales-deck/evals/evals.json`.

The server keeps those four paths as an explicit allowlist. Review the derived
slice whenever the pinned upstream snapshot changes; do not point the runtime
back to the umbrella Skill or full eval suite.
