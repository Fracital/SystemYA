/**
 * Suggestions under the 2022 search boxes (the home page's and the navbar's `form.omnibox`):
 * SystemYA's pages, the browser's bookmarks and Google's completions, ranked as Fracital's
 * omnibox ranks them (box.ts). The list hangs under the box in the look of the Theatre's search
 * suggestions, which follow the 2022 omnibox (theatre.css, omni.css). The 2022 boxes search
 * Google, so the completions are Google's.
 */
import { navigate } from "astro:transitions/client";
import { attachOmnibox, HEADERS, HINTS, type Omnibox } from "./box.ts";
import type { GroupKey, Suggestion } from "./rank.ts";
import {
  bookmarksSource,
  completionsSource,
  ENGINES,
  pagesSource,
  readBookmarks,
} from "./sources.ts";

export const HOME_ENGINE = ENGINES[1];

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

/** A Material Icons ligature from the 2022 icon font. */
const glyph = (name: string) => {
  const node = make("span", "material-icons", name);
  node.setAttribute("aria-hidden", "true");
  return node;
};

const GLYPHS: Record<Suggestion["kind"], string> = {
  url: "public",
  tab: "tab",
  page: "web_asset",
  game: "videogame_asset",
  song: "music_note",
  artist: "person",
  search: "search",
  completion: "search",
};

/** The typed text in bold where the row starts with it, as the Theatre's suggestions show it. */
function label(text: string, query: string): HTMLElement {
  const node = make("span", "systemya-omni-title");
  if (query && text.toLowerCase().startsWith(query.toLowerCase())) {
    node.append(make("b", undefined, text.slice(0, query.length)));
    node.append(text.slice(query.length));
  } else node.append(text);
  return node;
}

function row(s: Suggestion, query: string): HTMLElement {
  const el = make("div", "systemya-omni-row");
  if (typeof s.icon === "string") {
    const img = make("img", "systemya-omni-icon");
    img.src = s.icon;
    img.alt = "";
    img.setAttribute("aria-hidden", "true");
    img.addEventListener("error", () => img.replaceWith(glyph(GLYPHS[s.kind])));
    el.append(img);
  } else el.append(glyph(GLYPHS[s.kind]));
  const text = make("span", "systemya-omni-text");
  if (s.id === "default" && s.kind === "search")
    text.append(`Search ${HOME_ENGINE.name} for “`, label(s.title, ""), "”");
  else if (s.id === "default") text.append("Go to ", label(s.title, ""));
  else {
    // The site's or page's name and its host or address: data values.
    text.append(label(s.title, s.kind === "completion" ? query : ""));
    if (s.subtitle)
      text.append(make("span", "systemya-omni-subtitle", s.subtitle));
  }
  el.append(text, make("span", "systemya-omni-hint", HINTS[s.kind]));
  return el;
}

function header(key: GroupKey): HTMLElement | null {
  const text = HEADERS[key];
  if (!text) return null;
  const el = make("div", "systemya-omni-header", text);
  el.setAttribute("role", "presentation");
  return el;
}

/**
 * Give the 2022 box `form` its suggestions. `toUrl` is what the form's submit opens for a text;
 * `openUrl` opens a site the way the submit does.
 */
export function mountOmnibox(
  form: HTMLFormElement,
  toUrl: (q: string) => string,
  openUrl: (url: string) => void,
): Omnibox | null {
  const input = form.querySelector<HTMLInputElement>("input");
  if (!input) return null;
  // The 2022 boxes name an empty <datalist>; the list below takes its place.
  input.removeAttribute("list");
  const list = make("div", "systemya-omni");
  form.append(list);
  return attachOmnibox({
    input,
    list,
    toUrl,
    searchPrefix: HOME_ENGINE.url,
    local: (q) => [
      ...bookmarksSource(q, readBookmarks()),
      ...pagesSource(q, (href) => void navigate(href)),
    ],
    remote: (q, signal) => completionsSource(HOME_ENGINE, q, signal),
    navigate: (s) => openUrl(s.url as string),
    row,
    header,
    toggled: (open) => form.toggleAttribute("data-suggested", open),
  });
}
