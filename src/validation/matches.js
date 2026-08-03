import { z } from 'zod';

export const MATCH_STATUS = {
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  FINISHED: 'finished',
};

const isoDateStringSchema = z.string().trim().refine((value) => !Number.isNaN(Date.parse(value)), {
  message: 'Must be a valid ISO date string',
});

export const listMatchesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export const matchIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createMatchSchema = z
  .object({
    sport: z.string().trim().min(1, 'Sport is required'),
    homeTeam: z.string().trim().min(1, 'Home team is required'),
    awayTeam: z.string().trim().min(1, 'Away team is required'),
    startTime: z.string().trim(),
    endTime: z.string().trim().optional(),
    homeScore: z.coerce.number().int().nonnegative().optional(),
    awayScore: z.coerce.number().int().nonnegative().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.startTime && data.endTime) {
      const startTime = Date.parse(data.startTime);
      const endTime = Date.parse(data.endTime);

      if (Number.isNaN(startTime) || Number.isNaN(endTime)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'startTime and endTime must be valid ISO date strings',
          path: ['startTime'],
        });
        return;
      }

      if (endTime <= startTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'endTime must be after startTime',
          path: ['endTime'],
        });
      }
    }
  });

export const updateScoreSchema = z.object({
  homeScore: z.coerce.number().int().nonnegative(),
  awayScore: z.coerce.number().int().nonnegative(),
});
