import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

test("the production build is a self-contained Vercel static output", async () => {
  const indexPath = path.join(dist, "index.html");

  assert.equal(await exists(indexPath), true, "expected dist/index.html");

  const index = await readFile(indexPath, "utf8");
  const assetUrls = [...index.matchAll(/(?:href|src)="(\/assets\/[^\"]+)"/g)].map(
    ([, url]) => url,
  );

  assert.ok(assetUrls.length > 0, "expected index.html to reference built assets");

  for (const assetUrl of assetUrls) {
    assert.equal(
      await exists(path.join(dist, assetUrl.slice(1))),
      true,
      `missing built asset: ${assetUrl}`,
    );
  }

  assert.equal(await exists(path.join(dist, "client")), false);
  assert.equal(await exists(path.join(dist, "server")), false);
  assert.equal(await exists(path.join(dist, ".openai")), false);
});

test("Vercel rewrites application routes to the SPA shell", async () => {
  const config = JSON.parse(await readFile(path.join(root, "vercel.json"), "utf8"));

  assert.deepEqual(config.rewrites, [{ source: "/(.*)", destination: "/index.html" }]);
});
