# SystemYA static deployment

SystemYA is a static Astro site published to `https://systemya.fracit.al`.
CI builds `dist/` and rsyncs it to `/var/www/systemya` on the edge, where nginx
serves it. DNS, nginx, certificates, Holt and the backend hosts are configured
outside this repository.

## Routes

Every page is a number on `/`, kept in the route book,
`src/systemya/routes.ts`. No address names a page.

| Address | Page                                                                |
| ------- | ------------------------------------------------------------------- |
| `/`     | Home                                                                |
| `/?1`   | Theatre (`/?1&category=action&sort=nameASC&page=2`, `/?1&q=mario`)  |
| `/?2`   | Browser page (`/?2#<fragment>`, see "Browser page")                 |
| `/?3`   | Chat, embedding `/room/` in an iframe                               |
| `/?4`   | Support                                                             |
| `/?5`   | Contact                                                             |
| `/?6`   | Privacy                                                             |
| `/?7`   | Account (Fracital Accounts)                                         |
| `/?8`   | Insta-Proxy (the 2022 bookmark page)                                |
| `/?9`   | Flash player, shown in the browser page's frame (see "Player page") |

Extra state follows the number with `&`, and a fragment stays a fragment. An
unknown or retired number shows the not-found page.

How a page is served:

- The edge serves `index.html` for `/` and every `/?N`. `index.html` carries
  every page of the book as a `<template>` (`SystemYALayout.astro`, from
  `src/systemya/route-pages.ts`). A small inline script, built from
  `routes.ts`, puts the page the address names into `#root` while the page
  parses, so there is no flash of the home page.
- In-site navigation goes through Astro's `ClientRouter`.
  `src/systemya/router.ts` builds the next document from the templates instead
  of fetching it, so history, scrolling, Back and Forward and the
  `astro:page-load` events work as before and nothing is requested. All CSS
  and page scripts are in the shared layout bundle, so every page renders the
  same from any entry.
- Links in the 2022 snapshots keep their old paths in `src/systemya/snapshots/`.
  `bookLinks()` rewrites them at build time, so the site shows and follows
  `/?1`, never `/theatre.html`. Code builds addresses with
  `routeHref(page, query)`; the browser page's is `routeHref("app")`
  (`APP_PATH` in `src/systemya/proxy.ts`).

The old paths still work. `/theatre.html`, `/support.html`, `/contact.html`,
`/privacy.html` and `/bookmark.html` are built, and so are the `account/`,
`chat/` and `app/` folders (`account/index.astro` and so on), so that direct
links and email links keep loading. Each carries only its own page. On load
the address becomes the page's number with its query and fragment kept
(`/theatre.html?category=action` becomes `/?1&category=action`,
`/app/#x` becomes `/?2#x`). The first navigation from one of these fetches the
next number from the edge (which answers with `index.html`); after that the
templates are local. Extensionless spellings (`/theatre`, `/privacy`) and
`/chat.html` reach `index.html` through the edge's fallback and resolve the
same way. Nothing on the site links to an old path.

Email and redirect links come back to the old paths and keep their
parameters: Fracital's reset link `/account/?reset=1&token=...` becomes
`/?7&reset=1&token=...`, and `/account/?verified=1` and `?error=...` likewise.
The account page reads them (without the route number, `routeQuery()`) and
then sets the address to `/?7`.

### Adding or removing a page

1. Add the Astro page and its markup as before, and the page key to
   `SystemYAPage` in `src/systemya/snapshot.ts`.
2. In `src/systemya/routes.ts`, add the key to `RoutePage`, `PAGES` (title,
   full screen) and `OLD_PATHS` (its built path), and append a line to `BOOK`
   with the next number after the highest one already there, counting
   retired ones, and today's date as `since`.
3. Link to it with `routeHref("<key>")`, or with its old path in a snapshot.
4. To remove a page, keep its line and set `retired` to the day it goes. Its
   number is never given out again, and its address shows not-found.

`tests/routes.test.mjs` checks the book (numbers unique and increasing, the
first numbers never moving, one live number per page, titles matching the
page files), the old-path and email-link mapping and the entry script.
`tests/routes-browser.test.mjs` drives a built `dist/` in headless Chrome when
`PLAYWRIGHT_CORE` (and `CHROME`) are set, and is skipped otherwise.

