import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
test("website2 Node route reference is preserved", () => {
  const s = read("runtime.js");
  for (const fragment of ["/api/bare/", "/api/theatre/", "/cdn/", "/compat/"])
    assert.ok(s.includes(fragment), `missing route ${fragment}`);
});
test("Fracital holyWisp reference remains in the legacy runtime", () => {
  const s = read("runtime.js");
  assert.match(s, /import \{ holyWisp \} from "holywisp"/);
  assert.match(s, /await wisp\.start\(1\)/);
  assert.match(s, /wisp\.route\(req, socket, head\)/);
  assert.match(s, /req\.url === "\/api\/wisp\/" \|\| req\.url === "\/wisp\/"/);
});
test("dependencies use holywisp 0.5.2 and not mrrowisp", () => {
  const pkg = JSON.parse(read("package.json"));
  assert.equal(pkg.dependencies.holywisp, "0.5.2");
  assert.equal(pkg.dependencies.mrrowisp, undefined);
});
test("historical capture and Webcrack outputs are present", () => {
  assert.ok(
    existsSync(new URL("archive/wayback-2022/SystemYA/theatre.html", root)),
  );
  const m = JSON.parse(read("archive/webcrack/manifest.json"));
  assert.equal(m.unique_bundles, 31);
  assert.ok(m.files.every((file) => file.status === "ok"));
});
