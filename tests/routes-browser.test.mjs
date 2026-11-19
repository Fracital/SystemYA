// The route book in a browser: a built dist/ served the way the edge serves it (a file, a
// folder's index.html, or else /index.html), driven by headless Chrome. Skipped unless dist/ is
// built and playwright-core is given:
//
//   PLAYWRIGHT_CORE=<path to playwright-core/index.mjs> CHROME=<chrome binary> \
//     node --test tests/routes-browser.test.mjs
//
// /room/, /cdn/ and /api/ are not served, so this checks routing, not chat, games or sign-in.
import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { existsSync } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const skip = !existsSync(join(dist, "index.html"))
  ? "no build in dist/"
  : !process.env.PLAYWRIGHT_CORE
    ? "PLAYWRIGHT_CORE is not set"
    : false;

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
};

async function isFile(path) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

function serve() {
  const server = createServer(async (req, res) => {
    const { pathname } = new URL(req.url, "http://x");
    if (/^\/(room|cdn|v1|api)\//.test(pathname)) {
      res.writeHead(404).end();
      return;
    }
    let file = normalize(join(dist, decodeURIComponent(pathname)));
    if (!file.startsWith(dist)) file = join(dist, "index.html");
    else if (!(await isFile(file)))
      file = (await isFile(join(file, "index.html")))
        ? join(file, "index.html")
        : join(dist, "index.html");
    res.writeHead(200, {
      "content-type": types[extname(file)] ?? "application/octet-stream",
    });
    res.end(await readFile(file));
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok(server)));
}

test(
  "addresses, old paths, clicks, Back and Forward in a browser",
  { skip },
  async () => {
    const { chromium } = await import(
      pathToFileURL(process.env.PLAYWRIGHT_CORE).href
    );
    const server = await serve();
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch({
      executablePath: process.env.CHROME || "/usr/bin/google-chrome",
      args: ["--no-sandbox", "--disable-gpu"],
    });
    try {
      const page = await browser.newPage();
      const errors = [];
      page.on("pageerror", (error) => {
        // Back pressed again before the cross-fade ends skips it; the router reports that
        if (!/Transition was skipped/.test(String(error)))
          errors.push(String(error));
      });
      const where = () =>
        page.evaluate(() => ({
          url: location.pathname + location.search + location.hash,
          page: document.getElementById("root")?.dataset.page,
        }));
      const open = async (path) => {
        await page.goto(base + path);
        return where();
      };

      const direct = {
        "/": "home",
        "/?1": "theatre",
        "/?2": "app",
        "/?3": "chat",
        "/?4": "support",
        "/?5": "contact",
        "/?6": "privacy",
        "/?7": "account",
        "/?8": "bookmark",
        "/?9": "not-found",
        "/nope": "not-found",
      };
      for (const [path, shown] of Object.entries(direct))
        assert.deepEqual(await open(path), { url: path, page: shown });
      assert.equal(
        await page.evaluate(() =>
          document.querySelector("#root > nav a[href='/?3']") ? "linked" : "",
        ),
        "linked",
      );

      const old = {
        "/theatre.html?category=action&page=2": [
          "/?1&category=action&page=2",
          "theatre",
        ],
        "/app/#abc": ["/?2#abc", "app"],
        "/chat": ["/?3", "chat"],
        "/chat.html": ["/?3", "chat"],
        "/support.html": ["/?4", "support"],
        "/bookmark.html": ["/?8", "bookmark"],
      };
      for (const [path, [url, shown]] of Object.entries(old))
        assert.deepEqual(await open(path), { url, page: shown });

      // an email link: the account page reads it, then the address is the page's number
      await open("/account/?reset=1&token=x");
      await page.waitForFunction(() =>
        /New password/.test(
          document.querySelector("#systemya-account")?.textContent ?? "",
        ),
      );
      assert.equal((await where()).url, "/?7");

      // clicks stay in the document, from "/" and from an old path's file
      for (const start of ["/", "/support.html"]) {
        await open(start);
        const origin = await page.evaluate(() => performance.timeOrigin);
        const seen = [(await where()).url];
        for (const [href, shown] of [
          ["/?1", "theatre"],
          // in a footer, which the full-screen chat hides
          ["/?5", "contact"],
          ["/?3", "chat"],
          ["/", "home"],
        ]) {
          await page.locator(`#root a[href="${href}"]`).first().click();
          await page.waitForFunction(
            (want) => document.getElementById("root")?.dataset.page === want,
            shown,
          );
          assert.deepEqual(await where(), { url: href, page: shown });
          seen.push(href);
        }
        for (let i = seen.length - 2; i >= 0; i--) {
          await page.goBack();
          await page.waitForFunction(
            (url) => location.pathname + location.search === url,
            seen[i],
          );
        }
        await page.goForward();
        await page.waitForFunction(
          () => document.getElementById("root")?.dataset.page === "theatre",
        );
        assert.equal(
          await page.evaluate(() => performance.timeOrigin),
          origin,
          "a click reloaded the page",
        );
      }
      assert.deepEqual(errors, []);
    } finally {
      await browser.close();
      server.close();
    }
  },
);
