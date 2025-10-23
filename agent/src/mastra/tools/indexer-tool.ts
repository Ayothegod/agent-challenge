import { createTool } from "@mastra/core/tools";
import { SummarizerOutputSchema, UnifiedDocsSchema } from "../types/index";
import { summarizerTool } from "./summarizer";
import z from "zod";
import { MongoDBVector } from "@mastra/mongodb";
import { embedMany } from "ai";
import { google } from "@ai-sdk/google";
import { ContentEmbedding, GoogleGenAI } from "@google/genai";

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
    const chunks = context;
    const results = [];
    const errors: string[] = [];

    // await store.createIndex({
    //   indexName: "myCollection",
    //   dimension: 1536,
    // });
    // await store.upsert({
    //   indexName: "myCollection",
    //   vectors: embeddings,
    //   metadata: chunks.map(chunk => ({ text: chunk.text })),
    // });
    // const contents = [
    //   "What is the meaning of life?",
    //   "What is the purpose of existence?",
    //   "How do I bake a cake?",
    // ];

    // const response = await ai.models.embedContent({
    //   model: "gemini-embedding-001",
    //   contents,
    //   config: {
    //     outputDimensionality: 768,
    //   },
    // });

    // console.log(response.metadata);
    // const embeddings = response.embeddings as ContentEmbedding[];

    // // Match embeddings to original text:
    // contents.forEach((text, i) => {
    //   console.log(text, embeddings[i].values);
    // });

    const chunkTexts: string[] = [];
    for (const chunk of chunks) {
      chunkTexts.push(chunk.summary);
    }
    console.log(chunkTexts);
    

    return {
      status: errors.length ? "partial" : "success",
      indexed: results.length,
      skipped: errors.length,
      errors,
    };
  },
});
