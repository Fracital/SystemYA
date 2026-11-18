// holt's chat links to the platform's views by setting the parent page's hash ("#/account"), the
// way abulxt routes (holt main/src/lib/navigate.ts). SystemYA has real pages, so /chat/ turns those
// hashes into page loads instead of leaving the visitor on /chat/#/account.
const VIEWS: Record<string, string> = {
  account: "/account/",
  settings: "/account/",
  "verify-email": "/account/",
  pricing: "/account/",
  home: "/",
  games: "/theatre.html",
  privacy: "/privacy.html",
  tos: "/privacy.html",
  chat: "/chat/",
};

function follow(): void {
  const view = /^#\/([a-z-]+)/.exec(location.hash)?.[1];
  if (!view) return;
  const target = VIEWS[view] ?? "/";
  history.replaceState(null, "", location.pathname + location.search);
  if (target !== location.pathname) location.assign(target);
}

let bound = false;

export function mountChatLinks(root: HTMLElement): void {
  if (root.dataset.page !== "chat") return;
  follow();
  if (bound) return;
  bound = true;
  window.addEventListener("hashchange", () => {
    if (document.querySelector<HTMLElement>("#root")?.dataset.page === "chat")
      follow();
  });
}
