import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
const path = (p) => new URL(`../${p}`, import.meta.url);
const css = readFileSync(
  path("archive/wayback-2022/SystemYA/theatre_files/main.eb81df9c.css"),
  "utf8",
);
const runtime = readFileSync(path("src/systemya/historical-media.ts"), "utf8");
const manifest = JSON.parse(
  readFileSync(path("docs/HISTORICAL-ASSET-MANIFEST.json"), "utf8"),
);
const coords = JSON.parse(
  readFileSync(path("docs/THEATRE-SPRITE-COORDINATES.json"), "utf8"),
);
test("theatre cards preserve original 200x200 sprite and positions", () => {
  assert.match(css, /theatre\.4cf739e3dd20f770bb30\.webp/);
  assert.match(css, /\.front\{background:url/);
  assert.equal(coords.cells.length, 34);
  assert.equal(coords.tile_size[0], 200);
  assert.equal(coords.tile_size[1], 200);
  for (const cell of coords.cells) {
    assert.ok(cell.offset_x % 200 === 0);
    assert.ok(cell.offset_y % 200 === 0);
  }
});
test("both historical grid references are preserved", () => {
  assert.match(css, /light\.2d95225a7bb6ff1db853\.svg/);
  assert.match(css, /dark\.8cbd0429f3449df8c19c\.svg/);
  assert.match(css, /data-page=home\]\{background-image:var\(--grid\)/);
  assert.match(runtime, /getImage\("light"\)/);
  assert.match(runtime, /getImage\("dark"\)/);
  // The Theatre uses the Games SDK's thumbnails; the 2022 sprite is no longer loaded.
  assert.doesNotMatch(runtime, /theatre\.4cf739e3dd20f770bb30|\.front/);
  assert.equal(
    existsSync(path("public/static/media/theatre.4cf739e3dd20f770bb30.webp")),
    false,
  );
});
test("2022 media are present with exact hashes from the PC recovery", () => {
  assert.equal(manifest.assets.length, 12);
  const verified = manifest.assets.filter((a) => a.verified_original_bytes);
  assert.equal(verified.length, 6);
  // The Theatre sprite keeps its checksum record but left the build.
  const sprite = verified.find((a) => a.role === "sprite");
  assert.equal(sprite.local_path, null);
  assert.match(sprite.sha256, /^[0-9a-f]{64}$/);
  const recovered = verified.filter((a) => a.local_path);
  assert.equal(recovered.length, 5);
  for (const asset of recovered) {
    assert.ok(existsSync(path(asset.local_path)), `${asset.file} missing`);
    const bytes = readFileSync(path(asset.local_path));
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      asset.sha256,
    );
  }
  const alias = manifest.assets.find((a) => a.file.startsWith("segoe-ui-600."));
  assert.match(alias.status, /byte_for_byte_alias/);
  assert.equal(
    alias.sha256,
    manifest.assets.find((a) => a.file.startsWith("segoe-ui-700.")).sha256,
  );
  const localCSS = readFileSync(path("public/systemya-2022/main.css"), "utf8");
  assert.ok(localCSS.includes("light.2d95225a7bb6ff1db853.svg"));
  assert.ok(localCSS.includes("theatre.4cf739e3dd20f770bb30.webp"));
  assert.doesNotMatch(localCSS, /web\.archive\.org/);
  assert.doesNotMatch(localCSS, /MaterialIcons-Regular\.[\w.-]+\.(?:eot|ttf)/);
  assert.ok(existsSync(path("scripts/recover-systemya-media.mjs")));
});
