import Link from 'next/link';
import { QuizCalendar } from '@/components/quiz-calendar';
import { Reveal } from '@/components/reveal';
import { SearchBox } from '@/components/search-box';
import { quizzes } from '@/data/quizzes';
import { buildExportFromSource } from '@/lib/db';
import { countByCategory, countByCity } from '@/lib/dataset';
import { WEEKDAY_ORDER } from '@/lib/quiz-utils';
import { getSiteConfig } from '@/lib/site-config';

const LAST_UPDATED = '25 August 2026';

/**
 * Homepage: quiz calendar plus search, category and city browse.
 *
 * @returns The homepage
 */
export default async function HomePage(): Promise<React.ReactElement> {
  const config = getSiteConfig();
  const dataset = await buildExportFromSource();
  const categories = countByCategory(dataset.items).slice(0, 12);
  const cities = countByCity(dataset.items).slice(0, 8);
  const suburbCount = new Set(quizzes.map((quiz) => quiz.suburb)).size;
  const dayCounts = WEEKDAY_ORDER.map(
    (day) => `${quizzes.filter((quiz) => quiz.dayOfWeek === day).length}`
  );

  return (
    <main id="main" className="space-y-10">
      <header className="space-y-3 py-4 text-center">
        <p className="inline-flex items-center rounded-full border border-stone-300 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400">
          Wellington · New Zealand · Recurring only
        </p>
        <h1 className="font-display text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
          WLG NZ Quizzes
        </h1>
        <p className="mx-auto max-w-2xl text-stone-600 dark:text-stone-300">
          {quizzes.length} recurring pub quizzes across {suburbCount} suburbs, from weekly to
          seasonal, all on one calendar. Tap a quiz for details, a map link, and an add-to-calendar
          file. Bragging rights not included.
        </p>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Last updated {LAST_UPDATED}. Schedules change; confirm with the venue before you head out.
        </p>
        <div className="flex justify-center">
          <SearchBox />
        </div>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {dataset.items.length} {config.thingPlural} listed ·{' '}
          <Link href="/items" className="underline">
            browse all
          </Link>{' '}
          ·{' '}
          <Link href="/map" className="underline">
            map
          </Link>
        </p>
      </header>

      <Reveal>
        <QuizCalendar />
      </Reveal>

      {categories.length > 0 ? (
        <section aria-labelledby="categories-heading">
          <h2 id="categories-heading" className="mb-3 text-lg font-semibold">
            Browse by tag
          </h2>
          <ul className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <li key={category.category}>
                <Link
                  href={`/categories/${encodeURIComponent(category.category)}`}
                  className="rounded-full border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                >
                  {category.category} ({category.count})
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {cities.length > 0 ? (
        <section aria-labelledby="cities-heading">
          <h2 id="cities-heading" className="mb-3 text-lg font-semibold">
            Browse by area
          </h2>
          <ul className="flex flex-wrap gap-2">
            {cities.map((city) => (
              <li key={city.city}>
                <Link
                  href={`/cities/${encodeURIComponent(city.city)}`}
                  className="rounded-full border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                >
                  {city.city} ({city.count})
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <footer className="border-t border-stone-200 pt-4 text-xs text-stone-500 dark:border-stone-800 dark:text-stone-400">
        <p>
          Quiz counts by day: Mon {dayCounts[0]} · Tue {dayCounts[1]} · Wed {dayCounts[2]} · Thu{' '}
          {dayCounts[3]} · Fri {dayCounts[4]} · Sat {dayCounts[5]} · Sun {dayCounts[6]}.
        </p>
        <p>
          Data collected from public listings, primarily Believe it or Not’s find-a-quiz page. Spot
          a change or a missing quiz? Open an issue or send a pull request.
        </p>
        <p>Made with too much trivia knowledge.</p>
      </footer>
    </main>
  );
}
