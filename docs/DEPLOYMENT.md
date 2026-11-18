# SystemYA static deployment

SystemYA is a static Astro site published to `https://systemya.fracit.al`.
CI builds `dist/` and rsyncs it to `/var/www/systemya` on the edge, where nginx
serves it. DNS, nginx, certificates, Holt and the backend hosts are configured
outside this repository.

## Routes

Astro builds `src/pages/<name>.astro` with `build.format: "preserve"`, so each
page becomes `<name>.html`. `chat/` and `account/` are folders
(`chat/index.astro`, `account/index.astro`) so that `/chat` and `/account`
resolve.

| URL                                                                                  | Served by                                                                                          |
| ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| `/`                                                                                  | `index.html`                                                                                       |
| `/theatre.html`, `/support.html`, `/contact.html`, `/privacy.html`, `/bookmark.html` | Static pages                                                                                       |
| `/chat`                                                                              | Static page that embeds `/room/` in an iframe                                                      |
| `/account/`                                                                          | Static page for Fracital Accounts                                                                  |
| `/room/`                                                                             | Edge proxy to Holt, platform `systemya`, including realtime WebSockets. The edge adds the license. |
| `/v1/games/`                                                                         | Edge proxy to Holy Unblocker's games catalog API                                                   |
| `/cdn/`                                                                              | Edge proxy to Holy Unblocker's SDK and game CDN                                                    |
| `/api/`                                                                              | Edge proxy to the Fracital server (Fracital Accounts)                                              |

The build must not write files under `room/`, `v1/`, `cdn/` or `api/`. For an
unknown path the edge serves `/index.html` with status 200, and the frontend
renders its own not-found message.

## Accounts and chat

SystemYA has no backend of its own. Visitors sign in with Fracital Accounts
through the `/api/` proxy: email and password, Discord, Google, GitHub,
Last.fm, Terbium Accounts and passkeys, plus password reset and email
verification. The client is `src/fracital/`, ported from Fracital's
`src/libs` with the crypto codecs unchanged.

Providers only call back to Fracital's auth host (`https://fracit.al`), so
OAuth and Last.fm run through STomp (`src/fracital/stomp-oauth.ts`):

1. The sign-in starts on this host (`/api/auth/sign-in/social` with
   `disableRedirect`, `/api/auth/link-social`, or `/api/auth/lastfm/url`).
   Fracital sets its state cookie here and returns the provider's URL.
2. The provider's pages run in the STomp view.
3. A STomp request rule answers `https://fracit.al/api/auth/callback/<provider>`
   (and `/api/auth/lastfm/callback`) with a 204, and the request event hands
   over the code and state.
4. The same callback is replayed on this host. Fracital checks the state
   cookie, exchanges the code and sets the session here.

Browsers without service workers fall back to a popup on `fracit.al`, which
only works once Fracital lists `https://systemya.fracit.al` in
`BETTER_AUTH_TRUSTED_ORIGINS`. The cross-site sign-in hub needs that entry too.

Holt reads the visitor's identity from `/api/me/chat` on the same proxy. A
signed-in visitor posts in `/chat` under their Fracital username. Guests can
read public channels but cannot post. Holt links to the platform's views by
setting the parent page's hash (`#/account`); `src/systemya/chat-links.ts`
turns those into page loads (`/account/`, `/theatre.html` and so on).

The edge has no `/wisp/` route. STomp uses Fracital's public relay,
`wss://holywisp.fracit.al/` (`src/systemya/stomp.ts`).

## GitHub workflows

- `.github/workflows/ci.yml` runs on pull requests and on pushes to branches
  other than `main`: `npm ci`, `npm run verify`, `npm run build` and
  `scripts/verify-static-dist.mjs`.
- `.github/workflows/deploy.yml` runs on pushes to `main` and on manual
  dispatch. The build job repeats those checks and uploads `dist/` as an
  artifact. The deploy job rsyncs it to the edge. Deploys run one at a time
  with `cancel-in-progress: false`.
- `scripts/verify-static-dist.mjs` requires `dist/index.html` and rejects
  reserved edge paths, server build output, likely credentials and unexpected
  symlinks.

The `build` script runs `prepare:stomp`, `astro check`, `astro build` and the
static output check. website2's SDK build (`npm run build:sdk`) is not part of
it, because the edge already serves `/cdn/`.

rsync runs in two passes. The first copies everything except HTML. The second
copies all files and deletes old ones, so new pages only go live after their
assets exist. A stale tab that requests a deleted hashed chunk gets
`index.html` back; the layout listens for Vite's `preloadError` and reloads
once.

After the upload the workflow requests `/`, `/room/` and `/cdn/index.js` and
fails if any of them does not return success.

## Deploy credentials

The deploy job uses one GitHub Actions secret, `SYSTEMYA_DEPLOY_KEY`: a
restricted SSH key authorized by the edge operator. It is never committed,
placed in `.env`, or written into documentation or workflow YAML. The build job
cannot read it.

The workflow pins the SSH host keys for the edge and for divide, and reaches
`systemya@172.16.5.10` with `ProxyJump root@91.199.82.174`. A forced rsync
command limits writes to `/var/www/systemya`. The rsync destination is
`edge:`, relative to that directory.

Holt's license lives only in the edge's configuration. It is not a secret of
this repository and never reaches the frontend.

## Setup

1. Add the deploy key as the repository secret `SYSTEMYA_DEPLOY_KEY`.
2. Open a pull request. CI runs without the deploy secret.
3. Merge to `main` or run the Deploy workflow by hand. Every push to `main`
   deploys to production.

## Local development

```sh
npm ci
npm run verify
npm run dev
npm run build
npm run preview
```

The local server has no `/room/`, `/cdn/` or `/api/` proxy, so chat, the games
catalog and sign-in do not work locally. Do not replace them with fake
client-side services. `npm run build:obfuscated` is an optional Vite
client-chunk obfuscation build and is not part of CI.

## Website2 legacy code

`sdk/`, the website2 utilities in `scripts/`, `run-server.js`, `runtime.js`,
`Dockerfile` and the related configuration are kept as reference and tooling.
website2's non-static pages are in `legacy/website2/pages/` and its Node
middleware is `legacy/website2/middleware.ts`. Neither is in Astro's route
tree, and the Node server is not deployed.
