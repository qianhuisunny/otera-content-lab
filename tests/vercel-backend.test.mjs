import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createServer } from "vite";
import { writingApiPlugin } from "../server/vite-writing-api.js";
import healthHandler from "../api/health.js";
import generationHandler from "../api/writing/generate.js";
import { getWritingScenario } from "../src/data/writingScenario.js";

test("Vercel serves built assets and APIs before the SPA and only auto-deploys main", async () => {
  const config = JSON.parse(await readFile(new URL("../vercel.json", import.meta.url), "utf8"));
  assert.equal(config.outputDirectory, "dist/client");
  assert.deepEqual(config.git.deploymentEnabled, { "**": false, main: true });
  assert.equal(config.fluid, true);
  assert.equal(config.functions["api/**/*.js"].maxDuration, 300);
  assert.equal(config.functions["api/**/*.js"].supportsCancellation, true);
  assert.equal(config.functions["api/**/*.js"].includeFiles, "content/**/*.md");
  assert.equal(config.routes[0].handle, "filesystem");
  const missingApi = new RegExp(`^${config.routes[1].src}$`);
  assert.ok(missingApi.test("/api/writing/unknown"));
  assert.ok(missingApi.test("/api"));
  assert.equal(config.routes[1].status, 404);
  assert.equal(config.routes[2].dest, "/index.html");
});

test("Vercel Web handlers expose health and explicit method errors", async () => {
  assert.equal((await healthHandler.fetch(new Request("https://lab.example/api/health"))).status, 200);
  assert.equal((await generationHandler.fetch(new Request("https://lab.example/api/writing/generate"))).status, 405);
});

test("real local HTTP adapter serves health, input validation and missing-key errors", async (t) => {
  const server = await createServer({ configFile: false, server: { host: "127.0.0.1", port: 0 }, plugins: [writingApiPlugin({})] });
  t.after(() => server.close());
  await server.listen();
  const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  const health = await fetch(`${origin}/api/health`);
  assert.equal((await health.json()).configured, false);
  const response = await fetch(`${origin}/api/writing/generate`, { method: "POST", headers: { "content-type": "application/json", origin }, body: JSON.stringify({ companyId: "retell", stage: "outline", brief: getWritingScenario("retell").brief }) });
  assert.equal(response.status, 503);
  assert.equal((await response.json()).error.code, "NOT_CONFIGURED");
  const unknown = await fetch(`${origin}/api/unknown`, { headers: { accept: "text/html" } });
  assert.equal(unknown.status, 404);
  assert.match(unknown.headers.get("content-type"), /json/);
});
