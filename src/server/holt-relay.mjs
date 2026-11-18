/**
 * Same-origin Holt chat integration adapted from Fracital's chat-relay.ts.
 * Public visitors never enter an instance URL. The server supplies the platform
 * license in an upstream-only header, and streams the chat and its WebSocket.
 */
import http from "node:http";
import https from "node:https";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

export const CHAT_PATH = "/room/";
const RT_PATH = "_holt/api/rt";
const DEFAULT_ORIGIN = "https://holt.abstracteducation.loan";
const PLATFORM_PATTERN = /^[a-z][a-z0-9-]{0,31}$/;
const DROP_REQUEST = new Set([
  "host",
  "connection",
  "keep-alive",
  "proxy-authorization",
  "proxy-connection",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "content-length",
  "accept-encoding",
  "x-holt-license",
  "x-real-ip",
  "x-forwarded-for",
  "x-forwarded-host",
  "x-forwarded-proto",
  "forwarded",
  "true-client-ip",
]);
const DROP_RESPONSE = new Set([
  "connection",
  "keep-alive",
  "transfer-encoding",
  "content-length",
  "content-encoding",
  "set-cookie",
]);

function settings() {
  const license = process.env.HOLT_LICENSE?.trim() ?? "";
  const name = process.env.HOLT_PLATFORM?.trim() || "systemya";
  if (!PLATFORM_PATTERN.test(name)) throw new Error("Invalid HOLT_PLATFORM");
  const origin = new URL(process.env.HOLT_ORIGIN?.trim() || DEFAULT_ORIGIN);
  if (!/^https?:$/.test(origin.protocol) || origin.username || origin.password)
    throw new Error("Invalid HOLT_ORIGIN");
  return { license, platform: name, origin: new URL(origin.origin) };
}

export function holtEnabled() {
  return Boolean(process.env.HOLT_LICENSE?.trim());
}

function targetURL(url, config) {
  const requested = new URL(url || CHAT_PATH, "http://localhost");
  if (!requested.pathname.startsWith(CHAT_PATH)) return null;
  return new URL(
    `/${config.platform}/${requested.pathname.slice(CHAT_PATH.length)}${requested.search}`,
    config.origin,
  );
}

function rewriteLocation(value, config) {
  try {
    const url = new URL(value, config.origin);
    if (url.origin !== config.origin.origin) return value;
    if (url.pathname === `/${config.platform}`) return CHAT_PATH + url.search;
    const prefix = `/${config.platform}/`;
    if (url.pathname.startsWith(prefix))
      return (
        CHAT_PATH + url.pathname.slice(prefix.length) + url.search + url.hash
      );
  } catch {
    /* Preserve malformed or third-party redirects unchanged. */
  }
  return value;
}

function address(req) {
  // Trust proxy headers only when the operator confirms a trusted reverse proxy
  // overwrites them. Never trust an arbitrary browser-supplied X-Real-IP by default.
  if (process.env.HOLT_TRUST_PROXY === "1") {
    const value = req.headers["x-real-ip"] ?? req.headers["x-forwarded-for"];
    if (value)
      return String(Array.isArray(value) ? value[0] : value)
        .split(",")[0]
        .trim();
  }
  return req.socket?.remoteAddress || "";
}

function upstreamHeaders(req, config, websocket = false) {
  const headers = {};
  for (const [name, value] of Object.entries(req.headers)) {
    if (value === undefined || name.startsWith("cf-")) continue;
    if (DROP_REQUEST.has(name) && !(websocket && name === "upgrade")) continue;
    headers[name] = value;
  }
  const ip = address(req);
  if (ip) {
    headers["x-forwarded-for"] = ip;
    headers["x-real-ip"] = ip;
  }
  headers["x-holt-license"] = config.license;
  if (websocket) {
    headers.host = config.origin.host;
    headers.connection = "Upgrade";
  }
  return headers;
}

