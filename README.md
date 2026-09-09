# WLG NZ Quizzes

[![CI](https://github.com/olitreadwell/wlg-nz-quizzes/actions/workflows/ci.yml/badge.svg)](https://github.com/olitreadwell/wlg-nz-quizzes/actions/workflows/ci.yml)

Every pub quiz around Wellington on one calendar. Venues, start times, and
details for recurring quiz nights across Wellington City, the Hutt Valley,
Porirua, the Kapiti Coast, and Wairarapa, with a map link and
add-to-calendar file for each one.

Built on [olitreadwell/dataset-directory-template](https://github.com/olitreadwell/dataset-directory-template):
dataset + scrapers + OpenAPI API + website + feeds + community loop +
daily refresh, wired in from day one.

## What you get

- **Dataset** — zod-validated venues with recurring `schedule` entries
  (day, start time, cadence, cost, prizes, format, booking, operator,
  tags). Commit `src/data/items.ts`, regenerate the snapshot with
  `pnpm run build:snapshot`, or scrape.
- **API** — `/api/v1/items`, `/api/v1/items/{id}`, `/api/v1/cities`,
  `/api/v1/categories`, `/api/v1/dataset` (JSON + `.csv`, ETag +
  content-hash version), `/api/v1/dataset/meta`, `/api/search`,
  `/api/items/{id}/view`, `/api/opt-out`, `/api/cron/refresh`, plus the
  base `/health`, contact and feedback endpoints. OpenAPI 3.1 at
  `/api/openapi.json`, Swagger UI at `/docs`, contract-tested against a
  live server in `pnpm run smoke`.
- **Website** — home with the month calendar, browse with day/city/
  category filters (`/items`), fuzzy search (Fuse.js), quiz detail with
  the full schedule and community add/fix/review issue links, interactive
  map, opt-out page, dark mode.
- **Feeds** — `/feed.xml` RSS, `/calendar.ics` iCal, dynamic
  `/sitemap.xml`, `/robots.txt`.
- **Scrapers** — Node + cheerio-ready framework with robots.txt checks,
  rate limiting, exponential backoff + jitter, per-run `scrapes` logging
  and the candidate discovery → verification → promotion loop. Ships an
  offline example scraper; add your real sources in `src/lib/scrapers/`.
- **Snapshot mode by default** — no `DATABASE_URL`? The site serves the
  committed `src/data/snapshot.json`. Set `DATABASE_URL` and `pnpm db:setup`
  to switch to Postgres (`items`, `scrapes`, `candidates`, `analytics`).
- **Daily refresh** — Vercel Cron at 2am NZT (`vercel.json`),
  `CRON_SECRET`-protected.
- **Community loop** — opt-out, prefilled add/fix/review issues from every
  detail page, zod + tests as the PR gate, optional env-gated email
  subscribe module. Ethics: public data only, polite scraping.

## Quick start

```bash
pnpm install
pnpm run dev        # http://localhost:3000
```

## Commands

| Command | Purpose | CI gate |
| --- | --- | --- |
| `pnpm run dev` | Dev server | |
| `pnpm run build` | Production build | Blocking |
| `pnpm run setup` | Interactive scaffolder (identity, env, deploy) | Tested |
| `pnpm run build:snapshot` | Regenerate `src/data/snapshot.json` from `items.ts` | Blocking |
| `pnpm run scrape` | Run scrapers (snapshot or DB mode) | |
| `pnpm run scrape:apply` | Scrape and write merged items to the snapshot | |
| `pnpm db:setup` | Migrate + seed Postgres (DB mode) | |
| `pnpm db:snapshot` | Export live DB → `snapshot.json` | |
| `pnpm run contract` | Live server ↔ OpenAPI contract test | In smoke |
| `pnpm run typecheck` | `tsc --noEmit` | Blocking |
| `pnpm run lint` | ESLint | Blocking |
| `pnpm run format:check` | Prettier check | Blocking |
| `pnpm test` | Vitest unit/component | Blocking |
| `pnpm run test:coverage` | Coverage gate | Blocking |
| `pnpm run test:e2e` | Playwright | Blocking |
| `pnpm run test:a11y` | axe route audit (WCAG 2.2 A/AA) | Blocking (in e2e) |
| `pnpm run smoke` | Boot + curl + contract test | Blocking |
| `pnpm run check:links` | Internal link integrity | Blocking |
| **`pnpm run check`** | All of the above | Mirrored 1:1 |
| `pnpm run audit` | Dependency audit | Advisory |

## Data

- The dataset lives in [`src/data/items.ts`](src/data/items.ts), validated
  by the zod schema in [`src/data/schema.ts`](src/data/schema.ts). The
  calendar reads a quiz view-model derived from the items
  ([`src/data/quizzes.ts`](src/data/quizzes.ts)).
- Baseline comes from the Believe it or Not find-a-quiz list
  (<https://believeitornot.co.nz/findaquiz.html>), retrieved 2026-08-25,
  plus entries verified from venue or operator pages, plus currently listed
  recurring quiz events from Eventfinda (Wellington Region) and venue sites
  such as Star Group, Eva Pub, and The Old Bailey.
- Every quiz carries its source URL and a `lastVerified` date. Schedules
  change — the site tells readers to confirm with the venue before heading out.

### Add, fix, or review a quiz

Every quiz detail page links a prefilled add/fix/review issue. The dataset
gate (zod + tests) reviews every change.

## Docs

- [API](docs/api.md) — endpoints, auth, rate limits, contract test
- [Contact & feedback](docs/contact.md) — how the forms work
- [Deploy](docs/deploy.md) — Vercel, cron, env vars
- [Engineering](docs/engineering.md) — architecture, data flow
- [Testing](docs/testing.md) — unit, e2e, a11y, smoke
- [Template sync](docs/template-sync.md) — how quality gates stay current
