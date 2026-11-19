/**
 * The omnibox's behaviour without a framework (Fracital's useOmniSuggestions and useOmniBox), for
 * SystemYA's home page and navbar boxes (home.ts) and the browser UI's address bars (ui.ts).
 *
 * Local rows rank at once; the remote ones (the engine's completions) come after a short pause,
 * one request in flight, and a late answer for an older query is dropped. The empty box gets top
 * picks. Arrows move (from "nothing" down to the first row, up to the last), Enter opens the
 * highlighted row and otherwise leaves the form to submit as it did, Tab fills the box with the
 * row's text, Escape closes, hovering highlights. The input keeps the focus and names the
 * highlighted option (aria-activedescendant); each box keeps its own markup and draws its rows.
 */
import {
  rankAndGroup,
  topPicks,
  type GroupKey,
  type PickParts,
  type RankOptions,
  type Ranked,
  type Suggestion,
} from "./rank.ts";

const REMOTE_DELAY_MS = 250;
const REMOTE_MIN_CHARS = 2;
const EMPTY: Ranked = { groups: [], rows: [] };

export const HEADERS: Partial<Record<GroupKey, string>> = {
  tab: "Open tabs",
  url: "Sites",
  page: "Pages",
  game: "Games",
  completion: "Search suggestions",
  jump: "Jump back in",
  top: "Top sites",
};
export const HINTS: Record<Suggestion["kind"], string> = {
  tab: "Switch to tab",
  url: "Open",
  page: "Open",
  game: "Play",
  song: "Play",
  artist: "Open",
  search: "Search",
  completion: "Search",
};

export interface OmniOptions {
  input: HTMLInputElement;
  /** Emptied and refilled with the headers and rows; closed, it is empty. */
  list: HTMLElement;
  /** What the default row opens: the address as typed, or the engine's results for it. */
  toUrl(q: string): string;
  /** The engine's results page before the query: toUrl(q) starting with it means q is a search. */
  searchPrefix: string;
  local(q: string): Suggestion[];
  remote?(q: string, signal: AbortSignal): Promise<Suggestion[]>;
  /** The empty box's rows. */
  picks?(): PickParts;
  /**
   * Suggest for what was typed since the focus, not for the text the box already shows (an
   * address bar showing the page's address). Otherwise the box's text is the query.
   */
  typedOnly?: boolean;
  /** Open a row that has a URL and no action of its own. */
  navigate(row: Suggestion): void;
  row(row: Suggestion, query: string): HTMLElement;
  header?(key: GroupKey): HTMLElement | null;
  /** The list opened or closed. */
  toggled?(open: boolean): void;
}

export interface Omnibox {
  /** Rank again, after something a source reads has changed. */
  refresh(): void;
  destroy(): void;
}

let boxes = 0;

