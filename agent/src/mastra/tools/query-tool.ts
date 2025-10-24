// It handles retrieval, ranking, prompt assembly, and answer generation.
// The query → turned into a vector
// Vector store finds top-k most similar chunks (say 3–5)
// Backend merges those chunks’ text (and maybe adjacent ones)
// The merged text is sent as context to your agent/LMM

import { createTool } from "@mastra/core/tools";
import { UnifiedDocsSchema } from "../types/index";
import { summarizerTool } from "./summarizer";
import z from "zod";
import { ai, store, model } from "../server/util/services";
import { ContentEmbedding } from "@google/genai";
import { generateText } from "ai";

interface QueryFilters {
  sources?: string[]; // ["pdf", "csv"]
  tags?: string[]; // ["AI", "Healthcare"]
  dateRange?: { from: string; to: string };
}

export const queryTool = createTool({
  id: "query-tool",
  description: "Get Unified docs from extract API and send to other tools.",
  inputSchema: z.object({
    question: z.string().describe("The question for the query"),
    filters: z
      .object({
        sourceName: z.array(z.string()).optional(),
        sourceType: z.array(z.string()).optional(),
        tags: z.array(z.string()).optional(),
        dateRange: z
          .object({
            from: z.string(),
            to: z.string(),
          })
          .optional(),
      })
      .optional(),
  }),
  outputSchema: z.object({
    answer: z.string().describe("Query analyzer result for question"),
    citations: z
      .array(
        z.object({
          source: z.string(),
          id: z.string(),
        })
      )
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

    const vectorFilter: any = {};
    if (filters?.sourceName) vectorFilter.sourceName = { $in: filters.sourceName };
    if (filters?.sourceType) vectorFilter.sourceType = { $in: filters.sourceType };
    if (filters?.tags) vectorFilter.tags = { $overlaps: filters.tags };

    const results = await store.query({
      indexName,
      queryVector: embedding,
      topK: 5,
      filter: vectorFilter,
    });

    // const reranked = results.sort((a, b) => b.score - a.score);
    const filteredResults = results.filter((r) => r.score! > 0.8);
    console.log({ filteredResults, vectorFilter });

    // NOTE: Limit context length (merge or summarize if >5–10 chunks).
    const promptContext = filteredResults.map((r, i) => {
      const parts = [
        `Summary: ${r.metadata?.summary}`,
        r.metadata?.bullets?.length
          ? `Bullets: ${r.metadata.bullets.join("; ")}`
          : "",
        r.metadata?.tags?.length ? `Tags: ${r.metadata.tags.join(", ")}` : "",
        r.metadata?.entities?.length
          ? `Entities: ${r.metadata.entities.join(", ")}`
          : "",
        r.metadata?.source ? `Source: ${r.metadata.source}` : "",
      ].filter(Boolean);

      return `${i + 1}. ${parts.join(" | ")}`;
    });

    const prompt = `
    You are an AI assistant answering questions based only on the provided context.
    Do not use outside knowledge.

    Context:
    ${promptContext}

    ---

    Question:
    ${question}

    Instructions:
    - Use information only from the context.
    - If context lacks the answer, say: "The information is not available."
    - Write a short, direct answer.
    - Cite sources by chunk number (e.g., [1], [3]) if relevant.

    Answer:
        `.trim();

    const response = await generateText({
      model,
      messages: [{ role: "user", content: prompt }],
    });

    const cleanText = (response.text?.trim() ?? "")
      .replace(/```json|```/g, "")
      .trim();

    return {
      answer: cleanText,
      citations: filteredResults.map((r) => {
        return { source: r.metadata?.source, id: r.id };
      }),
      retrievedCount: filteredResults.length,
    };
  },
});
