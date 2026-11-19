import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import {
  engineFor,
  pagesSource,
  safeIcon,
  searchUrl,
} from "../src/systemya/omni/sources.ts";
import { applyPatches, patches } from "../scripts/prepare-powermouse.mjs";

test("the box's engine comes from the UI's search template, Google if unknown", () => {
  assert.equal(engineFor("https://search.brave.com/search?q=%s").id, "brave");
  assert.equal(engineFor("https://example.com/?q=%s").id, "google");
  assert.equal(
    searchUrl(engineFor("https://www.google.com/search?q="), "a b"),
    "https://www.google.com/search?q=a%20b",
  );
});

test("pages come from the route book, without the browser, the bookmark page or the player", () => {
  const rows = pagesSource("the", () => {});
  const theatre = rows.find((r) => r.id === "page:theatre");
  assert.equal(theatre.title, "Theatre");
  assert.equal(theatre.subtitle, "/?1");
  assert.ok(theatre.score > 0);
  assert.equal(rows.find((r) => r.id === "page:index").title, "Home");
  for (const hidden of ["app", "bookmark", "player"])
    assert.ok(!rows.some((r) => r.id === `page:${hidden}`), hidden);
});

test("only icons of this origin or data URLs are shown", () => {
  assert.equal(safeIcon("/ui/icons/a.png"), "/ui/icons/a.png");
  assert.equal(
    safeIcon("data:image/png;base64,AA"),
    "data:image/png;base64,AA",
  );
  assert.equal(safeIcon("//evil.example/a.png"), undefined);
  assert.equal(safeIcon("https://site.example/favicon.ico"), undefined);
});

const mainJs = new URL(
  "../vendor/powermouse/demo/public/pm/main.js",
  import.meta.url,
);
test(
  "the UI's address bars are handed to SystemYA's suggestions",
  { skip: !existsSync(mainJs) && "vendor/powermouse is not checked out" },
  async () => {
    const table = patches({
      directory: "/vendor/rt/",
      ui: "/ui/",
      files: { "error.html": "er.x.html" },
      runtime: {
        transport: { epoxy: "e.js", h3: "h.js", libcurl: "l.js" },
        page: { script: "c.js", search: "s.js" },
        assets: { serviceWorker: "sw.x.js" },
      },
      names: { error: "$x" },
    });
    const js = applyPatches(
      "pm/main.js",
      await readFile(mainJs, "utf8"),
      table["pm/main.js"],
    );
    assert.match(
      js,
      /window\.systemyaSuggest\(\{\n\t\tinputs: \[mainForm\.url, omni\.url\]/,
    );
    assert.doesNotMatch(js, /^attachSuggestions\(/m);
  },
);
