// SystemYA's side of the browser UI (powerMouse's demo host). scripts/prepare-powermouse.mjs
// copies this file into the UI directory under a stamped name, fills in CONFIG, and loads it
// after the controller script and before the UI's main script. The UI runs in the frame of
// /app/ (src/systemya/proxy.ts), the parent here.
(() => {
  const CONFIG = __SYSTEMYA_FRAME_CONFIG__;

  // The runtime is served under this build's names (scripts/prepare-stomp.mjs), and the helper
  // globals are minted per build: every controller the UI starts is told both.
  const Base = window.StompController;
  window.StompController = class extends Base {
    static register(directory, options) {
      return Base.register(directory, { ...options, assets: CONFIG.assets });
    }
    constructor(init) {
      super({ ...init, assets: CONFIG.assets, names: CONFIG.names });
    }
  };

  // pm/main.js names the files it loads itself (the service worker, the address bars' dropdown)
  // from STOMP_ASSETS, falling back to the package's own names.
  window.STOMP_ASSETS = CONFIG.assets;

  // demo/server.js renders this as /config.js. SystemYA has no server, so it is fixed here:
  // same origin, Fracital's public Wisp relay, no site pool.
  window.STOMP_CONFIG = CONFIG.stomp;

  // The demo's server also answers /api/status and /api/commits. On SystemYA /api/ is
  // Fracital's API, so those requests never leave the page: the status line is off, and the
  // commit list asks GitHub's public API directly. The address bars' suggestions are the
  // package's omnibox, or with a STomp from before it, SystemYA's own (src/systemya/omni/ui.ts,
  // bundled after this file).
  const pageFetch = window.fetch.bind(window);
  const unavailable = () =>
    Promise.reject(new TypeError("Not available on SystemYA"));
  const COMMITS_KEY = "systemya:ui-commits";
  async function commits() {
    try {
      const kept = JSON.parse(sessionStorage.getItem(COMMITS_KEY) ?? "null");
      if (kept && Date.now() - kept.at < 600000)
        return Response.json(kept.data);
    } catch {}
    const answer = await pageFetch(
      `https://api.github.com/repos/${CONFIG.repo}/commits?per_page=30`,
      { headers: { accept: "application/vnd.github+json" } },
    );
    if (!answer.ok)
      return Response.json(
        { error: `GitHub answered ${answer.status}` },
        { status: 502 },
      );
    const list = await answer.json();
    const data = {
      repo: "GitHub",
      url: `https://github.com/${CONFIG.repo}`,
      commits: list.map((entry) => ({
        sha: entry.sha.slice(0, 7),
        message: String(entry.commit?.message ?? "").split("\n")[0],
        author: entry.commit?.author?.name ?? entry.author?.login ?? "",
        date: entry.commit?.author?.date ?? null,
        avatar: entry.author?.avatar_url ?? null,
        url: entry.html_url,
      })),
    };
    try {
      sessionStorage.setItem(
        COMMITS_KEY,
        JSON.stringify({ at: Date.now(), data }),
      );
    } catch {}
    return Response.json(data);
  }
  window.fetch = function (input, init) {
    let url;
    try {
      url = new URL(
        input instanceof Request ? input.url : input,
        location.href,
      );
    } catch {
      return pageFetch(input, init);
    }
    if (url.origin === location.origin) {
      if (url.pathname === "/api/commits") return commits();
      if (url.pathname === "/api/status") return unavailable();
    }
    return pageFetch(input, init);
  };

  // The repository links (left as "#" in the copied page).
  addEventListener("DOMContentLoaded", () => {
    for (const link of document.querySelectorAll('a[href="#"]'))
      link.href = `https://github.com/${CONFIG.repo}`;
  });

  // The parent mirrors this document's fragment (the route of the page on show) into its own.
  const framed = window.parent !== window;
  const report = () => {
    if (framed)
      window.parent.postMessage(
        { systemya: "hash", hash: location.hash },
        location.origin,
      );
  };
  // What to open first: the parent puts it on this frame's element (proxy.ts), so the frame's
  // address names nothing. pm/main.js reads it from location.hash once its controller is up.
  const initial = framed ? window.frameElement?.systemyaHash : null;
  if (typeof initial === "string" && initial)
    history.replaceState(null, "", initial);
  for (const method of ["pushState", "replaceState"]) {
    const original = history[method];
    history[method] = function (...args) {
      const result = original.apply(this, args);
      report();
      return result;
    };
  }
  addEventListener("hashchange", report);

  // The parent's address bar, links and game launches open their URL here, in the active tab.
  addEventListener("message", (event) => {
    if (event.origin !== location.origin || event.source !== window.parent)
      return;
    const data = event.data;
    if (data?.systemya === "open" && typeof data.url === "string")
      // pm/main.js's navigate(), a global of that classic script
      void window.navigate(data.url);
  });
})();
