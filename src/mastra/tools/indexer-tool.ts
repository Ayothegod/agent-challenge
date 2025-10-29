import { createTool } from "@mastra/core/tools";
import { IndexerInputSchema } from "../types/index";
import z from "zod";
import { ContentEmbedding } from "@google/genai";
import prisma from "@/util/prisma";
import { ai, store } from "@/util/services";

export const indexerTool = createTool({
  id: "indexer-tool",
  description:
    "Generate embeddings for enriched chunks and store in vector DB + Postgres.",
  inputSchema: z.object({
    chunks: z.array(IndexerInputSchema),
    userId: z.string(),
  }),
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
    const indexName = "chunk-summary";
    const dimension = 768;
    const chunks = context.chunks;
    const userId = context.userId;

    if (!userId)
      return {
        msg: "No userID associated with this operation, please provide a userId.",
      };

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    console.log(user);

    if (!user)
      return {
        msg: "This user does not exists, create an account to get started.",
      };

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
      // contents: newChunks.map((c) => c.summary),
      contents: newChunks.map((c) =>
        [c.canonicalTitle, c.summary, c.bullets?.join(". ")]
          .filter(Boolean)
          .join(" | ")
      ),
      config: {
        outputDimensionality: dimension,
      },
    });

    const embeddings = response.embeddings as ContentEmbedding[];
    const vectors = embeddings.map((e) => e.values!);

    await store.createIndex({ indexName, dimension });

    console.time("Total upsert + create time");
    const ops = newChunks.map((chunk, i) => {
      console.time(`Chunk ${i + 1} time`);

      const upsert = store.upsert({
        ids: [chunk.id],
        indexName,
        vectors: [vectors[i]],
        metadata: [
          {
            id: chunk.id,
            sourceName: chunk.fileName,
            sourceType: chunk.source,
            summary: chunk.summary,
            bullets: chunk.bullets,
            title: chunk.canonicalTitle,
            tags: chunk.tags,
            createdAt: new Date(),
            userId,
          },
        ],
      });

      const create = prisma.indexedChunk.create({
        data: {
          chunkId: chunk.id,
          canonicalTitle: chunk.canonicalTitle,
          tags: chunk.tags?.join(","),
          bullets: chunk.bullets?.join(","),
          summary: chunk.summary,
          source: chunk.fileName,
          sourceType: chunk.source,
          metadata: JSON.stringify(chunk.metadata),
          userId,
        },
      });

      return Promise.all([upsert, create])
        .then((res) => {
          console.timeEnd(`Chunk ${i + 1} time`);
          return res;
        })
        .catch((err) => {
          console.timeEnd(`Chunk ${i + 1} time`);
          throw err;
        });
    });

    const results = await Promise.allSettled(ops);
    console.timeEnd("Total upsert + create time");
    
    console.log({ results });

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
