import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  OPTIONAL,
  RUNTIME,
  PAGE_FILES,
  assetKeys,
  mintHelperNames,
  prepareStomp,
  syncDirectory,
} from "../scripts/prepare-stomp.mjs";
import {
  applyPatches,
  missingReferences,
  patches,
  preparePowerMouse,
} from "../scripts/prepare-powermouse.mjs";
import {
  NAME_WORDS,
  checkNeutralDist,
} from "../scripts/check-neutral-dist.mjs";
import {
  decodeTarget,
  frameHash,
  proxyHash,
  readProxyHash,
} from "../src/systemya/proxy-hash.ts";

const root = new URL("../", import.meta.url);
const source = (name) => readFile(new URL(name, root), "utf8");
const demo = new URL("vendor/powermouse/demo/public/", root);
const haveDemo = existsSync(new URL("pm/main.js", demo));
const config = JSON.parse(await source("src/systemya/stomp-config.json"));

/** A fake @sysce/stomp dist/ and transports: every file the real ones have, tiny. */
async function fixture(dir) {
  const dist = join(dir, "package/dist");
  const epoxy = join(dir, "epoxy");
  await mkdir(dist, { recursive: true });
  await mkdir(join(epoxy, "h3"), { recursive: true });
  const defaults = Object.fromEntries(
    Object.entries(RUNTIME).map(([key, [file]]) => [key, file]),
  );
  for (const [file] of [
    ...Object.values(RUNTIME),
    ...Object.values(PAGE_FILES),
  ])
    await writeFile(
      join(dist, file),
      `// ${file} ${JSON.stringify(defaults).replace(/"(\w+)":/g, "$1:")}\n//# sourceMappingURL=${file}.map\n`,
    );
  await writeFile(join(dist, "codec.wasm"), "unused ".repeat(10));
  await writeFile(join(dist, "Controller.js.map"), "{}".repeat(30));
  await writeFile(
    join(epoxy, "index.mjs"),
    `// epoxy loads new URL("epoxy.wasm", import.meta.url) `.repeat(2),
  );
  await writeFile(join(epoxy, "epoxy.wasm"), "wasm ".repeat(20));
  await writeFile(
    join(epoxy, "h3/stomp_h3.js"),
    `// h3 loads new URL("stomp_h3_bg.wasm", import.meta.url) `.repeat(2),
  );
  await writeFile(join(epoxy, "h3/stomp_h3_bg.wasm"), "wasm ".repeat(20));
  const libcurl = join(dir, "libcurl.mjs");
  await writeFile(libcurl, "// libcurl ".repeat(10));
  return { source: dist, epoxy, libcurl };
}

