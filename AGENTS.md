# AGENTS.md | Fracital/SystemYA

These rules apply to coding agents and contributors. SystemYA restores the
May 2022 interface and builds to a static Astro SPA at `systemya.fracit.al`.

## Rules

- Never add `Co-Authored-By`, AI attribution or agent credits to commits or source.
- Never add em dashes to newly authored source, docs, UI or commit messages.
- Do not invent UI where recovered HTML, CSS, images or fonts exist.
- Preserve files under `archive/` as immutable recovery evidence.
- Do not paste, commit, package, print, or embed private deploy keys or Holt licenses.
- Do not deploy, publish or change live infrastructure without user authorization.
- Preserve upstream website2 copyrights and source provenance.
- Avoid filler comments and speculative feature work.

## Production architecture

- Astro `output: "static"`; deployment publishes only `dist/`.
- `/room/`, `/v1/games/`, `/cdn/` and `/api/` are nginx edge proxies. Do not
  generate or copy files into these directories.
- Holt is embedded through a same-origin `/room/` iframe. The edge holds the
  license; the browser never sees a license or host setting.
- Sign-in uses Fracital Accounts through the edge's `/api/` proxy, with the
  client in `src/fracital/`. Holt reads identity from `/api/me/chat`. Never
  fabricate an account identity on the client.
- The game catalog uses the `/cdn/index.js` SDK served by the edge.
- `run-server.js`, `runtime.js`, the website2 SDK suite and the legacy Astro
  routes are reference and tooling only. No Node middleware runs in production.
- The edge has no `/wisp/` route. STomp uses Fracital's public relay,
  `wss://holywisp.fracit.al/`. OAuth and Last.fm sign-in run through STomp
  (`src/fracital/stomp-oauth.ts`); see `docs/DEPLOYMENT.md`.

## CI and deployment

- Keep CI for pull requests and branches separate from the `main` deploy job.
- Deployment uses the `SYSTEMYA_DEPLOY_KEY` GitHub secret, pinned SSH host
  keys and `ProxyJump` to the restricted edge rsync account.
- Do not cancel an rsync deployment mid-flight. Upload non-HTML assets before
  publishing new pages and deleting old files.
- CI runs `npm ci`, `npm run verify`, `npm run build` and the static output
  check. Do not weaken tests to hide failures.

## How to verify

1. Run `npm run verify` and read any failures.
2. Run `npm run build`. Confirm `dist/index.html` exists and that `dist/` has
   no root-level `room`, `v1`, `cdn`, `api` or server build output.
3. For UI changes, compare browser renders with the May 2022 archive.
4. Holt, the Games SDK and sign-in only work behind the edge. Test them on the
   production origin after an authorized deployment.
5. Report any check you could not run.

[Deployment contract](docs/DEPLOYMENT.md)
