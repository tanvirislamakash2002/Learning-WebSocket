import { Router } from "express";

export const matchRouter = Router();

matchRouter.get("/", (req, res) => {
    res.status(200).json({ message: "Matches List" });
});

matchRouter.post("/", (req, res) => {
    const parsed = createMatchSchema.safeParse(req.body);
    const { data: { startTime, endTime, homeScore, awayScore } } = parsed
    if (!parsed.success) {
        return res.status(400).json({ errors: parsed.error.errors });
    }
    try {
        const [event] = await db.insert(matches).values({
            ...parsed.data,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            homeScore: homeScore ?? 0,
            awayScore: awayScore ?? 0,
            status: getMatchStatus(startTime, endTime),
        }).returning();

        res.status(201).json({ message: "Match created successfully", data: event });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
