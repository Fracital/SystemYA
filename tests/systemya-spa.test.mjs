import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const pages = ["index", "theatre", "support", "contact", "privacy"];

test("SystemYA 2022 routes are Astro pages", () => {
  for (const page of pages) {
    assert.ok(
      existsSync(
        new URL(`../src/systemya/snapshots/${page}.html`, import.meta.url),
      ),
    );
    assert.ok(
      existsSync(
        new URL(
          `../src/pages/${page === "index" ? "index.astro" : `${page}.astro`}`,
          import.meta.url,
        ),
      ),
    );
  }
});

test("Astro renders historical snapshots through ClientRouter", () => {
  const layout = read("src/layouts/SystemYALayout.astro");
  assert.match(layout, /ClientRouter/);
  assert.match(layout, /getSystemYASnapshot\(page\)/);
  assert.match(layout, /systemya-service-frame/);
  assert.doesNotMatch(layout, /UltravioletScripts/);
  assert.match(layout, /stomp\.css/);
});

test("navbar matches 2022 capture", () => {
  const original = read("archive/wayback-2022/SystemYA/index.html");
  const extracted = read("src/systemya/snapshots/index.html");
  for (const route of ["theatre.html", "support.html"]) {
    assert.ok(original.includes(route));
    assert.ok(extracted.includes(route));
  }
  assert.match(original, /nav-search/);
  assert.match(extracted, /nav-search/);
  assert.match(extracted, /class="search"/);
  assert.match(extracted, /class="lightswitch"/);
});

test("Astro startup still uses holyWisp, not a replacement transport", () => {
  const runtime = read("runtime.js");
  assert.match(runtime, /from "holywisp"/);
  assert.match(runtime, /handleUpgrade/);
});

test("historical CSS and branding are local", () => {
  assert.ok(
    existsSync(new URL("../public/systemya-2022/main.css", import.meta.url)),
  );
  assert.ok(
    existsSync(new URL("../public/systemya-2022/favicon.png", import.meta.url)),
  );
  const css = read("public/systemya-2022/main.css");
  assert.ok(css.includes(".omnibox"));
});

test("type-safe navbar interaction initialization", () => {
  const script = read("src/systemya/interactions.ts");
  assert.match(script, /astro:page-load/);
  assert.match(script, /systemya-theme/);
  assert.match(script, /data-typewriter/);
  assert.match(script, /openStomp/);
});
