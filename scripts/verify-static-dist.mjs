import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { resolve, sep } from "node:path";
import { checkNeutralDist } from "./check-neutral-dist.mjs";

const dir = resolve(process.argv[2] ?? "dist");
if (!existsSync(dir) || !statSync(dir).isDirectory()) {
  console.error(`No static build directory: ${dir}`);
  process.exit(1);
}

for (const name of ["index.html"]) {
  if (!existsSync(resolve(dir, name))) {
    throw new Error(`Missing required static entry: ${name}`);
  }
}

for (const reserved of ["room", "v1", "cdn", "api", "server", "_server"]) {
  if (existsSync(resolve(dir, reserved))) {
    throw new Error(
      `Build contains edge-reserved or server-only path: /${reserved}/`,
    );
  }
}

const root = readFileSync(resolve(dir, "index.html"), "utf8");
if (!root.includes("SystemYA"))
  throw new Error("The static homepage is not SystemYA");
if (!root.includes("_astro") && !root.includes("<script")) {
  throw new Error("Homepage does not reference a browser application");
}

const walk = (path) => {
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    const next = resolve(path, entry.name);
    if (entry.isSymbolicLink())
      throw new Error(`Unexpected symlink in deploy output: ${next}`);
    if (entry.isDirectory()) {
      walk(next);
      continue;
    }
    if (!entry.isFile()) throw new Error(`Unexpected build object: ${next}`);
    if (
      /^(?:\.env(?:\.|$)|systemya-ci$|holt-license|config\.js$)/i.test(
        entry.name,
      )
    ) {
      throw new Error(
        `Potential private or runtime-only file in deploy output: ${next}`,
      );
    }
    if (!next.startsWith(dir + sep))
      throw new Error(`Unsafe output path: ${next}`);
  }
};
walk(dir);
const neutral = checkNeutralDist(dir);
if (neutral.length) throw new Error(`Not neutral:\n${neutral.join("\n")}`);
console.log(
  `Static output verified: ${dir}. Edge-reserved routes and secrets excluded.`,
);
