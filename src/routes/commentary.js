import { Router } from "express";
import { db } from "../db/db.js";
import { commentary } from "../db/schema.js";
import { matchIdParamSchema } from "../validation/matches.js";
import { createCommentarySchema } from "../validation/commentary.js";

export const commentaryRouter = Router();

commentaryRouter.get("/", (req, res) => {
  res.status(200).json({ message: "commentary list" });
});

commentaryRouter.post("/", async (req, res) => {
  const parsedParams = matchIdParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({
      error: "Invalid match id",
      details: parsedParams.error.issues,
    });
  }

  const parsedBody = createCommentarySchema.safeParse(req.body);
  if (!parsedBody.success) {
    return res.status(400).json({
      error: "Invalid commentary payload",
      details: parsedBody.error.issues,
    });
  }

  try {
    const [createdCommentary] = await db
      .insert(commentary)
      .values({
        matchId: parsedParams.data.id,
        minute: parsedBody.data.minutes,
        sequence: parsedBody.data.sequence,
        period: parsedBody.data.period,
        eventType: parsedBody.data.eventType,
        actor: parsedBody.data.actor,
        team: parsedBody.data.team,
        message: parsedBody.data.message,
        metadata: parsedBody.data.metadata,
        tags: parsedBody.data.tags,
      })
      .returning();

    res.status(201).json({
      message: "Commentary created successfully",
      data: createdCommentary,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});