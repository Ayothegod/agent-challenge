// It handles retrieval, ranking, prompt assembly, and answer generation.
// The query → turned into a vector
// Vector store finds top-k most similar chunks (say 3–5)
// Backend merges those chunks’ text (and maybe adjacent ones)
// The merged text is sent as context to your agent/LMM

import { createTool } from "@mastra/core/tools";
import { UnifiedDocsSchema } from "../types/index";
import { summarizerTool } from "./summarizer";
import z from "zod";
import { ai, store } from "../server/util/services";
import { ContentEmbedding } from "@google/genai";

export const queryTool = createTool({
  id: "query-tool",
  description: "Get Unified docs from extract API and send to other tools.",
  inputSchema: z.object({
    question: z.string().describe("The question for the query"),
    filters: z.array(z.string()).optional(),
  }),
  outputSchema: z.object({
    answer: z.string().describe("Query analyzer result for question"),
    citations: z
      .array(z.string())
      .describe("Various sources gathered via vector and analysis"),
    retrievedCount: z.number().describe(""),
  }),
  execute: async ({ context }) => {
    const { question, filters } = context;
    const indexName = "chunkSummary";
    const dimension = 768;

    const queryEmbedding = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: question,
      config: {
        outputDimensionality: dimension,
      },
    });

    const [embedding] = (queryEmbedding.embeddings as ContentEmbedding[]).map(
      (e) => e.values!
    );

    const results = await store.query({
      indexName,
      queryVector: embedding,
      topK: 5,
      filter: {},
    });
    
    const reranked = results.sort((a, b) => b.score - a.score);
    console.log(results, reranked);


    // // 4. build prompt
    // const context = reranked
    //   .map((r, i) => `${i + 1}. ${r.chunk.summary || r.chunk.content}`)
    //   .join("\n");
    // const prompt = `Context:\n${context}\n---\nQuestion: ${question}\nAnswer:`;

    // // 5. query LLM
    // const answer = await llm.complete(prompt);

    return {
      answer: "REV ONUCHE is a dev",
      citations: ["chunk-1", "chunk-2"],
      retrievedCount: 5,
    };
  },
});
