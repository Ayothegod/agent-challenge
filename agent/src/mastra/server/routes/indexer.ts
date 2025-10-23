// src/mastra/server/routes/ingest.ts
import { RuntimeContext } from "@mastra/core/runtime-context";
import { Context } from "hono";
import { safeErrorMessage } from "../util/safeErrorMessage";
import { indexerTool } from "../../tools/indexer-tool";

const runtimeContext = new RuntimeContext();

export const indexerHandler = async (c: Context) => {
  try {
    const body = await c.req.json();

    const toolResult = await indexerTool.execute({
      context: body,
      runtimeContext,
    });

    // console.log(toolResult);

    return c.json({ msg: "workflow.indexer.completed", toolResult}, 201);
  } catch (err) {
    return c.json({ error: safeErrorMessage(err) }, 500);
  }
};


      // await prisma.indexedChunks.upsert({
      //   where: { id: chunk.id },
      //   update: {
      //     canonicalTitle: chunk.canonicalTitle,
      //     tags: chunk.tags,
      //     entities: chunk.entities,
      //     summary: chunk.summary,
      //     source: chunk.source,
      //   },
      //   create: {
      //     id: chunk.id,
      //     canonicalTitle: chunk.canonicalTitle,
      //     tags: chunk.tags,
      //     entities: chunk.entities,
      //     summary: chunk.summary,
      //     source: chunk.source,
      //   },
      // });
      // errors.length ? "partial" : "success"