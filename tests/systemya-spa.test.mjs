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
  // The browser is a page (/app/), not an overlay over every page.
  assert.doesNotMatch(layout, /systemya-service/);
  assert.doesNotMatch(layout, /UltravioletScripts/);
  assert.match(layout, /proxy\.css/);
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

test("every snapshot has the same navbar: Proxy link and an account icon button", () => {
  const navs = pages.map(
    (page) =>
      read(`src/systemya/snapshots/${page}.html`).match(
        /<nav\b[^>]*>[\s\S]*?<\/nav>/,
      )?.[0],
  );
  for (const nav of navs) assert.equal(nav, navs[0]);
  const nav = navs[0];
  // The browser's label reads "Proxy" through the 2022 obfuscation (only real-class letters
  // show); the markup never has the plain word.
  const real = ["G", "J", "P", "S", "W", "h", "v"];
  const label = (html) =>
    html
      .replace(/<s class="(\w)">([^<]*)<\/s>/g, (_, c, t) =>
        real.includes(c) ? t : "",
      )
      .replace(/<[^>]+>/g, "");
  const links = [
    ...nav.matchAll(
      /<a class="entry text" href="([^"]+)"><span>([\s\S]*?)<\/span><\/a>/g,
    ),
  ].map((m) => `${label(m[2])} ${m[1]}`);
  assert.deepEqual(links, [
    "Theatre /theatre.html",
    "Proxy /app/",
    "Chat /chat",
    "Support /support.html",
  ]);
  assert.doesNotMatch(nav, /proxy/i);
  assert.doesNotMatch(nav, /<span>Account<\/span>/);
  // The account button sits after the theme toggle, with an accessible name and a credited icon.
  assert.match(
    nav,
    /class="lightswitch">[\s\S]*?<\/button><!--[^>]*account_circle[^>]*Apache[^>]*--><a aria-label="Account" class="account" href="\/account\/"><svg aria-hidden="true" viewbox="0 -960 960 960"/,
  );
});

test("full-screen mode: layout prop, chat opts in, CSS hides the footer and fills main", () => {
  const layout = read("src/layouts/SystemYALayout.astro");
  assert.match(layout, /fullscreen\?: boolean/);
  assert.match(layout, /data-fullscreen=\{fullscreen \? "1" : "0"\}/);
  assert.match(layout, /shell\.css/);
  // /chat/ only: chat.astro would build /chat.html for the same route
  assert.ok(!existsSync(new URL("../src/pages/chat.astro", import.meta.url)));
  assert.match(
    read("src/pages/chat/index.astro"),
    /<SystemYALayout page="chat"[^>]*\bfullscreen\b/,
  );
  for (const page of ["index", "theatre", "support", "contact", "privacy"]) {
    const file = page === "index" ? "index.astro" : `${page}.astro`;
    assert.doesNotMatch(read(`src/pages/${file}`), /fullscreen/);
  }
  const css = read("src/systemya/shell.css");
  assert.match(
    css,
    /#root\[data-fullscreen="1"\] > footer \{\s*display: none;/,
  );
  assert.match(
    css,
    /#root\[data-fullscreen="1"\] \{[^}]*height: 100dvh;[^}]*overflow: hidden;/,
  );
  assert.match(
    css,
    /#root\[data-fullscreen="1"\] > main \{[^}]*flex: 1 1 0;[^}]*min-height: 0;/,
  );
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
  assert.match(script, /openProxy\(targetUrl\(input\.value\)\)/);
  assert.match(script, /mountProxy\(root\)/);
  assert.match(script, /^import "\.\/router";$/m);
});
