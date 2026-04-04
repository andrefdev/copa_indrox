import { defineCollection, z, reference } from 'astro:content';

const participantsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    role: z.string(),
    area: z.enum([
      'Engineering',
      'Design',
      'Marketing',
      'Sales',
      'Operations',
      'Product'
    ]),
    photo: z.string(),
    totalScore: z.number().min(0).max(100),
    wins: z.number().int().min(0),
    participations: z.number().int().min(1),
    joinedWeek: z.number().int().min(1),
  }),
});

const weeksCollection = defineCollection({
  type: 'content',
  schema: z.object({
    week: z.number().int().min(1),
    date: z.coerce.date(),
    presenter: reference('participants'),
    projectTitle: z.string(),
    projectDescription: z.string().max(300),
    landingUrl: z.string().url().optional(),
    scores: z.object({
      impact: z.number().min(0).max(10),
      presentation: z.number().min(0).max(10),
      creativity: z.number().min(0).max(10),
    }),
    totalScore: z.number().min(0).max(30),
    isWinner: z.boolean().default(false),
  }),
});

export const collections = {
  participants: participantsCollection,
  weeks: weeksCollection,
};
