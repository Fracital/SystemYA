import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import http from "node:http";
import { once } from "node:events";
import { prepareStomp, stompFiles } from "../scripts/prepare-stomp.mjs";
import {
  handleHoltRequest,
  handleHoltUpgrade,
  CHAT_PATH,
} from "../src/server/holt-relay.mjs";

const root = new URL("../", import.meta.url);
const source = async (name) => readFile(new URL(name, root), "utf8");

test("STomp version and Fracital runtime names remain aligned", async () => {
  const packageJson = JSON.parse(await source("package.json"));
  assert.equal(
    packageJson.dependencies["@sysce/stomp"],
    "4.2.0-nightly.202611101458.g70c72a0",
  );
  assert.match(
    packageJson.dependencies["@mercuryworkshop/epoxy-transport"],
    /Fracital\/EpoxyTransport/,
  );
  assert.deepEqual(
    stompFiles.map((x) => x[1]),
    ["sw.js", "doc.js", "wk.js", "tw.js", "rw.js", "api.mjs"],
  );
  const engine = await source("src/systemya/stomp.ts");
  assert.match(engine, /StompController|Controller.register/);
  assert.match(engine, /\/wisp\//);
  assert.match(engine, /controller.createFrame\(frame\)/);
  assert.match(engine, /currentFrame.go\(url.href\)/);
});

test("STomp build tool copies upstream assets and keeps their hashes", async () => {
  const rootDir = await mkdtemp(join(tmpdir(), "systemya-stomp-test-"));
  try {
    const input = join(rootDir, "package");
    const dest = join(rootDir, "public/vendor/st");
    await mkdir(input);
    for (const [filename] of stompFiles)
      await writeFile(
        join(input, filename),
        `// fixture ${filename} `.repeat(4),
      );
    const epoxy = join(rootDir, "index.mjs");
    await writeFile(epoxy, "// fixture epoxy transport ".repeat(4));
    const manifest = await prepareStomp({
      source: input,
      epoxy,
      destination: dest,
    });
    assert.equal(manifest.files.length, 7);
    const api = await readFile(join(dest, "api.mjs"), "utf8");
    assert.match(api, /controller/);
    assert.equal(
      JSON.parse(await readFile(join(dest, "manifest.json"))).files.length,
      7,
    );
  } finally {
    await rm(rootDir, { recursive: true, force: true });
  }
});

test("Theatre content is taken from the May 2022 Webcrack catalog, not scrambled HTML", async () => {
  const cat = JSON.parse(
    await source("src/systemya/theatre-catalog-2022.json"),
  );
  assert.equal(cat.categories.length, 7);
  assert.equal(cat.categories.flatMap((c) => c.items).length, 34);
  assert.ok(
    cat.categories.some((c) =>
      c.items.some((i) => i.name === "Sonic The Hedgehog"),
    ),
  );
  assert.ok(
    cat.categories.some((c) => c.items.some((i) => i.name === "Duck Life 4")),
  );
  const saved = await source("src/systemya/snapshots/theatre.html");
  assert.doesNotMatch(saved, /<s class="q">/);
  assert.match(saved, /Sonic The Hedgehog/);
  assert.match(
    saved,
    /Pokemon Red =&gt; Pokemon Fire Red|Pokemon Red => Pokemon Fire Red/,
  );
  assert.equal(
    (saved.match(/data-target="(?:proxy|embed|webretro)"/g) || []).length,
    34,
  );
  assert.match(saved, /href="\/chat"/);
  const events = await source("src/systemya/interactions.ts");
  assert.match(events, /\.items > \.item\[data-target\]/);
  assert.match(events, /data(?:set)?\.target|card\.dataset\.target/);
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
