import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { DIRECTORY, preparePlayer } from "../scripts/prepare-player.mjs";
import { NAME_WORDS } from "../scripts/check-neutral-dist.mjs";
import { BOOK, routeHref } from "../src/systemya/routes.ts";

const root = new URL("../", import.meta.url);
const source = (name) => readFile(new URL(name, root), "utf8");

test("the Flash player is pinned exactly and copied under neutral names", async () => {
  const pkg = JSON.parse(await source("package.json"));
  assert.match(pkg.dependencies["@ruffle-rs/ruffle"], /^\d+\.\d+\.\d+$/);
  const dir = await mkdtemp(join(tmpdir(), "systemya-player-"));
  try {
    const player = await preparePlayer({ destination: dir });
    assert.equal(player.version, pkg.dependencies["@ruffle-rs/ruffle"]);
    assert.equal(player.directory, DIRECTORY);
    assert.ok(player.entry.startsWith(DIRECTORY));
    const names = await readdir(dir);
    for (const name of names) {
      assert.doesNotMatch(name, NAME_WORDS, name);
      assert.doesNotMatch(name, /\.(?:mjs|map)$/, name);
    }
    assert.match(DIRECTORY, /^\/vendor\/\w+\/$/);
    assert.doesNotMatch(DIRECTORY, NAME_WORDS);
    // every chunk and wasm the entry asks for is there, by the name it asks for
    const entry = await readFile(
      join(dir, player.entry.slice(DIRECTORY.length)),
      "utf8",
    );
    const chunks = /"pc\."\+(\{[^}]+\})\[e\]\+"\.js"/.exec(entry);
    assert.ok(chunks, "chunk map renamed");
    for (const hash of chunks[1].match(/[0-9a-f]{16,}/g))
      assert.ok(names.includes(`pc.${hash}.js`), hash);
    for (const wasm of entry.match(/"[0-9a-f]+\.wasm"/g))
      assert.ok(names.includes(wasm.slice(1, -1)), wasm);
    assert.ok(entry.includes(`"${player.entry.slice(DIRECTORY.length)}"`));
    assert.doesNotMatch(entry, /"ruffle\.js"|"core\.ruffle\./);
    assert.doesNotMatch(entry, /sourceMappingURL/);
    assert.ok(
      names.includes("LICENSE_MIT") && names.includes("LICENSE_APACHE"),
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("an upstream change the copy does not know stops it", async () => {
  const real = dirname(
    createRequire(import.meta.url).resolve("@ruffle-rs/ruffle"),
  );
  const dir = await mkdtemp(join(tmpdir(), "systemya-player-src-"));
  try {
    for (const name of await readdir(real))
      if (!name.endsWith(".map") && !name.endsWith(".wasm"))
        await writeFile(join(dir, name), await readFile(join(real, name)));
    await writeFile(join(dir, "0123abcd.wasm"), "wasm");
    await writeFile(join(dir, "extra.js"), "x");
    await assert.rejects(
      preparePlayer({ source: dir, destination: join(dir, "out") }),
      /ships extra\.js/,
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("Flash games play on the player page, and single-file games use the raw /cdn/ path", async () => {
  assert.deepEqual(
    BOOK.find((route) => route.page === "player"),
    { n: 9, page: "player", since: "2026-11-19" },
  );
  assert.equal(routeHref("player"), "/?9");
  const sdk = await source("src/systemya/games-sdk.ts");
  assert.doesNotMatch(sdk, /UNSUPPORTED|not available on SystemYA/);
  assert.match(sdk, /return \[\.\.\.sdk\.types\];/);
  assert.match(sdk, /game\.launch\?\.type === "flash"/);
  assert.match(sdk, /playerHref\(movie\)/);
  assert.match(sdk, /type === "embed" \? rawPath\(game\) : null/);
  assert.match(sdk, /safeLocalPath\(game\.assetPath\)/);
  const player = await source("src/systemya/player.ts");
  assert.match(player, /openFrame\(here, undefined, \{ replace: true \}\)/);
  assert.match(player, /import build from "\.\/player-build\.json"/);
  const interactions = await source("src/systemya/interactions.ts");
  assert.match(interactions, /mountPlayer\(root\)/);
  const prepare = await source("scripts/prepare-stomp.mjs");
  assert.match(prepare, /await writePlayerBuild\(\);/);
  const ignore = await source(".gitignore");
  assert.match(ignore, /^public\/vendor\/pl\/$/m);
  assert.match(ignore, /^src\/systemya\/player-build\.json$/m);
});
