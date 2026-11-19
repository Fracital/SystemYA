#!/usr/bin/env node
/*
 * stomp-smoke.mjs: starts STomp from a built site and opens a page through it.
 * Serves dist/ on 127.0.0.1, loads the home page in headless Chrome, and there
 * starts a controller from the runtime dist/ ships, under the relay in
 * src/systemya/stomp-config.json and the directory, file names and helper
 * names in src/systemya/stomp-build.json (what scripts/prepare-stomp.mjs wrote
 * for the build in dist/), then opens https://example.com/ in a frame and
 * waits for its title. The browser UI's page must be in dist/ too. Fails on a STomp error, on
 * a timeout, and on any file under the runtime directory that the page asks
 * for and dist/ does not have (a STomp release that needs a file
 * prepare-stomp.mjs does not copy).
 *
 * The build and the tests never start STomp; this does. It needs the public
 * Wisp relay in the config and example.com to be reachable.
 *
 *   node scripts/stomp-smoke.mjs [dist]
 *
 * Chrome: CHROME=<binary>, default /usr/bin/google-chrome. playwright-core:
 * PLAYWRIGHT_CORE=<path to its index.mjs>, default the installed package.
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(process.argv[2] ?? "dist");
const config = {
  ...JSON.parse(
    await readFile(
      new URL("../src/systemya/stomp-config.json", import.meta.url),
    ),
  ),
  // this build's directory, file names and helper names (prepare-stomp.mjs)
  ...JSON.parse(
    await readFile(
      new URL("../src/systemya/stomp-build.json", import.meta.url),
    ),
  ),
};
const target = "https://example.com/";
const expectTitle = "Example Domain";
const timeout = 60_000;

const { chromium } = await import(
  process.env.PLAYWRIGHT_CORE
    ? pathToFileURL(process.env.PLAYWRIGHT_CORE).href
    : "playwright-core"
);

// The edge's nginx has no type for .mjs, so it gets none here either.
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".wasm": "application/wasm",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

async function file(path) {
  try {
    return (await stat(path)).isFile() ? path : null;
  } catch {
    return null;
  }
}

const server = createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const local = normalize(join(root, pathname));
  if (!local.startsWith(root)) {
    res.writeHead(403).end();
    return;
  }
  const found =
    (await file(local)) ??
    (await file(`${local}.html`)) ??
    (await file(join(local, "index.html")));
  if (!found) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, {
    "content-type": types[extname(found)] ?? "application/octet-stream",
    "cache-control": "no-store",
  });
  res.end(await readFile(found));
});
await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
const base = `http://127.0.0.1:${server.address().port}/`;

const browser = await chromium.launch({
  executablePath: process.env.CHROME || "/usr/bin/google-chrome",
  args: ["--no-sandbox", "--disable-gpu"],
});
const missing = [];
const failures = [];
try {
  const page = await browser.newPage();
  page.on("response", (response) => {
    const url = new URL(response.url());
    if (
      url.origin === new URL(base).origin &&
      url.pathname.startsWith(config.directory) &&
      response.status() >= 400
    )
      missing.push(`${response.status()} ${url.pathname}`);
  });
  page.on("pageerror", (error) => console.log(`  [pageerror] ${error}`));
  if (config.ui) {
    const ui = await page.request.get(new URL(config.ui, base).href);
    if (!ui.ok())
      failures.push(`the UI page ${config.ui} answers ${ui.status()}`);
  }
  await page.goto(base);
  const result = await page.evaluate(
    async ({
      directory,
      wisp,
      assets,
      controller: module,
      transport,
      names,
      target,
      timeout,
    }) => {
      const within = (promise, what) =>
        Promise.race([
          promise,
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`${what} timed out`)), timeout),
          ),
        ]);
      try {
        const { default: Controller } = await import(`${directory}${module}`);
        const registration = await within(
          Controller.register(directory, { assets }),
          "register()",
        );
        const controller = new Controller({
          serviceworker: registration,
          transport: {
            module: `${directory}${transport.epoxy}`,
            options: [{ wisp }],
            http3: { module: `${directory}${transport.h3}` },
          },
          directory,
          assets,
          names,
          codec: "xor",
        });
        await within(controller.wait(), "wait()");
        const iframe = document.createElement("iframe");
        document.body.append(iframe);
        const frame = controller.createFrame(iframe);
        await within(frame.go(target), `go(${target})`);
        return { title: frame.title, url: frame.url };
      } catch (error) {
        return { error: String(error?.message ?? error) };
      }
    },
    { ...config, target, timeout },
  );
  if (result.error) failures.push(result.error);
  else if (result.title !== expectTitle)
    failures.push(`${target} opened as "${result.title}" (${result.url})`);
  else console.log(`PASS ${target} opened through STomp: "${result.title}"`);

  // The same page through the browser on /?2, as a visitor opens it: the UI's own code registers
  // the service worker and starts the controller (a UI that names a file dist/ does not have, as
  // e5f74c5's serviceWorker.js did, fails here and not above). A context of its own, so the
  // worker the first check registered is not already there.
  const visitor = await browser.newContext();
  visitor.on("response", (response) => {
    const url = new URL(response.url());
    if (
      url.origin === new URL(base).origin &&
      url.pathname.startsWith(config.directory) &&
      response.status() >= 400
    )
      missing.push(`${response.status()} ${url.pathname}`);
  });
  const app = await visitor.newPage();
  app.on("pageerror", (error) => console.log(`  [pageerror /?2] ${error}`));
  await app.goto(`${base}?2`);
  const started = Date.now();
  let ui = null;
  while (!ui && Date.now() - started < timeout) {
    ui = app
      .frames()
      .find((frame) => frame.url().includes(config.ui ?? "/ui/"));
    if (!ui) await app.waitForTimeout(250);
  }
  if (!ui) failures.push("/?2 did not show the browser UI's frame");
  else {
    const bar = ui.locator("input").first();
    await bar.fill(target);
    await bar.press("Enter");
    let title = "";
    while (title !== expectTitle && Date.now() - started < 2 * timeout) {
      for (const frame of app.frames())
        if ((await frame.title().catch(() => "")) === expectTitle)
          title = expectTitle;
      if (title !== expectTitle) await app.waitForTimeout(500);
    }
    if (title === expectTitle)
      console.log(`PASS ${target} opened in the browser on /?2`);
    else failures.push(`${target} did not open in the browser on /?2`);
  }
  await visitor.close();
} finally {
  await browser.close();
  server.close();
}
if (missing.length)
  failures.push(
    `dist/ does not have:\n  ${[...new Set(missing)].join("\n  ")}`,
  );
for (const failure of failures) console.error(`FAIL ${failure}`);
if (failures.length) process.exit(1);
