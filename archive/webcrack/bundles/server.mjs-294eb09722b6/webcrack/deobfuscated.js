import http from "node:http";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { scramjetPath } from "@mercuryworkshop/scramjet/path";
import { server as wisp } from "@mercuryworkshop/wisp-js/server";
const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
const packageDir = specifier => path.dirname(require.resolve(specifier));
const app = express();
const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 8080);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("Invalid PORT");
}

// A publicly accessible Wisp endpoint is an outbound network relay. Do not
// permit SSRF to localhost/private infrastructure, nor unsolicited mail ports.
wisp.options.allow_private_ips = false;
wisp.options.allow_loopback_ips = false;
wisp.options.allow_direct_ip = false;
wisp.options.allow_udp_streams = false;
wisp.options.stream_limit_per_host = 16;
wisp.options.stream_limit_total = 64;
wisp.options.port_blacklist = [25, 110, 143, 465, 587, 445, 3306, 5432, 6379, 27017];
app.disable("x-powered-by");
app.use((_req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
});

// Keep the upstream rewriter and transports separate from our build/obfuscation.
app.use("/scram/", express.static(scramjetPath));
app.use("/controller/", express.static(packageDir("@mercuryworkshop/scramjet-controller")));
app.use("/utils/", express.static(packageDir("@mercuryworkshop/scramjet-utils")));
app.use("/libcurl/", express.static(packageDir("@mercuryworkshop/libcurl-transport")));
app.use("/epoxy/", express.static(packageDir("@mercuryworkshop/epoxy-transport")));
app.get("/healthz", (_req, res) => res.json({
  ok: true,
  engine: "scramjet2",
  transport: "wisp"
}));
app.use("/sw.js", (_req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  next();
});
app.use(express.static(path.join(here, "dist"), {
  index: "index.html"
}));
const server = http.createServer(app);
server.on("upgrade", (req, socket, head) => {
  // Never parse against the untrusted Host header.
  const pathname = new URL(req.url ?? "/", "http://localhost").pathname;
  if (pathname === "/wisp/") {
    req.url = pathname;
    wisp.routeRequest(req, socket, head);
    return;
  }
  socket.end();
});
server.listen(port, host, () => {
  console.log(`SystemYA serving http://${host}:${port} (Wisp at /wisp/)`);
  if (host === "0.0.0.0") {
    console.warn("[systemya] Public binding: add auth, quotas, rate limits and egress monitoring at the edge.");
  }
});