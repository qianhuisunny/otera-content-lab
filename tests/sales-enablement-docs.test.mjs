import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const text = (path) => readFile(new URL("../" + path, import.meta.url), "utf8");

test("sales enablement configuration and operating boundaries are documented", async () => {
  assert.match(await text(".env.example"),
    /^OPENAI_SALES_ENABLEMENT_MODEL=gpt-5\.6-sol$/m);
  const readme = await text("README.md");
  assert.match(readme, /Skill-powered Sales Enablement/i);
  assert.match(readme, /skills\/sales-enablement\/workflow\.json/);
  const backend = await text("docs/vercel-backend.md");
  assert.match(backend, /POST \/api\/sales-enablement\/runs/);
  assert.match(backend, /GET \/api\/sales-enablement\/runs\/:responseId/);
  assert.match(backend, /browser.*index.*not.*durable/is);
  assert.match(backend, /OpenAI.*stored Response.*authoritative/is);
  const agents = await text("AGENTS.md");
  assert.match(agents, /Approved Sales Enablement exception/);
  assert.match(agents, /does not change.*Writing.*frontend-only/is);
});

test("the default test command includes every sales enablement suite", async () => {
  const pkg = JSON.parse(await text("package.json"));
  for (const file of [
    "sales-enablement-manifest.test.mjs",
    "sales-enablement-contract.test.mjs",
    "sales-enablement-context.test.mjs",
    "sales-enablement-provider.test.mjs",
    "sales-enablement-api.test.mjs",
    "sales-enablement-state.test.mjs",
    "sales-enablement-client.test.mjs",
    "sales-enablement-ui.test.mjs",
    "sales-enablement-css.contract.test.mjs",
    "sales-enablement-docs.test.mjs",
  ]) {
    assert.match(pkg.scripts.test, new RegExp(file.replaceAll(".", "\\.")));
  }
});
