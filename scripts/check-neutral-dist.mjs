import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * The browser page, the player page and the files behind them stay neutral: no served file or
 * folder is named after the packages it comes from (the Flash player's included), /proxy/ is not built, and the pages SystemYA adds for it
 * (/app/ and the UI under /ui/) show none of the words below in their text or in the
 * attributes a filter reads. The May 2022 pages keep their own words (their copy talks about
 * proxies, in the 2022 obfuscation).
 */
export const NAME_WORDS =
  /stomp|sysce|epoxy|libcurl|powermouse|adblock|rewriter|proxy|ruffle|flash|swf/i;
export const PAGE_WORDS = /proxy|stomp|powermouse|unblock/i;

/** The text a reader sees, without tags, comments, scripts and styles. */
export function visibleText(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ");
}

/** Values of the attributes a filter or a reader can see. */
export function visibleAttributes(html) {
  return [
    ...html
      .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, " ")
      .matchAll(
        /\s(href|src|id|class|title|alt|placeholder|aria-label|name|content|data-[\w-]+)="([^"]*)"/gi,
      ),
  ].map((m) => `${m[1]}="${m[2]}"`);
}

export function checkNeutralDist(dir) {
  const problems = [];
  const walk = (path) => {
    for (const entry of readdirSync(path, { withFileTypes: true })) {
      const next = join(path, entry.name);
      const name = relative(dir, next);
      // the May 2022 media and pages keep their recovered names
      if (/^(?:systemya-2022|static|assets)(?:\/|$)/.test(name)) continue;
      if (NAME_WORDS.test(entry.name)) problems.push(`named after it: ${name}`);
      if (entry.isDirectory()) walk(next);
    }
  };
  walk(dir);
  if (existsSync(join(dir, "proxy")))
    problems.push("proxy/ is built; the page is /app/");
  const pages = [join(dir, "app/index.html")];
  const ui = join(dir, "ui");
  if (existsSync(ui))
    for (const entry of readdirSync(ui))
      if (entry.endsWith(".html")) pages.push(join(ui, entry));
  for (const page of pages) {
    if (!existsSync(page)) continue;
    const html = readFileSync(page, "utf8");
    const words = visibleText(html).match(new RegExp(PAGE_WORDS, "gi"));
    if (words)
      problems.push(`${relative(dir, page)} says ${[...new Set(words)]}`);
    for (const attribute of visibleAttributes(html))
      if (PAGE_WORDS.test(attribute))
        problems.push(`${relative(dir, page)}: ${attribute}`);
    const title = /<title>([^<]*)<\/title>/.exec(html)?.[1];
    // the error page, shown inside the UI's frame, keeps its own title
    if (!/\/er\.[^/]*$/.test(page) && title !== "SystemYA")
      problems.push(`${relative(dir, page)} has the title ${title}`);
  }
  // no page links to the old address or names the nav entry in plain text
  for (const page of readdirSync(dir, { recursive: true }))
    if (String(page).endsWith(".html")) {
      const html = readFileSync(join(dir, String(page)), "utf8");
      if (/href="\/proxy\/?"|<span>Proxy<\/span>/.test(html))
        problems.push(`${page} links to /proxy/ or shows the plain label`);
    }
  return problems;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const dir = resolve(process.argv[2] ?? "dist");
  const problems = checkNeutralDist(dir);
  for (const problem of problems) console.error(problem);
  if (problems.length) process.exit(1);
  console.log(`Neutral names verified: ${dir}`);
}