test("the runtime ships under short stamped names that change every build", async () => {
  const dir = await mkdtemp(join(tmpdir(), "systemya-rt-"));
  try {
    const inputs = await fixture(dir);
    const destination = join(dir, "public/vendor/rt");
    const first = await prepareStomp({ ...inputs, destination });
    const before = await stat(destination);
    const second = await prepareStomp({ ...inputs, destination });
    assert.notEqual(first.stamp, second.stamp);
    // synced in place: the folder stays (a running dev server keeps serving it), the old
    // build's files go
    assert.equal((await stat(destination)).ino, before.ino);
    const files = (await readdir(destination, { recursive: true })).filter(
      (name) => /\.\w+$/.test(name),
    );
    assert.deepEqual(files.sort(), [...second.files].sort());
    for (const name of second.files) {
      assert.doesNotMatch(name, NAME_WORDS, name);
      assert.doesNotMatch(name, /\.mjs$/, name);
      assert.ok(name.includes(`.${second.stamp}.`), name);
      assert.ok(!first.files.includes(name), name);
    }
    assert.deepEqual(
      Object.keys(second.assets).sort(),
      Object.keys(RUNTIME).sort(),
    );
    assert.equal(second.assets.serviceWorker, `sw.${second.stamp}.js`);
    assert.equal(second.page.module, `ap.${second.stamp}.js`);
    // epoxy and stomp-h3 are told their wasm's new names, and no file names its source map
    const ln = await readFile(
      join(destination, second.transport.epoxy),
      "utf8",
    );
    assert.match(ln, new RegExp(`"ln\\.${second.stamp}\\.wasm"`));
    assert.doesNotMatch(ln, /epoxy\.wasm/);
    const h3 = await readFile(join(destination, second.transport.h3), "utf8");
    assert.match(h3, new RegExp(`q3\\.${second.stamp}\\.wasm`));
    assert.doesNotMatch(h3, /stomp_h3_bg/);
    const sw = await readFile(
      join(destination, second.assets.serviceWorker),
      "utf8",
    );
    assert.doesNotMatch(sw, /sourceMappingURL/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("a STomp release with an asset the build does not name stops the build", async () => {
  const dir = await mkdtemp(join(tmpdir(), "systemya-rt-"));
  try {
    const inputs = await fixture(dir);
    await writeFile(join(inputs.source, "newThing.js"), "// new ".repeat(10));
    await assert.rejects(
      prepareStomp({ ...inputs, destination: join(dir, "out") }),
      /ships newThing\.js/,
    );
    const real = await readFile(
      new URL("node_modules/@sysce/stomp/dist/Controller.js", root),
      "utf8",
    );
    // every key the installed STomp has is named, and a named key it lacks is one a newer
    // release adds (OPTIONAL)
    const keys = assetKeys(real);
    assert.deepEqual(
      keys.filter((key) => !(key in RUNTIME)),
      [],
    );
    for (const key of Object.keys(RUNTIME))
      assert.ok(keys.includes(key) || OPTIONAL.has(key), key);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("a STomp from before omnibox.js builds without it", async () => {
  const dir = await mkdtemp(join(tmpdir(), "systemya-rt-"));
  try {
    const inputs = await fixture(dir);
    await rm(join(inputs.source, "omnibox.js"));
    for (const [file] of [
      ...Object.values(RUNTIME),
      ...Object.values(PAGE_FILES),
    ]) {
      const path = join(inputs.source, file);
      if (file === "omnibox.js") continue;
      await writeFile(
        path,
        (await readFile(path, "utf8")).replace(',omnibox:"omnibox.js"', ""),
      );
    }
    const runtime = await prepareStomp({
      ...inputs,
      destination: join(dir, "out"),
    });
    assert.ok(!("omnibox" in runtime.assets));
    assert.ok(!runtime.files.some((name) => name.startsWith("ob.")));
    // the ES module twin is in dist/ but not served
    await writeFile(join(inputs.source, "omnibox.mjs"), "// esm ".repeat(10));
    await prepareStomp({ ...inputs, destination: join(dir, "out") });
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("syncDirectory writes what changed and deletes only what is gone", async () => {
  const dir = await mkdtemp(join(tmpdir(), "systemya-sync-"));
  try {
    await syncDirectory(
      dir,
      new Map([
        ["a.js", "1"],
        ["d/b.js", "2"],
      ]),
    );
    await syncDirectory(
      dir,
      new Map([
        ["a.js", "3"],
        ["c.js", "4"],
      ]),
    );
    assert.deepEqual((await readdir(dir)).sort(), ["a.js", "c.js"]);
    assert.equal(await readFile(join(dir, "a.js"), "utf8"), "3");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("helper names are minted per build and are not STomp's defaults", () => {
  const a = mintHelperNames();
  const b = mintHelperNames();
  assert.notDeepEqual(a, b);
  assert.equal(new Set(Object.values(a)).size, 5);
  for (const name of Object.values(a)) {
    assert.match(name, /^\$[A-Za-z]{6}$/);
    assert.ok(!["$s$j", "$s$L", "$s$N", "$P$s", "stompError"].includes(name));
  }
});

test(
  "the browser UI is the vendored demo, patched in place and fully served",
  { skip: !haveDemo && "vendor/powermouse is not checked out" },
  async () => {
    const dir = await mkdtemp(join(tmpdir(), "systemya-ui-"));
    try {
      const inputs = await fixture(dir);
      const runtime = await prepareStomp({
        ...inputs,
        destination: join(dir, "public/vendor/rt"),
      });
      const names = mintHelperNames();
      const ui = await preparePowerMouse({
        runtime,
        names,
        config,
        destination: join(dir, "public/ui"),
      });
      const out = join(dir, "public/ui");
      assert.match(ui.entry, new RegExp(`^/ui/ix\\.${runtime.stamp}\\.html$`));
      for (const name of ui.files) assert.doesNotMatch(name, NAME_WORDS, name);
      const html = await readFile(
        join(out, `ix.${runtime.stamp}.html`),
        "utf8",
      );
      assert.match(html, /<title>SystemYA<\/title>/);
      assert.doesNotMatch(
        html,
        /powerMouse<|STomp|\/pm\/|\/stomp\/|config\.js/,
      );
      const order = ["ct.", "sb.", "sy.", "ma."].map((prefix) =>
        html.indexOf(`/${prefix}${runtime.stamp}.js`),
      );
      assert.ok(
        order.every((i, n) => i > 0 && (n === 0 || i > order[n - 1])),
        order.join(),
      );
      const js = await readFile(join(out, `ma.${runtime.stamp}.js`), "utf8");
      assert.match(js, /const DIRECTORY="\/vendor\/rt\/"/);
      assert.match(js, /\/vendor\/rt\/ln\.[0-9a-f]{8}\.js/);
      // frame.js calls this global of the UI's script, so the copy keeps its name
      assert.match(js, /async function navigate\(/);
      assert.match(js, /\^\\\/ui\\\/icons\\\//);
      // the Shields panel's text does not name the proxy
      assert.doesNotMatch(js, /through the proxy|Proxied page/);
      assert.match(js, /fetched through the relay/);
      const error = await readFile(
        join(out, `er.${runtime.stamp}.html`),
        "utf8",
      );
      assert.ok(error.includes(names.error));
      assert.doesNotMatch(error, /stompError|STomp/);
      const frame = await readFile(join(out, `sy.${runtime.stamp}.js`), "utf8");
      assert.ok(frame.includes(runtime.assets.serviceWorker));
      // pm/main.js names the files it loads itself from STOMP_ASSETS
      assert.match(frame, /window\.STOMP_ASSETS=/);
      assert.ok(frame.includes(names.access));
      // the UI's carrier follows stomp-config.json's webTransport
      assert.match(
        frame,
        config.webTransport
          ? /webTransport:(?:!0|true)[,}]/
          : /webTransport:(?:!1|false)[,}]/,
      );
      assert.match(js, /webTransport:[A-Z_]+/);
      assert.match(js, /CFG\.webTransport/);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  },
);

test(
  "each UI patch must match, and every file the UI names must be served",
  { skip: !haveDemo && "vendor/powermouse is not checked out" },
  async () => {
    const table = patches({
      directory: "/vendor/rt/",
      ui: "/ui/",
      files: {
        "error.html": "er.x.html",
        "pm/main.css": "ma.x.css",
        "pm/main.js": "ma.x.js",
        "frame.js": "sy.x.js",
      },
      runtime: {
        transport: { epoxy: "ln.x.js", h3: "q3.x.js", libcurl: "cu.x.js" },
        page: { script: "ct.x.js", search: "sb.x.js" },
        assets: { serviceWorker: "sw.x.js" },
      },
      names: { error: "$abcdef" },
    });
    applyPatches(
      "pm/main.js",
      await readFile(new URL("pm/main.js", demo), "utf8"),
      table["pm/main.js"],
    );
    assert.throws(
      () => applyPatches("pm/main.js", "no match here", table["pm/main.js"]),
      /expected .* found it 0 times/,
    );
    const missing = missingReferences(
      [
        [
          "ix.html",
          '<img src="/ui/icons/a.png"><script src="/vendor/rt/ct.x.js"></script><link href="/pm/x.css">',
        ],
      ],
      new Set(["/vendor/rt/ct.x.js"]),
      { ui: "/ui/", directory: "/vendor/rt/" },
    );
    assert.deepEqual(missing, [
      "ix.html: /ui/icons/a.png",
      "ix.html: /pm/x.css",
    ]);
  },
);

test("the /app/ fragment never holds a readable address", () => {
  const url = "https://example.com/a?q=secret words#e";
  const hash = proxyHash(url);
  assert.match(hash, /^#[\w-]+$/);
  assert.doesNotMatch(decodeURIComponent(hash), /example|secret|https/i);
  assert.deepEqual(readProxyHash(hash), {
    kind: "url",
    url: "https://example.com/a?q=secret%20words#e",
  });
  const frame = frameHash("/cdn/game/?x=1");
  assert.doesNotMatch(frame, /cdn|game/);
  assert.deepEqual(readProxyHash(frame), {
    kind: "frame",
    path: "/cdn/game/?x=1",
  });
  assert.throws(() => frameHash("//evil.example/"));
  assert.equal(
    decodeTarget(proxyHash("https://a.b/é").slice(1)),
    "https://a.b/%C3%A9",
  );
  // the UI's own sealed route passes through
  assert.deepEqual(readProxyHash("#html/3tnVzsDgBy6c9BOsxKHHGIkMmAI"), {
    kind: "route",
    hash: "#html/3tnVzsDgBy6c9BOsxKHHGIkMmAI",
  });
  // a plain address typed by hand opens; a plain path, a script URL or noise does not
  assert.deepEqual(readProxyHash("#https%3A%2F%2Fgithub.com%2F"), {
    kind: "url",
    url: "https://github.com/",
  });
  for (const hash of ["", "#/etc/passwd", "#javascript:alert(1)", "#zz"])
    assert.notEqual(readProxyHash(hash).kind, "url", hash);
});

test("the browser page is /app/, linked from every navbar under an obfuscated label", async () => {
  assert.ok(existsSync(new URL("src/pages/app/index.astro", root)));
  assert.ok(!existsSync(new URL("src/pages/proxy", root)));
  const page = await source("src/pages/app/index.astro");
  assert.match(
    page,
    /<SystemYALayout page="app" title="SystemYA" fullscreen \/>/,
  );
  for (const name of ["index", "theatre", "support", "contact", "privacy"]) {
    const html = await source(`src/systemya/snapshots/${name}.html`);
    assert.match(
      html,
      /<a class="entry text" href="\/app\/"><span><s class="q">/,
    );
    assert.doesNotMatch(html, /href="\/proxy\/|<span>Proxy<\/span>/);
  }
  const interactions = await source("src/systemya/interactions.ts");
  assert.match(interactions, /openProxy\(targetUrl\(input\.value\)\)/);
  // the page's address comes from the route book; /app/ is an old path that leads to it
  assert.match(await source("src/systemya/routes.ts"), /app: \["\/app\/"/);
  const proxy = await source("src/systemya/proxy.ts");
  assert.match(proxy, /export const APP_PATH = routeHref\("app"\);/);
  assert.match(proxy, /document\.addEventListener\("click", proxyLink\)/);
  assert.match(proxy, /export function openProxy\(/);
  assert.match(proxy, /export function openFrame\(/);
  const stomp = await source("src/systemya/stomp.ts");
  assert.match(stomp, /export function bootStomp\(/);
  assert.match(
    stomp,
    /new URL\(`\$\{DIRECTORY\}\$\{build\.controller\}`, location\.href\)/,
  );
  assert.doesNotMatch(
    await source("src/layouts/SystemYALayout.astro"),
    /systemya-service/,
  );
});

test("CI checks out the submodule, pinned shallow", async () => {
  const modules = await source(".gitmodules");
  assert.match(modules, /path = vendor\/powermouse/);
  assert.match(
    modules,
    /url = https:\/\/github\.com\/Fracital\/powerMouse\.git/,
  );
  assert.match(modules, /shallow = true/);
  for (const workflow of ["ci.yml", "deploy.yml"])
    assert.match(
      await source(`.github/workflows/${workflow}`),
      /actions\/checkout@v\d+\n\s+with:\n\s+submodules: true/,
    );
  const pkg = JSON.parse(await source("package.json"));
  assert.match(
    pkg.dependencies["@sysce/stomp"],
    /^\d+\.\d+\.\d+-nightly\.\d+\.g[0-9a-f]+$/,
  );
  assert.equal(config.directory, "/vendor/rt/");
  assert.equal(config.ui, "/ui/");
  assert.equal(config.wisp, "wss://holywisp.fracit.al/");
  // the session is found by the relay's /webtransport.json, the WebSocket kept as the fallback
  assert.equal(typeof config.webTransport, "boolean");
  assert.equal(config.webTransport, true);
  assert.match(
    await source("src/systemya/stomp.ts"),
    /const WEB_TRANSPORT = config\.webTransport;[\s\S]*webTransport: WEB_TRANSPORT,/,
  );
});

test("the neutral-name check catches package names, /proxy/ and plain words", async () => {
  const dir = await mkdtemp(join(tmpdir(), "systemya-dist-"));
  try {
    await mkdir(join(dir, "app"), { recursive: true });
    await mkdir(join(dir, "ui"), { recursive: true });
    await mkdir(join(dir, "proxy"), { recursive: true });
    await writeFile(
      join(dir, "app/index.html"),
      "<title>SystemYA</title><main></main>",
    );
    await writeFile(
      join(dir, "ui/ix.1.html"),
      '<title>SystemYA</title><a id="x" title="Stomp">powerMouse</a>',
    );
    await writeFile(join(dir, "ui/epoxy.js"), "");
    await writeFile(
      join(dir, "index.html"),
      '<a href="/proxy/"><span>Proxy</span></a>',
    );
    const problems = checkNeutralDist(dir).join("\n");
    assert.match(problems, /named after it: ui\/epoxy\.js/);
    assert.match(problems, /proxy\/ is built/);
    assert.match(problems, /ui\/ix\.1\.html says powerMouse/);
    assert.match(problems, /title="Stomp"/);
    assert.match(problems, /index\.html links to \/proxy\//);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test(
  "a built dist/ is neutral",
  {
    skip:
      !existsSync(new URL("dist/app/index.html", root)) && "no build in dist/",
  },
  () => {
    assert.deepEqual(checkNeutralDist(new URL("dist", root).pathname), []);
  },
);
