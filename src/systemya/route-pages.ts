// What the layout writes into every page: each page of the route book (routes.ts) as a template,
// with its links in the book's form, so the entry script and the router can show any page
// without fetching it. Build time only.
import { getSystemYASnapshot } from "./snapshot";
import { BOOK, PAGES, bookLinks, type RoutePage } from "./routes";

export type ShownPage = RoutePage | "not-found";

export interface PageTemplate {
  page: ShownPage;
  title: string;
  fullscreen: boolean;
  markup: string;
}

const NOT_FOUND_MAIN =
  '<main><h1>Page not found</h1><a href="/">Home</a></main>';

/** A page's markup with its links in the book's form. */
export function pageMarkup(page: ShownPage): string {
  if (page === "not-found")
    return bookLinks(
      getSystemYASnapshot("index").replace(
        /<main\b[^>]*>[\s\S]*<\/main>/,
        NOT_FOUND_MAIN,
      ),
    );
  return bookLinks(getSystemYASnapshot(page));
}

/** Home, every live page of the book, and the not-found page. */
export function pageTemplates(): PageTemplate[] {
  const pages: ShownPage[] = [
    "index",
    ...BOOK.filter((route) => !route.retired).map((route) => route.page),
    "not-found",
  ];
  return pages.map((page) => ({
    page,
    title: page === "not-found" ? "SystemYA" : PAGES[page].title,
    fullscreen: page === "not-found" ? false : PAGES[page].fullscreen,
    markup: pageMarkup(page),
  }));
}
