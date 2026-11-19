import test from "node:test";
import assert from "node:assert/strict";
import {
  readFileSync,
  existsSync,
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = new URL("../", import.meta.url);
const read = (name) => readFileSync(new URL(name, root), "utf8");

test("Astro builds static files for the registered SystemYA origin", () => {
  const config = read("astro.config.mjs");
  assert.match(config, /site: "https:\/\/systemya\.fracit\.al"/);
  assert.match(config, /output: "static"/);
  assert.doesNotMatch(
    config,
    /@astrojs\/node|mode: "middleware"|astro:server:setup|handleUpgrade/,
  );
});

test("Only historical SPA pages are active in src/pages", async () => {
  const { readdirSync } = await import("node:fs");
  const names = readdirSync(new URL("../src/pages/", import.meta.url)).sort();
  // Pages are files; /chat/, /account/ and /app/ are folders so the bare paths reach them on the edge.
  const folders = ["account", "app", "chat"];
  assert.ok(
    names.every((name) => name.endsWith(".astro") || folders.includes(name)),
    names.join(", "),
  );
  assert.ok(
    existsSync(new URL("../src/pages/chat/index.astro", import.meta.url)),
  );
  assert.ok(names.includes("index.astro"));
  assert.equal(existsSync(new URL("../src/pages/api", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/pages/cdn", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/pages/v1", import.meta.url)), false);
  assert.equal(
    existsSync(new URL("../src/pages/room", import.meta.url)),
    false,
  );
  assert.ok(
    existsSync(
      new URL("../legacy/website2/pages/v1/games/index.ts", import.meta.url),
    ),
  );
});

test("Chat is same-origin and Games SDK uses the edge's /cdn/ proxy", () => {
  assert.match(read("src/systemya/snapshot.ts"), /<iframe src=\\?"\/room\//);
  assert.match(read("src/systemya/games-sdk.ts"), /"\/cdn\/index\.js"/);
  const config = read("astro.config.mjs");
  assert.doesNotMatch(config, /HOLT_LICENSE|private|holywisp/);
});

test("CI builds the static artifact without credentials, and deploy queues with pinned SSH hosts", () => {
  const ci = read(".github/workflows/ci.yml");
  const deploy = read(".github/workflows/deploy.yml");
  for (const workflow of [ci, deploy]) {
    assert.match(workflow, /npm ci/);
    assert.match(workflow, /npm run build/);
    assert.match(workflow, /permissions:\s*\n\s*contents: read/);
  }
  assert.match(deploy, /cancel-in-progress: false/);
  assert.match(deploy, /secrets\.SYSTEMYA_DEPLOY_KEY/);
  assert.match(deploy, /ProxyJump root@\$JUMP_HOST/);
  assert.match(deploy, /StrictHostKeyChecking yes/);
  assert.match(
    deploy,
    /rsync -rlz --chmod=D755,F644 --exclude='\*\.html' dist\/ edge:/,
  );
  assert.match(deploy, /rsync -rlz --chmod=D755,F644 --delete dist\/ edge:/);
  assert.match(deploy, /actions\/download-artifact@v4/);
  assert.doesNotMatch(
    deploy,
    /HOLT_LICENSE|BEGIN OPENSSH PRIVATE KEY|X-Holt-License/,
  );
});

test("Static artifact verification accepts public files and rejects reserved routes or secrets", () => {
  const fixture = mkdtempSync(join(tmpdir(), "systemya-static-deploy-"));
  try {
    writeFileSync(
      join(fixture, "index.html"),
      '<!doctype html><title>SystemYA</title><script src="/_astro/a.js"></script>',
    );
    const verify = () =>
      spawnSync(
        process.execPath,
        [
          new URL("../scripts/verify-static-dist.mjs", import.meta.url)
            .pathname,
          fixture,
        ],
        { encoding: "utf8" },
      );
    assert.equal(verify().status, 0);
    mkdirSync(join(fixture, "room"));
    assert.notEqual(verify().status, 0);
    rmSync(join(fixture, "room"), { recursive: true });
    writeFileSync(join(fixture, "holt-license.env"), "dummy");
    assert.notEqual(verify().status, 0);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

test("Build preserves website2 scripts without shipping the backend", () => {
  const p = JSON.parse(read("package.json"));
  assert.match(p.scripts.build, /verify-static-dist/);
  assert.match(p.scripts.prebuild, /prepare:stomp/);
  assert.doesNotMatch(p.scripts.build, /build:sdk|run-server\.js/);
  assert.ok(existsSync(new URL("../sdk/build.mjs", import.meta.url)));
  assert.ok(existsSync(new URL("../runtime.js", import.meta.url)));
});

test("Stale chunk loader reloads before retaining broken SPA state", () => {
  const layout = read("src/layouts/SystemYALayout.astro");
  assert.match(layout, /vite:preloadError/);
  assert.match(layout, /window\.location\.reload/);
  assert.match(read("src/systemya/route-pages.ts"), /Page not found/);
});
