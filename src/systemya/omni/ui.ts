/**
 * Suggestions under the browser UI's address bars (the landing's box and the toolbar's), in
 * place of the demo's TLD list, which asked the demo's own server (/suggestions) and so had
 * nothing to ask on SystemYA. scripts/prepare-powermouse.mjs bundles this into the UI frame's
 * script (frame.js) and patches pm/main.js to call systemyaSuggest() with what it knows: its tabs,
 * its bookmarks and its search engine.
 *
 * Rows: the other open tabs, the pages the open tabs visited this session (the UI keeps no
 * history beyond its tabs), the bookmarks, SystemYA's pages and the engine's completions. The
 * look is the UI's own `.suggestions` / `.auto-fill` dropdown.
 */
import { routeHref } from "../routes.ts";
import { attachOmnibox, HEADERS, HINTS } from "./box.ts";
import {
  canonicalUrl,
  frecentSites,
  hostOf,
  scoreUrl,
  urlMatch,
  type GroupKey,
  type HistoryEntry,
  type PickParts,
  type Suggestion,
} from "./rank.ts";
import {
  bookmarksSource,
  completionsSource,
  engineFor,
  pagesSource,
  siteRow,
  type Bookmark,
} from "./sources.ts";

/** A tab of pm/main.js, as far as the suggestions read it. */
interface Tab {
  history?: unknown;
}

/** What pm/main.js hands over (the call its patch adds). */
interface BrowserUI {
  /** The landing's box (a new tab), then the toolbar's (the tab on show). */
  inputs: [HTMLInputElement, HTMLInputElement];
  tabs(): Tab[];
  active(): Tab | null;
  activate(tab: Tab): void;
  title(tab: Tab): string;
  url(tab: Tab): string;
  bookmarks(): Bookmark[];
  /** SearchBuilder's template, `...?q=%s`. */
  search: string;
  /** What the box's submit opens for a text (SearchBuilder.query). */
  query(text: string): string;
}

declare global {
  interface Window {
    systemyaSuggest?: (ui: BrowserUI) => void;
  }
}

const isWeb = (url: string) => /^https?:\/\//i.test(url);

const STYLE = `
.suggestions .omni-head{padding:.35rem .75rem .15rem;font:600 11px 'Roboto',sans-serif;letter-spacing:.04em;text-transform:uppercase;color:#8a939b;border-top:1px solid #eee;cursor:default;user-select:none}
.suggestions .omni-head:first-child{border-top:0}
.suggestions .omni-head+.auto-fill{border-top:0}
.suggestions .auto-fill{display:flex;align-items:center;gap:.6rem}
.suggestions .auto-fill[data-hover]{background:#e8f1fb;color:#1a3d5c}
.suggestions .auto-fill img{width:16px;height:16px;flex:none;object-fit:contain}
.suggestions .omni-text{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.suggestions .omni-sub{margin-left:.5rem;font-size:13px;color:#8a939b}
.suggestions .omni-hint{flex:none;font-size:12px;color:#8a939b}
`;

function make<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

window.systemyaSuggest = (ui) => {
  const engine = engineFor(ui.search);
  document.head.append(make("style", undefined, STYLE));

  /** The open tabs' pages, each tab's latest last; the UI keeps them for Back and Forward. */
  const visits = (): HistoryEntry[] => {
    const now = Date.now();
    const out: HistoryEntry[] = [];
    for (const tab of ui.tabs()) {
      const list = Array.isArray(tab.history)
        ? tab.history.filter((u): u is string => typeof u === "string")
        : [];
      const shown = ui.url(tab);
      list.forEach((url, i) =>
        out.push({
          url,
          title: url === shown ? ui.title(tab) : "",
          at: now - (list.length - i),
        }),
      );
    }
    return out;
  };

  const tabRow = (tab: Tab, score: number): Suggestion => {
    const url = ui.url(tab);
    return {
      kind: "tab",
      id: `tab:${ui.tabs().indexOf(tab)}`,
      title: ui.title(tab) || hostOf(url),
      subtitle: hostOf(url),
      url,
      score,
      fill: url,
      run: () => ui.activate(tab),
    };
  };

  const goPage = (href: string) => (window.top ?? window).location.assign(href);

  const row = (s: Suggestion): HTMLElement => {
    const el = make("div", "auto-fill ns");
    if (typeof s.icon === "string") {
      const img = make("img");
      img.src = s.icon;
      img.alt = "";
      img.addEventListener("error", () => img.remove());
      el.append(img);
    }
    const text = make("span", "omni-text");
    if (s.id === "default" && s.kind === "search")
      text.append(`Search ${engine.name} for “${s.title}”`);
    else if (s.id === "default") text.append(`Go to ${s.title}`);
    else {
      // The site's or page's name and its host: data values.
      text.append(s.title);
      if (s.subtitle) text.append(make("span", "omni-sub", s.subtitle));
    }
    el.append(text, make("span", "omni-hint", HINTS[s.kind]));
    return el;
  };

  const header = (key: GroupKey): HTMLElement | null => {
    const text = HEADERS[key];
    if (!text) return null;
    const el = make("div", "omni-head", text);
    el.setAttribute("role", "presentation");
    return el;
  };

  ui.inputs.forEach((input, i) => {
    const addressBar = i === 1;
    /** The landing opens a new tab, so every tab is another; the toolbar's tab is the one on show. */
    const otherTabs = () => {
      const active = addressBar ? ui.active() : null;
      return ui.tabs().filter((t) => t !== active && isWeb(ui.url(t)));
    };
    const container = input.parentElement as HTMLElement;
    const list = make("div", "suggestions");
    container.append(list);
    const form = input.form;

    attachOmnibox({
      input,
      list,
      toUrl: (q) => ui.query(q),
      searchPrefix: engine.url,
      typedOnly: addressBar,
      local: (q) => [
        ...otherTabs().map((t) =>
          tabRow(t, urlMatch(q, ui.url(t), ui.title(t)) * 1.05),
        ),
        ...frecentSites(visits()).map((s) =>
          siteRow(
            s.url,
            s.title,
            undefined,
            scoreUrl(urlMatch(q, s.url, s.title), s.frecency),
          ),
        ),
        ...bookmarksSource(q, ui.bookmarks()),
        ...pagesSource(q, goPage),
      ],
      remote: (q, signal) => completionsSource(engine, q, signal),
      picks: (): PickParts => {
        const others = otherTabs();
        // Pages open in a tab, the one on show included, are not offered again as sites.
        const open = new Set(ui.tabs().map((t) => canonicalUrl(ui.url(t))));
        const all = frecentSites(visits()).filter(
          (s) => !open.has(s.canonical),
        );
        return {
          recentGames: [],
          recentSites: [...all]
            .sort((a, b) => b.lastAt - a.lastAt)
            .map((s) => siteRow(s.url, s.title, undefined, 1)),
          topSites: all.map((s) => siteRow(s.url, s.title, undefined, 1)),
          openTabs: others.map((t) => tabRow(t, 1)),
        };
      },
      // The form's own submit opens it, as typing it and pressing Enter does.
      navigate: (s) => {
        input.value = s.url as string;
        form?.requestSubmit();
      },
      row,
      header,
    });
  });
};
