# Games SDK and Holt

## Games SDK

The game catalog uses Holy Unblocker website2's SDK, version 0.0.5, from
`sdk/`. In production the edge serves its browser bootstrap at `/cdn/index.js`
and proxies `/cdn/` and `/v1/games/` to Holy Unblocker. The static build does
not include the SDK.

`/theatre.html` keeps the 34 recovered 2022 cards from
`src/systemya/snapshots/theatre.html` with their original sprite coordinates.
`src/systemya/games-sdk.ts` loads `/cdn/index.js` and adds a "More games"
section below them, which was not part of the 2022 site. It uses `HU.query`
for search and pagination, `HU.getGame` to launch and `HU.countPlay` after a
launch. Thumbnails use the SDK's opaque same-origin image paths.

Launches open in SystemYA's in-page frame:

- `proxy` games open their source URL in STomp, over Fracital's public relay
  `wss://holywisp.fracit.al/`.
- `flash` games open `/flash#<encrypted URL>`, website2's Ruffle page. That
  page is in `legacy/website2/pages/` and is not part of the static build.
- Other games open the SDK's local `launchPath`.

The browser talks to the SDK's opaque `/cdn/` routes only. Do not add browser
requests to `/v1/games/` or show raw game source URLs in the UI.

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
