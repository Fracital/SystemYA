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
  | "app";

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
};

// The 2022 banner names the Insta-Proxy page in plain text. Every page carries it, and index.html
// now holds every page, so it is wrapped like Support's text and doesn't show in the page source.
const BANNER_NAME = "Insta-Proxy";
const wrapBanner = (markup: string): string =>
  markup.replace(/(<div class="banner">[\s\S]*?<\/div>)/g, (banner) =>
    banner.split(BANNER_NAME).join(obfuscateText(BANNER_NAME)),
  );

export function getSystemYASnapshot(page: SystemYAPage): string {
  return wrapBanner(renderSnapshot(page));
}

function renderSnapshot(page: SystemYAPage): string {
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
