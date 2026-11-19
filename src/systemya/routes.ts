/**
 * The route book: every page of the site has a number, and its address is that number on "/"
 * (`/?1`, `/?2`, ...), so no address names a page. Extra state follows the number
 * (`/?1&category=action`, `/?2#<fragment>`). "/" is home.
 *
 * Rules for the book:
 * - A new page takes the next number after the highest one in the book, retired ones included.
 * - A removed page keeps its line with `retired` set; its number is never given out again, and
 *   its address shows the not-found page.
 * - A number never moves to another page.
 *
 * The edge serves index.html for every one of these addresses, and every built page carries
 * every other page (SystemYALayout.astro), so any address renders from any entry. The old
 * paths (`/theatre.html`, `/account/`, ...) are still built and still work: they turn into
 * their number on load, keeping their query and fragment.
 *
 * This file has no imports, so the tests and the layout's inline entry script can use it as is.
 */

export type RoutePage =
  | "index"
  | "theatre"
  | "app"
  | "chat"
  | "support"
  | "contact"
  | "privacy"
  | "account"
  | "bookmark"
  | "player";

export interface Route {
  /** the address is `/?<n>` */
  n: number;
  page: Exclude<RoutePage, "index">;
  /** the day the number was given out */
  since: string;
  /** the day the page was removed; the number stays taken */
  retired?: string;
}

export const BOOK: readonly Route[] = [
  { n: 1, page: "theatre", since: "2026-11-18" },
  { n: 2, page: "app", since: "2026-11-18" },
  { n: 3, page: "chat", since: "2026-11-18" },
  { n: 4, page: "support", since: "2026-11-18" },
  { n: 5, page: "contact", since: "2026-11-18" },
  { n: 6, page: "privacy", since: "2026-11-18" },
  { n: 7, page: "account", since: "2026-11-18" },
  { n: 8, page: "bookmark", since: "2026-11-18" },
  { n: 9, page: "player", since: "2026-11-19" },
];

/** What each page shows in the tab, and whether it fills the window under the navbar. */
export const PAGES: Record<RoutePage, { title: string; fullscreen: boolean }> =
  {
    index: { title: "SystemYA", fullscreen: false },
    theatre: { title: "Theatre | SystemYA", fullscreen: false },
    app: { title: "SystemYA", fullscreen: true },
    chat: { title: "Chat | SystemYA", fullscreen: true },
    support: { title: "Support | SystemYA", fullscreen: false },
    contact: { title: "Contact | SystemYA", fullscreen: false },
    privacy: { title: "Privacy | SystemYA", fullscreen: false },
    account: { title: "Account | SystemYA", fullscreen: false },
    bookmark: { title: "SystemYA", fullscreen: false },
    player: { title: "SystemYA", fullscreen: true },
  };

/**
 * The paths each page had before the book (and their spellings without the extension or the
 * slash). They lead to the page's number. "/" is the shell every number is served from.
 */
export const OLD_PATHS: Record<RoutePage, readonly string[]> = {
  index: ["/", "/index.html"],
  theatre: ["/theatre.html", "/theatre"],
  app: ["/app/", "/app", "/app/index.html"],
  chat: ["/chat/", "/chat", "/chat.html", "/chat/index.html"],
  support: ["/support.html", "/support"],
  contact: ["/contact.html", "/contact"],
  privacy: ["/privacy.html", "/privacy"],
  account: ["/account/", "/account", "/account/index.html"],
  bookmark: ["/bookmark.html", "/bookmark"],
  player: ["/player.html", "/player"],
};

/** The book as the browser needs it: live numbers to pages, and paths to pages. */
export interface RouteTable {
  numbers: Record<string, RoutePage>;
  paths: Record<string, RoutePage>;
}

export function routeTable(book: readonly Route[] = BOOK): RouteTable {
  const numbers: Record<string, RoutePage> = {};
  for (const route of book)
    if (!route.retired) numbers[String(route.n)] = route.page;
  const paths: Record<string, RoutePage> = {};
  for (const [page, list] of Object.entries(OLD_PATHS))
    for (const path of list) paths[path] = page as RoutePage;
  return { numbers, paths };
}

export const TABLE = routeTable();

export interface Located {
  /** the page to show; "not-found" for an unknown or retired number, or a path that is no page */
  page: RoutePage | "not-found";
  /** the address the page should have (`/?N&...#...`), or null to leave the address alone */
  href: string | null;
}

/**
 * Which page an address shows, and its address in the book's form. Self-contained (it is also
 * inlined into every page as the entry script), so it uses nothing but its arguments.
 */
