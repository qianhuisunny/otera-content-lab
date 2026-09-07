import { Readable } from "node:stream";
import { handleApiRequest } from "./writing-api.js";

export function writingApiPlugin(env) {
  const install = (server) => {
    server.middlewares.use(async (req, res, next) => {
      if (!/^\/api(?:\/|$)/.test(req.url)) { next(); return; }
      const controller = new AbortController();
      req.once("aborted", () => controller.abort());
      res.once("close", () => { if (!res.writableEnded) controller.abort(); });
      try {
        const request = new Request(new URL(req.url, `http://${req.headers.host || "localhost"}`), {
          method: req.method, headers: req.headers, signal: controller.signal,
          ...(!["GET", "HEAD"].includes(req.method) ? { body: Readable.toWeb(req), duplex: "half" } : {}),
        });
        const response = await handleApiRequest(request, { env });
        res.writeHead(response.status, Object.fromEntries(response.headers));
        res.end(Buffer.from(await response.arrayBuffer()));
      } catch {
        if (!res.headersSent) res.writeHead(500, { "Content-Type": "application/json", "Cache-Control": "no-store" });
        if (!res.writableEnded) res.end(JSON.stringify({ error: { code: "LOCAL_SERVER_ERROR", message: "The local writing server could not handle this request." } }));
      }
    });
  };
  return { name: "content-lab-writing-api", configureServer: install, configurePreviewServer: install };
}
