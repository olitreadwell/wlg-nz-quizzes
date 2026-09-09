# WLG NZ Quizzes - Project Context

Snapshot for agents and future sessions. Read `AGENTS.md` and
`docs/contributing/00-index.md` for rules; this file captures state, sources,
gotchas, and where the project is headed.

## Identity

- Repo: `olitreadwell/wlg-nz-quizzes` (renamed from `wellington-quizzes`, Aug 2026)
- Local path: `/Users/oli/code/wlg-nz-quizzes`
- Site: Vercel (dataset-directory app); GitHub Pages export is a secondary path
- Old GitHub Pages URL 404s - GitHub Pages does not redirect on repo rename

## What it is

Open directory of recurring pub quizzes around Wellington (WLG), NZ -
venues, days, times, details, map links, add-to-calendar files. Visitors
can search, filter (area/day/tag), compare quizzes side by side, and
submit community fixes via prefilled issues.

## Stack

- Next.js 16 App Router, React 19, TS strict, Tailwind 4, pnpm
- Dataset-directory structure: zod-validated `items` with `schedule`
  entries, snapshot mode by default, scrapers, OpenAPI API, feeds,
  community loop, daily refresh (Vercel Cron)
- Vitest + Testing Library + coverage gate (80% lines on `src/lib` +
  `src/server`), Playwright e2e + axe a11y, ESLint 9 + Prettier, husky,
  zod boundary validation
- The calendar reads a quiz view-model derived from the items
  (`src/data/quizzes.ts` adapts `src/data/items.ts`)

## Commands

- `pnpm run dev` - dev server at http://localhost:3000
- `pnpm run build` - production build (standalone)
- `pnpm run build:snapshot` - regenerate `src/data/snapshot.json`
- `pnpm run scrape` / `pnpm run scrape:apply` - run scrapers
- `pnpm run smoke` - boot + curl + contract test
- `pnpm run test:e2e` - Playwright
- `pnpm run check` - full gate: format, lint, typecheck, coverage, build,
  smoke, e2e, links
- `pnpm run audit` - dependency audit

CI mirrors `pnpm run check` plus actionlint, yamllint, codespell, audit.

## Data sources

- Baseline: Believe it or Not find-a-quiz list (believeitornot.co.nz),
  retrieved 2026-08-25
- Plus Eventfinda (Wellington Region) recurring quiz events and venue
  sites (Star Group, Eva Pub, The Old Bailey, Gibbons Hotel)
- Every quiz carries its source URL and a `lastVerified` date; schedules
  change, so the site tells readers to confirm with the venue

## Gotchas

- Keep `src/data/quizzes.ts` (the calendar view-model) in sync with
  `src/data/items.ts`; edit items, never the adapter
- The GitHub Pages export path (`.github/workflows/github-pages.yml`) is
  aspirational like the template's: API/feed/cron routes are serverless
  only, so the export serves the site shell + dataset pages
