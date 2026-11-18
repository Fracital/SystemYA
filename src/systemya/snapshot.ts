import home from "./snapshots/index.html?raw";
import theatre from "./snapshots/theatre.html?raw";
import support from "./snapshots/support.html?raw";
import contact from "./snapshots/contact.html?raw";
import privacy from "./snapshots/privacy.html?raw";
import { BOOKMARK_MAIN } from "./bookmark";

export type SystemYAPage =
  | "index"
  | "theatre"
  | "support"
  | "contact"
  | "privacy"
  | "chat"
  | "account"
  | "bookmark";

const snapshots: Record<SystemYAPage, string> = {
  index: home,
  theatre,
  support,
  contact,
  privacy,
  chat: "",
  account: "",
  bookmark: "",
};

export function getSystemYASnapshot(page: SystemYAPage): string {
  if (page === "chat" || page === "account" || page === "bookmark") {
    const navbar = home.match(/<nav\b[^>]*>[\s\S]*?<\/nav>/)?.[0] ?? "";
    const footer = home.match(/<footer\b[^>]*>[\s\S]*?<\/footer>/)?.[0] ?? "";
    if (page === "bookmark") return `${navbar}${BOOKMARK_MAIN}${footer}`;
    if (page === "account")
      return `${navbar}<main class="systemya-account" id="systemya-account" aria-label="Account"></main>${footer}`;
    return `${navbar}<main class="systemya-chat" aria-label="SystemYA community chat"><iframe src="/room/" title="SystemYA Chat" loading="eager" allow="clipboard-write; autoplay"></iframe></main>${footer}`;
  }
  return snapshots[page];
}
