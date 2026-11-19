/**
 * The sites the browser page's tabs visited (after Fracital's src/libs/browsingHistory.ts), kept
 * only in this browser's localStorage and never sent anywhere. The browser UI records a visit
 * whenever a tab reaches a page (ui.ts); both omniboxes rank them with rank.ts's frecency. The
 * newest HISTORY_CAP visits are kept, newest first. "Clear history" in the UI's menu empties it.
 *
 * A tab reports where it is again and again (on load and while its page is on show), and its
 * title arrives after its address, so a report for the address the tab's last visit already has
 * updates that visit instead of adding one.
 */
import type { HistoryEntry } from "./rank.ts";

export const HISTORY_KEY = "systemya:visits";
/** Fracital's cap for a history kept only in the browser. */
export const HISTORY_CAP = 5000;

export interface Visit extends HistoryEntry {
  id: string;
}

type Store = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const local = (): Store | null => {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
};

const isVisit = (v: unknown): v is Visit =>
  !!v &&
  typeof (v as Visit).id === "string" &&
  typeof (v as Visit).url === "string" &&
  typeof (v as Visit).title === "string" &&
  typeof (v as Visit).at === "number";

let cached: { raw: string | null; visits: Visit[] } = { raw: null, visits: [] };

/** The visits, newest first; parsed again only when the stored copy changed. */
export function loadVisits(store: Store | null = local()): Visit[] {
  let raw: string | null = null;
  try {
    raw = store?.getItem(HISTORY_KEY) ?? null;
  } catch {}
  if (raw === cached.raw) return cached.visits;
  let visits: Visit[] = [];
  try {
    const saved: unknown = JSON.parse(raw ?? "[]");
    if (Array.isArray(saved)) visits = saved.filter(isVisit);
  } catch {}
  cached = { raw, visits };
  return visits;
}

function save(visits: Visit[], store: Store | null) {
  try {
    const raw = JSON.stringify(visits);
    store?.setItem(HISTORY_KEY, raw);
    cached = { raw, visits };
  } catch {
    // Storage full or unavailable: history just isn't kept this time.
  }
}

/** Each tab's latest visit, so a report of the same address (with its title) lands on it. */
const lastByTab = new Map<unknown, string>();

let counter = 0;
const newId = (now: number) =>
  `${now.toString(36)}${(++counter).toString(36)}${Math.random().toString(36).slice(2, 8)}`;

/** Only icons this origin serves or holds; a site's own icon address would be fetched outside the browser. */
const keptIcon = (icon: unknown): string | undefined =>
  typeof icon === "string" &&
  (icon.startsWith("data:image/") || /^\/(?!\/)[\w./-]+$/.test(icon))
    ? icon
    : undefined;

/** Records that `tab` (any key) is on `entry.url`. Only web pages count. */
export function recordVisit(
  tab: unknown,
  entry: { url: string; title?: string; icon?: unknown },
  {
    store = local(),
    now = Date.now(),
  }: { store?: Store | null; now?: number } = {},
): void {
  if (!/^https?:\/\//i.test(entry.url)) return;
  const title = entry.title?.trim() ?? "";
  const icon = keptIcon(entry.icon);
  const visits = loadVisits(store);
  const lastId = lastByTab.get(tab);
  const last = lastId ? visits.find((v) => v.id === lastId) : undefined;
  if (last && last.url === entry.url) {
    if ((!title || title === last.title) && (!icon || icon === last.icon))
      return;
    save(
      visits.map((v) =>
        v.id === last.id
          ? { ...v, title: title || v.title, ...(icon ? { icon } : {}) }
          : v,
      ),
      store,
    );
    return;
  }
  const visit: Visit = {
    id: newId(now),
    url: entry.url,
    title,
    ...(icon ? { icon } : {}),
    at: now,
  };
  lastByTab.set(tab, visit.id);
  save([visit, ...visits].slice(0, HISTORY_CAP), store);
}

/** Forgets every visit. */
export function clearHistory(store: Store | null = local()): void {
  lastByTab.clear();
  try {
    store?.removeItem(HISTORY_KEY);
  } catch {}
}
