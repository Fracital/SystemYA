#!/usr/bin/env node
// Recover the original May 2022 SystemYA media referenced by the archived CSS.
// Never substitute a modern image or store an HTML error as an image.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, resolve, dirname } from "node:path";
import { createHash } from "node:crypto";

const root = resolve(import.meta.dirname, "..");
const outDir = join(root, "public/static/media");
const reportPath = join(root, "docs/HISTORICAL-ASSET-RECOVERY.json");
const sourceCss = await readFile(
  join(root, "archive/wayback-2022/SystemYA/theatre_files/main.eb81df9c.css"),
  "utf8",
);
const fileNames = [
  ...new Set(
    [...sourceCss.matchAll(/\/static\/media\/([A-Za-z0-9_.-]+)/g)].map(
      (m) => m[1],
    ),
  ),
].sort();
const importAt = process.argv.indexOf("--import");
const importDir =
  importAt === -1 ? null : resolve(process.argv[importAt + 1] || ".");
const online = process.argv.includes("--online");
const dryRun = process.argv.includes("--dry-run");
const origin = "https://sys32.dev/static/media/";
const stamp = "20220526154012";
const results = [];

function isValid(name, bytes) {
  if (bytes.length < 16) return false;
  const first = bytes.subarray(0, 32).toString("utf8");
  if (/<!doctype|<html|wayback machine|temporarily unavailable/i.test(first))
    return false;
  if (name.endsWith(".webp"))
    return (
      bytes.toString("ascii", 0, 4) === "RIFF" &&
      bytes.toString("ascii", 8, 12) === "WEBP"
    );
  if (name.endsWith(".svg")) return /<svg\b/i.test(bytes.toString("utf8"));
  if (name.endsWith(".woff2")) return bytes.toString("ascii", 0, 4) === "wOF2";
  if (name.endsWith(".woff")) return bytes.toString("ascii", 0, 4) === "wOFF";
  if (name.endsWith(".ttf"))
    return (
      bytes.toString("hex", 0, 4) === "00010000" ||
      bytes.toString("ascii", 0, 4) === "true"
    );
  if (name.endsWith(".eot")) return bytes.length > 32;
  return false;
}

const candidates = (name) => [
  `https://web.archive.org/web/${stamp}id_/${origin}${name}`,
  `https://web.archive.org/web/${stamp}im_/${origin}${name}`,
  `https://web.archive.org/web/20220526000000id_/http://sys32.dev/static/media/${name}`,
  `https://web.archive.org/web/20220601000000id_/${origin}${name}`,
];

await mkdir(outDir, { recursive: true });
await mkdir(dirname(reportPath), { recursive: true });
for (const name of fileNames) {
  const file = join(outDir, name);
  const entry = {
    filename: name,
    original_url: origin + name,
    status: "missing",
    attempts: [],
  };
  try {
    const data = await readFile(file);
    if (isValid(name, data)) {
      entry.status = "present";
      entry.sha256 = createHash("sha256").update(data).digest("hex");
      results.push(entry);
      continue;
    }
    entry.attempts.push("Existing file failed format verification");
  } catch {}
  if (dryRun) {
    results.push(entry);
    continue;
  }
  let bytes;
  if (importDir) {
    try {
      const found = await readFile(join(importDir, name));
      if (isValid(name, found)) {
        bytes = found;
        entry.source = "user-import";
      } else entry.attempts.push("Imported asset failed format verification");
    } catch {
      entry.attempts.push("No matching imported asset");
    }
  }
  if (!bytes && online) {
    for (const url of candidates(name)) {
      try {
        const response = await fetch(url, {
          signal: AbortSignal.timeout(10000),
          headers: { "User-Agent": "SystemYA-source-recovery/1.0" },
        });
        const data = Buffer.from(await response.arrayBuffer());
        if (response.ok && isValid(name, data)) {
          bytes = data;
          entry.source = url;
          break;
        }
        entry.attempts.push(
          `${url}: HTTP ${response.status}, invalid/mismatched file`,
        );
      } catch (e) {
        entry.attempts.push(`${url}: ${String(e.message || e)}`);
      }
    }
  }
  if (bytes) {
    await writeFile(file, bytes);
    entry.status = "recovered";
    entry.sha256 = createHash("sha256").update(bytes).digest("hex");
  }
  results.push(entry);
}
const report = {
  reference: "May 26 2022 SystemYA CSS",
  mode: dryRun ? "dry-run" : online ? "online" : importDir ? "import" : "audit",
  summary: {
    total: results.length,
    available: results.filter((e) =>
      ["present", "recovered"].includes(e.status),
    ).length,
    missing: results.filter((e) => e.status === "missing").length,
  },
  assets: results,
};
await writeFile(reportPath, JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report.summary));
if (report.summary.missing)
  console.log(
    "Missing:",
    results
      .filter((r) => r.status === "missing")
      .map((r) => r.filename)
      .join(", "),
  );
