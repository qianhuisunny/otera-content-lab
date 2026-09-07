# Writing backend on Vercel

The live Writing flow uses OpenAI Responses for **brief → editable outline → generated article → rich-text editing**. It does not advance with fixture output. The prewritten scenarios remain only as isolated UI design fixtures. Both companies and the existing Context/Workflow views are preserved.

## Production setup

- Import `qianhuisunny/otera-content-lab`, with Root Directory `./`, Vite preset, and Production Branch `main`.
- `vercel.json` sets `npm ci`, `npm run build`, `dist/client`, and Node functions under `api/`. Fluid compute is enabled; generation has a 240-second provider timeout within a 300-second function limit.
- In Vercel project Settings → Environment Variables, add `OPENAI_API_KEY` for **Production**. Optionally set `OPENAI_MODEL` (default: `gpt-4.1-mini`, must support Responses). Redeploy after changing environment variables.
- Keys are server-only. Never use `VITE_OPENAI_API_KEY`, commit a real key, or enter it into the writing form. `.env.local`, `.env*`, and `.vercel/` are ignored; `.env.example` contains no secret.
- `/api/health` returns backend status and `configured: true/false`, never the key. A deployment can be healthy but not ready to generate until the key is added. A real provider test is still needed after configuration; health does not validate billing or model access.

## Deployment policy

`git.deploymentEnabled` enables only `main` and disables every other branch, including names containing `/`. Each main push updates Vercel Production when the project's Production Branch is `main`. A branch must contain this configuration for it to apply: merge current main into older feature branches before their next push. For repository-wide enforcement on branches that have not received the file, also set the Vercel project's Git deployment settings to production-only where available. Do not claim older branches are covered until this has been verified.

Non-main work can be previewed locally in Codex with `npm run dev`; the local server handles the same `/api` routes. `.env.local` is optional for inspecting UI, required for real local OpenAI requests. `npm run preview` also serves the backend after a build. Neither starts a Vercel deployment.

The Sites Worker, metadata and build contract are preserved unchanged. Sites cloud previews display the UI but do not contain this Node/OpenAI backend; the UI explicitly reports this if generation is attempted. Sites publication remains on-demand, not an automatic consequence of branch pushes.

## Request and editorial boundaries

- `POST /api/writing/generate` accepts only an allowlisted company, `outline` or `draft`, bounded brief fields, and the approved outline for drafting. The server owns provider URL, model, key, instructions, and output budgets.
- The prompt includes complete saved company, ICP, buying-committee and relevant audience documents (at most 180,000 characters), with source names and research cutoffs. These documents and the user's brief/outline are sent to OpenAI. No user-supplied URL is fetched, and no new live research or automatic fact-checking is performed.
- Article Markdown is converted to allowlisted editor HTML; raw HTML, scripts, unsafe links and remote images are not rendered. Refusals, incomplete output and provider failures do not replace edits or unlock the next step.
- Waiting, cancellation and retry are explicit. There are no automatic provider retries. Switching views cancels the local request; cancellation is best effort and cannot guarantee that a provider call already in progress incurs no charge.
- Drafts and edits are held in the current browser session only. Reloading clears them. There is no database, account/login system, publishing workflow, background queue, or claimed editorial score.

## Exposure and cost

Generation is callable by visitors to the deployed app once an API key is configured. Same-origin checks, an 80 KB request limit, bounded output tokens, and **instance-local** rate/concurrency limits reduce accidental abuse but do **not** provide authentication, a durable global quota, or a hard spending cap. Serverless instances do not share the limiter, and non-browser callers can omit Origin. Use a dedicated OpenAI project/key and review provider usage/billing. Before exposing this to untrusted users, configure access protection and a durable quota/rate limit. This change does not silently introduce a new authentication system.

## Sales Enablement runs

`POST /api/sales-enablement/runs` is a same-origin create endpoint. It validates
the selected Retell workflow and returns `202 Accepted` with a normalized public
run. `GET /api/sales-enablement/runs/:responseId` is the same-origin retrieval
endpoint and returns `200 OK` with the latest normalized public run. The client
never receives provider prompts, API credentials, lane packets, agent messages,
or raw reasoning content.

The server makes one OpenAI Responses request with
`OpenAI-Beta: responses_multi_agent=v1`, `background: true`, and `store: true`.
It defaults to `gpt-5.6-sol` unless `OPENAI_SALES_ENABLEMENT_MODEL` overrides
it. There is no automatic create retry and no single-agent fallback.

All 24 local Retell Markdown files are loaded and routed through the canonical
Skill package. The browser receives only normalized source records and public
run data. OpenAI's stored Response is authoritative for the temporary run;
browser storage is only a sanitized ten-record index and is not durable.
Clearing browser storage or provider retention expiry can make a prior run
unavailable. Retrieval is unauthenticated, and the serverless limiter is
instance-local, so authenticated ownership checks and durable quotas are
required before public or team use.

Sites remains a static preview: Example mode works there, but the live Node API
requires the Vercel or local backend.

## Verification

`npm test` covers input isolation, actual HTTP routing, provider request construction, response parsing, safe errors, timeouts/cancellation, source selection, Markdown safety and stale-result handling. Provider responses are mocked in automated tests, not in the shipped runtime. `npm run build` and `npm run test:sites` verify coexistence with Sites. After deployment, check the main commit's Vercel status, `/api/health`, page loading, and the unconfigured error; perform a real outline and draft after adding the key.

References: [OpenAI text generation](https://developers.openai.com/api/docs/guides/text), [Vercel Node functions](https://vercel.com/docs/functions/runtimes/node-js), [Vercel Git configuration](https://vercel.com/docs/project-configuration/git-configuration), [Vercel project configuration](https://vercel.com/docs/project-configuration/vercel-json).
