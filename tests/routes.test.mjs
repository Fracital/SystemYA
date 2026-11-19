import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import {
  BOOK,
  OLD_PATHS,
  PAGES,
  TABLE,
  bookHref,
  bookLinks,
  entryScript,
  locate,
  routeHref,
  routeQuery,
  routeTable,
} from "../src/systemya/routes.ts";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

// The book as first written. A number keeps its page for good: this list only grows.
const FIRST = [
  [1, "theatre"],
  [2, "app"],
  [3, "chat"],
  [4, "support"],
  [5, "contact"],
  [6, "privacy"],
  [7, "account"],
  [8, "bookmark"],
  [9, "player"],
];

test("the book's numbers are unique, increasing and never move", () => {
  let last = 0;
  for (const route of BOOK) {
    assert.ok(Number.isInteger(route.n) && route.n > last, `${route.n}`);
    last = route.n;
    assert.match(route.since, /^\d{4}-\d{2}-\d{2}$/);
    if (route.retired) {
      assert.match(route.retired, /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(route.retired >= route.since, `${route.n} retired early`);
    }
  }
  assert.deepEqual(
    BOOK.slice(0, FIRST.length).map((route) => [route.n, route.page]),
    FIRST,
  );
});

test("every page has exactly one live number, and every page is in the book", () => {
  const source = read("src/systemya/snapshot.ts");
  const union = /export type SystemYAPage =([^;]+);/.exec(source)[1];
  const pages = [...union.matchAll(/"(\w+)"/g)].map((m) => m[1]).sort();
  assert.deepEqual(Object.keys(PAGES).sort(), pages);
  assert.deepEqual(Object.keys(OLD_PATHS).sort(), pages);
  for (const page of pages.filter((page) => page !== "index")) {
    const live = BOOK.filter((route) => route.page === page && !route.retired);
    assert.equal(live.length, 1, page);
    assert.equal(locate(TABLE, "/", `?${live[0].n}`, "").page, page);
  }
});

test("each page file passes the book's title and full-screen flag", () => {
  const files = {
    index: "index.astro",
    theatre: "theatre.astro",
    app: "app/index.astro",
    chat: "chat/index.astro",
    support: "support.astro",
    contact: "contact.astro",
    privacy: "privacy.astro",
    account: "account/index.astro",
    bookmark: "bookmark.astro",
    player: "player.astro",
  };
  for (const [page, file] of Object.entries(files)) {
    const astro = read(`src/pages/${file}`);
    assert.match(astro, new RegExp(`page="${page}"`), file);
    assert.match(astro, new RegExp(`title="${PAGES[page].title}"`), file);
    assert.equal(/\bfullscreen\b/.test(astro), PAGES[page].fullscreen, file);
  }
});

test("a retired number shows not-found and is never given out again", () => {
  const book = [
    { n: 1, page: "theatre", since: "2026-11-18", retired: "2026-12-01" },
    { n: 2, page: "chat", since: "2026-11-18" },
    { n: 3, page: "theatre", since: "2026-12-01" },
  ];
  const table = routeTable(book);
  assert.deepEqual(locate(table, "/", "?1", ""), {
    page: "not-found",
    href: null,
  });
  assert.equal(locate(table, "/", "?3", "").page, "theatre");
  assert.equal(routeHref("theatre", "", table), "/?3");
  assert.equal(locate(table, "/theatre.html", "", "").href, "/?3");
});

test("addresses: numbers, extra state, unknown numbers and other paths", () => {
  const at = (path, search = "", hash = "") =>
    locate(TABLE, path, search, hash);
  assert.deepEqual(at("/"), { page: "index", href: "/" });
  assert.deepEqual(at("/", "?1&category=action&q=mario&page=2"), {
    page: "theatre",
    href: "/?1&category=action&q=mario&page=2",
  });
  assert.deepEqual(at("/", "?2", "#aGVsbG8"), {
    page: "app",
    href: "/?2#aGVsbG8",
  });
  assert.equal(at("/", "?1=").href, "/?1");
  for (const search of ["?10", "?0", "?01", "?999"])
    assert.deepEqual(at("/", search), { page: "not-found", href: null });
  assert.deepEqual(at("/nope"), { page: "not-found", href: null });
  assert.deepEqual(at("/room/"), { page: "not-found", href: null });
  // home keeps a query that names no page
  assert.deepEqual(at("/", "?q=x"), { page: "index", href: "/?q=x" });
});

test("old paths become their number and keep their query and fragment", () => {
  const cases = {
    "/theatre.html?category=action&page=2#top":
      "/?1&category=action&page=2#top",
    "/theatre.html": "/?1",
    "/app/#aGVsbG8": "/?2#aGVsbG8",
    "/chat": "/?3",
    "/chat/": "/?3",
    "/chat.html": "/?3",
    "/support.html": "/?4",
    "/contact.html": "/?5",
    "/privacy.html": "/?6",
    "/privacy": "/?6",
    "/account/?reset=1&token=abc.def": "/?7&reset=1&token=abc.def",
    "/account/?verified=1": "/?7&verified=1",
    "/account/?error=INVALID_TOKEN": "/?7&error=INVALID_TOKEN",
    "/account/?oauth=ok": "/?7&oauth=ok",
    "/bookmark.html": "/?8",
    "/player.html#aGVsbG8": "/?9#aGVsbG8",
    "/index.html": "/",
  };
  for (const [from, to] of Object.entries(cases)) {
    const url = new URL(from, "https://systemya.fracit.al");
    assert.equal(locate(TABLE, url.pathname, url.search, url.hash).href, to);
    assert.equal(bookHref(from), to, from);
  }
});

test("routeHref, routeQuery and link translation", () => {
  assert.equal(routeHref("index"), "/");
  assert.equal(routeHref("theatre"), "/?1");
  assert.equal(routeHref("theatre", "q=mario"), "/?1&q=mario");
  assert.equal(
    routeHref("theatre", new URLSearchParams({ category: "a b" })),
    "/?1&category=a+b",
  );
  assert.equal(routeHref("app"), "/?2");
  assert.equal(routeQuery("?7&reset=1&token=x"), "reset=1&token=x");
  assert.equal(routeQuery("?reset=1"), "reset=1");
  assert.equal(routeQuery(""), "");
  assert.equal(bookHref("https://example.com/theatre.html"), null);
  assert.equal(bookHref("//example.com/"), null);
  assert.equal(bookHref("/systemya-2022/main.css"), null);
  assert.equal(
    bookLinks(
      '<a href="/theatre.html">T</a><a class="x" href="/app/">P</a><a href="/account/?a=1&amp;b=2">A</a><a href="https://github.com/x">G</a><link href="/systemya-2022/main.css">',
    ),
    '<a href="/?1">T</a><a class="x" href="/?2">P</a><a href="/?7&amp;a=1&amp;b=2">A</a><a href="https://github.com/x">G</a><link href="/systemya-2022/main.css">',
  );
  // no snapshot link leads to an old path once translated
  for (const name of ["index", "theatre", "support", "contact", "privacy"]) {
    const html = bookLinks(read(`src/systemya/snapshots/${name}.html`));
    for (const [, href] of html.matchAll(/\shref="(\/[^"]*)"/g))
      assert.ok(href === "/" || /^\/\?\d/.test(href) || /\./.test(href), href);
  }
});

/** A page with the layout's #root and page templates, enough for the entry script. */
function fakePage(path) {
  const url = new URL(path, "https://systemya.fracit.al");
  const templates = Object.fromEntries(
    [...Object.keys(PAGES), "not-found"].map((page) => [
      page,
      {
        innerHTML: `<main>${page}</main>`,
        dataset: {
          page,
          title: PAGES[page]?.title ?? "SystemYA",
          fullscreen: PAGES[page]?.fullscreen ? "1" : "0",
        },
      },
    ]),
  );
  const root = { innerHTML: "<main>served</main>", dataset: { page: "home" } };
  const document = {
    title: "SystemYA",
    getElementById: (id) =>
      id === "root"
        ? root
        : id === "systemya-pages"
          ? {
              querySelector: (selector) =>
                templates[/data-page="([\w-]+)"/.exec(selector)[1]] ?? null,
            }
          : null,
  };
  const replaced = [];
  const context = {
    document,
    location: { pathname: url.pathname, search: url.search, hash: url.hash },
    history: {
      state: null,
      replaceState: (_state, _title, href) => replaced.push(href),
    },
  };
  vm.runInNewContext(entryScript(), context);
  return { root, document, replaced };
}

test("the inline entry script shows the page the address names", () => {
  let page = fakePage("/?1&category=action");
  assert.equal(page.root.dataset.page, "theatre");
  assert.equal(page.root.innerHTML, "<main>theatre</main>");
  assert.equal(page.document.title, "Theatre | SystemYA");
  assert.deepEqual(page.replaced, []);

  page = fakePage("/account/?reset=1&token=x");
  assert.equal(page.root.dataset.page, "account");
  assert.deepEqual(page.replaced, ["/?7&reset=1&token=x"]);

  page = fakePage("/?3");
  assert.equal(page.root.dataset.fullscreen, "1");

  page = fakePage("/?42");
  assert.equal(page.root.dataset.page, "not-found");
  assert.deepEqual(page.replaced, []);

  page = fakePage("/");
  assert.equal(page.root.innerHTML, "<main>served</main>");
});

test("the layout carries the book: templates on /, the entry script, links in book form", () => {
  const layout = read("src/layouts/SystemYALayout.astro");
  assert.match(layout, /bookLinks\(getSystemYASnapshot\(page\)\)/);
  assert.match(layout, /page === "index" \? pageTemplates\(\) : \[\]/);
  assert.match(layout, /<div id="systemya-pages" hidden>/);
  assert.match(layout, /<script is:inline set:html=\{entry\} \/>/);
  // the entry script runs before the obfuscation rules go into #root's <style>
  assert.ok(layout.indexOf("set:html={entry}") < layout.indexOf("data-rules"));
  const proxy = read("src/systemya/proxy.ts");
  assert.match(proxy, /export const APP_PATH = routeHref\("app"\);/);
  assert.match(
    read("src/systemya/theatre.ts"),
    /routeHref\("theatre", search\)/,
  );
  assert.match(read("src/systemya/chat-links.ts"), /routeHref\(/);
});
