import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { transform } from "esbuild";
import { obfuscateText, obfuscationRules } from "../src/systemya/obfuscate.ts";
import { routeHref } from "../src/systemya/routes.ts";
import { mintStamp, stamped, syncDirectory } from "./prepare-stomp.mjs";

/**
 * The browser UI of /app/: STomp's demo host (github.com/Fracital/powerMouse demo/public, the
 * vendor/powermouse submodule), copied into the UI directory of src/systemya/stomp-config.json.
 *
 * Its code is copied as it is except for the strings below. The demo hardcodes where the runtime
 * lives (/stomp/), its own folder (/pm/), its error page and its transports (as .mjs, which the
 * edge serves as application/octet-stream), and its server renders /config.js. SystemYA serves
 * the runtime and the UI under short neutral names stamped per build (prepare-stomp.mjs) and has
 * no server, and its pages do not show the demo's branding. Each replacement must match the
 * stated number of times, so an upstream change that moves one stops the build instead of
 * shipping a broken page.
 */
export function patches({ directory, ui, files, runtime, names }) {
  const at = (name) => `${ui}${files[name]}`;
  const base = "${proxyBase()}";
  return {
    "pm/main.js": [
      ["const DIRECTORY = '/stomp/';", `const DIRECTORY = '${directory}';`],
      [
        `\`${base}/epoxy/index.mjs\``,
        `\`${base}${directory}${runtime.transport.epoxy}\``,
      ],
      [
        "\t\t\thttp3: CFG.testTransport\n\t\t\t\t? { module: `${proxyBase()}/epoxy/h3/stomp_h3.js` }\n\t\t\t\t: true,",
        `\t\t\thttp3: { module: \`${base}${directory}${runtime.transport.h3}\` },`,
      ],
      [
        `\`${base}/libcurl/index.mjs\``,
        `\`${base}${directory}${runtime.transport.libcurl}\``,
      ],
      ["errorPage: '/error.html',", `errorPage: '${at("error.html")}',`],
      ["element.title = 'Proxied page';", "element.title = 'Page';"],
      // the Shields panel's notes on how block lists are fetched
      ["through the proxy", "through the relay", 2],
      ["'/pm/", `'${ui}`, "any"],
      // markup in template strings (the About panel's logo)
      ['"/pm/', `"${ui}`, "any"],
      // the bookmark icon check, a regular expression (/^\/pm\/icons\/[\w.-]+$/)
      ["\\/pm\\/", ui.replace(/\//g, "\\/"), 1],
    ],
    "pm/main.css": [
      [
        "url('/fonts/montserrat/montserrat-latin-400-normal.woff2')",
        `url('${ui}fonts/montserrat-latin-400-normal.woff2')`,
      ],
      ["url('/pm/", `url('${ui}`, "any"],
    ],
    "index.html": [
      ["<title>powerMouse</title>", "<title>SystemYA</title>"],
      ['\t\t<meta name="description" content="STomp web proxy demo" />\n', ""],
      [
        '<link rel="stylesheet" href="/pm/main.css" />',
        `<link rel="stylesheet" href="${at("pm/main.css")}" /><style>${obfuscationRules().join("")}</style>`,
      ],
      ['\t\t<script src="/config.js"></script>\n', ""],
      // the demo's live reload client, for its own dev server
      [
        "\t\t<script>\n\t\t\t// npm run dev only: live reload client (the server sets dev in config)\n\t\t\tif (window.STOMP_CONFIG && window.STOMP_CONFIG.dev)\n\t\t\t\tdocument.head.append(\n\t\t\t\t\tObject.assign(document.createElement('script'), {\n\t\t\t\t\t\ttype: 'module',\n\t\t\t\t\t\tsrc: '/pm/dev.js',\n\t\t\t\t\t}),\n\t\t\t\t);\n\t\t</script>\n",
        "",
      ],
      [
        '<script src="/stomp/Controller.js"></script>',
        `<script src="${directory}${runtime.page.script}"></script>`,
      ],
      // SystemYA's side (src/systemya/proxy-frame.js) runs after the controller script and
      // before pm/main.js.
      [
        '<script src="/stomp/SearchBuilder.js"></script>',
        `<script src="${directory}${runtime.page.search}"></script>\n\t\t<script src="${at("frame.js")}"></script>`,
      ],
      [
        '<script src="/pm/main.js"></script>',
        `<script src="${at("pm/main.js")}"></script>`,
      ],
      // The title goes back to the landing, in the 2022 obfuscation; "/" would be SystemYA's
      // home inside the frame.
      [
        '<a class="noStyle ns" href="/">powerMouse</a>',
        `<a class="noStyle ns" href="${routeHref("app")}" target="_top">${obfuscateText("powerMouse")}</a>`,
      ],
      // The repository links get their address from frame.js once the page is parsed.
      ['href="https://github.com/Fracital/powerMouse"', 'href="#"', 2],
      [">Fracital/powerMouse</a", ">GitHub</a"],
      // No server, so no uptime line and no version.
      [
        'Uptime: <span id="uptime">…</span><span id="version"></span>',
        '<span id="uptime" hidden></span>&nbsp;<span id="version"></span>',
      ],
      ['"/pm/', `"${ui}`, "any"],
    ],
    "error.html": [
      ['href="/pm/main.css"', `href="${at("pm/main.css")}"`],
      ["<p>STomp could not load", "<p>This page could not load"],
      ["stompError", names.error, "all"],
    ],
  };
}

/**
 * Apply `list` to `text`. A count of "all" means at least once; a number, exactly that many;
 * "any" also allows none, for the folder rewrites ('/pm/ and the like), whose leftovers
 * missingReferences() reports.
 */
export function applyPatches(name, text, list) {
  for (const [index, [from, to, times = 1]] of list.entries()) {
    const count = text.split(from).length - 1;
    if (times === "any") {
      text = text.split(from).join(to);
      continue;
    }
    if (times === "all" ? count < 1 : count !== times)
      throw new Error(
        `powerMouse ${name}, patch ${index + 1} of ${list.length}: expected ${JSON.stringify(from)} ${times === "all" ? "at least once" : `${times} time(s)`}, found it ${count} times. Update its entry in patches() in scripts/prepare-powermouse.mjs for the new upstream.`,
      );
    text = text.split(from).join(to);
  }
  return text;
}

/**
 * Every address under the UI's or the runtime's directory that a text file of the UI names,
 * which `served` (a set of paths like "/ui/icons/x.png") does not have; and every reference
 * left to the demo's own folders.
 */
export function missingReferences(texts, served, { ui, directory }) {
  const missing = new Set();
  const escape = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
  const pattern = new RegExp(
    `(?:${escape(ui)}|${escape(directory)})[\\w./-]*[\\w-]\\.[a-z0-9]+`,
    "g",
  );
  for (const [name, text] of texts) {
    for (const [path] of text.matchAll(pattern))
      if (!served.has(path)) missing.add(`${name}: ${path}`);
    for (const [path] of text.matchAll(
      /["'(]\/(?:pm|stomp|epoxy|libcurl)\/[^"')]*/g,
    ))
      missing.add(`${name}: ${path.slice(1)}`);
  }
  return [...missing];
}

/** Served as they are (images); they keep their names. */
const ASSETS = ["pm/logo.png", "pm/noise.png", "pm/header-background.png"];

/** Code and pages, renamed: short neutral names with the build's stamp. */
const RENAMED = {
  "index.html": "ix.html",
  "error.html": "er.html",
  "pm/main.js": "ma.js",
  "pm/main.css": "ma.css",
  "frame.js": "sy.js",
};

export async function preparePowerMouse({
  runtime,
  names,
  config,
  source = resolve("vendor/powermouse/demo/public"),
  font = resolve(
    "node_modules/@fontsource/montserrat/files/montserrat-latin-400-normal.woff2",
  ),
  frameScript = resolve("src/systemya/proxy-frame.js"),
  destination,
}) {
  if (!existsSync(join(source, "pm/main.js")))
    throw new Error(
      `The browser UI is missing at ${source}. Run: git submodule update --init vendor/powermouse`,
    );
  const stamp = runtime.stamp ?? mintStamp();
  const { directory, ui } = config;
  destination ??= resolve("public", ui.replace(/^\/|\/$/g, ""));
  const files = Object.fromEntries(
    Object.entries(RENAMED).map(([from, to]) => [from, stamped(to, stamp)]),
  );
  const table = patches({ directory, ui, files, runtime, names });

  const out = new Map();
  for (const [name, list] of Object.entries(table))
    out.set(
      files[name],
      applyPatches(name, await readFile(join(source, name), "utf8"), list),
    );
  const shim = await readFile(frameScript, "utf8");
  if (!shim.includes("__SYSTEMYA_FRAME_CONFIG__"))
    throw new Error(`${frameScript} lost its config placeholder`);
  out.set(
    files["frame.js"],
    shim.replace("__SYSTEMYA_FRAME_CONFIG__", () =>
      JSON.stringify({
        repo: config.repo,
        assets: runtime.assets,
        names,
        stomp: {
          // same origin: no proxy origin, so no isolation frame
          proxyOrigin: "",
          wisp: config.wisp,
          http3: true,
          // pm/main.js passes this to epoxy's descriptor as `webTransport`
          webTransport: config.webTransport,
          echDns: "https://cloudflare-dns.com/dns-query",
          shieldsDefaults: true,
        },
      }),
    ),
  );
  // Comments go: they describe the code with the names the copy leaves out. Identifiers stay,
  // so the scripts' globals (navigate, which frame.js calls) keep their names.
  for (const [name, text] of out) {
    if (name.endsWith(".js"))
      out.set(
        name,
        (
          await transform(text, {
            loader: "js",
            minifyWhitespace: true,
            minifySyntax: true,
            legalComments: "none",
          })
        ).code,
      );
    else if (name.endsWith(".css"))
      out.set(
        name,
        (await transform(text, { loader: "css", minify: true })).code,
      );
    else if (name.endsWith(".html"))
      out.set(name, text.replace(/<!--[\s\S]*?-->\s*/g, ""));
  }
  for (const name of ASSETS)
    out.set(name.replace(/^pm\//, ""), await readFile(join(source, name)));
  for (const entry of await readdir(join(source, "pm/icons")))
    out.set(`icons/${entry}`, await readFile(join(source, "pm/icons", entry)));
  out.set("fonts/montserrat-latin-400-normal.woff2", await readFile(font));
  const served = new Set([
    ...[...out.keys()].map((name) => `${ui}${name}`),
    ...runtime.files.map((name) => `${directory}${name}`),
  ]);
  // errors name the upstream file (pm/main.js), not this build's stamped copy
  const upstream = Object.fromEntries(
    Object.entries(files).map(([from, to]) => [to, from]),
  );
  const texts = [...out]
    .filter(([name]) => /\.(?:html|js|css)$/.test(name))
    .map(([name, text]) => [
      upstream[name] ? `${upstream[name]} (served as ${name})` : name,
      text,
    ]);
  const missing = missingReferences(texts, served, { ui, directory });
  if (missing.length)
    throw new Error(
      `The browser UI names files that are not served:\n${missing.join("\n")}\nAdd a patch for each in patches() in scripts/prepare-powermouse.mjs, or serve the file (ASSETS).`,
    );
  await syncDirectory(destination, out);
  console.log(`Browser UI: ${out.size} files in ${destination}`);
  return { entry: `${ui}${files["index.html"]}`, files: [...out.keys()] };
}
