import {
  mkdir,
  readFile,
  readdir,
  rmdir,
  unlink,
  writeFile,
} from "node:fs/promises";
import { existsSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { preparePowerMouse } from "./prepare-powermouse.mjs";
import { writePlayerBuild } from "./prepare-player.mjs";

/**
 * STomp's runtime under the directory in src/systemya/stomp-config.json, as Fracital vendors it:
 * every file under a short neutral name with this build's stamp before the extension
 * (sw.<stamp>.js), so no served URL names the package, and a new build is a new URL that no
 * cache can answer with the old file. The controller learns the names through `assets`
 * (src/systemya/stomp-build.json, written here). Everything ships as .js, never .mjs: the edge's
 * nginx serves .mjs as application/octet-stream, which browsers refuse as a module script.
 */

/** @sysce/stomp's served files by their Assets key: the file in dist/, and our short name. */
export const RUNTIME = Object.freeze({
  serviceWorker: ["serviceWorker.js", "sw.js"],
  injectDocument: ["injectDocument.js", "dc.js"],
  injectWorker: ["injectWorker.js", "wk.js"],
  injectDocumentFull: ["injectDocumentFull.js", "dcf.js"],
  injectWorkerFull: ["injectWorkerFull.js", "wkf.js"],
  controllerFrame: ["controllerFrame.html", "cf.html"],
  controllerFrameScript: ["controllerFrame.js", "cf.js"],
  siteFrameScript: ["siteFrame.js", "sf.js"],
  transportWorker: ["transportWorker.js", "tw.js"],
  rtcWorker: ["rtcWorker.js", "cw.js"],
  rtc: ["rtc.wasm", "cn.wasm"],
  rtcStack: ["rtcStack.js", "cs.js"],
  rewriteWorker: ["rewriteWorker.js", "rw.js"],
  core: ["core.wasm", "cr.wasm"],
  blocker: ["blocker.wasm", "bk.wasm"],
  adblockResources: ["adblock-resources.json", "br.json"],
  adblockSnapshot: ["adblock-snapshot.dat.gz", "bs.dat.gz"],
  rewriterLib: ["rewriterLib.js", "rl.js"],
  omnibox: ["omnibox.js", "ob.js"],
  extensionsRuntime: ["extensionsRuntime.js", "xr.js"],
});

/** Keys a newer STomp adds that the nightly before it does not have: the build ships them when
 * the package has them, so the updater can take the release that adds one. The address bars'
 * dropdown (omnibox.js) and the runtime of the documents a browser extension reaches
 * (extensionsRuntime.js) came after 4.2.0-nightly.202611192242; the prebuilt adblock snapshot
 * (adblock-snapshot.dat.gz) came after 4.2.0-nightly.202611200512. */
export const OPTIONAL = new Set([
  "omnibox",
  "extensionsRuntime",
  "adblockSnapshot",
]);

/** The other files a page loads: the ES module controller (stomp.ts), the classic script build
 * and the search helper (the powerMouse UI). */
export const PAGE_FILES = Object.freeze({
  module: ["controller.mjs", "ap.js"],
  script: ["Controller.js", "ct.js"],
  search: ["SearchBuilder.js", "sb.js"],
});

/** In dist/ but loaded by nothing at run time (no bundle names it; build.json is the package's
 * version stamp; omnibox.mjs is the ES module twin of omnibox.js, which the UI loads). */
const UNUSED = new Set(["codec.wasm", "build.json", "omnibox.mjs"]);

export const stamped = (name, stamp) =>
  name.replace(/\.(?=[^.]+$)/, `.${stamp}.`);

export const mintStamp = () => randomBytes(4).toString("hex");

/**
 * The five helper globals STomp's rewriter, inject bundles and error page meet on, minted per
 * build as Fracital does, so a deployment never carries the package defaults ($s$j and so on).
 * `$` and six letters: no plain window has such a global.
 */
export function mintHelperNames() {
  const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const names = new Set();
  while (names.size < 5)
    names.add(
      `$${Array.from(randomBytes(6), (b) => letters[b % letters.length]).join("")}`,
    );
  const [access, client, globalProxy, globalName, error] = names;
  return { access, client, globalProxy, globalName, error };
}

/** The Assets keys this STomp build has (its DEFAULT_ASSETS, as the classic build spells it). */
export function assetKeys(controllerScript) {
  const match = /\{serviceWorker:"serviceWorker\.js",[^}]*\}/.exec(
    controllerScript,
  );
  if (!match) throw new Error("STomp's default asset names were not found");
  return [...match[0].matchAll(/(\w+):"/g)].map((m) => m[1]);
}

/**
 * Make `destination` hold exactly `files` (relative path to contents): write what changed,
 * delete what is no longer produced, and leave the directory itself in place, so a running dev
 * server keeps serving it.
 */
export async function syncDirectory(destination, files) {
  await mkdir(destination, { recursive: true });
  for (const [name, contents] of files) {
    const path = join(destination, name);
    let current = null;
    try {
      current = await readFile(path);
    } catch {}
    if (current && Buffer.compare(current, Buffer.from(contents)) === 0)
      continue;
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, contents);
  }
  const prune = async (dir) => {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) {
        await prune(path);
        if (!(await readdir(path)).length) await rmdir(path);
      } else if (!files.has(relative(destination, path).split("\\").join("/")))
        await unlink(path);
    }
  };
  await prune(destination);
}

