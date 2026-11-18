# Recovery and provenance

SystemYA is rebuilt from the May 26, 2022 capture of `sys32.dev`
(`https://web.archive.org/web/20220526154011/https://sys32.dev/theatre.html`).
It is not the March 2023 React build, which has a different navbar and
different chunks.

## Sources

- `itstime.zip`: the five saved pages (`index`, `theatre`, `support`,
  `contact`, `privacy`), `main.59cf0c20.js`, `main.eb81df9c.css`, Wayback
  playback files and a generic globe SVG. It has none of the media files.
- `systemya2.zip`: historical JavaScript plus logo and favicon artwork.
- `systemya-recovered.zip`: 31 JavaScript files with their Webcrack output.

Checksums for the archived pages are in `HISTORICAL-SOURCES.json`, checked by
`npm run verify:archive`.

## Locations

| What                        | Where                                                           |
| --------------------------- | --------------------------------------------------------------- |
| Saved 2022 pages, untouched | `archive/wayback-2022/SystemYA/*.html`                          |
| Archived CSS, untouched     | `archive/wayback-2022/SystemYA/theatre_files/main.eb81df9c.css` |
| Webcrack output             | `archive/webcrack/`                                             |
| Runtime page markup         | `src/systemya/snapshots/`                                       |
| Runtime CSS                 | `public/systemya-2022/main.css`                                 |
| Recovered media             | `public/static/media/`                                          |
| Layout                      | `src/layouts/SystemYALayout.astro`                              |
| Theatre sprite coordinates  | `THEATRE-SPRITE-COORDINATES.json`                               |
| Media checksums             | `HISTORICAL-ASSET-MANIFEST.json`                                |

The runtime markup is a copy of the saved pages, kept separate from the
originals. The runtime CSS is the archived stylesheet with Wayback URLs
rewritten to same-origin paths. `interactions.ts` implements the search
expansion, mobile menu, theme toggle and headline animation.

## What the 2022 CSS defines

- The homepage background is
  `#root[data-page=home]{background-image:var(--grid)}`, a tiled SVG grid.
  The theme swaps `light.2d95225a7bb6ff1db853.svg` and
  `dark.8cbd0429f3449df8c19c.svg`, both 66 x 66.
- Theatre cards share one sprite, `theatre.4cf739e3dd20f770bb30.webp`, through
  `#root[data-page=theatre]>main>section>.items>.item>.front`. Cards are
  200 x 200 and the saved offsets reach `-600px` horizontally and `-1400px`
  vertically, so the sprite is an 800 x 1600 sheet of 4 by 8 tiles. The
  capture has 34 items in seven sections.
- The navbar is 50px tall.
- Fonts are Segoe UI in five weights and Material Icons, loaded from
  `/static/media/`.

## Media

The CSS names 12 media files. Seven were downloaded from the Wayback capture
and imported without modification:

- `light.2d95225a7bb6ff1db853.svg` and `dark.8cbd0429f3449df8c19c.svg`
- `theatre.4cf739e3dd20f770bb30.webp`
- `MaterialIcons-Regular.97b9b1857a2af7322eba.woff2`
- `segoe-ui-400.1a84982fb6140613fadc.woff2`, true weight 400
- `segoe-ui-700.c408ee083ec612e2efcf.woff2`, which identifies internally as
  Segoe UI Semibold, weight 600
- `segoe-ui-600.c408ee083ec612e2efcf.woff2`

The archived CSS gives the 600 and 700 entries the same hash,
`c408ee083ec612e2efcf`. The 600 file is a byte-for-byte copy of the 700 file
under the 600 filename. It was not downloaded separately.

Not recovered:

- Segoe UI weights 100 and 200. The 2022 CSS defines them but no element uses
  them, so their `@font-face` rules were removed from the runtime CSS. The
  original rules remain in `archive/`.
- The Material Icons TTF, WOFF and EOT alternates. Modern browsers use the
  WOFF2.

