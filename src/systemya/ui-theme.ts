/**
 * Make the vendored browser UI (/app/'s frame, powerMouse's demo host) follow SystemYA's own
 * light/dark. SystemYA keeps its choice on #root's data-theme ("light"/"dark", set and toggled by
 * interactions.ts from localStorage "systemya-theme"); powerMouse's theme.js keeps its own on the
 * shared localStorage key below and exposes globalThis.PMTheme in the frame.
 *
 * The shell and the UI frame are the same origin, so they share localStorage. We write the key
 * before the frame loads, so theme.js paints the right scheme on the first frame (it reads the key
 * before body parse), and we re-apply through the frame's PMTheme when SystemYA's theme switches.
 */

import build from "./stomp-build.json";

const CHOICE_KEY = "stomp-demo:theme";
/** The UI's built-in themes for SystemYA's light and dark (scripts/prepare-powermouse.mjs). */
const THEMES = build.uiThemes;

type PMTheme = { apply(id: string): unknown };

/**
 * PMTheme's built-in id for SystemYA's current appearance: night maps to Dark, else to SystemYA
 * Light (Light in a UI from before it). The pages' preference (Settings, Page appearance) matches
 * the theme's scheme unless the visitor chose one there.
 */
function uiThemeChoice(): string {
  const root = document.getElementById("root");
  return root?.dataset.theme === "dark" ? THEMES.dark : THEMES.light;
}

/** Store the choice so theme.js paints it on the next frame load. Storage can throw; ignore it. */
function writeChoice(choice: string): void {
  try {
    localStorage.setItem(CHOICE_KEY, choice);
  } catch {
    // private mode or full storage: the live apply below still reaches a loaded frame.
  }
}

/** The frame's PMTheme, if its theme.js has run. Same origin, but guard anyway. */
function framePMTheme(frame: HTMLIFrameElement): PMTheme | null {
  try {
    const pm = (frame.contentWindow as unknown as { PMTheme?: PMTheme })
      ?.PMTheme;
    return pm && typeof pm.apply === "function" ? pm : null;
  } catch {
    return null;
  }
}

/**
 * Keep the browser UI in `frame` in SystemYA's light/dark. Call before the frame's src is set, so
 * the stored choice is in place for the first paint. Returns a teardown that stops following.
 */
export function syncUiTheme(frame: HTMLIFrameElement): () => void {
  // Before the frame loads, theme.js has no PMTheme yet: the stored key is the only path in.
  writeChoice(uiThemeChoice());

  const root = document.getElementById("root");

  const apply = (): void => {
    const choice = uiThemeChoice();
    const pm = framePMTheme(frame);
    // PMTheme.apply writes the choice key itself, so one or the other keeps both sides in step.
    if (pm) pm.apply(choice);
    else writeChoice(choice);
  };

  // When the frame finishes loading, re-apply in case the theme changed while it was loading.
  const onLoad = (): void => apply();
  frame.addEventListener("load", onLoad);

  // Follow a live switch: interactions.ts flips #root's data-theme, the same signal
  // historical-media.ts watches.
  let observer: MutationObserver | undefined;
  if (root) {
    observer = new MutationObserver(apply);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
  }

  return () => {
    observer?.disconnect();
    frame.removeEventListener("load", onLoad);
  };
}
