import type {
  HUCatalogClient,
  ListData,
  ListOptions,
  TheatreEntry,
  TheatreEntryMin,
} from "../../sdk/src/types/index";
import { playerHref } from "./player";
import { openFrame, openProxy } from "./proxy";

declare global {
  interface Window {
    HU?: HUCatalogClient;
  }
}

// The edge serves Holy Unblocker's Games SDK bootstrap here. It defines the global HU client,
// whose opaque /cdn/ routes are signed for this visitor's route cookie.
const BOOTSTRAP = "/cdn/index.js";
let bootstrap: Promise<HUCatalogClient> | undefined;

function injectBootstrap(attempt: number): Promise<HUCatalogClient> {
  return new Promise<HUCatalogClient>((resolve, reject) => {
    const script = document.createElement("script");
    // A retry adds a query string so a failed response is not reused. The bootstrap derives
    // its route base from the script's pathname, so the query does not change any route.
    script.src = attempt === 0 ? BOOTSTRAP : `${BOOTSTRAP}?retry=${attempt}`;
    script.async = true;
    script.dataset.systemyaSdk = "";
    script.onload = () =>
      window.HU
        ? resolve(window.HU)
        : reject(new Error("The Games SDK loaded but did not start"));
    script.onerror = () => {
      script.remove();
      reject(new Error("The Games SDK could not be downloaded"));
    };
    document.body.append(script);
  });
}

/** Load the edge's SDK once per document. A failed load is retried once, then on the next call. */
export function loadSDK(): Promise<HUCatalogClient> {
  if (window.HU) return Promise.resolve(window.HU);
  bootstrap ??= injectBootstrap(0)
    .catch(() => injectBootstrap(1))
    .catch((error: unknown) => {
      bootstrap = undefined;
      throw error;
    });
  return bootstrap;
}

/** The SDK's game types that SystemYA can open, for every catalog query: all of them. */
export function playableTypes(sdk: HUCatalogClient): string[] {
  return [...sdk.types];
}

/** website2's theatre sort names and the API sort and order each one maps to (renderTheatre.ts). */
export const SORTS = {
  mostPopular: { sort: "plays" },
  leastPopular: { sort: "plays", order: "asc" },
  recentlyAddedDESC: { sort: "index" },
  recentlyAddedASC: { sort: "index", order: "asc" },
  nameASC: { sort: "name", order: "asc" },
  nameDESC: { sort: "name", order: "desc" },
} as const satisfies Record<string, Pick<ListOptions, "sort" | "order">>;

export type SortKey = keyof typeof SORTS;

export function isSortKey(value: unknown): value is SortKey {
  return typeof value === "string" && Object.hasOwn(SORTS, value);
}

/** website2's per-page count on category and search pages. */
export const PAGE_SIZE = 30;
/** website2's per-category count on the popular games page. */
export const GROUP_SIZE = 15;

export function queryCatalog(
  sdk: HUCatalogClient,
  options: ListOptions,
  signal?: AbortSignal,
): Promise<ListData> {
  return sdk.query({ ...options, type: playableTypes(sdk) }, signal);
}

/** First category id of an entry. The API sends a string and the types say string[]. */
export function primaryCategory(item: TheatreEntryMin): string | undefined {
  const value: unknown = item.category;
  if (typeof value === "string") return value || undefined;
  if (Array.isArray(value) && typeof value[0] === "string")
    return value[0] || undefined;
  return undefined;
}

