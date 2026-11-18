import { mountHistoricalMedia } from "./historical-media";
import { openStomp, openEmbed, closeService, reloadService } from "./stomp";
import { mountGamesSDK } from "./games-sdk";
import { mountAccount, startAccountSession } from "./account";
import { mountBookmark } from "./bookmark";
import { mountChatLinks } from "./chat-links";
// Astro ClientRouter preserves same-document navigation between the recovered pages.
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
  // nginx serves /index.html for unknown routes; draw our own 404 in the SPA.
  const knownPaths = new Set([
    "/",
    "/index.html",
    "/theatre.html",
    "/support.html",
    "/contact.html",
    "/privacy.html",
    "/chat",
    "/chat/",
    "/chat.html",
    "/account",
    "/account/",
    "/bookmark.html",
    "/404.html",
  ]);
  if (!knownPaths.has(window.location.pathname)) {
    const main = root.querySelector("main");
    if (main) {
      main.replaceChildren();
      const heading = document.createElement("h1");
      heading.textContent = "Page not found";
      const home = document.createElement("a");
      home.href = "/";
      home.textContent = "Home";
      main.append(heading, home);
    }
    root.dataset.page = "not-found";
  }
  mountHistoricalMedia(root);
  mountGamesSDK(root);
  mountAccount(root);
  mountBookmark(root);
  mountChatLinks(root);
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
      const url = targetUrl(input.value);
      void openStomp(url);
    });
  }

  for (const card of root.querySelectorAll<HTMLElement>(
    ".items > .item[data-target]",
  )) {
    const openCard = () => {
      const target = card.dataset.target;
      const src = card.dataset.src;
      if (!target || !src) return;
      if (target === "proxy") void openStomp(src);
      else if (target === "embed")
        openEmbed(src, card.dataset.title ?? "Theatre");
      else if (target === "webretro") {
        const embedded = `/assets/theatre/WebRetro/?rom=${encodeURIComponent(src)}&core=autodetect`;
        openEmbed(embedded, card.dataset.title ?? "Theatre");
      }
    };
    card.addEventListener("click", openCard);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openCard();
      }
    });
  }

  for (const section of root.querySelectorAll<HTMLElement>("main > section")) {
    const items = section.querySelector<HTMLElement>(".items");
    const expandButton = section.querySelector<HTMLElement>(".items-expand");
    if (!items || !expandButton) continue;
    const measure = () => {
      if (!section.isConnected) return;
      const prev = section.dataset.expanded;
      section.dataset.expanded = "0";
      section.dataset.overflowing =
        items.scrollHeight > items.clientHeight + 1 ? "1" : "0";
      section.dataset.expanded = prev ?? "0";
    };
    expandButton.addEventListener("click", () => {
      section.dataset.expanded = section.dataset.expanded === "1" ? "0" : "1";
      expandButton.textContent =
        section.dataset.expanded === "1" ? "expand_less" : "expand_more";
    });
    expandButton.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        expandButton.click();
      }
    });
    window.addEventListener("resize", measure);
    requestAnimationFrame(measure);
    document.addEventListener(
      "astro:before-swap",
      () => window.removeEventListener("resize", measure),
      { once: true },
    );
  }

  document
    .querySelector("#systemya-close-service")
    ?.addEventListener("click", closeService);
  document
    .querySelector("#systemya-reload-service")
    ?.addEventListener("click", () => {
      void reloadService();
    });
  document
    .querySelector("#systemya-fullscreen-service")
    ?.addEventListener("click", () => {
      void document
        .querySelector<HTMLIFrameElement>("#systemya-service-frame")
        ?.requestFullscreen();
    });

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
