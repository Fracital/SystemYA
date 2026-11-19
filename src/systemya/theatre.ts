// The Theatre: Holy Unblocker website2's theatre (src/pages/hub/index.astro, TheatreCategory.astro,
// TheatreSearchBar.astro, lib/renderTheatre.ts and lib/searchResult.ts) on the May 2022 page.
// Categories are 2022 drawers; "See all" and the category buttons open website2's paged category
// view. Every view is an address of the Theatre's route (/?1&category=action, routes.ts), so
// Astro's router handles back and forward.
// theatre.css is linked by SystemYALayout.astro on every page, so it is there however you arrive.
import { navigate } from "astro:transitions/client";
import type {
  HUCatalogClient,
  ListData,
  TheatreEntryMin,
} from "../../sdk/src/types/index";
import {
  GROUP_SIZE,
  PAGE_SIZE,
  SORTS,
  imageFor,
  isSortKey,
  launchGame,
  loadSDK,
  primaryCategory,
  queryCatalog,
  type SortKey,
} from "./games-sdk";
import { routeHref } from "./routes";

const PATH = routeHref("theatre");
const SUGGESTIONS = 8;

const SORT_LABELS: Record<SortKey, string> = {
  mostPopular: "Most Popular",
  leastPopular: "Least Popular",
  recentlyAddedDESC: "Recently Added",
  recentlyAddedASC: "Oldest First",
  nameASC: "Name (A-Z)",
  nameDESC: "Name (Z-A)",
};
// website2 offers fewer sorts on the popular games page than on a category page.
const HUB_SORTS: SortKey[] = [
  "mostPopular",
  "leastPopular",
  "nameASC",
  "nameDESC",
];
const LIST_SORTS = Object.keys(SORTS) as SortKey[];

type View =
  | { kind: "hub"; sort: SortKey }
  | { kind: "category"; category: string; sort: SortKey; page: number }
  | { kind: "search"; q: string; page: number };

function readView(): View {
  const params = new URLSearchParams(location.search);
  const sortParam = params.get("sort");
  const pageParam = Number.parseInt(params.get("page") ?? "1", 10);
  const page = Number.isFinite(pageParam) && pageParam > 1 ? pageParam : 1;
  const q = params.get("q")?.trim();
  if (q) return { kind: "search", q, page };
  const category = params.get("category");
  if (category)
    return {
      kind: "category",
      category,
      sort: isSortKey(sortParam) ? sortParam : "mostPopular",
      page,
    };
  return {
    kind: "hub",
    sort:
      isSortKey(sortParam) && HUB_SORTS.includes(sortParam)
        ? sortParam
        : "mostPopular",
  };
}

function href(view: View): string {
  const params = new URLSearchParams();
  if (view.kind === "search") params.set("q", view.q);
  if (view.kind === "category") params.set("category", view.category);
  if (view.kind !== "search" && view.sort !== "mostPopular")
    params.set("sort", view.sort);
  if (view.kind !== "hub" && view.page > 1)
    params.set("page", String(view.page));
  const search = params.toString();
  return routeHref("theatre", search);
}

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
function icon(name: string): HTMLSpanElement {
  const node = make("span", "material-icons", name);
  node.setAttribute("aria-hidden", "true");
  return node;
}

function categoryName(sdk: HUCatalogClient | undefined, id: string): string {
  return sdk?.categories.find((c) => c.id === id)?.name ?? id;
}

