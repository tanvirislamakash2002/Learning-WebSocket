import { desc } from 'drizzle-orm';
import { Router } from 'express';
import { db } from '../db/db.js';
import { matches } from '../db/schema.js';
import { createMatchSchema, listMatchesQuerySchema } from '../validation/matches.js';
import { getMatchStatus } from '../utils/match-status.js';

export const matchRouter = Router();
const MAX_LIMIT = 100;
matchRouter.get('/', async (req, res) => {
    const parsed = listMatchesQuerySchema.safeParse(req.query);

    if (!parsed.success) {
        return res.status(400).json({ error: "Invalid query parameters", details: parsed.error.issues });
    }

    const limit = Math.min(parsed.data.limit ?? 50, MAX_LIMIT);

    try {
        const data = await db
            .select()
            .from(matches)
            .orderBy(desc(matches.createdAt))
            .limit(limit);

        res.status(200).json({ data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'failed to list matches', details: error.message });
    }
});

matchRouter.post('/', async (req, res) => {
    const parsed = createMatchSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
            error: "Invalid payload",
            details: parsed.error.issues
        });
    }

    const { data:{startTime, endTime, homeScore, awayScore} } = parsed;
    try {
        const [event] = await db.insert(matches).values({
            ...parsed.data,
            startTime: new Date(startTime),
            endTime: endTime ? new Date(endTime) : null,
            homeScore: homeScore ?? 0,
            awayScore: awayScore ?? 0,
            status: getMatchStatus(startTime, endTime),
        }).returning();

        res.status(201).json({ message: 'Match created successfully', data: event });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
