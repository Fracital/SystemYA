import assert from "node:assert/strict";
import test from "node:test";
import {
  HISTORY_CAP,
  HISTORY_KEY,
  OLD_HISTORY_KEY,
  clearHistory,
  loadVisits,
  recordVisit,
} from "../src/systemya/omni/history.ts";
import { historyPicks, historySource } from "../src/systemya/omni/sources.ts";
import { NAME_WORDS } from "../scripts/check-neutral-dist.mjs";

const fakeStore = () => {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
    map,
  };
};

test("the key names neither a package nor a proxy", () => {
  assert.doesNotMatch(HISTORY_KEY, NAME_WORDS);
});

test("the history is the one the browser UI's omnibox keeps, and the old key moves to it", () => {
  assert.equal(HISTORY_KEY, "omnibox:visits");
  const store = fakeStore();
  const old = [{ id: "1", url: "https://a.example/", title: "A", at: 1 }];
  store.setItem(OLD_HISTORY_KEY, JSON.stringify(old));
  assert.deepEqual(loadVisits(store), old);
  assert.equal(store.getItem(HISTORY_KEY), JSON.stringify(old));
  assert.ok(!store.map.has(OLD_HISTORY_KEY));
  // when both exist (the UI's omnibox already wrote one), the current key wins
  const current = [{ id: "2", url: "https://b.example/", title: "B", at: 2 }];
  store.setItem(HISTORY_KEY, JSON.stringify(current));
  store.setItem(OLD_HISTORY_KEY, JSON.stringify(old));
  assert.deepEqual(loadVisits(store), current);
  assert.ok(!store.map.has(OLD_HISTORY_KEY));
});

test("a visit is recorded once per page a tab reaches, newest first, web pages only", () => {
  const store = fakeStore();
  const tab = {};
  recordVisit(tab, { url: "https://a.example/" }, { store, now: 1 });
  // the same page reported again, now with its title: the same visit
  recordVisit(
    tab,
    { url: "https://a.example/", title: "A" },
    { store, now: 2 },
  );
  recordVisit(tab, { url: "https://a.example/" }, { store, now: 3 });
  recordVisit(tab, { url: "about:blank" }, { store, now: 4 });
  recordVisit(
    tab,
    { url: "https://b.example/", title: "B" },
    { store, now: 5 },
  );
  // another tab on the same page is another visit
  recordVisit({}, { url: "https://b.example/" }, { store, now: 6 });
  const visits = loadVisits(store);
  assert.deepEqual(
    visits.map((v) => [v.url, v.title, v.at]),
    [
      ["https://b.example/", "", 6],
      ["https://b.example/", "B", 5],
      ["https://a.example/", "A", 1],
    ],
  );
  assert.equal(new Set(visits.map((v) => v.id)).size, 3);
});

test("only this origin's icons are kept", () => {
  const store = fakeStore();
  recordVisit(
    {},
    { url: "https://a.example/", icon: "https://a.example/favicon.ico" },
    { store },
  );
  recordVisit(
    {},
    { url: "https://b.example/", icon: "data:image/png;base64,AA" },
    { store },
  );
  assert.deepEqual(
    loadVisits(store).map((v) => v.icon),
    ["data:image/png;base64,AA", undefined],
  );
});

test("the history keeps the newest visits up to the cap", () => {
  const store = fakeStore();
  for (let i = 0; i < HISTORY_CAP + 25; i++)
    recordVisit({}, { url: `https://s${i}.example/` }, { store, now: i });
  const visits = loadVisits(store);
  assert.equal(visits.length, HISTORY_CAP);
  assert.equal(visits[0].url, `https://s${HISTORY_CAP + 24}.example/`);
  assert.equal(visits.at(-1).url, "https://s25.example/");
});

test("clearing forgets every visit, and a bad stored copy reads as none", () => {
  const store = fakeStore();
  const tab = {};
  recordVisit(tab, { url: "https://a.example/" }, { store });
  clearHistory(store);
  assert.deepEqual(loadVisits(store), []);
  assert.ok(!store.map.has(HISTORY_KEY));
  // the tab's last visit went with it: the same page again is a new visit
  recordVisit(tab, { url: "https://a.example/", title: "A" }, { store });
  assert.equal(loadVisits(store).length, 1);
  store.setItem(HISTORY_KEY, "{not json");
  assert.deepEqual(loadVisits(store), []);
  store.setItem(HISTORY_KEY, JSON.stringify([{ url: 1 }, null]));
  assert.deepEqual(loadVisits(store), []);
});

test("history ranks by frecency and the empty box gets the latest and the most visited", () => {
  const now = Date.now();
  const visits = [
    { id: "1", url: "https://news.example/", title: "News", at: now - 1000 },
    { id: "2", url: "https://often.example/", title: "Often", at: now - 2000 },
    { id: "3", url: "https://often.example/", title: "Often", at: now - 3000 },
    { id: "4", url: "https://often.example/", title: "Often", at: now - 4000 },
  ];
  const rows = historySource("often", visits);
  const often = rows.find((r) => r.url === "https://often.example/");
  assert.ok(often.score > 0.79 && often.score < 0.81);
  assert.equal(rows.find((r) => r.url === "https://news.example/").score, 0);
  const picks = historyPicks(visits, ["https://news.example"]);
  assert.deepEqual(
    picks.recentSites.map((r) => r.url),
    ["https://often.example/"],
  );
  assert.deepEqual(
    picks.topSites.map((r) => r.url),
    ["https://often.example/"],
  );
});
