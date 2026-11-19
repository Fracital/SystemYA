import { readFile, readdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { syncDirectory } from "./prepare-stomp.mjs";

/**
 * The Flash player of the player page (/?9): the self-hosted build of @ruffle-rs/ruffle, the
 * version website2 ships at /ruffle/, pinned exactly in package.json. It is copied into
 * DIRECTORY under neutral names, so no served URL names the package:
 *
 * - ruffle.js becomes pl.<hash>.js, where <hash> comes from the package's own file, so a new
 *   version is a new URL. The entry names itself in four strings (the iframe polyfill's script
 *   and the navigator.plugins filename it checks), which are renamed with it.
 * - its two core chunks, core.ruffle.<hash>.js, become pc.<hash>.js, and the chunk map in the
 *   entry is renamed to match.
 * - the two .wasm files keep their content-hash names. The edge serves .wasm as
 *   application/wasm, which the player needs.
 *
 * Its licenses are copied next to it. The source maps are not served. Each replacement must match, so an upstream change that moves
 * one stops the build instead of shipping a player that cannot find its files.
 */
export const DIRECTORY = "/vendor/pl/";
const ENTRY = "ruffle.js";
const CHUNK = /^core\.ruffle\.([0-9a-f]+)\.js$/;

export async function preparePlayer({
  source,
  destination = resolve("public", DIRECTORY.replace(/^\/|\/$/g, "")),
} = {}) {
  if (!source) {
    try {
      source = dirname(
        createRequire(import.meta.url).resolve("@ruffle-rs/ruffle"),
      );
    } catch (error) {
      throw new Error("@ruffle-rs/ruffle is missing. Run npm ci first.", {
        cause: error,
      });
    }
  }
  const { version } = JSON.parse(
    await readFile(join(source, "package.json"), "utf8"),
  );
  const original = await readFile(join(source, ENTRY), "utf8");
  const entry = `pl.${createHash("sha256").update(original).digest("hex").slice(0, 12)}.js`;
  const files = new Map();
  const chunks = [];
  for (const name of await readdir(source)) {
    if (name.endsWith(".map")) continue;
    const chunk = CHUNK.exec(name);
    if (chunk) {
      chunks.push(name);
      files.set(`pc.${chunk[1]}.js`, await readFile(join(source, name)));
    } else if (/^[0-9a-f]+\.wasm$/.test(name))
      files.set(name, await readFile(join(source, name)));
    // its licenses travel with it
    else if (/^LICENSE_\w+$/.test(name))
      files.set(name, await readFile(join(source, name)));
    else if (name !== ENTRY && !/^(?:README\.md|package\.json)$/.test(name))
      throw new Error(
        `@ruffle-rs/ruffle ships ${name}, which scripts/prepare-player.mjs does not name`,
      );
  }
  if (
    chunks.length === 0 ||
    ![...files.keys()].some((n) => n.endsWith(".wasm"))
  )
    throw new Error("@ruffle-rs/ruffle has no core chunk or no .wasm");

  const replace = (text, from, to, count) => {
    const found = text.split(from).length - 1;
    if (found !== count)
      throw new Error(
        `@ruffle-rs/ruffle names ${from} ${found} times, expected ${count}`,
      );
    return text.split(from).join(to);
  };
  let script = replace(original, '"core.ruffle."+{', '"pc."+{', 1);
  script = replace(script, `"${ENTRY}"`, `"${entry}"`, 4);
  for (const name of [...files.keys()].filter((n) => n.endsWith(".wasm")))
    replace(script, `"${name}"`, `"${name}"`, 1);
  const strip = (text) =>
    text.replace(/\n?\/\/# sourceMappingURL=\S+\s*$/, "\n");
  files.set(entry, Buffer.from(strip(script)));
  for (const [name, contents] of files)
    if (name.startsWith("pc."))
      files.set(name, Buffer.from(strip(contents.toString())));

  await syncDirectory(destination, files);
  console.log(
    `Flash player ${version}: ${files.size} files in ${destination} (${entry})`,
  );
  return { version, entry: `${DIRECTORY}${entry}`, directory: DIRECTORY };
}

/** Copy the player and write the names the player page needs (player.ts). Generated, gitignored. */
export async function writePlayerBuild(
  path = resolve("src/systemya/player-build.json"),
) {
  const player = await preparePlayer();
  await writeFile(
    path,
    JSON.stringify(
      {
        version: player.version,
        directory: player.directory,
        entry: player.entry,
      },
      null,
      2,
    ) + "\n",
  );
  return player;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  await writePlayerBuild();