export function safeLocalPath(value: unknown): string | null {
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

export function imageFor(sdk: HUCatalogClient, item: TheatreEntryMin): string {
  return safeLocalPath(item.imagePath) || sdk.getImageUrl(item.id);
}

/**
 * The edge's own path for a local game's file ("./flash/x.swf"): the path of the SDK's launch
 * URL, which names Holy Unblocker's CDN (/cdn/flash/x.swf). The edge proxies /cdn/ to that CDN,
 * so the path works on this origin. Null unless the launch URL is the game's local file.
 */
function cdnPath(game: TheatreEntry): string | null {
  const launch = game.launch;
  if (typeof game.src !== "string" || !game.src.startsWith("./")) return null;
  if (!launch || typeof launch.url !== "string") return null;
  try {
    const url = new URL(launch.url);
    return /^https?:$/.test(url.protocol) &&
      decodeURI(url.pathname) === `/cdn/${game.src.slice(2)}`
      ? safeLocalPath(url.pathname)
      : null;
  } catch {
    return null;
  }
}

/**
 * The raw /cdn/ path for a local game that the signed asset path cannot serve, or null. The
 * signed path serves a folder's files under its token ("./html5/x/"), but a single page's
 * neighbours ("./html5/x/index.html" loading "style.css") resolve next to the token and are not
 * found, and a folder written without its slash ("./html5/x") is not served at all. Those games
 * open at the edge's raw /cdn/ path, where relative URLs work; the folder gets its slash.
 */
function rawPath(game: TheatreEntry): string | null {
  const src = typeof game.src === "string" ? game.src : "";
  if (!src.startsWith("./") || src.endsWith("/")) return null;
  const path = cdnPath(game);
  if (!path) return null;
  return /\.html?$/i.test(src) ? path : `${path}/`;
}

/** How website2's TheatrePlayer opens a game, as one URL for SystemYA's frame. */
function resolveLaunch(
  game: TheatreEntry,
): { kind: "proxy" | "frame"; url: string } | { error: string } {
  const type = game.type.toLowerCase();
  const src = typeof game.src === "string" ? game.src : "";
  if (type === "proxy") {
    return /^https?:\/\//i.test(src)
      ? { kind: "proxy", url: src }
      : { error: "This game has no site to open" };
  }
  // The SDK's flash launch kind: its SWF plays on the player page (website2's /flash).
  if (type === "flash" || game.launch?.type === "flash") {
    const movie = cdnPath(game) ?? safeLocalPath(game.assetPath);
    return movie
      ? { kind: "frame", url: location.origin + playerHref(movie) }
      : { error: "This game has no supported launch route" };
  }
  // Local games ("./...") are served through the SDK's signed asset path, unless it fails them.
  const raw = type === "embed" ? rawPath(game) : null;
  const asset = raw ?? safeLocalPath(game.assetPath);
  if (!asset) return { error: "This game has no supported launch route" };
  const url = location.origin + asset;
  if (type === "embed") return { kind: "frame", url };
  if (type === "emulator" || type.startsWith("emulator.")) {
    const player = safeLocalPath(game.playerPath);
    if (!player) return { error: "This game's emulator is unavailable" };
    const query = new URLSearchParams({ rom: url, core: "autodetect" });
    return { kind: "frame", url: `${player}?${query}` };
  }
  return { error: "This game has no supported launch route" };
}

// Like website2's seenGames setting: count one play per game per browser.
const SEEN_KEY = "systemya-seen-games";
function countFirstPlay(sdk: HUCatalogClient, id: string): void {
  let seen: string[] = [];
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(SEEN_KEY) ?? "[]");
    if (Array.isArray(stored))
      seen = stored.filter((x): x is string => typeof x === "string");
  } catch {}
  if (seen.includes(id)) return;
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify([...seen, id]));
  } catch {}
  void sdk.countPlay(id).catch(() => {});
}

/**
 * Open a catalog entry. Every Theatre launch goes through here: proxy games open their site in
 * the proxy, every other game opens its same-origin player in SystemYA's frame.
 * Resolves to an error message, or undefined once the game is open.
 */
export async function launchGame(
  sdk: HUCatalogClient,
  item: Pick<TheatreEntryMin, "id" | "name">,
): Promise<string | undefined> {
  try {
    const game = await sdk.getGame(item.id);
    if (!game) return "This game is no longer available";
    const launch = resolveLaunch(game);
    if ("error" in launch) return launch.error;
    if (launch.kind === "proxy") openProxy(launch.url);
    else openFrame(launch.url, game.name);
    countFirstPlay(sdk, game.id);
    return undefined;
  } catch (error) {
    return error instanceof Error ? error.message : "Game could not be opened";
  }
}
