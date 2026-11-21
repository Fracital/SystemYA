import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { build, transform } from "esbuild";
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
export function patches({
  directory,
  ui,
  files,
  runtime,
  names,
  upstreamOmnibox = false,
  tor = false,
  torState = false,
  appShell = false,
  dialing = false,
  offline = false,
  offlineFile = null,
}) {
  const at = (name) => `${ui}${files[name]}`;
  const base = "${proxyBase()}";
  return {
    "pm/main.js": [
      [
        // a separate service worker scope for the Tor route came in ec02970, and the dialing
        // mode's scope of its own (CFG.dial) after 058c7e7
        [
          "const DIRECTORY = DIAL\n\t? TOR_REQUESTED\n\t\t? DIAL.torDirectory\n\t\t: DIAL.directory\n\t: TOR_REQUESTED\n\t\t? '/stomp-tor/'\n\t\t: '/stomp/';",
          "const DIRECTORY = TOR_REQUESTED ? '/stomp-tor/' : '/stomp/';",
          "const DIRECTORY = '/stomp/';",
        ],
        `const DIRECTORY = '${directory}';`,
      ],
      ...(tor
        ? // SystemYA has no Tor relay: the choice is never read (a saved stomp-demo:tor or a
          // ?tor would otherwise stop the browser with "Tor relay unavailable"), and its box is
          // hidden (index.html below).
          [
            [
              "const TOR_REQUESTED = (() => {",
              "const TOR_REQUESTED = false && (() => {",
            ],
          ]
        : []),
      ...(torState
        ? // Tor's readiness (8cbf81f) is never asked for (TOR_REQUESTED is false), and its
          // words stay the relay's
          [
            [
              "'Tor is not running on the server. Proxied pages load once it is.'",
              "'Tor is not running on the server. Pages load once it is.'",
            ],
          ]
        : []),
      ...(dialing
        ? // The opt-in call mode (?mode=just-call-stomp) stays off: its call page has no stamped
          // name in the runtime, and the mode's word would be in the frame's address.
          [
            [
              "const JUST_CALL =\n\tnew URLSearchParams(location.search).get('mode') === 'just-call-stomp';",
              "const JUST_CALL = false;",
            ],
          ]
        : []),
      // the UI registers the service worker itself (since e5f74c5), by the package's file name,
      // and later by STOMP_ASSETS' (which frame.js sets, so either way it is this build's name)
      [
        [
          "`${DIRECTORY}serviceWorker.js`",
          "`${DIRECTORY}${assetName('serviceWorker')}`",
        ],
        `\`\${DIRECTORY}${runtime.assets.serviceWorker}\``,
      ],
      [
        // the transport's directory became CFG.transports' (transportPath) in e5f74c5
        [
          `\`${base}/epoxy/index.mjs\``,
          `\`${base}\${transportPath('epoxy')}index.mjs\``,
        ],
        `\`${base}${directory}${runtime.transport.epoxy}\``,
      ],
      [
        "\t\t\thttp3: CFG.testTransport\n\t\t\t\t? { module: `${proxyBase()}/epoxy/h3/stomp_h3.js` }\n\t\t\t\t: true,",
        `\t\t\thttp3: { module: \`${base}${directory}${runtime.transport.h3}\` },`,
      ],
      [
        [
          `\`${base}/libcurl/index.mjs\``,
          `\`${base}\${transportPath('libcurl')}index.mjs\``,
        ],
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
      ...(upstreamOmnibox
        ? // The address bars' dropdown is the package's (omnibox.js, which pm/main.js loads by
          // its STOMP_ASSETS name); it keeps its history under omnibox:visits, the key the
          // landing's boxes read too (omni/history.ts).
          [["function loadOmnibox() {", "function loadOmnibox() {"]]
        : [
            // With a STomp from before it, the address bars' suggestions are SystemYA's
            // (src/systemya/omni/ui.ts, bundled into frame.js): the demo's asked its server's
            // /suggestions, which SystemYA does not have.
            [
              "attachSuggestions(mainForm.url);\nattachSuggestions(omni.url);",
              SUGGEST_CALL,
            ],
            // what that call names must still be there, so a rename upstream stops the build
            ...SUGGEST_NAMES.map((name) => [name, name]),
            // each page a tab reaches goes into the history the suggestions rank
            [
              'function recordUrl(tab) {\n\t// the requested URL and the one the frame reports can differ only by\n\t// normalisation ("https://a.com" vs "https://a.com/"); that is not a new entry\n\tconst url = normalizeUrl(tab.frame.url);\n\tif (!url) return;\n',
              "function recordUrl(tab) {\n\tconst url = normalizeUrl(tab.frame.url);\n\tif (!url) return;\n\twindow.systemyaVisit?.(tab, url);\n",
            ],
          ]),
    ],
    "pm/main.css": [
      [
        "url('/fonts/montserrat/montserrat-latin-400-normal.woff2')",
        `url('${ui}fonts/montserrat-latin-400-normal.woff2')`,
      ],
      ["url('/pm/", `url('${ui}`, "any"],
    ],
    // The theme reader (globalThis.PMTheme, loaded in the head before body parse) and the
    // Extensions page (its script and stylesheet, loaded before pm/main.js). They name no
    // other served file, so they are copied and stamped as they are; index.html's tags below
    // point at the stamped names.
    "pm/theme.js": [],
    "pm/extensions-page.js": [],
    "pm/extensions-page.css": [],
    "index.html": [
      ["<title>powerMouse</title>", "<title>SystemYA</title>"],
      ['\t\t<meta name="description" content="STomp web proxy demo" />\n', ""],
      [
        '<link rel="stylesheet" href="/pm/main.css" />',
        `<link rel="stylesheet" href="${at("pm/main.css")}" /><style>${obfuscationRules().join("")}</style>${LANDING_GUARD}`,
      ],
      ...(appShell
        ? // The installable app (manifest.webmanifest, app-worker.js, the title bar's
          // theme-color) is powerMouse's own site's: the copy ships none of it, so the UI never
          // links a manifest, never registers the app worker (pm/main.js registers it only where
          // the manifest link is) and has no Install item in its menu.
          [
            [
              '\t\t<!-- the app window\'s title bar: pm/theme.js keeps it the theme\'s -->\n\t\t<meta name="theme-color" content="#000000" />\n',
              "",
            ],
            [
              "\t\t<script>\n\t\t\t// powerMouse as an installed app (manifest.webmanifest, the root's\n\t\t\t// app-worker.js): only on the site's own page at its root, the top\n\t\t\t// one. A copy of the page in a frame or under another path (a host\n\t\t\t// that ships this page inside its own) is no app: a manifest there\n\t\t\t// makes nothing installable, and a root worker would be the host's.\n\t\t\tif (window === window.top && /^\\/(index\\.html)?$/.test(location.pathname))\n\t\t\t\tdocument.head.append(\n\t\t\t\t\tObject.assign(document.createElement('link'), {\n\t\t\t\t\t\tid: 'pmAppManifest',\n\t\t\t\t\t\trel: 'manifest',\n\t\t\t\t\t\thref: '/manifest.webmanifest',\n\t\t\t\t\t}),\n\t\t\t\t);\n\t\t</script>\n",
              "",
            ],
            [
              '\t\t\t<button\n\t\t\t\tid="menuInstall"\n\t\t\t\tclass="pmMenuItem"\n\t\t\t\ttype="button"\n\t\t\t\trole="menuitem"\n\t\t\t\ttabindex="-1"\n\t\t\t\thidden\n\t\t\t></button>\n',
              "",
            ],
          ]
        : []),
      // SystemYA has no Tor relay (pm/main.js above): its box is not offered, and with it
      // Tor's readiness (#torState, 8cbf81f), which only Tor mode asks for.
      ...(tor ? [['id="torLabel"', 'id="torLabel" hidden']] : []),
      // Download (b9994a9) saves offline.html, which pm/main.js fetches from /offline.html or
      // from STOMP_ASSETS.offline. SystemYA serves no offline.html, so the link is hidden unless
      // stomp-config.json names one as `offline` (frame.js passes it on as STOMP_ASSETS.offline).
      ...(offline
        ? [
            [
              'id="offlineDownload"',
              offlineFile
                ? 'id="offlineDownload"'
                : 'id="offlineDownload" hidden',
            ],
            [
              'href="/offline.html"',
              `href="${offlineFile ? attribute(offlineFile) : "#"}"`,
            ],
            [
              'title="Save powerMouse as one HTML file that runs from your computer through this page\'s wisp server"',
              'title="Save the browser as one HTML file that runs from your computer through this page\'s relay"',
            ],
          ]
        : []),
      // the Extensions page's stylesheet, in the head after main.css
      [
        '<link rel="stylesheet" href="/pm/extensions-page.css" />',
        `<link rel="stylesheet" href="${at("pm/extensions-page.css")}" />`,
      ],
      // the theme reader (globalThis.PMTheme), in the head before body parse
      [
        '<script src="/pm/theme.js"></script>',
        `<script src="${at("pm/theme.js")}"></script>`,
      ],
      // The cover the guard paints over the demo-styled body until the browser view opens.
      [
        '<div class="wrapper" id="landing">',
        '<div id="sy-cover"></div>\n\t\t<div class="wrapper" id="landing">',
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
      // A STomp whose UI loads the omnibox by a <script data-omnibox> tag (the demo server
      // stamped /stomp/omnibox.js; SystemYA has no server) gets the tag pointed at the stamped
      // asset, so there is no 404 and loadOmnibox uses it instead of its assetName fallback.
      ...(upstreamOmnibox
        ? [
            [
              '<script src="/stomp/omnibox.js" defer data-omnibox></script>',
              `<script src="${directory}${runtime.assets.omnibox}" defer data-omnibox></script>`,
            ],
          ]
        : []),
      // the Extensions page's script, before pm/main.js (it uses main.js's globals when they run)
      [
        '<script src="/pm/extensions-page.js"></script>',
        `<script src="${at("pm/extensions-page.js")}"></script>`,
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

/** `text` as the value of an HTML attribute in double quotes. */
const attribute = (text) =>
  String(text)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");

/**
 * Hides the demo landing (quick-link grid, demo shell) and paints a neutral cover over the
 * demo-styled body on a fresh load, so none of it shows for the frames the controller takes to
 * boot before a navigation opens the browser view. The head script marks this document sy-home
 * when its frame carries no site to open (the home screen, set on the frame element by
 * src/systemya/proxy.ts), which reveals the landing at once; otherwise frame.js reveals it once
 * the browser view is up. The style is in the head, so the cover paints before the body does.
 */
const LANDING_GUARD = `<style>#landing{visibility:hidden}html.sy-home #landing{visibility:visible}#sy-cover{position:fixed;inset:0;background:#000;z-index:2147483647}html.sy-home #sy-cover{display:none}</style><script>try{var h=window.frameElement&&window.frameElement.systemyaHash;if(!(typeof h==='string'&&h))document.documentElement.classList.add('sy-home')}catch(e){document.documentElement.classList.add('sy-home')}</script>`;

/** The call that hands pm/main.js's address bars, tabs and bookmarks to SystemYA's suggestions. */
const SUGGEST_CALL = `try {
	window.systemyaSuggest({
		inputs: [mainForm.url, omni.url],
		tabs: () => tabs,
		active: () => activeTab,
		activate: activateTab,
		title: tabTitle,
		url: shownUrl,
		bookmarks: () => bookmarks,
		search: SEARCH.template,
		query: (text) => SEARCH.query(text.trim()),
		icon: (name) => shieldIcon(name),
		closeMenu: () => menuPopover.close(),
	});
} catch (error) {
	console.error(error);
}`;
const SUGGEST_NAMES = [
  "const SEARCH = new SearchBuilder(",
  "const omni = $('omni');",
  "const mainForm = $('mainForm');",
  "const tabs = [];",
  "let activeTab = null;",
  "function activateTab(tab) {",
  "function tabTitle(tab) {",
  "const shownUrl = (tab) =>",
  "let bookmarks = loadBookmarks();",
  "function shieldIcon(name, cls = 'shieldsIcon') {",
  "const menuPopover = popover(menuPanel, $('menuScrim'));",
];

/**
 * Apply `list` to `text`. A count of "all" means at least once; a number, exactly that many;
 * "any" also allows none, for the folder rewrites ('/pm/ and the like), whose leftovers
 * missingReferences() reports. `from` may be a list of spellings (an upstream that moved
 * between them): the first one the text has is the one counted.
 */
export function applyPatches(name, text, list) {
  for (const [index, [spellings, to, times = 1]] of list.entries()) {
    const from = Array.isArray(spellings)
      ? (spellings.find((spelling) => text.includes(spelling)) ?? spellings[0])
      : spellings;
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

/**
 * What this upstream UI has that patches() handles only where it is there. Each is read from a
 * mark of its own (a file, the markup), not from the string its patch replaces, so a rename of
 * that string stops the build.
 */
export async function uiFeatures(source) {
  const read = (name) => readFile(join(source, name), "utf8");
  const [mainJs, indexHtml, themeJs] = await Promise.all([
    read("pm/main.js"),
    read("index.html"),
    read("pm/theme.js"),
  ]);
  return {
    // the address bars' dropdown is the package's own (omnibox.js), so SystemYA's is not needed
    upstreamOmnibox: mainJs.includes("function loadOmnibox() {"),
    // the Tor box beside Block ads (ec02970)
    tor: indexHtml.includes('id="torLabel"'),
    // the installable app (bfda786)
    appShell: existsSync(join(source, "manifest.webmanifest")),
    // Tor's readiness beside the box (8cbf81f)
    torState: indexHtml.includes('id="torState"'),
    // the opt-in call mode (807f0ac)
    dialing: mainJs.includes("just-call-stomp"),
    // Download, the single-file offline.html (b9994a9)
    offline: indexHtml.includes('id="offlineDownload"'),
    // The built-in themes SystemYA's light and dark show as (src/systemya/ui-theme.ts):
    // SystemYA Light (7813c5a; the black home page with white bars), else Light.
    themes: {
      light: themeJs.includes("id: 'systemya-light',")
        ? "systemya-light"
        : "light",
      dark: "dark",
    },
  };
}

/** Served as they are (images); they keep their names. */
const ASSETS = ["pm/logo.png", "pm/noise.png", "pm/header-background.png"];

/** The installed app's icons, which only its manifest and app worker name (neither ships). */
const APP_ICONS = new Set([
  "app-192.png",
  "app-512.png",
  "app-maskable-512.png",
]);

/**
 * Files of an older UI that pm/main.js still names only to recognise what that build saved
 * (FORMER_DEFAULTS: a bookmark whose icon is still the old default's gets the new one). Nothing
 * loads them, so they are not served, and the served-files check takes them as known.
 */
const FORMER = ["icons/estro.svg"];

/** Code and pages, renamed: short neutral names with the build's stamp. */
const RENAMED = {
  "index.html": "ix.html",
  "error.html": "er.html",
  "pm/main.js": "ma.js",
  "pm/main.css": "ma.css",
  "pm/theme.js": "th.js",
  "pm/extensions-page.js": "ep.js",
  "pm/extensions-page.css": "ep.css",
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
  suggestScript = resolve("src/systemya/omni/ui.ts"),
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
  const features = await uiFeatures(source);
  const { upstreamOmnibox } = features;
  if (upstreamOmnibox && !runtime.assets.omnibox)
    throw new Error(
      "The browser UI loads omnibox.js, which this STomp does not ship (scripts/prepare-stomp.mjs RUNTIME)",
    );
  if (config.offline != null && typeof config.offline !== "string")
    throw new Error("stomp-config.json: offline must be a URL or a file name");
  const table = patches({
    directory,
    ui,
    files,
    runtime,
    names,
    ...features,
    offlineFile: config.offline || null,
  });

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
        // Download's file (STOMP_ASSETS.offline), when stomp-config.json names one
        offline: (features.offline && config.offline) || null,
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
    ) +
      // the address bars' suggestions, which pm/main.js's patched call starts
      (upstreamOmnibox
        ? ""
        : (
            await build({
              entryPoints: [suggestScript],
              bundle: true,
              write: false,
              format: "iife",
              target: "es2022",
              legalComments: "none",
            })
          ).outputFiles[0].text),
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
    if (!APP_ICONS.has(entry))
      out.set(
        `icons/${entry}`,
        await readFile(join(source, "pm/icons", entry)),
      );
  out.set("fonts/montserrat-latin-400-normal.woff2", await readFile(font));
  const served = new Set([
    ...[...out.keys(), ...FORMER].map((name) => `${ui}${name}`),
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
  return {
    entry: `${ui}${files["index.html"]}`,
    files: [...out.keys()],
    themes: features.themes,
  };
}