export function locate(
  table: RouteTable,
  pathname: string,
  search: string,
  hash: string,
): Located {
  const own = (object: object, key: string) =>
    Object.prototype.hasOwnProperty.call(object, key);
  const parts = search
    .replace(/^\?/, "")
    .split("&")
    .filter((part) => part !== "");
  if (!own(table.paths, pathname)) return { page: "not-found", href: null };
  let page: RoutePage = table.paths[pathname];
  if (page === "index") {
    const number = /^(\d+)=?$/.exec(parts[0] || "");
    if (number) {
      if (!own(table.numbers, number[1]))
        return { page: "not-found", href: null };
      page = table.numbers[number[1]];
      parts.shift();
    }
  }
  let n = "";
  for (const key of Object.keys(table.numbers))
    if (table.numbers[key] === page) n = key;
  const query = (n ? [n].concat(parts) : parts).join("&");
  return { page, href: "/" + (query ? "?" + query : "") + hash };
}

/**
 * Put `page` into `doc`'s #root from the page templates the layout writes into every page.
 * Self-contained like locate(): the entry script runs it on the live document, the router on the
 * document it builds for a navigation.
 */
export function show(doc: Document, page: string): void {
  const root = doc.getElementById("root");
  const pages = doc.getElementById("systemya-pages");
  if (!root || !pages) return;
  const shown = page === "index" ? "home" : page;
  if (root.dataset.page === shown) return;
  const source = (pages.querySelector(`template[data-page="${page}"]`) ||
    pages.querySelector(
      'template[data-page="not-found"]',
    )) as HTMLTemplateElement | null;
  if (!source) return;
  root.innerHTML = source.innerHTML;
  root.dataset.page =
    source.dataset.page === "index" ? "home" : source.dataset.page;
  root.dataset.fullscreen = source.dataset.fullscreen || "0";
  doc.title = source.dataset.title || "SystemYA";
}

/** Run once, inline, while the page parses: show the page the address names, in its book form. */
export function enter(
  locateRoute: typeof locate,
  showRoute: typeof show,
  table: RouteTable,
): void {
  const here = location.pathname + location.search + location.hash;
  const at = locateRoute(
    table,
    location.pathname,
    location.search,
    location.hash,
  );
  showRoute(document, at.page);
  if (at.href !== null && at.href !== here)
    history.replaceState(history.state, "", at.href);
}

/** The inline entry script: enter() with locate(), show() and the table, as source text. */
export function entryScript(table: RouteTable = TABLE): string {
  return `(${enter.toString()})(${locate.toString()},${show.toString()},${JSON.stringify(table)});`;
}

/**
 * The address of `page`, with `query` (no leading "?" or "&") after the number:
 * routeHref("theatre", "q=mario") is "/?1&q=mario", routeHref("index") is "/".
 */
export function routeHref(
  page: RoutePage,
  query: string | URLSearchParams = "",
  table: RouteTable = TABLE,
): string {
  const rest = String(query).replace(/^[?&]/, "");
  let n = "";
  for (const key of Object.keys(table.numbers))
    if (table.numbers[key] === page) n = key;
  if (page !== "index" && !n) throw new Error(`No live route for ${page}`);
  const all = [n, rest].filter(Boolean).join("&");
  return all ? `/?${all}` : "/";
}

/** The query without the route number: routeQuery("?7&reset=1") is "reset=1". */
export function routeQuery(search: string): string {
  const parts = search
    .replace(/^\?/, "")
    .split("&")
    .filter((part) => part !== "");
  if (/^\d+=?$/.test(parts[0] || "")) parts.shift();
  return parts.join("&");
}

/**
 * A same-origin link's address in the book's form ("/theatre.html" is "/?1"), or null when it
 * leads to no page (another origin, /room/, a file).
 */
export function bookHref(
  href: string,
  table: RouteTable = TABLE,
): string | null {
  if (!href.startsWith("/") || href.startsWith("//")) return null;
  const url = new URL(href, "https://systemya.invalid");
  const at = locate(table, url.pathname, url.search, url.hash);
  return at.page === "not-found" ? null : at.href;
}

/** Every `href="/..."` in `html` that leads to a page, in the book's form. */
export function bookLinks(html: string, table: RouteTable = TABLE): string {
  return html.replace(/(\shref=")(\/[^"]*)"/g, (whole, lead, href) => {
    const next = bookHref(String(href).replace(/&amp;/g, "&"), table);
    return next === null ? whole : `${lead}${next.replace(/&/g, "&amp;")}"`;
  });
}