export async function prepareStomp({
  source,
  epoxy,
  libcurl,
  destination = resolve("public/vendor/rt"),
  directory = "/vendor/rt/",
  stamp = mintStamp(),
} = {}) {
  if (!source) {
    try {
      source = (await import("@sysce/stomp/path")).stompPath;
    } catch (error) {
      throw new Error("@sysce/stomp is missing. Run npm ci first.", {
        cause: error,
      });
    }
  }
  epoxy ??= resolve("node_modules/@mercuryworkshop/epoxy-transport/dist");
  libcurl ??= resolve(
    "node_modules/@mercuryworkshop/libcurl-transport/dist/index.mjs",
  );
  const name = (short) => stamped(short, stamp);

  // Every file the package serves must have a name here, so an asset a new nightly adds stops
  // the build instead of being missing at run time.
  const known = new Set(
    [...Object.values(RUNTIME), ...Object.values(PAGE_FILES)].map(([f]) => f),
  );
  for (const entry of await readdir(source, { withFileTypes: true }))
    if (
      entry.isFile() &&
      !entry.name.endsWith(".map") &&
      !known.has(entry.name) &&
      !UNUSED.has(entry.name)
    )
      throw new Error(
        `@sysce/stomp ships ${entry.name}, which scripts/prepare-stomp.mjs does not name`,
      );
  const keys = assetKeys(
    await readFile(join(source, PAGE_FILES.script[0]), "utf8"),
  );
  const missing = keys.filter((key) => !(key in RUNTIME));
  const extra = Object.keys(RUNTIME).filter(
    (key) => !keys.includes(key) && !OPTIONAL.has(key),
  );
  if (missing.length || extra.length)
    throw new Error(
      `STomp's assets changed (new: ${missing.join(", ") || "none"}; gone: ${extra.join(", ") || "none"}). Update RUNTIME in scripts/prepare-stomp.mjs.`,
    );

  const assets = {};
  const operations = [];
  for (const [key, [from, to]] of Object.entries(RUNTIME)) {
    // An optional file ships when the package has it, named by the controller or not: the
    // powerMouse UI loads omnibox.js by its own assets setting (assetName('omnibox')).
    if (
      !keys.includes(key) &&
      !(OPTIONAL.has(key) && existsSync(join(source, from)))
    )
      continue;
    assets[key] = name(to);
    operations.push({ from: join(source, from), to: name(to) });
  }
  const page = {};
  for (const [key, [from, to]] of Object.entries(PAGE_FILES)) {
    page[key] = name(to);
    operations.push({ from: join(source, from), to: name(to) });
  }
  // The transports, imported by the transport worker: epoxy and stomp-h3 (each loads its wasm
  // by name next to itself, so that name is rewritten to match) and libcurl.
  const transport = {
    epoxy: name("ln.js"),
    h3: name("q3.js"),
    libcurl: name("cu.js"),
  };
  const epoxyWasm = name("ln.wasm");
  // epoxy builds from 4d5a277 on also load a SIMD build of the same wasm, by name next to
  // themselves, when the browser validates SIMD and bulk memory
  const epoxySimd = existsSync(join(epoxy, "epoxy-simd.wasm"))
    ? name("lm.wasm")
    : null;
  const h3wasm = name("q3.wasm");
  operations.push(
    {
      from: join(epoxy, "index.mjs"),
      to: transport.epoxy,
      transform: (text) => {
        if (!text.includes('"epoxy.wasm"'))
          throw new Error("epoxy-transport no longer names epoxy.wasm");
        const namesSimd = text.includes('"epoxy-simd.wasm"');
        if (namesSimd && !epoxySimd)
          throw new Error(
            "epoxy-transport names epoxy-simd.wasm, which its dist/ does not have",
          );
        let out = text.split('"epoxy.wasm"').join(JSON.stringify(epoxyWasm));
        if (namesSimd)
          out = out.split('"epoxy-simd.wasm"').join(JSON.stringify(epoxySimd));
        return out;
      },
    },
    { from: join(epoxy, "epoxy.wasm"), to: epoxyWasm },
    ...(epoxySimd
      ? [{ from: join(epoxy, "epoxy-simd.wasm"), to: epoxySimd }]
      : []),
    {
      from: join(epoxy, "h3/stomp_h3.js"),
      to: transport.h3,
      transform: (text) => {
        if (!text.includes("stomp_h3_bg.wasm"))
          throw new Error("stomp-h3 no longer names stomp_h3_bg.wasm");
        return text.split("stomp_h3_bg.wasm").join(h3wasm);
      },
    },
    { from: join(epoxy, "h3/stomp_h3_bg.wasm"), to: h3wasm },
    { from: libcurl, to: transport.libcurl },
  );

  // Read and check everything before touching the destination, so a partial package install
  // cannot ship a partial runtime.
  const files = new Map();
  for (const { from, to, transform } of operations) {
    let contents = await readFile(from);
    if (contents.length < 50)
      throw new Error(`Empty STomp runtime asset: ${from}`);
    if (transform) contents = Buffer.from(transform(contents.toString()));
    // A source map comment names the file it came from, and the maps are not served.
    if (/\.js$/.test(to))
      contents = Buffer.from(
        contents.toString().replace(/\n?\/\/# sourceMappingURL=\S+\s*$/, "\n"),
      );
    if (to.endsWith(".mjs"))
      throw new Error(`A .mjs file would reach the edge: ${to}`);
    files.set(to, contents);
  }
  await syncDirectory(destination, files);

  let version = null;
  try {
    version = JSON.parse(
      await readFile(join(source, "../package.json"), "utf8"),
    ).version;
  } catch {}
  console.log(
    `STomp ${version ?? ""}: ${files.size} runtime files in ${destination} (stamp ${stamp})`,
  );
  return {
    version,
    stamp,
    directory,
    assets,
    page,
    transport,
    files: [...files.keys()],
  };
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const config = JSON.parse(
    await readFile(resolve("src/systemya/stomp-config.json"), "utf8"),
  );
  const stamp = mintStamp();
  const names = mintHelperNames();
  const runtime = await prepareStomp({
    directory: config.directory,
    destination: resolve("public", config.directory.replace(/^\/|\/$/g, "")),
    stamp,
  });
  const ui = await preparePowerMouse({ runtime, names, config });
  // What the pages need to know about this build (stomp.ts, proxy.ts). Generated, gitignored.
  const build = {
    stamp,
    directory: runtime.directory,
    assets: runtime.assets,
    controller: runtime.page.module,
    transport: runtime.transport,
    names,
    ui: ui.entry,
    uiThemes: ui.themes,
  };
  await writeFile(
    resolve("src/systemya/stomp-build.json"),
    JSON.stringify(build, null, 2) + "\n",
  );
  // The player page's Flash player, copied by the same step (prepare-player.mjs).
  await writePlayerBuild();
}
