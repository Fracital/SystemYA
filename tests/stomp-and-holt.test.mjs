import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import http from "node:http";
import { once } from "node:events";
import {
  handleHoltRequest,
  handleHoltUpgrade,
  CHAT_PATH,
} from "../src/server/holt-relay.mjs";

const root = new URL("../", import.meta.url);
const source = async (name) => readFile(new URL(name, root), "utf8");

test("OAuth and Last.fm run through STomp and replay fracit.al's callback here", async () => {
  const oauth = await source("src/fracital/stomp-oauth.ts");
  assert.match(oauth, /AUTH_HOST = "https:\/\/fracit\.al"/);
  assert.match(oauth, /\/api\/auth\/callback\//);
  assert.match(oauth, /disableRedirect: true/);
  assert.match(oauth, /\/api\/auth\/lastfm\/url\?mode=/);
  assert.match(oauth, /action: \{ status: 204 \}/);
  const auth = await source("src/fracital/auth.ts");
  assert.match(auth, /oauthThroughStomp\(provider, mode, scopes\)/);
  assert.match(auth, /lastfmThroughStomp\(mode\)/);
});

test("Theatre is the Games SDK catalog; the 2022 cards and their sprite are gone", async () => {
  const saved = await source("src/systemya/snapshots/theatre.html");
  assert.match(
    saved,
    /<main class="systemya-theatre" id="systemya-theatre" aria-label="Theatre"><\/main>/,
  );
  assert.doesNotMatch(saved, /data-target=|class="front"|Pokemon Red =&gt;/);
  assert.match(saved, /href="\/chat"/);
  const { existsSync } = await import("node:fs");
  assert.equal(
    existsSync(new URL("src/systemya/theatre-catalog-2022.json", root)),
    false,
  );
  const events = await source("src/systemya/interactions.ts");
  assert.match(events, /mountTheatre\(root\)/);
  assert.doesNotMatch(events, /\.items > \.item\[data-target\]/);
});

test("The chat route is a fixed, same-origin Holt frame, not a visitor URL popup", async () => {
  const snapshot = await source("src/systemya/snapshot.ts");
  assert.match(snapshot, /iframe src=\\"\/room\/\\"|iframe src="\/room\/"/);
  const layout = await source("src/pages/chat/index.astro");
  assert.match(layout, /SystemYALayout page="chat"/);
  const server = await source("run-server.js");
  const vite = await source("astro.config.mjs");
  assert.match(server, /handleHoltRequest\(req, res\)/);
  assert.match(server, /handleHoltUpgrade\(req, socket, head\)/);
  assert.match(vite, /output: "static"/);
  assert.doesNotMatch(vite, /handleHoltUpgrade|handleHoltRequest/);
});

function makeServer(handler) {
  const server = http.createServer((req, res) => handler(req, res));
  return new Promise((resolve) =>
    server.listen(0, "127.0.0.1", () => resolve(server)),
  );
}

async function close(server) {
  await new Promise((resolve, reject) =>
    server.close((err) => (err ? reject(err) : resolve())),
  );
}

test("Holt is unavailable without the server-side license, with no leaked token", async () => {
  const former = process.env.HOLT_LICENSE;
  delete process.env.HOLT_LICENSE;
  const server = await makeServer((req, res) => {
    if (!handleHoltRequest(req, res)) res.writeHead(404).end();
  });
  try {
    const url = `http://127.0.0.1:${server.address().port}`;
    const response = await fetch(url + CHAT_PATH);
    assert.equal(response.status, 503);
    assert.match(await response.text(), /temporarily unavailable/);
  } finally {
    await close(server);
    if (former !== undefined) process.env.HOLT_LICENSE = former;
  }
});

test("Holt forwards requests under the platform path, rewrites redirects and keeps the license upstream", async () => {
  const previous = Object.fromEntries(
    ["HOLT_LICENSE", "HOLT_ORIGIN", "HOLT_PLATFORM"].map((k) => [
      k,
      process.env[k],
    ]),
  );
  let received = null;
  const holt = await makeServer(async (req, res) => {
    received = {
      url: req.url,
      license: req.headers["x-holt-license"],
      cookie: req.headers.cookie,
    };
    if (req.url.startsWith("/systemya/redirect")) {
      res.writeHead(302, { location: "/systemya/room?x=1" }).end();
      return;
    }
    let body = "";
    for await (const chunk of req) body += chunk;
    res
      .writeHead(200, {
        "content-type": "text/plain",
        "cache-control": "no-store",
      })
      .end("hello from Holt: " + body);
  });
  const app = await makeServer((req, res) => {
    if (!handleHoltRequest(req, res)) res.writeHead(404).end();
  });
  process.env.HOLT_LICENSE = "test-server-secret";
  process.env.HOLT_ORIGIN = `http://127.0.0.1:${holt.address().port}`;
  process.env.HOLT_PLATFORM = "systemya";
  try {
    let response = await fetch(
      `http://127.0.0.1:${app.address().port}/room/send`,
      {
        method: "POST",
        body: "hello",
        headers: { cookie: "sid=abc", "x-holt-license": "browser-spoof" },
      },
    );
    assert.equal(response.status, 200);
    assert.equal(await response.text(), "hello from Holt: hello");
    assert.equal(received.url, "/systemya/send");
    assert.equal(received.license, "test-server-secret");
    assert.equal(received.cookie, "sid=abc");
    assert.equal(response.headers.get("x-holt-license"), null);
    response = await fetch(
      `http://127.0.0.1:${app.address().port}/room/redirect`,
      { redirect: "manual" },
    );
    assert.equal(response.status, 302);
    assert.equal(response.headers.get("location"), "/room/room?x=1");
  } finally {
    await close(app);
    await close(holt);
    for (const [k, v] of Object.entries(previous))
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
  }
});

test("Only the single Holt websocket endpoint is forwarded", async () => {
  const prev = process.env.HOLT_LICENSE;
  delete process.env.HOLT_LICENSE;
  const socket = {
    ended: null,
    end(value) {
      this.ended = value;
    },
  };
  try {
    assert.equal(
      handleHoltUpgrade({ url: "/wisp/" }, socket, Buffer.alloc(0)),
      false,
    );
    assert.equal(
      handleHoltUpgrade({ url: "/room/_holt/api/rt" }, socket, Buffer.alloc(0)),
      true,
    );
    assert.match(socket.ended, /503 Service Unavailable/);
  } finally {
    if (prev === undefined) delete process.env.HOLT_LICENSE;
    else process.env.HOLT_LICENSE = prev;
  }
});