export function attachOmnibox(o: OmniOptions): Omnibox {
  const { input, list } = o;
  const listId = list.id || `omni-${++boxes}`;
  list.id = listId;
  list.setAttribute("role", "listbox");
  input.setAttribute("role", "combobox");
  input.setAttribute("aria-autocomplete", "list");
  input.setAttribute("aria-controls", listId);
  input.setAttribute("aria-expanded", "false");
  input.autocomplete = "off";
  input.spellcheck = false;

  let enabled = false;
  let closed = false;
  let query = "";
  let index = -1;
  let ranked = EMPTY;
  let elements: HTMLElement[] = [];
  let remote: { forQuery: string; rows: Suggestion[] } | null = null;
  let controller: AbortController | null = null;
  let timer: number | undefined;
  let wasOpen = false;

  const rankOptions = (q: string): RankOptions => {
    const url = o.toUrl(q);
    return { urlLike: !url.startsWith(o.searchPrefix), defaultUrl: url };
  };
  const isOpen = () => enabled && !closed && ranked.rows.length > 0;

  const highlight = () => {
    elements.forEach((el, i) => {
      el.toggleAttribute("data-hover", i === index);
      el.setAttribute("aria-selected", String(i === index));
    });
    if (isOpen() && index >= 0 && elements[index]) {
      input.setAttribute("aria-activedescendant", elements[index].id);
      elements[index].scrollIntoView?.({ block: "nearest" });
    } else input.removeAttribute("aria-activedescendant");
  };

  const draw = () => {
    const open = isOpen();
    elements = [];
    if (!open) list.replaceChildren();
    else {
      const nodes: HTMLElement[] = [];
      for (const group of ranked.groups) {
        const head = o.header?.(group.key);
        if (head) nodes.push(head);
        for (const row of group.rows) {
          const i = elements.length;
          const el = o.row(row, query.trim());
          el.id = `${listId}-${i}`;
          el.setAttribute("role", "option");
          el.addEventListener("mousedown", (event) => event.preventDefault());
          el.addEventListener("mouseenter", () => {
            index = i;
            highlight();
          });
          el.addEventListener("click", () => pick(row));
          elements.push(el);
          nodes.push(el);
        }
      }
      list.replaceChildren(...nodes);
    }
    input.setAttribute("aria-expanded", String(open));
    highlight();
    if (open !== wasOpen) {
      wasOpen = open;
      o.toggled?.(open);
    }
  };

  const rank = () => {
    const q = query.trim();
    if (!enabled) ranked = EMPTY;
    else if (!q) ranked = o.picks ? topPicks(o.picks()) : EMPTY;
    else {
      const rows = remote && remote.forQuery === q ? remote.rows : [];
      ranked = rankAndGroup(q, [...o.local(q), ...rows], rankOptions(q));
    }
    if (index >= ranked.rows.length) index = -1;
    draw();
  };

  const fetchRemote = () => {
    controller?.abort();
    controller = null;
    window.clearTimeout(timer);
    list.removeAttribute("aria-busy");
    const q = query.trim();
    if (
      !enabled ||
      !o.remote ||
      q.length < REMOTE_MIN_CHARS ||
      rankOptions(q).urlLike
    )
      return;
    const ac = new AbortController();
    controller = ac;
    timer = window.setTimeout(() => {
      list.setAttribute("aria-busy", "true");
      o.remote!(q, ac.signal)
        .catch(() => [] as Suggestion[])
        .then((rows) => {
          if (ac.signal.aborted) return;
          list.removeAttribute("aria-busy");
          remote = { forQuery: q, rows };
          rank();
        });
    }, REMOTE_DELAY_MS);
  };

  /** New text or a new focus: nothing highlighted, the list showing again. */
  const setQuery = (text: string) => {
    query = text;
    index = -1;
    closed = false;
    rank();
    fetchRemote();
  };

  function pick(row: Suggestion) {
    closed = true;
    draw();
    if (row.run) row.run();
    else if (row.url) o.navigate(row);
    input.blur();
  }

  const onFocus = () => {
    enabled = true;
    setQuery(o.typedOnly ? "" : input.value);
  };
  const onBlur = () => {
    enabled = false;
    controller?.abort();
    window.clearTimeout(timer);
    rank();
  };
  const onInput = () => setQuery(input.value);
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.isComposing) return;
    const open = isOpen();
    const rows = ranked.rows;
    if (event.key === "Enter") {
      // Nothing highlighted: the form submits what was typed, as it did before suggestions.
      if (open && index >= 0 && rows[index]) {
        event.preventDefault();
        event.stopImmediatePropagation();
        pick(rows[index]);
      }
      return;
    }
    if (!open) return;
    const move =
      event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;
    if (move) {
      event.preventDefault();
      // -1 is "nothing": down from it goes to the first row, up to the last.
      index =
        index + move < -1
          ? rows.length - 1
          : index + move >= rows.length
            ? -1
            : index + move;
      highlight();
      return;
    }
    if (event.key === "Tab" && !event.shiftKey && index >= 0 && rows[index]) {
      event.preventDefault();
      const row = rows[index];
      input.value = row.fill ?? row.url ?? row.title;
      setQuery(input.value);
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closed = true;
      draw();
    }
  };

  input.addEventListener("focus", onFocus);
  input.addEventListener("blur", onBlur);
  input.addEventListener("input", onInput);
  input.addEventListener("keydown", onKeyDown);
  if (document.activeElement === input) onFocus();

  return {
    refresh: () => {
      if (enabled) rank();
    },
    destroy: () => {
      onBlur();
      input.removeEventListener("focus", onFocus);
      input.removeEventListener("blur", onBlur);
      input.removeEventListener("input", onInput);
      input.removeEventListener("keydown", onKeyDown);
    },
  };
}
