import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";

const here = new URL("../", import.meta.url);
const run = (script) =>
  spawnSync(process.execPath, [new URL(script, here).pathname], {
    encoding: "utf8",
  });

test("verified upstream website2 script suite has not drifted", () => {
  const result = run("scripts/verify-website2-structure.mjs");
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test("verified 2022 asset content is not modified", () => {
  const result = run("scripts/verify-systemya-archive.mjs");
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test("no invented standalone SPA replaces the Astro pages", () => {
  const pkg = JSON.parse(readFileSync(new URL("package.json", here), "utf8"));
  assert.match(pkg.scripts.dev, /^astro dev/);
  assert.match(pkg.scripts.build, /astro build/);
  assert.ok(existsSync(new URL("src/systemya/snapshots/theatre.html", here)));
  assert.ok(existsSync(new URL("src/pages/theatre.astro", here)));
});

test("upstream license and SystemYA ISC license are separate", () => {
  const upstream = readFileSync(new URL("LICENSE", here), "utf8");
  const systemya = readFileSync(new URL("LICENSE-SYSTEMYA", here), "utf8");
  assert.match(upstream, /Holy Unblocker/);
  assert.match(systemya, /Copyright \(c\) 2026 David Reed/);
});
