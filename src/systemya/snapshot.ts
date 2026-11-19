import home from "./snapshots/index.html?raw";
import theatre from "./snapshots/theatre.html?raw";
import support from "./snapshots/support.html?raw";
import contact from "./snapshots/contact.html?raw";
import privacy from "./snapshots/privacy.html?raw";
import { BOOKMARK_MAIN } from "./bookmark";
import { obfuscateText } from "./obfuscate";

export type SystemYAPage =
  | "index"
  | "theatre"
  | "support"
  | "contact"
  | "privacy"
  | "chat"
  | "account"
  | "bookmark"
  | "app"
  | "player";

const snapshots: Record<SystemYAPage, string> = {
  index: home,
  theatre,
  support,
  contact,
  privacy,
  chat: "",
  account: "",
  bookmark: "",
  app: "",
  player: "",
};

// The 2022 banner names the Insta-Proxy page in plain text. Every page carries it, and index.html
// now holds every page, so it is wrapped like Support's text and doesn't show in the page source.
const BANNER_NAME = "Insta-Proxy";
const wrapBanner = (markup: string): string =>
  markup.replace(/(<div class="banner">[\s\S]*?<\/div>)/g, (banner) =>
    banner.split(BANNER_NAME).join(obfuscateText(BANNER_NAME)),
  );

// The 2022 footer reads "SystemYA 2022". It shows the current year instead, as website2's footer
// does: the build's year in the page, and the visitor's (UTC) on every page load
// (interactions.ts), so a page built last December still says this year.
const FOOTER_YEAR =
  /(<footer\b[^>]*>[\s\S]*?<span class="brand-text">SystemYA<\/span> )2022(<\/span><\/footer>)/g;
const YEAR_CLASS = "systemya-year";
const currentYear = (markup: string): string =>
  markup.replace(
    FOOTER_YEAR,
    `$1<span class="${YEAR_CLASS}">${new Date().getUTCFullYear()}</span>$2`,
  );

export function getSystemYASnapshot(page: SystemYAPage): string {
  return currentYear(wrapBanner(renderSnapshot(page)));
}

function renderSnapshot(page: SystemYAPage): string {
  // The Flash player runs in the browser page's frame (openFrame), under that page's navbar, so
  // its own page is only the player's <main> (player.ts).
  if (page === "player")
    return '<main class="systemya-player" aria-label="Game"></main>';
  if (
    page === "chat" ||
    page === "account" ||
    page === "bookmark" ||
    page === "app"
  ) {
    const navbar = home.match(/<nav\b[^>]*>[\s\S]*?<\/nav>/)?.[0] ?? "";
    const footer = home.match(/<footer\b[^>]*>[\s\S]*?<\/footer>/)?.[0] ?? "";
    if (page === "bookmark") return `${navbar}${BOOKMARK_MAIN}${footer}`;
    // proxy.ts puts the browser UI's frame (or a same-origin page) in main.
    if (page === "app")
      return `${navbar}<main class="systemya-app"></main>${footer}`;
    if (page === "account")
      return `${navbar}<main class="systemya-account" id="systemya-account" aria-label="Account"></main>${footer}`;
    return `${navbar}<main class="systemya-chat" aria-label="SystemYA community chat"><iframe src="/room/" title="SystemYA Chat" loading="eager" allow="clipboard-write; autoplay"></iframe></main>${footer}`;
  }
  return snapshots[page];
}
