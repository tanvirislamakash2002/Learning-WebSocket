import { Router } from "express";
import { desc, eq } from "drizzle-orm";
import { db } from "../db/db.js";
import { commentary } from "../db/schema.js";
import { matchIdParamSchema } from "../validation/matches.js";
import {
  createCommentarySchema,
  listCommentaryQuerySchema,
} from "../validation/commentary.js";

export const commentaryRouter = Router({ mergeParams: true });

const MAX_LIMIT = 100;

commentaryRouter.get("/", async (req, res) => {
  const parsedParams = matchIdParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({
      error: "Invalid match id",
      details: parsedParams.error.issues,
    });
  }

  const parsedQuery = listCommentaryQuerySchema.safeParse(req.query);
  if (!parsedQuery.success) {
    return res.status(400).json({
      error: "Invalid query parameters",
      details: parsedQuery.error.issues,
    });
  }

  const limit = Math.min(parsedQuery.data.limit ?? MAX_LIMIT, MAX_LIMIT);

  try {
    const data = await db
      .select()
      .from(commentary)
      .where(eq(commentary.matchId, parsedParams.data.id))
      .orderBy(desc(commentary.createdAt))
      .limit(limit);

    res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to list commentary", details: error.message });
  }
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
        minute: parsedBody.data.minute,
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