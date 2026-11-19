// First, so it sees the body as it was served.
import "./router";
import { mountHistoricalMedia } from "./historical-media";
import { mountProxy, openProxy } from "./proxy";
import { mountTheatre } from "./theatre";
import { mountAccount, startAccountSession } from "./account";
import { mountBookmark } from "./bookmark";
import { mountChatLinks } from "./chat-links";
// Astro ClientRouter preserves same-document navigation between the recovered pages, all of them
// served from "/" by number (routes.ts).
// Each page-load rebinds the captured 2022 markup without injecting a new interface.

function targetUrl(value: string): string {
  const input = value.trim();
  if (/^https?:\/\//i.test(input)) return input;
  if (/^[^\s]+\.[^\s]+$/.test(input)) return `https://${input}`;
  return `https://www.google.com/search?q=${encodeURIComponent(input)}`;
}

function initSystemYA(): void {
  const root = document.querySelector<HTMLElement>("#root");
  const nav = root?.querySelector<HTMLElement>("nav");
  if (!root || !nav || nav.dataset.bound === "1") return;
  nav.dataset.bound = "1";

  try {
    root.dataset.theme =
      localStorage.getItem("systemya-theme") === "dark" ? "dark" : "light";
  } catch {
    root.dataset.theme = "light";
  }
  // Which page #root shows (and the not-found page for an address that names none) is the
  // route book's call (routes.ts, router.ts).
  mountHistoricalMedia(root);
  mountTheatre(root);
  mountAccount(root);
  mountBookmark(root);
  mountChatLinks(root);
  if (root.dataset.page === "app") mountProxy(root);
  startAccountSession();
  nav.dataset.expanded = "0";
  nav.dataset.search = "0";

  const mobile = nav.querySelector<HTMLElement>(".expand");
  mobile?.setAttribute("role", "button");
  mobile?.setAttribute("tabindex", "0");
  const expand = (): void => {
    nav.dataset.expanded = nav.dataset.expanded === "1" ? "0" : "1";
  };
  mobile?.addEventListener("click", expand);
  mobile?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      expand();
    }
  });

  nav
    .querySelector<HTMLButtonElement>("button.search")
    ?.addEventListener("click", () => {
      nav.dataset.search = "1";
      nav.querySelector<HTMLInputElement>("form.omnibox input")?.focus();
    });
  nav
    .querySelector<HTMLButtonElement>("form.omnibox button.cancel")
    ?.addEventListener("click", () => {
      nav.dataset.search = "0";
    });
  nav
    .querySelector<HTMLButtonElement>("button.lightswitch")
    ?.addEventListener("click", () => {
      const theme = root.dataset.theme === "light" ? "dark" : "light";
      root.dataset.theme = theme;
      try {
        localStorage.setItem("systemya-theme", theme);
      } catch {}
    });

  for (const form of root.querySelectorAll<HTMLFormElement>("form.omnibox")) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = form.querySelector<HTMLInputElement>("input");
      if (!input?.value.trim()) return;
      nav.dataset.search = "0";
      openProxy(targetUrl(input.value));
    });
  }

  const heading = root.querySelector<HTMLElement>("[data-typewriter]");
  if (
    heading &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const words = [
      "Easier",
      "More Secure.",
      "More Private.",
      "Uncensored.",
      "Safer.",
      "More Fun.",
    ];
    let wordIndex = 0;
    let letters = words[0].length;
    let removing = false;
    let timer: number | undefined;
    const advance = (): void => {
      if (!heading.isConnected) return;
      const word = words[wordIndex];
      heading.textContent = word.slice(0, letters);
      if (!removing && letters === word.length) {
        removing = true;
        timer = window.setTimeout(advance, 1700);
      } else if (removing && letters === 0) {
        removing = false;
        wordIndex = (wordIndex + 1) % words.length;
        timer = window.setTimeout(advance, 300);
      } else {
        letters += removing ? -1 : 1;
        timer = window.setTimeout(advance, removing ? 55 : 95);
      }
    };
    advance();
    document.addEventListener(
      "astro:before-swap",
      () => window.clearTimeout(timer),
      { once: true },
    );
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.isConnected) {
      nav.dataset.search = "0";
      nav.dataset.expanded = "0";
    }
  });
}

document.addEventListener("astro:page-load", initSystemYA);
if (document.readyState !== "loading") initSystemYA();
