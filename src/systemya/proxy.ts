/**
 * The browser page (/app/): the vendored browser UI (powerMouse's demo host, prepared into /ui/
 * by scripts/prepare-powermouse.mjs) full size under SystemYA's navbar, in a same-origin frame
 * so its styles and globals stay out of SystemYA's documents. The same view shows same-origin
 * pages without the proxy (openFrame), for games that need none.
 *
 * Every way in comes through here: the navbar's and home page's search boxes, every link to
 * another site, and game launches. proxy-hash.ts has the fragment's forms; nothing readable is
 * ever written to the address bar.
 */
import { navigate } from "astro:transitions/client";
import build from "./stomp-build.json";
import { routeHref } from "./routes";
import {
  frameHash,
  proxyHash,
  readProxyHash,
  webUrl,
  type ProxyTarget,
} from "./proxy-hash";
import { syncUiTheme } from "./ui-theme";

/**
 * Where the browser page lives. Everything that leads to it (openProxy, openFrame, links)
 * builds its address from this one function; the page itself reads only the fragment.
 */
export const APP_PATH = routeHref("app");
export const appHref = (hash: string): string => `${APP_PATH}${hash}`;
const UI = build.ui;
const TITLE = "SystemYA";
const TITLE_KEY = "systemya:frame-title:";

// What a page in the UI may use, as the UI grants its own frames (pm/main.js FRAME_ALLOW), plus
// what a game asks for. A frame only passes on what its parent was given.
const ALLOW = [
  "fullscreen",
  "autoplay",
  "encrypted-media",
  "picture-in-picture",
  "gamepad",
  "xr-spatial-tracking",
  "publickey-credentials-get",
  "publickey-credentials-create",
  "geolocation",
  "camera",
  "microphone",
  "clipboard-read",
  "clipboard-write",
  "midi",
  "display-capture",
  "screen-wake-lock",
  "local-fonts",
  "idle-detection",
  "window-management",
  "captured-surface-control",
  "local-network-access",
  "speaker-selection",
  "usb",
  "hid",
  "serial",
  "bluetooth",
].join("; ");

/** The browser page's address for `url` (http or https). */
export function proxyHref(url: string): string {
  const href = webUrl(url, location.href);
  if (!href) throw new TypeError("Only HTTP and HTTPS sites can be opened");
  return appHref(proxyHash(href));
}

type View = {
  kind: "ui" | "frame";
  frame: HTMLIFrameElement;
  /** the route the UI shows, or the framed path */
  path: string;
  loaded: boolean;
  /** stops following SystemYA's theme; set only for the "ui" view */
  cleanup?: () => void;
};
let view: View | undefined;
/** The mounted page's teardown; set while the browser page is on screen. */
let unmount: (() => void) | undefined;

/**
 * Open `url` (http or https) in the browser UI: while the browser page is mounted, in its
 * active tab; anywhere else, by going to the browser page.
 */
export function openProxy(url: string): void {
  const href = proxyHref(url);
  if (unmount && view?.kind === "ui" && view.loaded) {
    open(view, webUrl(url, location.href) as string);
    return;
  }
  void navigate(href);
}

/**
 * Show the same-origin page `src` (a path, or a URL on this origin) full size under the navbar,
 * without the proxy. Any other origin opens in the browser UI. `replace` swaps the current
 * history entry instead of adding one.
 */
export function openFrame(
  src: string,
  title?: string,
  { replace = false }: { replace?: boolean } = {},
): void {
  const url = new URL(src, location.href);
  if (url.origin !== location.origin) return openProxy(url.href);
  const path = `${url.pathname}${url.search}${url.hash}`;
  if (title)
    try {
      sessionStorage.setItem(TITLE_KEY + path, title);
    } catch {}
  void navigate(appHref(frameHash(path)), {
    history: replace ? "replace" : "auto",
  });
}

/** The title openFrame was given for the framed page at `path`, if any. */
export function frameTitle(path: string): string | null {
  try {
    return sessionStorage.getItem(TITLE_KEY + path);
  } catch {
    return null;
  }
}

function open(current: View, url: string): void {
  current.frame.contentWindow?.postMessage(
    { systemya: "open", url },
    location.origin,
  );
}

function makeView(kind: View["kind"], src: string, initial = ""): View {
  const frame = document.createElement("iframe");
  frame.title = TITLE;
  frame.allow = ALLOW;
  // The UI reads what to open from here (proxy-frame.js), so the frame's address names nothing.
  if (initial)
    (frame as HTMLIFrameElement & { systemyaHash?: string }).systemyaHash =
      initial;
  // The browser UI carries powerMouse's theme.js, which reads the shared theme key before body
  // parse: write it before src so the first paint matches SystemYA's light/dark.
  const cleanup = kind === "ui" ? syncUiTheme(frame) : undefined;
  frame.src = src;
  const made: View = { kind, frame, path: "", loaded: false, cleanup };
  frame.addEventListener("load", () => {
    made.loaded = true;
    if (kind === "frame") {
      try {
        const name = frame.contentDocument?.title;
        if (name) document.title = name;
      } catch {}
    }
  });
  return made;
}

