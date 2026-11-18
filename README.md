# CyberGamez

A live gaming storefront and news site: Steam and Epic releases, weekly free games
and deals, and fresh headlines — all pre-rendered as a static Next.js site.

[![CI](https://github.com/AymenBoukadida/cybergamez/actions/workflows/ci.yml/badge.svg)](https://github.com/AymenBoukadida/cybergamez/actions/workflows/ci.yml)
[![Sync live game data](https://github.com/AymenBoukadida/cybergamez/actions/workflows/sync-live.yml/badge.svg?branch=main)](https://github.com/AymenBoukadida/cybergamez/actions/workflows/sync-live.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

![CyberGamez home page](docs/screenshot.webp)

## What is in it

- **Weekly drops** — Epic's current and upcoming free games next to Steam's
  weeklong deals, each with a live countdown and a link to its own game page.
- **Trending and new releases** — pulled from Steam's top sellers and new-release
  feeds on every data refresh.
- **Deals** — current Steam specials, biggest discounts first.
- **News** — studio updates and patch notes from Steam's news API.
- **Game pages** — one pre-rendered page per game with artwork, genres, developers,
  price, screenshots and a link to the official store listing.

This is a portfolio project. It is not affiliated with any game publisher.

## Stack

- **Next.js 16** (App Router) with `output: "export"`, so the whole site builds to
  plain HTML, CSS and JS in `out/`.
- **React 19** and **TypeScript**.
- **Tailwind CSS v4** with design tokens in `app/globals.css`.
- **Swiper 14** for the trending rail, **Radix Dialog** for the mobile drawer, and
  **lucide-react** for icons.
- **Vitest** and **Testing Library** for component tests.
- **sharp** for the responsive image pipeline (run automatically before dev/build).
- Build-time sync scripts that snapshot the public Steam and Epic Games Store
  endpoints into `app/data/live.generated.json`.

## Routes

| Route             | Contents                                                                 |
| ----------------- | ------------------------------------------------------------------------ |
| `/`               | Featured game, weekly drops, trending, new releases, deals, Steam news   |
| `/games/[slug]/`  | One pre-rendered page per game in the snapshot, with store link and shots |
| `/sitemap.xml`    | All pages, generated at build time                                       |
| `/robots.txt`     | Crawler rules and sitemap location                                       |

There is no server runtime: every route is generated at build time.

## Live data

`scripts/sync-live.mjs` fetches:

- `store.steampowered.com/api/featuredcategories` for top sellers, new releases and
  current specials;
- `store.steampowered.com/search/results` with `filter=weeklongdeals` for the weekly
  Steam deals and their Monday reset window;
- `store.steampowered.com/api/appdetails` for descriptions, genres, developers,
  prices and screenshots of each app;
- `api.steampowered.com/ISteamNews/GetNewsForApp/v2` for studio updates and patch
  notes;
- `store-site-backend-static.ak.epicgames.com/freeGamesPromotions` for the current
  and upcoming Epic free games.

The script normalizes everything into a single committed snapshot at
`app/data/live.generated.json`. `app/data/live.ts` exposes typed accessors, section
helpers and date formatting to the app.

```bash
npm run sync   # refresh the snapshot and fail loudly on a bad fetch
```

`prebuild` runs `optimize-images.mjs` and then `sync-live.mjs --allow-stale`. If a
store is unreachable during a deploy, the previous snapshot is kept so the build
still succeeds. A manual `npm run sync` has no fallback, which makes data failures
visible.

Store artwork is hotlinked from the official Steam and Epic CDNs. Prices and
availability are point-in-time values from the last sync; the game page's store
button always opens the official listing. Free-game countdowns are calculated in
the browser from the ISO dates in the snapshot, so they stay correct between
rebuilds. The weekly Steam countdown targets the next Monday 10:00 Pacific reset
computed by the sync script.

## Automation

Two GitHub Actions workflows keep the site current:

| Workflow | Trigger | What it does |
| --- | --- | --- |
| `.github/workflows/ci.yml` | Every push, every pull request, manual dispatch | Installs dependencies, validates the committed snapshot, runs lint, typecheck, tests and the static build. |
| `.github/workflows/sync-live.yml` | Every six hours (`17 */6 * * *`) and manual dispatch | Fetches Steam and Epic, validates the new snapshot, runs the tests, builds the export, then commits `app/data/live.generated.json` to `main`. |

A sync run only publishes data that passed validation and a full production build.
`scripts/snapshot-validation.mjs` checks that the snapshot has enough games, that
every section slug resolves, that freebies and weekly deals have valid offers and
that URLs and dates are well formed. If a store is unreachable or returns an
incomplete snapshot, the job fails before committing, so the last good snapshot
stays live. The job also has a single-run concurrency group and retries the push if
`main` moved during the build.

Vercel's Git integration is the deploy step: its production deployment follows
`main`, so the bot commit made by the sync workflow triggers the rebuild that picks
up the new data. No API keys or deploy hooks are needed.

To refresh without CI, run `npm run sync`, then `npm run verify:data`, and commit
the changed snapshot.

## Local development

Requirements: Node.js 20.9 or newer and npm.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000/`. To check the production output instead:

```bash
npm run build
npm run preview
```

## Scripts

| Command               | What it does                                                |
| --------------------- | ----------------------------------------------------------- |
| `npm run dev`         | Start the dev server on `http://localhost:3000`             |
| `npm run build`       | Sync live data and build the static export into `out/`      |
| `npm run build:ci`    | Build from the committed snapshot without a network sync    |
| `npm run verify:data` | Validate the committed snapshot and report its age          |
| `npm run preview`     | Serve the built `out/` folder with `npx serve`              |
| `npm run sync`        | Refresh `app/data/live.generated.json` from Steam and Epic  |
| `npm run images`      | Regenerate optimized images from `assets/img/` (forced)     |
| `npm test`            | Run the Vitest suite once                                   |
| `npm run typecheck`   | Run `tsc --noEmit`                                          |
| `npm run lint`        | Run ESLint                                                  |

`node scripts/optimize-images.mjs` runs automatically before `dev` and `build`, so
`public/img/opt/` is generated on demand. Those derivatives are git-ignored; the
source art lives in `assets/img/`. The script fails rather than upscaling a source
image, so every source must be at least as wide as the largest width requested for
it in `scripts/images.mjs`.

## Project structure

```text
.
├── app/
│   ├── components/       # hero, weekly drops, cards, header
│   ├── data/             # typed accessors + live.generated.json
│   ├── games/[slug]/     # one static page per game
│   └── lib/              # base-path and formatting helpers
├── assets/img/           # source art for the image pipeline
├── public/               # favicon and generated image derivatives
├── scripts/              # sync, validation and image optimization
├── test/                 # Vitest setup
└── .github/workflows/    # CI and scheduled data sync
```

## Deployment (Vercel)

1. Import this repository in Vercel. The app is at the repo root, so leave **Root
   Directory** empty (or `.`).
2. Keep the detected framework preset (Next.js). The build command is
   `npm run build`; the output is the static `out/` folder.
3. Optionally set `NEXT_PUBLIC_SITE_URL` to the production origin, for example
   `https://cybergamez.vercel.app`. It feeds `metadataBase`, canonical URLs, the
   Open Graph tags and the sitemap. When unset, the build uses Vercel's
   `VERCEL_PROJECT_PRODUCTION_URL`, then falls back to `http://localhost:3000`.
4. Connect the Git integration to the `main` branch. Every push to `main` creates a
   production deployment, including the snapshot commits from the sync workflow.
5. In GitHub, open **Settings → Actions → General → Workflow permissions** and allow
   **Read and write permissions**, so the sync workflow can push its snapshot commit.
6. Run **Sync live game data** once from the Actions tab with `workflow_dispatch` to
   confirm the pipeline can write to `main` and that Vercel deploys the result.

No environment variables are required: absolute URLs use `NEXT_PUBLIC_SITE_URL`
when set, otherwise Vercel's production URL, otherwise `http://localhost:3000`.

### Building for a subpath

The site can be hosted under a path prefix such as `/cybergamez`:

```powershell
$env:NEXT_PUBLIC_BASE_PATH = "/cybergamez"
npm run build
```

Copy the contents of `out/` to the matching directory on the host. All internal
links and asset URLs are prefixed through `app/lib/base-path.ts`. Leave the
variable unset for a root deployment.

## Limitations

- Live game pages do not host downloads. They show the current price and send you
  to Steam or Epic to buy or claim the game.
- Store data is refreshed by a build, not streamed in real time. The footer shows
  the snapshot date, and the hero and game pages show when prices were checked.

## Credits

- Promotional artwork and screenshots belong to their respective publishers and are
  used here for a non-commercial demo. Local sources are listed in
  [`assets/SOURCES.md`](assets/SOURCES.md); live store art is hotlinked from the
  official Steam and Epic CDNs.
- Fonts: [Inter](https://rsms.me/inter/) and
  [Chakra Petch](https://fonts.google.com/specimen/Chakra+Petch), bundled through
  Fontsource.
- Split from [AymenBoukadida/Web](https://github.com/AymenBoukadida/Web) with its
  commit history preserved.

## License

[MIT](LICENSE), matching the original project. The licence covers the code, not the
third-party game artwork.
