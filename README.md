# SystemYA

A restoration of the May 26, 2022 SystemYA interface, built with
[Astro](https://astro.build/) and TypeScript, using the original recovered
homepage, grid SVGs, stylesheet and typography. Repository:
`Fracital/SystemYA`.

The site is <https://systemya.fracit.al>. It is static: the edge serves the
files and proxies Holt chat, the Holy Unblocker games SDK and Fracital Accounts
sign-in. The website2 and Fracital sources are kept as reference code, not run
as a Node server.

## Development

Requires Node.js 22.22.1+ for local source work. CI uses Node 26.

```bash
npm ci
npm run verify
npm run dev
```

Run `npm run build` to produce the static site in `dist/`, or
`npm run preview` to view the build locally. Local servers have none of the
edge's proxies, so chat, the games catalog and sign-in only work on the
deployed site.

## Frontend

The pages are the 2022 SystemYA pages plus chat, accounts and the browser
page. Each is a number on `/`, listed in the route book
(`src/systemya/routes.ts`), so no address names a page:

| Address | Page                                                                  |
| ------- | --------------------------------------------------------------------- |
| `/`     | Homepage and historical search interface                              |
| `/?1`   | Theatre: the Holy Unblocker games catalog in the 2022 Theatre drawers |
| `/?2`   | Browser page                                                          |
| `/?3`   | Holt chat embedded from `/room/`                                      |
| `/?4`   | Support                                                               |
| `/?5`   | Contact                                                               |
| `/?6`   | Privacy                                                               |
| `/?7`   | Fracital Accounts                                                     |
| `/?8`   | Insta-Proxy, recovered from the 2022 bundle                           |

Numbers only grow: a new page takes the next one, and a removed page's number
is retired, never reused. The old paths (`/theatre.html`, `/account/`, `/app/`
and the rest) still load and turn into their number. See "Routes" in
[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for how pages are served and how to
add one.

Astro's `ClientRouter` handles navigation; `src/systemya/router.ts` feeds it
pages from the book without fetching them. The historical captures are kept
under `archive/` and `src/systemya/snapshots/`. Routes, edge proxies, sign-in
and deployment are described in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Commands

| Command                    | Description                                                        |
| -------------------------- | ------------------------------------------------------------------ |
| `npm run dev`              | Astro static frontend development server                           |
| `npm run build`            | Prepare STomp files, type-check, build static Astro, verify output |
| `npm run preview`          | Preview generated static files                                     |
| `npm run check`            | Astro diagnostics                                                  |
| `npm run verify`           | Structural and archive integrity checks, plus tests                |
| `npm run verify:static`    | Audit a completed `dist/` directory                                |
| `npm run verify:deploy`    | Run the static deployment contract test suite                      |
| `npm run prepare:stomp`    | Copy the browser UI and its runtime under stamped names            |
| `npm run build:sdk`        | Build website2's SDK tooling, not required for static production   |
| `npm run build:obfuscated` | Optional Vite client-chunk obfuscated build                        |
| `npm run games`            | Original website2 game-data utility                                |
| `npm run thumbnails`       | Original website2 thumbnail utility                                |
| `npm run fetch-adblock`    | Original website2 adblock utility                                  |
| `npm run fetch-cloaks`     | Original website2 cloak utility                                    |
| `npm run seed`             | Original website2 database seeder, legacy-only                     |
| `npm run audit:media`      | Audit recovered historical media                                   |
| `npm run recover:media`    | Attempt asset recovery from Wayback                                |

## CI and deployment

`ci.yml` checks pull requests and branch pushes. `deploy.yml` builds `main`
and rsyncs `dist/` to the edge. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Source structure

```text
SystemYA/
  .github/workflows/     CI and static deployment workflows
  archive/               Immutable captured 2022 pages and Webcrack output
  public/static/media/   Recovered historical sprite, SVGs and fonts
  public/systemya-2022/  Original CSS, favicon and supporting fonts
  src/pages/             Astro static pages
  src/fracital/          Fracital Accounts client
  src/systemya/          Historical snapshots and TypeScript behavior
  sdk/                   Website2 Games SDK source and build scripts
  scripts/               Website2 utilities and SystemYA verification
  legacy/website2/       Server-only routes and middleware, not deployed
  tests/                 Regression and deploy-contract tests
  docs/DEPLOYMENT.md     Edge, SSH, rsync and integration contract
  docs/RECOVERY.md       Provenance of the recovered pages, media and scripts
```

## Rules and licensing

Contributor rules are in [AGENTS.md](AGENTS.md).

Original SystemYA code is under [ISC](LICENSE-SYSTEMYA), copyright 2026
David Reed. Website2 code retains its upstream license in [LICENSE](LICENSE).
Third-party assets, fonts, archived material and dependencies retain their
respective licensing requirements.