### Edge paths

| URL                   | Served by                                                                                          |
| --------------------- | -------------------------------------------------------------------------------------------------- |
| `/ui/`, `/vendor/rt/` | The browser UI and STomp's runtime, copied in by `prepare:stomp`                                   |
| `/vendor/pl/`         | The Flash player (`@ruffle-rs/ruffle`), copied in by `prepare:stomp`                               |
| `/room/`              | Edge proxy to Holt, platform `systemya`, including realtime WebSockets. The edge adds the license. |
| `/v1/games/`          | Edge proxy to Holy Unblocker's games catalog API                                                   |
| `/cdn/`               | Edge proxy to Holy Unblocker's SDK and game CDN                                                    |
| `/api/`               | Edge proxy to the Fracital server (Fracital Accounts)                                              |

The build must not write files under `room/`, `v1/`, `cdn/` or `api/`. For an
unknown path the edge serves `/index.html` with status 200, and the frontend
renders its own not-found page.

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
signed-in visitor posts in the chat (`/?3`) under their Fracital username.
Guests can read public channels but cannot post. Holt links to the platform's
views by setting the parent page's hash (`#/account`);
`src/systemya/chat-links.ts` turns those into a navigation to the page's number
(`/?7`, `/?1` and so on) that replaces the hash's history entry, so Back
returns to the chat.

The edge has no `/wisp/` route. STomp uses Fracital's public relay,
`wss://holywisp.fracit.al/` (`src/systemya/stomp-config.json`).

## Browser page

The browser page (`/?2`; its old path `/app/` still works) shows powerMouse's
browser UI full size under the navbar, in a
same-origin frame (`src/systemya/proxy.ts`). The UI is the `demo/public`
folder of the `vendor/powermouse` submodule. After a clone, run
`git submodule update --init vendor/powermouse`. `npm run prepare:stomp` (run
by `dev` and `build`) copies it to `public/ui/` and STomp's runtime to
`public/vendor/rt/`. Both folders are generated and ignored by git.

The copy changes only fixed strings: the runtime's paths, the transports
(served as `.js`, because the edge serves `.mjs` as a download), the title,
the branding and the version line. Each replacement must match its stated
count, so an upstream change that moves one stops the build. The rewrites of
the demo's folder (`'/pm/`, `"/pm/`, `url('/pm/`) may match none, because a
reference left to that folder, or to a file the build does not serve, stops
the build anyway. The UI's scripts and pages get short
names with a stamp minted per build (`ma.<stamp>.js`), as do the runtime's
files and STomp's page globals. The names are written to
`src/systemya/stomp-build.json`. `src/systemya/proxy-frame.js` runs inside the
UI and passes those names to STomp. `prepare:stomp` updates the folders in
place, so a running `npm run dev` picks up the new files.

The fragment never holds a readable address. A visit starts as
`/?2#<base64url of the XOR-encoded URL>`. Once the UI loads, the fragment
becomes the UI's sealed route (`#html/...`) and follows browsing with
`replaceState`, so reload, Back and Forward work. A fragment typed into the
address bar opens at once. `/?2` with no fragment shows the UI's landing
page. The navbar and home search, every link to another site and game
launches open here: `openProxy(url)` for a site, `openFrame(src, title)` for
a same-origin page without the proxy. The UI's commit list comes from
GitHub's public API, called from the browser.

## Player page

