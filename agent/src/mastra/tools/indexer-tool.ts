import { createTool } from "@mastra/core/tools";
import { SummarizerOutputSchema, UnifiedDocsSchema } from "../types/index";
import { summarizerTool } from "./summarizer";
import z from "zod";
import { MongoDBVector } from "@mastra/mongodb";
import { embedMany } from "ai";
import { google } from "@ai-sdk/google";
import { ContentEmbedding, GoogleGenAI } from "@google/genai";
import { ApiError } from "../server/util/services";
import { prisma } from "../server/util/prisma";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const store = new MongoDBVector({
  uri: process.env.MONGODB_URI as string,
  dbName: process.env.MONGODB_DATABASE as string,
});

export const indexerTool = createTool({
  id: "indexer-tool",
  description:
    "Generate embeddings for enriched chunks and store in vector DB + Postgres.",
  inputSchema: SummarizerOutputSchema,
  outputSchema: z.object({
    status: z.string(),
    indexed: z.number(),
    skipped: z.number(),
    errors: z.array(z.string()),
  }),
  execute: async ({ context }) => {
    const indexName = "chunkSummary";
    const dimension = 768;
    const chunks = context;

    const chunkTexts: string[] = chunks.map((c) => c.summary);

    // const response = await ai.models.embedContent({
    //   model: "gemini-embedding-001",
    //   contents: chunkTexts,
    //   config: {
    //     outputDimensionality: dimension,
    //   },
    // });

    // const embeddings = response.embeddings as ContentEmbedding[];
    // const vectors = embeddings.map((e) => e.values!);

    const indexes = await store.listIndexes();
    const singleIndex = indexes.find((i) => i === indexName);
    console.log(singleIndex);

    // await store.createIndex({
    //   indexName: "chunkSummary",
    //   dimension: 768,
    // });
    // Skip already stored ID's
    // const existingIds =
    //   (await store.queryIds?.(
    //     indexName,
    //     chunks.map((c) => c.id)
    //   )) ?? [];
    // const newChunks = chunks.filter((c) => !existingIds.includes(c.id));

    // try {
    //   const upsert = await store.upsert({
    //     indexName: "chunkSummary",
    //     vectors,
    //     metadata: chunks.map((chunk) => ({
    //       id: chunk.id,
    //       summary: chunk.summary,
    //       tags: chunk.tags,
    //       bullets: chunk.bullets,
    //       title: chunk.canonicalTitle,
    //     })),
    //   });
    // } catch (error) {
    //   console.log("Error occured", error);
    // }

    // const ops = chunks.map((chunk, i) =>
    //   store.upsert({
    //     indexName,
    //     vectors: [vectors[i]],
    //     metadata: [
    //       {
    //         id: chunk.id,
    //         summary: chunk.summary,
    //         tags: chunk.tags,
    //         bullets: chunk.bullets,
    //         title: chunk.canonicalTitle,
    //       },
    //     ],
    //   })
    // );

    // const results = await Promise.allSettled(ops);
    // const indexed = results.filter((r) => r.status === "fulfilled").length;
    // const errors = results
    //   .filter((r) => r.status === "rejected")
    //   .map((r) => r.reason);

    // return {
    //   status: "success",
    //   indexed,
    //   skipped: errors.length,
    //   errors,
    // };

    return {
      status: "success",
      indexed: 2,
      skipped: 2,
      errors: [],
    };
  },
});
