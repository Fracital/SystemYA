/**
 * Suggestions under the browser UI's address bars (the landing's box and the toolbar's), in
 * place of the demo's TLD list, which asked the demo's own server (/suggestions) and so had
 * nothing to ask on SystemYA. scripts/prepare-powermouse.mjs bundles this into the UI frame's
 * script (frame.js) and patches pm/main.js to call systemyaSuggest() with what it knows: its tabs,
 * its bookmarks and its search engine.
 *
 * Rows: the other open tabs, the sites visited (history.ts, which this records: the patch calls
 * systemyaVisit() from pm/main.js's recordUrl, each time a tab reaches a page), the bookmarks,
 * SystemYA's pages and the engine's completions. The look is the UI's own `.suggestions` /
 * `.auto-fill` dropdown. The UI's menu gets "Clear history".
 */
import { routeHref } from "../routes.ts";
import { attachOmnibox, HEADERS, HINTS } from "./box.ts";
import { clearHistory, loadVisits, recordVisit } from "./history.ts";
import {
  hostOf,
  urlMatch,
  type GroupKey,
  type PickParts,
  type Suggestion,
} from "./rank.ts";
import {
  bookmarksSource,
  completionsSource,
  engineFor,
  historyPicks,
  historySource,
  pagesSource,
  type Bookmark,
} from "./sources.ts";

/** A tab of pm/main.js, as far as the suggestions read it. */
interface Tab {
  icon?: unknown;
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
  /** pm/main.js's shieldIcon(name): the menu's icons, as markup. */
  icon(name: string): string;
  closeMenu(): void;
}

declare global {
  interface Window {
    systemyaSuggest?: (ui: BrowserUI) => void;
    /** pm/main.js's recordUrl: `tab` reached `url`. */
    systemyaVisit?: (tab: Tab, url: string) => void;
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

  window.systemyaVisit = (tab, url) => {
    const title = ui.title(tab);
    // tabTitle() falls back to the address, or to "New tab" before there is one
    recordVisit(tab, {
      url,
      title:
        title === url || title === ui.url(tab) || title === "New tab"
          ? ""
          : title,
      icon: tab.icon,
    });
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
        ...historySource(q, loadVisits()),
        ...bookmarksSource(q, ui.bookmarks()),
        ...pagesSource(q, goPage),
      ],
      remote: (q, signal) => completionsSource(engine, q, signal),
      picks: (): PickParts => ({
        recentGames: [],
        // pages open in a tab, the one on show included, are not offered again as sites
        ...historyPicks(loadVisits(), ui.tabs().map(ui.url)),
        openTabs: otherTabs().map((t) => tabRow(t, 1)),
      }),
      // The form's own submit opens it, as typing it and pressing Enter does.
      navigate: (s) => {
        input.value = s.url as string;
        form?.requestSubmit();
      },
      row,
      header,
    });
  });
  // The menu's "Clear history", after About; the menu's keys find every menuitem. Added once
  // pm/main.js has run: its icons are declared after the call that starts this.
  queueMicrotask(() => {
    const menu = document.getElementById("pmMenu");
    if (!menu) return;
    const item = make("button", "pmMenuItem");
    item.type = "button";
    item.setAttribute("role", "menuitem");
    item.tabIndex = -1;
    item.innerHTML = ui.icon("forget");
    item.append(make("span", undefined, "Clear history"));
    item.addEventListener("click", () => {
      ui.closeMenu();
      if (confirm("Clear the history of the sites you visited here?"))
        clearHistory();
    });
    menu.append(item);
  });
};
