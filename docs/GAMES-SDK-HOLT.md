# Games SDK and Holt

## Games SDK

The Theatre (`/theatre.html`) is Holy Unblocker website2's theatre on the 2022
page. In production the edge serves the SDK's browser bootstrap at
`/cdn/index.js` and proxies `/cdn/` and `/v1/games/` to Holy Unblocker. The
static build does not include the SDK. `sdk/` holds website2's SDK source,
version 0.0.5, as reference and for the tests.

- `src/systemya/games-sdk.ts` loads `/cdn/index.js` once per document (one
  retry), maps website2's sort names to API parameters and launches games.
- `src/systemya/theatre.ts` and `theatre.css` draw the Theatre from
  website2's `hub/index.astro`, `TheatreCategory.astro`,
  `TheatreSearchBar.astro`, `renderTheatre.ts` and `searchResult.ts`.

Views are URLs, so the browser's back and forward buttons work:

| URL                             | View                                                  |
| ------------------------------- | ----------------------------------------------------- |
| `/theatre.html`                 | One 2022 drawer per category, 15 games each, sorted   |
| `/theatre.html?category=action` | Every game in a category, 30 per page, with six sorts |
| `/theatre.html?q=mario`         | Search results, 30 per page                           |
| `&sort=nameASC`, `&page=2`      | Sort (website2's names) and page                      |

The SDK calls are the ones website2 makes: `HU.query` with `groupBy:
"category"` and `limitPerGroup` for the drawers, with `category`, `offset`,
`limit`, `sort` and `order` for a category, with `search` for search results
and suggestions, `HU.getGame` before a launch and `HU.countPlay` once per game
per browser. Every query passes `type` with the SDK's types except `flash`.
Thumbnails use each entry's opaque `imagePath`.

A drawer shows one row. Its round button opens the drawer in place, and stays
at the bottom of the screen while the drawer is open. If the drawer's heading
has scrolled above the screen when it opens or closes, the page scrolls back to
it. The 2022 page scrolls `#root` (`position: fixed; overflow: auto`), not the
window.

`launchGame` in `games-sdk.ts` is the one place a game opens, following
website2's `TheatrePlayer.astro`:

- `proxy` games open their source URL in STomp, over Fracital's public relay
  `wss://holywisp.fracit.al/`.
- `embed` games open the SDK's signed `assetPath` in SystemYA's frame.
- `emulator.*` games open the SDK's `playerPath` (webretro) with the
  `assetPath` as the ROM.
- `flash` games need website2's Ruffle page at `/flash`, which the static
  build does not have, so the catalog leaves them out.

The `launchPath` (`/hub/?v=...`) is a website2 page and is not used here.
The browser talks to the SDK's opaque `/cdn/` routes only. Do not add browser
requests to `/v1/games/` or show raw game source URLs in the UI.

The bootstrap only exists behind the edge. `npm run dev` and `npm run preview`
have no `/cdn/`, so the Theatre shows "The game library is unavailable right
now." with a Try again button there.

## Holt

Holt has the `systemya` platform registered for the origin
`https://systemya.fracit.al`. `/chat` embeds the same-origin iframe `/room/`,
and the edge proxies `/room/` to Holt, including the realtime socket at
`/room/_holt/api/rt`. The edge adds the platform license upstream; it is never
in the browser bundle or in this repository.

Holt asks `GET /api/me/chat` who the visitor is. On SystemYA that path goes
through the edge's `/api/` proxy to Fracital Accounts, so a visitor signed in
at `/account/` posts under their Fracital username. Guests can read public
channels and cannot post.

`src/server/holt-relay.mjs` and `src/server/holt-identity.mjs` are the earlier
Node relay and a guest-only identity response, adapted from Fracital's
`chat-relay.ts`. They are kept for the tests and as reference, and are not
deployed.