`npm run audit:media` lists the 12 files and their status, and
`npm run recover:media` (`scripts/recover-systemya-media.mjs`) downloads
missing ones from the capture, checks their magic bytes or SVG structure, and
writes `HISTORICAL-ASSET-RECOVERY.json`. It can also import files downloaded by
hand, matched by name.

`public/systemya-2022/font-supplement.opt-in.css` and `fonts/optional/` hold
later Segoe UI files for the missing light weights (see
`SEGOE-SUPPLEMENT-IMPORT.json`). They are not historical and are not loaded by
default.

## Runtime fallbacks

The runtime CSS uses local font URLs only. `src/systemya/historical-media.ts`
loads the grid and sprite from their local paths. If a file is missing it tries
the Wayback capture URL, and for the grid it then falls back to
`public/systemya-2022/fallback/*-grid.svg`, which is not the original grid and
sets `data-grid-source="fallback"`.

## Capture limits

The saved HTML froze some animated text mid-transition, so Theatre item names
and the promotional banner are scrambled in the capture. The runtime homepage
description and announcement banner were taken from readable 2022 copies. The
original typewriter timing was not recovered; the runtime timing is an
approximation.

## Webcrack inventory

| Original file                                       |   Bytes | Webcrack status |
| --------------------------------------------------- | ------: | --------------- |
| `main.59cf0c20.js`                                  | 193,221 | ok              |
| `main.8a92d525.js`                                  | 229,078 | ok              |
| `120.d80594db.chunk.js`                             |   3,595 | ok              |
| `125.29be8d15.chunk.js`                             |   4,657 | ok              |
| `326.6a18ed1e.chunk.js`                             |   1,553 | ok              |
| `372.b61d9907.chunk.js`                             |   3,972 | ok              |
| `552.d642dfff.chunk.js`                             |   8,751 | ok              |
| `757.99fcbaf7.chunk.js`                             |   1,771 | ok              |
| `932.97a16dc2.chunk.js`                             |   6,374 | ok              |
| `main.59cf0c20.js`                                  | 191,897 | ok              |
| `main-d28c931833.js`                                |  40,292 | ok              |
| `index-b74c2cbb94.js`                               |  14,576 | ok              |
| `home.js`                                           |   4,101 | ok              |
| `home-8a9868d414.js`                                |  33,004 | ok              |
| `jquery-3.5.1.min.js`                               |  89,476 | ok              |
| `nav-9791fb49a7.js`                                 |   1,860 | ok              |
| `page-875cea48f7.js`                                |   2,741 | ok              |
| `particles.min.js`                                  |  23,364 | ok              |
| `prox-6cb86263ea.js`                                |   2,902 | ok              |
| `forum-en.js`                                       |  22,957 | ok              |
| `forum-en-258b2a6840.js`                            |  27,449 | ok              |
| `forum-en-60b7a2b384.js`                            |  29,429 | ok              |
| `forum.js`                                          | 630,212 | ok              |
| `forum-4a3dd402ad.js`                               | 671,928 | ok              |
| `forum-a4b6f35041.js`                               | 702,165 | ok              |
| `page.js`                                           |   1,998 | ok              |
| `adapter.js`                                        |   1,140 | ok              |
| `vb26e4fa9e5134444860be286fd8771851679335129114.js` |  16,691 | ok              |
| `sw.js`                                             |     425 | ok              |
| `server.mjs`                                        |   2,936 | ok              |
| `astro.config.mjs`                                  |     330 | ok              |

The March 2023 app references four lazy route chunks that are not in the
archive: `701.02c09a1d.chunk.js`, `557.e7e9038f.chunk.js`,
`932.ba0c1c56.chunk.js` and `453.1424daec.chunk.js`. Webcrack only makes the
supplied files readable; it cannot recreate missing chunks.

## Font rights

Segoe UI is a Microsoft typeface. Microsoft's font redistribution FAQ says
Windows font rights do not by themselves allow hosting, modifying or
redistributing the font as a webfont; those rights come from licensed
suppliers such as Monotype. An archived copy being downloadable does not grant
a webfont license. Confirm the licensing before publishing the Segoe UI files
in a public repository. The site can rely on a visitor's installed Segoe UI,
with a separately licensed fallback.