/** Intercepts only /room/ requests. Returns true if claimed. */
export function handleHoltRequest(req, res) {
  if (!req.url?.startsWith(CHAT_PATH)) return false;
  void (async () => {
    let config;
    try {
      config = settings();
    } catch {
      res.writeHead(500).end("Chat configuration is invalid");
      return;
    }
    if (!config.license) {
      res.writeHead(503, {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      });
      res.end("Chat is temporarily unavailable.");
      return;
    }
    const target = targetURL(req.url, config);
    if (!target) {
      res.writeHead(404).end();
      return;
    }
    try {
      const method = req.method || "GET";
      const hasBody = !["GET", "HEAD"].includes(method);
      const upstream = await fetch(target, {
        method,
        headers: upstreamHeaders(req, config),
        body: hasBody ? req : undefined,
        duplex: hasBody ? "half" : undefined,
        redirect: "manual",
      });
      const headers = {};
      for (const [name, value] of upstream.headers) {
        if (DROP_RESPONSE.has(name)) continue;
        headers[name] =
          name === "location" ? rewriteLocation(value, config) : value;
      }
      const cookies = upstream.headers.getSetCookie?.() || [];
      if (cookies.length) headers["set-cookie"] = cookies;
      if (!headers["cache-control"]) headers["cache-control"] = "no-store";
      res.writeHead(upstream.status, headers);
      if (method === "HEAD" || !upstream.body) {
        res.end();
        return;
      }
      await pipeline(Readable.fromWeb(upstream.body), res);
    } catch (error) {
      if (!res.headersSent) {
        res.writeHead(502, {
          "content-type": "text/plain; charset=utf-8",
          "cache-control": "no-store",
        });
        res.end("Chat is temporarily unavailable.");
      } else res.destroy(error);
    }
  })();
  return true;
}

/** Forwards the single Holt real-time WebSocket upgrade. */
export function handleHoltUpgrade(req, socket, head) {
  if (!req.url?.startsWith(CHAT_PATH)) return false;
  const reject = (status) => {
    if (!socket.destroyed)
      socket.end(`HTTP/1.1 ${status}\r\nConnection: close\r\n\r\n`);
  };
  let config;
  try {
    config = settings();
  } catch {
    reject("500 Internal Server Error");
    return true;
  }
  if (!config.license) {
    reject("503 Service Unavailable");
    return true;
  }
  const parsed = new URL(req.url, "http://localhost");
  if (parsed.pathname !== CHAT_PATH + RT_PATH) {
    reject("404 Not Found");
    return true;
  }
  const secure = config.origin.protocol === "https:";
  const upstream = (secure ? https : http).request({
    host: config.origin.hostname,
    port: config.origin.port || (secure ? 443 : 80),
    servername: secure ? config.origin.hostname : undefined,
    method: "GET",
    path: `/${config.platform}/${RT_PATH}${parsed.search}`,
    headers: upstreamHeaders(req, config, true),
  });
  upstream.on("upgrade", (response, upstreamSocket, upstreamHead) => {
    let status = `HTTP/1.1 ${response.statusCode} ${response.statusMessage}\r\n`;
    for (let i = 0; i < response.rawHeaders.length; i += 2)
      status += `${response.rawHeaders[i]}: ${response.rawHeaders[i + 1]}\r\n`;
    socket.write(status + "\r\n");
    if (upstreamHead.length) socket.write(upstreamHead);
    if (head.length) upstreamSocket.write(head);
    upstreamSocket.pipe(socket).pipe(upstreamSocket);
    const close = () => {
      socket.destroy();
      upstreamSocket.destroy();
    };
    socket.on("error", close);
    upstreamSocket.on("error", close);
    socket.on("close", close);
    upstreamSocket.on("close", close);
  });
  upstream.on("response", (response) => {
    reject(
      `${response.statusCode || 502} ${response.statusMessage || "Bad Gateway"}`,
    );
    response.resume();
  });
  upstream.on("error", () => reject("502 Bad Gateway"));
  socket.on("error", () => upstream.destroy());
  upstream.end();
  return true;
}