The player page (`/?9`) is website2's `/flash` page: it plays one SWF with
the self-hosted build of `@ruffle-rs/ruffle`, pinned exactly in
`package.json` (the version website2 ships). `prepare:stomp` runs
`scripts/prepare-player.mjs`, which copies it to `public/vendor/pl/` under
neutral names: the entry as `pl.<hash>.js` (the hash is of the package's own
entry), its core chunks as `pc.<hash>.js` and its `.wasm` files under their
content-hash names, with the entry's references renamed to match. Each rename
must match, so an upstream change stops the build. The folder and
`src/systemya/player-build.json` (the entry's name) are generated and ignored
by git. The edge serves `.wasm` as `application/wasm`, which the player needs.

The page's template is only its `<main>`, without the navbar. A Flash launch
opens `/?9#<code>` with `openFrame`, so it shows full size in the browser
page's frame, under the navbar. `<code>` is the SWF's same-origin path in the
fragment code of `proxy-hash.ts`. Opened on its own, `/?9` moves itself into
that frame and replaces its history entry (`src/systemya/player.ts`).

## GitHub workflows

- `.github/workflows/ci.yml` runs on pull requests and on pushes to branches
  other than `main`: `npm ci`, `npm run verify`, `npm run build` and
  `scripts/verify-static-dist.mjs`.
- `.github/workflows/deploy.yml` runs on pushes to `main` and on manual
  dispatch. The build job repeats those checks and uploads `dist/` as an
  artifact. The deploy job rsyncs it to the edge. Deploys run one at a time
  with `cancel-in-progress: false`.
- `.github/workflows/stomp-update.yml` keeps STomp current. See "Keeping
  STomp current" below.
- `scripts/verify-static-dist.mjs` requires `dist/index.html` and rejects
  reserved edge paths, server build output, likely credentials and unexpected
  symlinks.

### Keeping STomp current

powerMouse publishes its `master` branch to npm as `@sysce/stomp@nightly`
at 07:17 UTC and on a manual run, and only publishes a commit whose CI
passed. `stomp-update.yml` moves SystemYA to each new nightly by itself:

- Triggers. powerMouse's nightly workflow sends this repository a
  `repository_dispatch` of type `stomp-nightly` with the version it published
  in `client_payload.version`, so the update starts within minutes of the
  publish. The schedule checks every 5 minutes (GitHub's shortest), the fallback
  for a lost dispatch and while powerMouse has no dispatch token. "Run workflow"
  tries now, optionally with a specific `version` and with `dry_run`, which
  runs every check (on the pin itself when it is current) and pushes nothing.
- The probe job reads the pin on `main` and npm, and stops in seconds when
  both are current. A dispatched version can take minutes to reach the
  registry, so the probe waits for it, up to 20 minutes. The package only
  moves to a version published after the pinned one, and the
  `vendor/powermouse` submodule moves to the commit the version was built
  from (its `gitHead`), only forward along `master`, so the UI and the runtime
  always come from the same tested commit. A manual run with a `version` may
  go back.
- The check job holds no write token. It bumps `package.json` and
  `package-lock.json` and the submodule, then runs the same checks as CI and
  the deploy: `npm ci`, `npm run verify`, `npm run build` (which runs
  `prepare:stomp`, so every patch and stamped name, and the neutrality check
  in `verify-static-dist.mjs`) and the deploy contract. After that,
  `scripts/stomp-smoke.mjs` starts STomp from `dist/` in headless Chrome and
  opens a page through the public relay. Nothing else in the build starts
  STomp. Registry and network steps get four tries, for a tarball that is not
  served yet. The check fails if anything but the pin changed, so the
  updater never touches SystemYA's own settings, such as `webTransport` in
  `src/systemya/stomp-config.json`.
- If all of that passes, `github-actions[bot]` commits the change to `main`.
  A push made with `GITHUB_TOKEN` starts no workflow, so the publish job
  starts `deploy.yml` with `gh workflow run`, finds that run and waits for it
  to pass.
- If `main` moved during the check, nothing is pushed: the publish job starts
  the workflow again, which bumps and tests on top of the new `main`, up to
  three times in a row. Runs wait for each other (one concurrency group), so
  two updates never race.
- If a check fails, `main` keeps its pin and the workflow opens an issue titled
  "STomp update needs attention", or comments on the one already open. The
  issue quotes the error lines (a patch that no longer matches names its file,
  its number in `patches()` and the string; a file the UI names but the build
  does not serve names the upstream file), the failed step and how to
  reproduce it. If the deploy fails, the issue says so. The schedule
  retests a version that failed every 6 hours; a new nightly, a dispatch or a
  manual run tests at once. The next update that passes closes the issue, as
  does a scheduled probe that finds `main` current and its last deploy passed.

The workflow needs no secrets beyond the `GITHUB_TOKEN` that Actions
provides. The dispatch is sent from powerMouse with a token of its own (a
fine-grained token with Contents read and write on this repository); without
it the 5-minute schedule still picks up every nightly within minutes.

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