function render(main: HTMLElement, target: ProxyTarget): void {
  if (target.kind === "frame") {
    if (view?.kind === "frame" && view.path === target.path) return;
    document.title = frameTitle(target.path) ?? TITLE;
    view?.cleanup?.();
    view = makeView("frame", target.path);
    view.path = target.path;
    main.replaceChildren(view.frame);
    return;
  }
  document.title = TITLE;
  if (view?.kind === "ui") {
    if (target.kind === "url" && view.loaded) return open(view, target.url);
    // the route the UI wrote itself
    if (target.kind === "route" && target.hash === view.path) return;
    if (target.kind === "none") return;
  }
  // The UI opens what its own fragment names when it starts: its route, or the URL.
  const initial =
    target.kind === "route"
      ? target.hash
      : target.kind === "url"
        ? `#${encodeURIComponent(target.url)}`
        : "";
  view?.cleanup?.();
  view = makeView("ui", UI, initial);
  if (target.kind === "route") view.path = target.hash;
  main.replaceChildren(view.frame);
}

/**
 * Start the browser page in `root`'s <main>, from the fragment of the current address (the path
 * does not matter). Returns the teardown, which unmountProxy also runs; mounting again first
 * tears down the previous mount.
 */
export function mountProxy(root: HTMLElement): () => void {
  unmountProxy();
  const main = root.querySelector<HTMLElement>("main");
  if (!main) return () => {};
  view = undefined;
  render(main, readProxyHash(location.hash));

  // The UI reports its fragment (the sealed route of the page on show). The address bar keeps
  // it with replaceState, so browsing inside the UI does not stack entries of its own (the
  // frame's navigations already give Back its steps), and a reload, a bookmark, Back or Forward
  // come back to that page.
  const onMessage = (event: MessageEvent): void => {
    if (
      event.origin !== location.origin ||
      view?.kind !== "ui" ||
      event.source !== view.frame.contentWindow
    )
      return;
    const data = event.data as { systemya?: string; hash?: unknown };
    if (data?.systemya !== "hash" || typeof data.hash !== "string") return;
    const target = readProxyHash(data.hash);
    const hash = target.kind === "route" ? target.hash : "";
    view.path = hash;
    if (location.hash !== hash)
      history.replaceState(
        history.state,
        "",
        `${location.pathname}${location.search}${hash}`,
      );
  };
  // A fragment typed into the address bar, or Back and Forward between fragments.
  const onHashChange = (): void => render(main, readProxyHash(location.hash));
  window.addEventListener("message", onMessage);
  window.addEventListener("hashchange", onHashChange);
  const teardown = (): void => {
    if (unmount !== teardown) return;
    window.removeEventListener("message", onMessage);
    window.removeEventListener("hashchange", onHashChange);
    document.removeEventListener("astro:before-swap", teardown);
    view?.cleanup?.();
    view?.frame.remove();
    view = undefined;
    unmount = undefined;
  };
  unmount = teardown;
  document.addEventListener("astro:before-swap", teardown);
  return teardown;
}

/** Stop the browser page, if it is mounted: its listeners go and its frame is removed. */
export function unmountProxy(): void {
  unmount?.();
}

// One delegated handler for the whole site: a link to another origin opens in the browser UI. A
// plain click goes to /app/; a middle click or Ctrl, Cmd or Shift opens /app/ in a new tab.
// Same-origin links, and links marked data-direct, are left alone.
function proxyLink(event: MouseEvent): void {
  if (event.defaultPrevented || event.button > 1) return;
  if (event.type === "auxclick" && event.button !== 1) return;
  const link =
    event.target instanceof Element
      ? event.target.closest<HTMLAnchorElement>("a[href]")
      : null;
  if (!link || link.hasAttribute("download") || "direct" in link.dataset)
    return;
  const href = webUrl(link.href, location.href);
  if (!href || new URL(href).origin === location.origin) return;
  event.preventDefault();
  if (event.button === 1 || event.ctrlKey || event.metaKey || event.shiftKey)
    window.open(proxyHref(href), "_blank", "noopener");
  else openProxy(href);
}

if (typeof document !== "undefined") {
  document.addEventListener("click", proxyLink);
  document.addEventListener("auxclick", proxyLink);
}
