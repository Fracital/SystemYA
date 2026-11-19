/**
 * What a deploy keeps on the edge after it leaves the build: every file the site served in the
 * KEEP_HOURS before the last deploy.
 *
 * Each build renames the browser UI and the runtime (`/ui/ix.<stamp>.html`, `/vendor/rt/sw.<stamp>.js`,
 * ...), and Astro's chunks are named by their content. A page loaded before a deploy still names
 * the files of its own build: an open tab, its browser page's frames and service worker, and a page
 * that Back or Forward takes from the browser's cache without asking the edge. Deleted, those
 * files get the edge's fallback, the SystemYA shell, which shows "Page not found" in the browser's
 * frame (or, under the browser page's embedder policy, a blocked frame) and breaks a proxied page
 * on its next request.
 *
 * Reads `rsync --list-only -r edge:`, taken before the upload, on stdin, and prints an rsync
 * protect rule for each file to keep, for `--filter='merge <rules>'` on the pass that deletes.
 * rsync without -t gives every file it uploads the time of the upload, so a file's time is the
 * last deploy that had it. The window is measured from the newest file (the last deploy), not
 * from now, so a deploy after a quiet week still keeps the build before it.
 */
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

export const KEEP_HOURS = 72;

const LINE =
  /^-\S*\s+[\d,.]+\s+(\d{4})\/(\d\d)\/(\d\d) (\d\d):(\d\d):(\d\d) (.+)$/;

/** The regular files of an `rsync --list-only` listing, with their times in ms (the edge runs on UTC). */
export function parseListing(text) {
  const files = [];
  for (const line of text.split("\n")) {
    const match = LINE.exec(line);
    if (!match) continue;
    const [, y, mo, d, h, mi, s, path] = match;
    files.push({ path, time: Date.UTC(+y, +mo - 1, +d, +h, +mi, +s) });
  }
  return files;
}

/** The paths to keep: every file within `hours` of the newest one. */
export function keptPaths(files, hours = KEEP_HOURS) {
  if (!files.length) return [];
  const newest = Math.max(...files.map((file) => file.time));
  const from = newest - hours * 3600 * 1000;
  return files
    .filter((file) => file.time >= from)
    .map((file) => file.path)
    .sort();
}

/**
 * An rsync protect rule for exactly `path`, anchored at the transfer's root. rsync reads a
 * backslash as an escape only in a pattern with a wildcard, so only such a path is escaped.
 */
export const protectRule = (path) =>
  `P /${/[*?[]/.test(path) ? path.replace(/[\\*?[]/g, "\\$&") : path}`;

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const kept = keptPaths(parseListing(readFileSync(0, "utf8")));
  process.stdout.write(kept.map((path) => `${protectRule(path)}\n`).join(""));
  console.error(`Keeping ${kept.length} files of the last ${KEEP_HOURS} hours`);
}