export function mountTheatre(root: HTMLElement): void {
  const main = root.querySelector<HTMLElement>("main#systemya-theatre");
  if (root.dataset.page !== "theatre" || !main || main.dataset.mounted) return;
  main.dataset.mounted = "1";

  const view = readView();
  const controller = new AbortController();
  const { signal } = controller;
  let sdk: HUCatalogClient | undefined;
  let toastTimer: number | undefined;

  document.addEventListener(
    "astro:before-swap",
    () => {
      controller.abort();
      window.clearTimeout(toastTimer);
    },
    { once: true },
  );

  const reducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Launch feedback sits at the bottom of the screen, wherever the card was.
  const toast = make("div", "theatre-toast");
  toast.setAttribute("role", "status");
  toast.hidden = true;
  const say = (message: string, sticky = false) => {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = !message;
    if (message && !sticky)
      toastTimer = window.setTimeout(() => (toast.hidden = true), 5000);
  };

  let launching = false;
  const play = async (item: TheatreEntryMin) => {
    if (!sdk || launching) return;
    launching = true;
    say(`Opening ${item.name}...`, true);
    const error = await launchGame(sdk, item);
    launching = false;
    say(error ?? "");
  };

  // website2's renderTheatreItem: a shimmer placeholder until the thumbnail loads.
  const card = (item?: TheatreEntryMin): HTMLElement => {
    const node = make(item ? "button" : "div", "item");
    node.dataset.load = "";
    const thumb = make("div", "thumb");
    const name = make("div", "name");
    node.append(thumb, name);
    if (!item || !sdk) {
      node.dataset.placeholder = "";
      node.setAttribute("aria-hidden", "true");
      return node;
    }
    const button = node as HTMLButtonElement;
    button.type = "button";
    button.title = item.name;
    name.textContent = item.name;
    const image = make("img");
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    const src = imageFor(sdk, item);
    image.addEventListener("load", () => node.removeAttribute("data-load"));
    // The edge answers a revalidation of a cached thumbnail (If-None-Match) with 404, so a
    // revisit can fail. Fetch it once more under a fresh URL; the query does not change the route.
    let retried = false;
    image.addEventListener("error", () => {
      if (retried) return node.removeAttribute("data-load");
      retried = true;
      image.src = `${src}${src.includes("?") ? "&" : "?"}r=${Date.now()}`;
    });
    image.src = src;
    thumb.append(image);
    button.addEventListener("click", () => void play(item));
    return node;
  };

  // Search bar: website2's TheatreSearchBar with the 2022 homepage omnibox look.
  const search = make("div", "theatre-search");
  const form = make("form", "theatre-search-bar");
  form.setAttribute("role", "search");
  const input = make("input");
  input.type = "search";
  input.enterKeyHint = "search";
  input.autocomplete = "off";
  input.spellcheck = false;
  input.placeholder = "Search games";
  input.setAttribute("aria-label", "Search games");
  input.setAttribute("aria-autocomplete", "list");
  input.setAttribute("aria-controls", "theatre-suggest");
  if (view.kind === "search") input.value = view.q;
  const clear = make("button", "theatre-search-clear");
  clear.type = "button";
  clear.setAttribute("aria-label", "Clear search");
  clear.tabIndex = -1;
  clear.append(icon("close"));
  const submit = make("button", "theatre-search-submit");
  submit.type = "submit";
  submit.setAttribute("aria-label", "Search");
  submit.append(icon("search"));
  form.append(input, clear, submit);
  const suggest = make("div", "theatre-suggest");
  suggest.id = "theatre-suggest";
  suggest.setAttribute("role", "listbox");
  search.append(form, suggest);
  search.toggleAttribute("data-text", input.value !== "");

  // Category filter and sort.
  const toolbar = make("div", "theatre-toolbar");
  // A div, not <nav>: main.css styles every nav as the 2022 navbar.
  const filters = make("div", "theatre-filters");
  filters.setAttribute("role", "navigation");
  filters.setAttribute("aria-label", "Game categories");
  const sortLabel = make("label", "theatre-sort");
  const sortSelect = make("select");
  sortLabel.append(make("span", undefined, "Sort"), sortSelect);
  toolbar.append(filters, sortLabel);

  const heading = make("div", "theatre-heading");
  const body = make("div", "theatre-body");
  main.replaceChildren(search, toolbar, heading, body, toast);

  const renderFilters = () => {
    const active = view.kind === "category" ? view.category : "";
    const chips: Array<[string, string]> = [
      ["", "All"],
      ...(sdk?.categories ?? []).map(
        ({ id, name }) => [id, name] as [string, string],
      ),
    ];
    filters.replaceChildren(
      ...chips.map(([id, name]) => {
        const chip = make("a", "theatre-chip", name);
        chip.href = id
          ? href({
              kind: "category",
              category: id,
              sort: "mostPopular",
              page: 1,
            })
          : PATH;
        if (id === active && view.kind !== "search")
          chip.setAttribute("aria-current", "page");
        return chip;
      }),
    );
  };

  const renderSort = () => {
    if (view.kind === "search") {
      sortLabel.hidden = true;
      return;
    }
    const keys = view.kind === "hub" ? HUB_SORTS : LIST_SORTS;
    sortSelect.replaceChildren(
      ...keys.map((key) => {
        const option = make("option", undefined, SORT_LABELS[key]);
        option.value = key;
        option.selected = key === view.sort;
        return option;
      }),
    );
  };
  sortSelect.addEventListener("change", () => {
    if (view.kind === "search" || !isSortKey(sortSelect.value)) return;
    void navigate(
      href(
        view.kind === "hub"
          ? { kind: "hub", sort: sortSelect.value }
          : { ...view, sort: sortSelect.value, page: 1 },
      ),
    );
  });

  const renderHeading = () => {
    if (view.kind === "hub") {
      heading.hidden = true;
      return;
    }
    const back = make("a", "theatre-back");
    back.href = PATH;
    back.setAttribute("aria-label", "All games");
    back.append(icon("arrow_back"));
    const title = make(
      "h1",
      undefined,
      view.kind === "search"
        ? `Search results for '${view.q}'`
        : categoryName(sdk, view.category),
    );
    const count = make("span", "theatre-count");
    heading.replaceChildren(back, title, count);
    heading.hidden = false;
  };

  const showError = (error: unknown, retry: () => void) => {
    const box = make("div", "theatre-error");
    box.setAttribute("role", "alert");
    box.append(
      make("strong", undefined, "The game library is unavailable right now."),
      make(
        "span",
        undefined,
        error instanceof Error ? error.message : String(error),
      ),
    );
    const again = make("button", "theatre-retry", "Try again");
    again.type = "button";
    again.addEventListener("click", retry);
    box.append(again);
    body.replaceChildren(box);
  };

  // Keep a drawer's heading on screen when it opens or closes. #root is the 2022 page's
  // scroll container (position: fixed; overflow: auto), so the window never scrolls.
  const reveal = (section: HTMLElement) => {
    const top = section.getBoundingClientRect().top;
    const rootTop = root.getBoundingClientRect().top;
    if (top < rootTop)
      section.scrollIntoView({
        block: "start",
        behavior: reducedMotion() ? "auto" : "smooth",
      });
  };

  const drawers: Array<() => void> = [];
  const measureDrawers = () => drawers.forEach((measure) => measure());
  window.addEventListener("resize", measureDrawers, { signal });

  // A 2022 drawer: one row of cards with the round expand button underneath.
  const drawer = (
    id: string,
    label: string,
    entries: TheatreEntryMin[],
    total: number,
  ): HTMLElement => {
    const section = make("section", "theatre-drawer");
    section.id = `theatre-${id}`;
    section.dataset.expanded = "0";
    section.dataset.overflowing = "0";
    const head = make("div", "theatre-drawer-head");
    const title = make("h1", undefined, label);
    title.id = `theatre-${id}-title`;
    section.setAttribute("aria-labelledby", title.id);
    const all = make("a", "theatre-see-all");
    all.href = href({
      kind: "category",
      category: id,
      sort: "mostPopular",
      page: 1,
    });
    all.append(
      make("span", undefined, total ? `See all ${total}` : "See all"),
      icon("arrow_forward"),
    );
    head.append(title, all);
    const items = make("div", "items");
    items.id = `theatre-${id}-items`;
    items.append(...entries.map((entry) => card(entry)));
    const toggle = make("button", "items-expand material-icons", "expand_more");
    toggle.type = "button";
    toggle.setAttribute("aria-controls", items.id);
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", `Show all of ${label}`);
    toggle.addEventListener("click", () => {
      const open = section.dataset.expanded !== "1";
      section.dataset.expanded = open ? "1" : "0";
      toggle.textContent = open ? "expand_less" : "expand_more";
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute(
        "aria-label",
        open ? `Show less of ${label}` : `Show all of ${label}`,
      );
      reveal(section);
    });
    section.append(head, items, toggle);
    drawers.push(() => {
      if (!section.isConnected || section.dataset.expanded === "1") return;
      section.dataset.overflowing =
        items.scrollHeight > items.clientHeight + 1 ? "1" : "0";
    });
    return section;
  };

  const placeholderDrawers = () => {
    body.replaceChildren(
      ...[0, 1, 2].map(() => {
        const section = make("section", "theatre-drawer");
        section.dataset.placeholder = "";
        section.setAttribute("aria-hidden", "true");
        const items = make("div", "items");
        for (let i = 0; i < 8; i++) items.append(card());
        section.append(make("div", "theatre-drawer-head"), items);
        return section;
      }),
    );
  };

  // website2 shows the catalog size in the search placeholder.
  let counted = false;
  const countGames = (client: HUCatalogClient) => {
    if (counted) return;
    counted = true;
    void queryCatalog(client, { limit: 1 }, signal)
      .then(({ total }) => {
        if (total > 0) input.placeholder = `Search ${total} games`;
      })
      .catch(() => (counted = false));
  };

  const loadHub = async (sort: SortKey) => {
    placeholderDrawers();
    try {
      sdk ??= await loadSDK();
      countGames(sdk);
      renderFilters();
      const data = await queryCatalog(
        sdk,
        { ...SORTS[sort], groupBy: "category", limitPerGroup: GROUP_SIZE },
        signal,
      );
      if (signal.aborted) return;
      const groups = (data.groups ?? []).filter((g) => g.games.length);
      drawers.length = 0;
      body.replaceChildren(
        ...groups.map((group) =>
          drawer(
            group.key,
            categoryName(sdk, group.key) || group.label,
            group.games,
            group.total,
          ),
        ),
      );
      if (!groups.length)
        body.replaceChildren(make("p", "theatre-empty", "No games yet."));
      requestAnimationFrame(measureDrawers);
    } catch (error) {
      if (!signal.aborted) showError(error, () => void loadHub(sort));
    }
  };

  const loadList = async (list: Exclude<View, { kind: "hub" }>) => {
    const section = make("section", "theatre-list");
    section.dataset.expanded = "1";
    const items = make("div", "items");
    for (let i = 0; i < PAGE_SIZE; i++) items.append(card());
    section.append(items);
    const pages = make("div", "theatre-pages");
    pages.hidden = true;
    body.replaceChildren(section, pages);
    try {
      sdk ??= await loadSDK();
      countGames(sdk);
      renderFilters();
      renderHeading();
      const data: ListData = await queryCatalog(
        sdk,
        list.kind === "search"
          ? {
              search: list.q,
              offset: (list.page - 1) * PAGE_SIZE,
              limit: PAGE_SIZE,
            }
          : {
              ...SORTS[list.sort],
              category: [list.category],
              offset: (list.page - 1) * PAGE_SIZE,
              limit: PAGE_SIZE,
            },
        signal,
      );
      if (signal.aborted) return;
      const total = typeof data.total === "number" ? data.total : 0;
      const count = heading.querySelector(".theatre-count");
      if (count)
        count.textContent = `${total} ${total === 1 ? "game" : "games"}`;
      if (!data.entries.length) {
        body.replaceChildren(
          make(
            "p",
            "theatre-empty",
            list.kind === "search"
              ? `No games matched '${list.q}'.`
              : list.page > 1
                ? "There are no more games in this category."
                : "No games in this category yet.",
          ),
        );
        return;
      }
      items.replaceChildren(...data.entries.map((entry) => card(entry)));
      // website2's two page buttons, with the page number between them.
      const last = Math.max(Math.ceil(total / PAGE_SIZE), 1);
      if (last > 1) {
        const step = (delta: number, name: string, label: string) => {
          const target = list.page + delta;
          const button = make("button", "theatre-page");
          button.type = "button";
          button.setAttribute("aria-label", label);
          button.append(icon(name));
          button.disabled = target < 1 || target > last;
          button.addEventListener(
            "click",
            () => void navigate(href({ ...list, page: target })),
          );
          return button;
        };
        pages.replaceChildren(
          step(-1, "chevron_left", "Previous page"),
          make("span", "theatre-page-label", `${list.page} / ${last}`),
          step(1, "chevron_right", "Next page"),
        );
        pages.hidden = false;
      }
    } catch (error) {
      if (!signal.aborted) showError(error, () => void loadList(list));
    }
  };

  // Suggestions, as website2's TheatreSearchBar: the typed text first, then up to eight games.
  let suggestAbort: AbortController | undefined;
  let resultIndex = -1;
  let focused = false;
  const rows = () => [...suggest.children] as HTMLElement[];
  const closeSuggest = () => {
    focused = false;
    suggestAbort?.abort();
    suggest.replaceChildren();
    resultIndex = -1;
    search.removeAttribute("data-suggested");
    input.setAttribute("aria-expanded", "false");
  };
  const highlight = () =>
    rows().forEach((row, i) => {
      row.toggleAttribute("data-hover", i === resultIndex);
      row.setAttribute("aria-selected", String(i === resultIndex));
    });
  const goSearch = (q: string) => {
    closeSuggest();
    input.blur();
    if (q) void navigate(href({ kind: "search", q, page: 1 }));
  };
  const suggestionRow = (
    text: string,
    query: string,
    action: () => void,
    category?: string,
  ) => {
    const row = make("div", "theatre-suggestion");
    row.setAttribute("role", "option");
    row.append(icon("search"));
    const label = make("span", "theatre-suggestion-text");
    if (query && text.toLowerCase().startsWith(query.toLowerCase())) {
      label.append(make("b", undefined, text.slice(0, query.length)));
      label.append(text.slice(query.length));
    } else label.append(text);
    row.append(label);
    if (category)
      row.append(make("span", "theatre-suggestion-category", category));
    row.append(icon("north_west"));
    // mousedown runs before the input's blur closes the list.
    row.addEventListener("mousedown", (event) => {
      event.preventDefault();
      action();
    });
    return row;
  };
  const updateSuggestions = async () => {
    suggestAbort?.abort();
    suggestAbort = new AbortController();
    const local = suggestAbort;
    const query = input.value.trim();
    resultIndex = -1;
    search.toggleAttribute("data-text", input.value !== "");
    const first = query
      ? [suggestionRow(query, query, () => goSearch(query))]
      : [];
    suggest.replaceChildren(...first);
    search.toggleAttribute("data-suggested", first.length > 0);
    if (!query) return;
    try {
      sdk ??= await loadSDK();
      const data = await queryCatalog(
        sdk,
        { search: query, limit: SUGGESTIONS },
        local.signal,
      );
      if (local.signal.aborted || !focused) return;
      suggest.append(
        ...data.entries.map((entry) => {
          const id = primaryCategory(entry);
          return suggestionRow(
            entry.name,
            query,
            () => {
              closeSuggest();
              input.blur();
              void play(entry);
            },
            id ? categoryName(sdk, id) : undefined,
          );
        }),
      );
      search.setAttribute("data-suggested", "");
      input.setAttribute("aria-expanded", "true");
    } catch {
      // Suggestions are optional; submitting still searches.
    }
  };

  input.addEventListener("focus", () => {
    focused = true;
    search.setAttribute("data-focused", "");
    void updateSuggestions();
  });
  input.addEventListener("blur", () => {
    search.removeAttribute("data-focused");
    closeSuggest();
  });
  input.addEventListener("input", () => void updateSuggestions());
  input.addEventListener("keydown", (event) => {
    const list = rows();
    switch (event.key) {
      case "Escape":
        closeSuggest();
        input.blur();
        break;
      case "ArrowDown":
        if (!list.length) return;
        event.preventDefault();
        resultIndex = resultIndex >= list.length - 1 ? 0 : resultIndex + 1;
        highlight();
        break;
      case "ArrowUp":
        if (!list.length) return;
        event.preventDefault();
        resultIndex = resultIndex <= 0 ? list.length - 1 : resultIndex - 1;
        highlight();
        break;
    }
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const chosen = rows()[resultIndex];
    if (chosen)
      chosen.dispatchEvent(new MouseEvent("mousedown", { cancelable: true }));
    else goSearch(input.value.trim());
  });
  clear.addEventListener("mousedown", (event) => event.preventDefault());
  clear.addEventListener("click", () => {
    input.value = "";
    search.removeAttribute("data-text");
    input.focus();
    void updateSuggestions();
  });

  renderFilters();
  renderSort();
  renderHeading();
  if (view.kind === "hub") void loadHub(view.sort);
  else void loadList(view);
}
