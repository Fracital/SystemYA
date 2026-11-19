/**
 * What the omnibox can suggest on SystemYA, as scored rows for rank.ts (after Fracital's
 * src/libs/omni/sources.ts): SystemYA's own pages from the route book, the browser UI's bookmarks
 * (its quick links), and the search engine's completions from the edge's /api/complete. The
 * browser UI adds its open tabs and the pages they visited (ui.ts). Every source takes what it
 * reads as an argument, so the home page and the UI frame share them.
 */
import { PAGES, routeHref, type RoutePage } from "../routes.ts";
import {
  canonicalUrl,
  frecentSites,
  hostOf,
  matchScore,
  scoreUrl,
  urlMatch,
  type FrecentSite,
  type HistoryEntry,
  type PickParts,
  type Suggestion,
} from "./rank.ts";

/** Fracital's search engines (src/libs/searchEngines.ts), by the ids /api/complete takes. */
export const ENGINES = [
  { id: "duckduckgo", name: "DuckDuckGo", url: "https://duckduckgo.com/?q=" },
  { id: "google", name: "Google", url: "https://www.google.com/search?q=" },
  { id: "bing", name: "Bing", url: "https://www.bing.com/search?q=" },
  {
    id: "brave",
    name: "Brave Search",
    url: "https://search.brave.com/search?q=",
  },
  {
    id: "startpage",
    name: "Startpage",
    url: "https://www.startpage.com/do/search?q=",
  },
] as const;
export type Engine = (typeof ENGINES)[number];
export type EngineId = Engine["id"];

/** The engine a search template (`...?q=%s` or `...?q=`) belongs to, Google if none. */
export function engineFor(template: string): Engine {
  const prefix = template.replace(/%s.*$/, "");
  return ENGINES.find((engine) => engine.url === prefix) ?? ENGINES[1];
}

export const searchUrl = (engine: Engine, text: string): string =>
  engine.url + encodeURIComponent(text);

// --- The search engine's completions ---

export async function completionsSource(
  engine: Engine,
  q: string,
  signal: AbortSignal,
): Promise<Suggestion[]> {
  // Fracital's /api/complete answers for every engine (Brave with Google's completions)
  const res = await fetch(
    `/api/complete?q=${encodeURIComponent(q)}&e=${engine.id}`,
    {
      signal,
    },
  );
  if (!res.ok) return [];
  const { s } = (await res.json()) as { s?: unknown };
  return (Array.isArray(s) ? s : [])
    .filter((text): text is string => typeof text === "string")
    .map(
      (text, i) =>
        ({
          kind: "completion",
          id: `completion:${text.toLowerCase()}`,
          title: text,
          url: searchUrl(engine, text),
          displayUrl: text,
          score: 0.55 - i * 0.02,
          fill: text,
        }) satisfies Suggestion,
    );
}

// --- SystemYA's pages ---

/** Pages the box doesn't offer: the browser itself, the bookmark page and the player, which needs a game. */
const HIDDEN_PAGES = new Set<RoutePage>(["app", "bookmark", "player"]);

export const pageName = (page: RoutePage): string =>
  page === "index" ? "Home" : PAGES[page].title.replace(/ \| SystemYA$/, "");

/** `open` goes to the page; the home page and the UI frame get there differently. */
export const pagesSource = (
  q: string,
  open: (href: string) => void,
): Suggestion[] =>
  (Object.keys(PAGES) as RoutePage[])
    .filter((page) => !HIDDEN_PAGES.has(page))
    .map((page) => {
      const title = pageName(page);
      const href = routeHref(page);
      const score =
        Math.max(
          matchScore(q, title),
          matchScore(q, page),
          matchScore(q, href),
        ) * 0.9;
      return {
        kind: "page",
        id: `page:${page}`,
        title,
        subtitle: href,
        displayUrl: href,
        score,
        fill: title,
        run: () => open(href),
      } satisfies Suggestion;
    });

// --- Bookmarks, the browser UI's quick links ---

export interface Bookmark {
  url: string;
  title: string;
  icon?: string | null;
}

/** The UI's bookmark list (pm/main.js BOOKMARKS_KEY), in this origin's storage. */
const BOOKMARKS_KEY = "stomp-demo:bookmarks";

export function readBookmarks(): Bookmark[] {
  try {
    const list: unknown = JSON.parse(
      localStorage.getItem(BOOKMARKS_KEY) ?? "[]",
    );
    return Array.isArray(list)
      ? list.filter(
          (entry): entry is Bookmark => typeof entry?.url === "string",
        )
      : [];
  } catch {
    return [];
  }
}

/** Only icons this origin serves or holds: a site's own icon address would be fetched without the browser. */
export const safeIcon = (icon: unknown): string | undefined =>
  typeof icon === "string" &&
  (icon.startsWith("data:image/") || /^\/(?!\/)[\w./-]+$/.test(icon))
    ? icon
    : undefined;

export const siteRow = (
  url: string,
  title: string,
  icon: string | undefined,
  score: number,
): Suggestion => ({
  kind: "url",
  id: `url:${canonicalUrl(url)}`,
  title: title || hostOf(url),
  subtitle: hostOf(url),
  icon,
  url,
  displayUrl: url,
  score,
  fill: url,
});

export const bookmarksSource = (q: string, list: Bookmark[]): Suggestion[] =>
  list
    .filter((b) => /^https?:\/\//i.test(b.url))
    // A bookmark counts as a site the user uses, whatever history says (Fracital's quick links).
    .map((b) =>
      siteRow(
        b.url,
        b.title,
        safeIcon(b.icon),
        scoreUrl(urlMatch(q, b.url, b.title), 4.5),
      ),
    );

// --- History (history.ts), by frecency ---

/** History grouped by page; rebuilt only when the history changes. */
let frecentFor: { visits: unknown; sites: FrecentSite[] } | null = null;
const frecent = (visits: HistoryEntry[]) => {
  if (!frecentFor || frecentFor.visits !== visits)
    frecentFor = { visits, sites: frecentSites(visits) };
  return frecentFor.sites;
};

export const historySource = (
  q: string,
  visits: HistoryEntry[],
): Suggestion[] =>
  frecent(visits).map((s) =>
    siteRow(
      s.url,
      s.title,
      safeIcon(s.icon),
      scoreUrl(urlMatch(q, s.url, s.title), s.frecency),
    ),
  );

/** The empty box's sites: the latest and the most frecent, leaving out pages open in a tab. */
export function historyPicks(
  visits: HistoryEntry[],
  openUrls: string[] = [],
): Pick<PickParts, "recentSites" | "topSites"> {
  const open = new Set(openUrls.map(canonicalUrl));
  const all = frecent(visits).filter((s) => !open.has(s.canonical));
  return {
    recentSites: [...all]
      .sort((a, b) => b.lastAt - a.lastAt)
      .map((s) => siteRow(s.url, s.title, safeIcon(s.icon), 1)),
    topSites: all.map((s) => siteRow(s.url, s.title, safeIcon(s.icon), 1)),
  };
}
