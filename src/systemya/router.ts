// In-site navigation for the route book (routes.ts). Astro's ClientRouter keeps doing history,
// scrolling, Back and Forward and the page events; this only changes what a navigation loads.
// A navigation to a page of the book builds the next document here, from the page templates
// "/" carries, instead of fetching one: the address stays /?N and nothing is requested. On an
// old path's file (/theatre.html), which has no templates, the first navigation fetches the
// number (the edge answers with "/"), and the ones after it are local again. A navigation to an
// old path goes to its number instead.
import type { TransitionBeforePreparationEvent } from "astro:transitions/client";
import { TABLE, locate, show, type RoutePage } from "./routes";

/** A document's <body> with an empty #root: the page templates and the scripts. */
function cleanBody(doc: Document): string {
  const copy = doc.body.cloneNode(true) as HTMLElement;
  for (const child of [...copy.children]) {
    if (child.id === "root") {
      child.replaceChildren();
      (child as HTMLElement).dataset.page = "";
    } else if (child.id !== "systemya-pages" && child.localName !== "script")
      child.remove();
  }
  // ClientRouter marks every script it has seen; the copy must look freshly served.
  for (const script of copy.querySelectorAll("script"))
    script.removeAttribute("data-astro-exec");
  return copy.innerHTML;
}

/**
 * The body as served, taken before anything mounts (and again from a fetched "/"), so every
 * navigation starts from the same clean body.
 */
let body = "";
let hasPages = false;
let parser: DOMParser | undefined;

function keep(doc: Document): void {
  body = cleanBody(doc);
  hasPages = !!doc.querySelector("#systemya-pages > template");
}

/** The document for `page`: this head, the clean body, and the page in #root. */
function documentFor(page: RoutePage | "not-found"): Document {
  parser ??= new DOMParser();
  const doc = parser.parseFromString(
    `<!doctype html><html lang="${document.documentElement.lang}"><head>${document.head.innerHTML}</head><body>${body}</body></html>`,
    "text/html",
  );
  for (const node of doc.querySelectorAll("noscript")) node.remove();
  show(doc, page);
  return doc;
}

function onBeforePreparation(event: Event): void {
  const prep = event as TransitionBeforePreparationEvent;
  if (prep.formData || prep.to.origin !== location.origin) return;
  if (!Object.prototype.hasOwnProperty.call(TABLE.paths, prep.to.pathname))
    return;
  const at = locate(TABLE, prep.to.pathname, prep.to.search, prep.to.hash);
  if (at.href !== null) prep.to = new URL(at.href, location.origin);
  // The edge isolates only the browser's page (/?2: COOP same-origin, COEP require-corp), so a
  // page in it that isolates itself is isolated through STomp, while the other pages keep loading
  // cross-origin images and frames. A document's headers can't change in place: a move into or
  // out of the browser is a full load (Astro sets location.href when the navigation is
  // cancelled). A browser that can't isolate makes every move into it a full load, never a loop.
  // A move from the browser to the browser is a full load too: the UI and the runtime are renamed
  // every build, and only a fresh document names the current build's files.
  if (at.page === "app" || globalThis.crossOriginIsolated) {
    prep.preventDefault();
    return;
  }
  if (hasPages) {
    prep.loader = async () => {
      prep.newDocument = documentFor(at.page);
    };
    return;
  }
  const fetchPage = prep.loader;
  prep.loader = async () => {
    await fetchPage();
    const doc = prep.newDocument;
    if (doc === document || !doc.querySelector("#systemya-pages > template"))
      return;
    keep(doc);
    show(doc, at.page);
  };
}

if (typeof document !== "undefined") {
  keep(document);
  document.addEventListener("astro:before-preparation", onBeforePreparation);
}
