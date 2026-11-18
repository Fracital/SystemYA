import type {
  HUCatalogClient,
  TheatreEntryMin,
} from "../../sdk/src/types/index";
import { encryptURL } from "../lib/cryptURL";
import { openEmbed, openStomp } from "./stomp";

declare global {
  interface Window {
    HU?: HUCatalogClient;
  }
}

const PAGE_SIZE = 24;
const BOOTSTRAP = "/cdn/index.js";
let bootstrap: Promise<HUCatalogClient> | undefined;

function loadSDK(): Promise<HUCatalogClient> {
  if (window.HU) return Promise.resolve(window.HU);
  if (!bootstrap) {
    bootstrap = new Promise<HUCatalogClient>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = BOOTSTRAP;
      script.async = true;
      script.onload = () =>
        window.HU
          ? resolve(window.HU)
          : reject(new Error("Games SDK did not initialize"));
      script.onerror = () =>
        reject(new Error("Games SDK bootstrap could not load"));
      document.head.append(script);
    }).catch((error: unknown) => {
      bootstrap = undefined;
      throw error;
    });
  }
  return bootstrap;
}

function make<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  label?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (label !== undefined) node.textContent = label;
  return node;
}

function safeLocalPath(value: unknown): string | null {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//")
  )
    return null;
  const candidate = new URL(value, location.origin);
  return candidate.origin === location.origin &&
    /^https?:$/.test(candidate.protocol)
    ? candidate.pathname + candidate.search + candidate.hash
    : null;
}

async function playGame(
  client: HUCatalogClient,
  item: TheatreEntryMin,
  report: HTMLElement,
): Promise<void> {
  report.textContent = `Loading ${item.name}...`;
  try {
    const game = await client.getGame(item.id);
    if (!game) throw new Error("This game is no longer available");
    const localPlayer = safeLocalPath(game.launchPath);
    const gameType = game.type.toLowerCase();

    if (
      gameType === "proxy" &&
      typeof game.src === "string" &&
      /^https?:\/\//i.test(game.src)
    ) {
      await openStomp(game.src);
    } else if (gameType === "flash") {
      const swf =
        typeof game.assetPath === "string" ? game.assetPath : game.src;
      if (!swf) throw new Error("Missing Flash game URL");
      const resolvedSwf = new URL(swf, location.origin);
      if (!/^https?:$/.test(resolvedSwf.protocol))
        throw new Error("Unsupported Flash URL");
      openEmbed(`/flash#${encryptURL(resolvedSwf.href)}`, game.name);
    } else if (localPlayer) {
      openEmbed(localPlayer, game.name);
    } else {
      throw new Error("This game has no supported launch route");
    }

    report.textContent = "";
    void client.countPlay(game.id).catch(() => {});
  } catch (error) {
    report.textContent =
      error instanceof Error ? error.message : "Game could not be opened";
  }
}

/** Add the official website2 game catalog below the unmodified 2022 card sections. */
export function mountGamesSDK(root: HTMLElement): void {
  if (
    root.dataset.page !== "theatre" ||
    root.querySelector("#systemya-sdk-catalog")
  )
    return;
  const main = root.querySelector("main");
  if (!main) return;

  const section = make("section", "systemya-sdk-catalog");
  section.id = "systemya-sdk-catalog";
  const heading = make("h2", undefined, "More games");
  const intro = make("p", "systemya-sdk-intro", "Holy Unblocker game library");
  const form = make("form", "systemya-sdk-search");
  const search = make("input");
  search.type = "search";
  search.placeholder = "Search games";
  search.setAttribute("aria-label", "Search game library");
  const submit = make("button", undefined, "Search");
  submit.type = "submit";
  form.append(search, submit);
  const status = make("p", "systemya-sdk-status");
  status.setAttribute("role", "status");
  const grid = make("div", "systemya-sdk-grid");
  const pagination = make("div", "systemya-sdk-pagination");
  const previous = make("button", undefined, "Previous");
  const next = make("button", undefined, "Next");
  previous.type = "button";
  next.type = "button";
  const pageLabel = make("span");
  pagination.append(previous, pageLabel, next);
  section.append(heading, intro, form, status, grid, pagination);
  main.append(section);

  let page = 1;
  let query = "";
  let active = 0;
  let sdk: HUCatalogClient | undefined;
  let cancelled = false;
  let controller: AbortController | undefined;

  const load = async (): Promise<void> => {
    if (cancelled) return;
    const sequence = ++active;
    controller?.abort();
    controller = new AbortController();
    grid.replaceChildren();
    status.textContent = "Loading game library...";
    previous.disabled = true;
    next.disabled = true;
    try {
      sdk ??= await loadSDK();
      if (cancelled || sequence !== active) return;
      const result = await sdk.query(
        {
          q: query || undefined,
          sort: query ? "relevance" : "popular",
          page,
          limit: PAGE_SIZE,
        },
        controller.signal,
      );
      if (cancelled || sequence !== active) return;
      const games = Array.isArray(result.entries) ? result.entries : [];
      for (const item of games) {
        const button = make("button", "systemya-sdk-game");
        button.type = "button";
        const image = make("img");
        image.loading = "lazy";
        image.alt = "";
        image.src = safeLocalPath(item.imagePath) || sdk.getImageUrl(item.id);
        const label = make("span", undefined, item.name);
        button.append(image, label);
        button.addEventListener("click", () => {
          if (sdk) void playGame(sdk, item, status);
        });
        grid.append(button);
      }
      status.textContent = games.length ? "" : "No games matched your search.";
      const totalPages =
        typeof result.pages === "number"
          ? result.pages
          : Math.ceil(Math.max(result.total, games.length) / PAGE_SIZE);
      pageLabel.textContent = `Page ${page}${totalPages ? ` of ${totalPages}` : ""}`;
      previous.disabled = page <= 1;
      next.disabled =
        games.length < PAGE_SIZE || (totalPages > 0 && page >= totalPages);
    } catch (error) {
      if (cancelled || sequence !== active || controller?.signal.aborted)
        return;
      status.textContent = `Game library unavailable: ${error instanceof Error ? error.message : String(error)}`;
      const retry = make("button", undefined, "Retry");
      retry.type = "button";
      retry.addEventListener("click", () => {
        void load();
      });
      grid.append(retry);
    }
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    query = search.value.trim();
    page = 1;
    void load();
  });
  previous.addEventListener("click", () => {
    page = Math.max(1, page - 1);
    void load();
  });
  next.addEventListener("click", () => {
    page++;
    void load();
  });
  document.addEventListener(
    "astro:before-swap",
    () => {
      cancelled = true;
      controller?.abort();
    },
    { once: true },
  );
  void load();
}
