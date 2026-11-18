import { readFile, access } from "node:fs/promises";
import { createHash } from "node:crypto";

const root = new URL("../", import.meta.url);
const get = (path) => new URL(path, root);
const pkg = JSON.parse(await readFile(get("package.json"), "utf8"));
const lock = JSON.parse(await readFile(get("package-lock.json"), "utf8"));
const manifest = JSON.parse(
  await readFile(get("docs/UPSTREAM-SCRIPT-INVENTORY.json"), "utf8"),
);
const failures = [];

for (const row of manifest) {
  try {
    const bytes = await readFile(get(row.path));
    if (createHash("sha256").update(bytes).digest("hex") !== row.sha256) {
      failures.push(`${row.path}: differs from supplied website2 source`);
    }
  } catch (error) {
    failures.push(`${row.path}: ${error.code || error.message}`);
  }
}

const expectedCommands = [
  "dev",
  "start",
  "build:sdk",
  "build",
  "build:obfuscated",
  "preview",
  "check",
  "seed",
  "astro",
  "games",
  "thumbnails",
  "fetch-adblock",
  "fetch-cloaks",
  "prepare",
  "recover:media",
  "audit:media",
  "verify",
  "test",
];
for (const cmd of expectedCommands)
  if (!pkg.scripts[cmd]) failures.push(`missing command: ${cmd}`);
for (const path of [
  "src/pages/index.astro",
  "src/pages/theatre.astro",
  "src/pages/contact.astro",
  "src/layouts/SystemYALayout.astro",
  "src/systemya/interactions.ts",
  "sdk/build.mjs",
  "config/config.example.js",
  "config/Caddyfile",
  "Dockerfile",
  "docker-compose.yml",
  "db.sql",
  "runtime.js",
  "run-server.js",
  "obfuscator.mjs",
  "svgmin.mjs",
  "src/lib/TheatreAPI.ts",
]) {
  try {
    await access(get(path));
  } catch {
    failures.push(`missing website2/SystemYA component: ${path}`);
  }
}
if (pkg.dependencies?.holywisp !== "0.5.2" || pkg.dependencies?.mrrowisp) {
  failures.push("Wisp transport must be holywisp 0.5.2, not mrrowisp");
}
if (
  lock.packages?.["node_modules/holywisp"]?.version !== "0.5.2" ||
  lock.packages?.["node_modules/mrrowisp"]
) {
  failures.push("package-lock Wisp metadata is not adapted");
}
for (const section of ["dependencies", "devDependencies"]) {
  if (
    JSON.stringify(Object.entries(pkg[section]).sort()) !==
    JSON.stringify(Object.entries(lock.packages?.[""]?.[section] || {}).sort())
  ) {
    failures.push(`package-lock root ${section} differs from package.json`);
  }
}
if (failures.length) {
  console.error(`Structure verification failed (${failures.length} issues):`);
  for (const failure of failures) console.error(` - ${failure}`);
  process.exitCode = 1;
} else {
  console.log(
    `Verified ${manifest.length} copied website2 scripts, ${expectedCommands.length} commands and project structure.`,
  );
}
