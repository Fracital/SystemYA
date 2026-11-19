// holt's chat links to the platform's views by setting the parent page's hash ("#/account"), the
// way abulxt routes (holt main/src/lib/navigate.ts). SystemYA's pages are numbers in the route
// book (routes.ts), so the chat page turns those hashes into a navigation to the page's number
// instead of leaving the visitor on /?3#/account.
import { navigate } from "astro:transitions/client";
import { routeHref, type RoutePage } from "./routes";

const VIEWS: Record<string, RoutePage> = {
  account: "account",
  settings: "account",
  "verify-email": "account",
  pricing: "account",
  home: "index",
  games: "theatre",
  privacy: "privacy",
  tos: "privacy",
  chat: "chat",
};

/** Where holt's `#/<view>` leads: the page's number, or home for a view SystemYA lacks. */
export function chatViewHref(hash: string): string | null {
  const view = /^#\/([a-z-]+)/.exec(hash)?.[1];
  if (!view) return null;
  return routeHref(
    Object.prototype.hasOwnProperty.call(VIEWS, view) ? VIEWS[view] : "index",
  );
}

/** The chat page's own history entry, as the router left it. */
let chatState: unknown = null;

function follow(): void {
  const target = chatViewHref(location.hash);
  if (!target) return;
  const here = location.pathname + location.search;
  // Setting the hash added an entry with no router state. It becomes the chat page's again, and
  // the view replaces it, so Back from the view is the chat.
  history.replaceState(
    chatState ?? history.state ?? { index: 0, scrollX: 0, scrollY: 0 },
    "",
    here,
  );
  if (target !== here) void navigate(target, { history: "replace" });
}

let bound = false;

export function mountChatLinks(root: HTMLElement): void {
  if (root.dataset.page !== "chat") return;
  chatState = history.state;
  follow();
  if (bound) return;
  bound = true;
  window.addEventListener("hashchange", () => {
    if (document.querySelector<HTMLElement>("#root")?.dataset.page === "chat")
      follow();
  });
}
