import { createTool } from "@mastra/core/tools";
import { SummarizerOutputSchema } from "../types/index";
import { summarizerTool } from "./summarizer";
import z from "zod";
import { ContentEmbedding } from "@google/genai";
import { prisma } from "../server/util/prisma";
import { ai, store } from "../server/util/services";

export const indexerTool = createTool({
  id: "indexer-tool",
  description:
    "Generate embeddings for enriched chunks and store in vector DB + Postgres.",
  inputSchema: SummarizerOutputSchema,
  outputSchema: z.union([
    z.object({
      status: z.string(),
      indexed: z.number(),
      skipped: z.number(),
      errors: z.array(z.string()),
    }),
    z.object({ msg: z.string().describe("No chunk available output") }),
  ]),
  execute: async ({ context }) => {
    const indexName = "chunkSummary";
    const dimension = 768;
    const chunks = context;

    if (!chunks)
      return { msg: "No chunks available, please input chunk data." };

    const existing = await prisma.indexedChunk.findMany({
      where: { chunkId: { in: chunks.map((c) => c.id) } },
      select: { chunkId: true },
    });
    const existingIds = new Set(existing.map((e) => e.chunkId));
    const newChunks = chunks.filter((c) => !existingIds.has(c.id));
    console.log({ existing, existingIds, newChunks });

    if (newChunks.length < 1)
      return { msg: "The current chunks are already indexed." };

    const response = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: newChunks.map((c) => c.summary),
      config: {
        outputDimensionality: dimension,
      },
    });

    const embeddings = response.embeddings as ContentEmbedding[];
    const vectors = embeddings.map((e) => e.values!);

    await store.createIndex({ indexName, dimension });

    const ops = newChunks.map((chunk, i) =>
      Promise.all([
        store.upsert({
          ids: [chunk.id],
          indexName,
          vectors: [vectors[i]],
          metadata: [
            {
              id: chunk.id,
              sourceName: chunk.source,
              sourceType: chunk.fileName,
              summary: chunk.summary,
              bullets: chunk.bullets,
              title: chunk.canonicalTitle,
              tags: chunk.tags,
              createdAt: new Date()
            },
          ],
        }),
        prisma.indexedChunk.create({
          data: {
            chunkId: chunk.id,
            canonicalTitle: chunk.canonicalTitle,
            tags: chunk.tags,
            entities: chunk.entities,
            summary: chunk.summary,
            source: chunk.source,
            sourceType: chunk.fileName,
            metadata: JSON.stringify(chunk.metadata),
          },
        }),
      ])
    );
    const results = await Promise.allSettled(ops);
    const indexed = results.filter((r) => r.status === "fulfilled").length;
    const errors = results
      .filter((r) => r.status === "rejected")
      .map((r) => String(r.reason));

    return {
      status: errors.length ? "partial" : "success",
      indexed,
      skipped: errors.length,
      errors,
    };
  },
});
