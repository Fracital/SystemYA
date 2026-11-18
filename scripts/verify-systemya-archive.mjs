import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const root = new URL("../", import.meta.url);
const manifest = JSON.parse(
  await readFile(new URL("./docs/HISTORICAL-SOURCES.json", root), "utf8"),
);
const failures = [];

for (const entry of manifest.files) {
  if (
    !/^((archive\/wayback-2022\/)|(public\/static\/media\/))[a-zA-Z0-9_./()-]+$/.test(
      entry.path,
    ) ||
    entry.path.includes("..")
  ) {
    failures.push(`${entry.path}: invalid manifest path`);
    continue;
  }
  try {
    const bytes = await readFile(new URL(entry.path, root));
    const hash = createHash("sha256").update(bytes).digest("hex");
    if (hash !== entry.sha256) failures.push(`${entry.path}: SHA-256 mismatch`);
    if (bytes.length !== entry.bytes)
      failures.push(`${entry.path}: size mismatch`);
    if (
      entry.path.endsWith(".webp") &&
      (bytes.subarray(0, 4).toString() !== "RIFF" ||
        bytes.subarray(8, 12).toString() !== "WEBP")
    ) {
      failures.push(`${entry.path}: invalid WebP signature`);
    }
    if (
      entry.path.endsWith(".woff2") &&
      bytes.subarray(0, 4).toString() !== "wOF2"
    ) {
      failures.push(`${entry.path}: invalid WOFF2 signature`);
    }
  } catch (error) {
    failures.push(`${entry.path}: ${error.code || error.message}`);
  }
}

if (failures.length) {
  console.error(
    `Historical archive verification failed (${failures.length} issues):`,
  );
  for (const failure of failures) console.error(` - ${failure}`);
  process.exitCode = 1;
} else {
  console.log(
    `Verified ${manifest.files.length} original 2022 pages, scripts, styles, and media files by SHA-256.`,
  );
}
