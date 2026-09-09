import { seedItems } from '@/data/items';
import { quizListSchema, type Quiz } from '@/server/quiz-schema';

/**
 * Quiz view-model derived from the item dataset.
 *
 * The dataset-directory structure stores every listing as an item with a
 * `schedule` array; the calendar and its helpers still read the flat Quiz
 * shape, so this file adapts items back to quizzes. Keep the two in sync:
 * edit `src/data/items.ts`, never this file.
 */
export const quizzes: Quiz[] = quizListSchema.parse(
  seedItems.map((item) => {
    const entry = item.schedule[0];
    return {
      id: item.id,
      venue: item.name,
      suburb: item.location ?? '',
      address: item.address ?? '',
      area: item.city,
      dayOfWeek: entry?.day ?? 'Monday',
      startTime: entry?.startTime ?? '19:00',
      cadence: entry?.cadence ?? 'weekly',
      cadenceNote: entry?.cadenceNote,
      cost: entry?.cost,
      prizes: entry?.prizes,
      format: entry?.format,
      booking: entry?.booking,
      notes: item.description,
      operator: entry?.operator,
      teamSize: entry?.teamSize,
      tags: entry?.tags ?? [],
      source: item.source,
      lastVerified: item.lastVerified,
    };
  })
);
