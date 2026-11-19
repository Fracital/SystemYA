/**
 * The /app/ page's fragment. Never a readable address:
 *
 * - `#<code>`: what openProxy or openFrame hands over, an http(s) URL or a same-origin path.
 *   Fracital's XOR (every second character XOR 2), then base64url of the UTF-8 bytes.
 * - `#html.../<seal>`: the browser UI's own route for the page on show, which it writes once
 *   the page loads. It only opens again in the browser that sealed it.
 *
 * A plain URL typed after the `#` by hand also opens; it is replaced by the route.
 * No imports, so the tests load it in Node.
 */

export type ProxyTarget =
  | { kind: "route"; hash: string }
  | { kind: "url"; url: string }
  | { kind: "frame"; path: string }
  | { kind: "none" };

function xor(input: string): string {
  let result = "";
  for (let i = 0; i < input.length; i++)
    result +=
      i % 2 ? String.fromCharCode(input.charCodeAt(i) ^ 2) : input.charAt(i);
  return result;
}

export function encodeTarget(value: string): string {
  let binary = "";
  for (const byte of new TextEncoder().encode(xor(value)))
    binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function decodeTarget(code: string): string {
  if (!/^[\w-]+$/.test(code)) throw new TypeError("Not an encoded target");
  const binary = atob(code.replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return xor(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
}

/** The http(s) URL `value` names, or null. */
export function webUrl(value: string, base?: string): string | null {
  try {
    const url = new URL(value, base);
    return /^https?:$/.test(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

const isPath = (value: string) =>
  value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\");

/** `#` and the fragment that hands `url` (http or https) to the browser UI. */
export function proxyHash(url: string): string {
  const href = webUrl(url);
  if (!href) throw new TypeError("Only HTTP and HTTPS sites can be opened");
  return `#${encodeTarget(href)}`;
}

/** `#` and the fragment that shows the same-origin `path` (with its query) full size. */
export function frameHash(path: string): string {
  if (!isPath(path))
    throw new TypeError("A framed page must be a same-origin path");
  return `#${encodeTarget(path)}`;
}

function target(value: string): ProxyTarget {
  if (isPath(value)) return { kind: "frame", path: value };
  const url = /^https?:\/\/\S/i.test(value) ? webUrl(value) : null;
  return url ? { kind: "url", url } : { kind: "none" };
}

/** What an /app/ fragment (with or without its `#`) asks for. */
export function readProxyHash(hash: string): ProxyTarget {
  const text = hash.replace(/^#/, "");
  if (!text) return { kind: "none" };
  // the browser UI's route test (demo/public/pm/main.js readHash)
  if (/^html[^/]*\/[^/]+$/.test(text.split("#")[0]))
    return { kind: "route", hash: `#${text}` };
  try {
    const found = target(decodeTarget(text));
    if (found.kind !== "none") return found;
  } catch {}
  try {
    // typed by hand: only a web address, never a path
    const found = target(decodeURIComponent(text));
    if (found.kind === "url") return found;
  } catch {}
  return { kind: "none" };
}
