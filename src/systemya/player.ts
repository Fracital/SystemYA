/**
 * The player page (/?9): website2's /flash page. It plays one SWF with the self-hosted Flash
 * player that scripts/prepare-player.mjs copies to /vendor/pl/. The page runs in the browser
 * page's frame (openFrame), so it shows full size under the navbar; opened on its own, it moves
 * itself into that frame. Its fragment is the SWF's same-origin path in proxy-hash.ts's code,
 * never a readable address.
 */
import build from "./player-build.json";
import { frameTitle, openFrame } from "./proxy";
import { decodeTarget, encodeTarget } from "./proxy-hash";
import { routeHref } from "./routes";

interface PlayerElement extends HTMLElement {
  ruffle?: () => { load(options: object): Promise<void> };
  load?: (options: object) => Promise<void>;
}

declare global {
  interface Window {
    RufflePlayer?: {
      newest?: () => { createPlayer(): PlayerElement } | null;
      config?: object;
    };
  }
}

const isPath = (value: string) =>
  value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\");

/** The player page's address for the same-origin SWF at `path`. */
export function playerHref(path: string): string {
  if (!isPath(path)) throw new TypeError("A movie must be a same-origin path");
  return `${routeHref("player")}#${encodeTarget(path)}`;
}

/** The SWF path the player page's fragment names, or null. */
export function readPlayerHash(hash: string): string | null {
  try {
    const path = decodeTarget(hash.replace(/^#/, ""));
    return isPath(path) ? path : null;
  } catch {
    return null;
  }
}

let script: Promise<void> | undefined;
function loadPlayer(): Promise<void> {
  // website2's settings for its page, and nothing on this page for the player to rewrite.
  window.RufflePlayer = window.RufflePlayer ?? {};
  window.RufflePlayer.config = {
    publicPath: build.directory,
    polyfills: false,
    autoplay: "on",
    letterbox: "on",
  };
  script ??= new Promise<void>((resolve, reject) => {
    const element = document.createElement("script");
    element.src = build.entry;
    element.onload = () => resolve();
    element.onerror = () => {
      script = undefined;
      element.remove();
      reject(new Error("The player could not be downloaded"));
    };
    document.head.append(element);
  });
  return script;
}

function fail(main: HTMLElement, message: string): void {
  const text = document.createElement("p");
  text.className = "systemya-player-error";
  text.textContent = message;
  main.replaceChildren(text);
}

/** Start the player page in `root`'s <main>. */
export function mountPlayer(root: HTMLElement): void {
  const main = root.querySelector<HTMLElement>("main.systemya-player");
  if (!main || main.dataset.bound === "1") return;
  main.dataset.bound = "1";
  const here = `${location.pathname}${location.search}${location.hash}`;
  if (window.parent === window) {
    openFrame(here, undefined, { replace: true });
    return;
  }
  // The frame's title becomes the tab's (proxy.ts), so it is the game's name.
  const title = frameTitle(here);
  if (title) document.title = title;
  const movie = readPlayerHash(location.hash);
  if (!movie) return fail(main, "This game could not be found");
  void loadPlayer()
    .then(() => {
      const player = window.RufflePlayer?.newest?.()?.createPlayer();
      if (!player) throw new Error("The player did not start");
      player.addEventListener("loadeddata", () => {
        main.dataset.load = "";
      });
      main.replaceChildren(player);
      const options = { url: new URL(movie, location.href).href };
      return player.ruffle
        ? player.ruffle().load(options)
        : player.load?.(options);
    })
    .catch((error: unknown) =>
      fail(
        main,
        error instanceof Error ? error.message : "The game could not be loaded",
      ),
    );
}
