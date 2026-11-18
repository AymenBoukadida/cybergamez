# CyberGamez

A live gaming storefront and news site, rebuilt as a static Next.js site, plus a
playable Subway Surfers demo. The home page carries a featured Steam title, Epic
free-game giveaways with live countdowns, trending and new Steam releases, current
deals, and recent gaming headlines. Every game has its own detail page with artwork,
store metadata, screenshots and a link to the official store.

This is a portfolio/demo project. It is not affiliated with any game publisher.

## Stack

- **Next.js 16** (App Router) with `output: "export"`, so the whole site builds to
  plain HTML, CSS and JS in `out/`.
- **React 19** and **TypeScript**.
- **Tailwind CSS v4** with design tokens in `app/globals.css`.
- **Swiper 14** for the trending rail, **Radix Dialog** for the mobile drawer and
  screenshot lightbox, and **lucide-react** for icons.
- **Vitest** and **Testing Library** for component tests.
- **sharp** for the responsive image pipeline (run automatically before dev/build).
- A build-time sync script that snapshots the public Steam and Epic Games Store
  endpoints into `app/data/live.generated.json`.

## Routes

| Route             | Contents                                                                 |
| ----------------- | ------------------------------------------------------------------------ |
| `/`               | Featured game, Epic freebies, trending, new releases, deals, Steam news   |
| `/games/[slug]/`  | One pre-rendered page per game in the snapshot, with store link and shots |
| `/download/`      | Subway Surfers demo: APK, captioned trailer + transcript, gallery         |
| `/sitemap.xml`    | All pages, generated at build time                                       |
| `/robots.txt`     | Crawler rules and sitemap location                                       |

There is no server runtime: every route is generated at build time.

## Live data

`scripts/sync-live.mjs` fetches:

- `store.steampowered.com/api/featuredcategories` for top sellers, new releases and
  current specials;
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
rebuilds.

### Scheduled refresh

`.github/workflows/sync-live.yml` runs every six hours and on manual dispatch. It
refreshes the snapshot and commits it back to the repository. If your host deploys
on push (Vercel, Netlify, GitHub Pages), that commit triggers a fresh build and the
site picks up the new data. No secrets or API keys are required.

To refresh without CI, run `npm run sync` locally and commit the changed snapshot.

## Scripts

Run these from `Responsive-Gaming-Website/`:

| Command             | What it does                                                        |
| ------------------- | ------------------------------------------------------------------- |
| `npm run dev`       | Start the dev server on `http://localhost:3000`                     |
| `npm run build`     | Sync live data and build the static export into `out/`               |
| `npm run preview`   | Serve the built `out/` folder with `npx serve`                      |
| `npm run sync`      | Refresh `app/data/live.generated.json` from Steam and Epic           |
| `npm run images`    | Regenerate optimized images from `assets/img/` (forced)             |
| `npm test`          | Run the Vitest suite once                                           |
| `npm run typecheck` | Run `tsc --noEmit`                                                  |
| `npm run lint`      | Run ESLint                                                          |

`node scripts/optimize-images.mjs` runs automatically before `dev` and `build`, so
`public/img/opt/` is generated on demand. Those derivatives are git-ignored; the
source art lives in `assets/img/`. The script fails rather than upscaling a source
image, so every source must be at least as wide as the largest width requested for
it in `scripts/images.mjs`.

## Local development

Requirements: Node.js 20.9 or newer and npm.

```bash
cd Responsive-Gaming-Website
npm ci
npm run dev
```

Open `http://localhost:3000/`. To check the production output instead:

```bash
npm run build
npm run preview
```

## Deployment (Vercel)

1. Import the repository in Vercel.
2. Set **Root Directory** to `Responsive-Gaming-Website`.
3. Keep the detected framework preset (Next.js). The build command is
   `npm run build`; the output is the static `out/` folder.
4. Set `NEXT_PUBLIC_SITE_URL` to the production origin, for example
   `https://cybergamez.example.com`. It feeds `metadataBase`, canonical URLs, the
   Open Graph tags and the sitemap. If unset, it falls back to
   `http://localhost:3000`.
5. Optional: enable the scheduled sync workflow so the data refreshes without a
   manual commit. Vercel redeploys on the workflow's commit.

No environment variables are required for the site to render; only absolute URLs
in metadata depend on `NEXT_PUBLIC_SITE_URL`.

### Building for a subpath

The site can be hosted under a path prefix such as `/cybergamez`:

```powershell
$env:NEXT_PUBLIC_BASE_PATH = "/cybergamez"
npm run build
```

Copy the contents of `out/` to the matching directory on the host. All internal
links and asset URLs are prefixed through `app/lib/base-path.ts`. Leave the
variable unset for a root deployment.

## Demo limitations

- Only the **Android APK** (`public/download-files/subway-surfers-demo.apk`) is a
  real file. It is a small demo build, not the full game.
- The **iOS** and **Windows** rows in the download panel are disabled and labelled
  "Not in this demo".
- Live game pages do not host downloads. They show the current price and send you
  to Steam or Epic to buy or claim the game.
- Store data is refreshed by a build, not streamed in real time. The footer shows
  the snapshot date, and the hero and game pages show when prices were checked.
- The trailer is bundled with the original project. Captions carry music cues and
  on-screen text because the trailer has no spoken dialogue; a visible transcript
  is provided for the same content (WCAG 1.2.2).

## Credits

- Promotional artwork and screenshots belong to their respective publishers and are
  used here for a non-commercial demo. Local sources are listed in
  [`assets/SOURCES.md`](assets/SOURCES.md); live store art is hotlinked from the
  official Steam and Epic CDNs.
- Fonts: [Inter](https://rsms.me/inter/) and
  [Chakra Petch](https://fonts.google.com/specimen/Chakra+Petch), bundled through
  Fontsource.

## License

[MIT](LICENSE), matching the original project. The licence covers the code, not the
third-party game artwork.
