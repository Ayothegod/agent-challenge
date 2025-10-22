import { createTool } from "@mastra/core/tools";
import {
  SummarizerInputSchema,
  SummarizerOutputSchema,
} from "../types/index";
import z from "zod";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export const summarizerTool = createTool({
  id: "summarizer-tool",
  description:
    "Summarizes and enriches document chunks with bullet points, entities, and tags.",
  inputSchema: SummarizerInputSchema,
  // outputSchema: SummarizerOutputSchema,
  outputSchema: z.string(),
  execute: async ({ context, runtimeContext }) => {
    const { chunks } = context;

    console.log("this is summarizer tool");
    

    // const results = [];

    // for (const chunk of chunks) {
    //   const chunkPrompt = `
    //   Summarize and enrich document chunks.
    //   For each chunk provided, generate:

    //   A concise 2–4 line summary of the chunk content "${chunk.content}" in respect to the chunk title
    //   3–7 key bullet points summarizing important details.
    //   Named entities (people, organizations, places, topics) that are present in the chunk only.
    //   A short canonical title describing the chunk’s main idea.
    //   3–5 topic or keyword tags.
      
    //   Return a JSON object with:
    // {
    //   "summary": "2-4 line summary",
    //   "bullets": ["point1", "point2", ...],
    //   "entities": ["entity1", "entity2", ...],
    //   "canonicalTitle": "short descriptive title",
    //   "tags": ["tag1", "tag2", ...]
    // }
    //       `;

    //   const model = google("gemini-2.5-flash");
    //   const result = await generateText({
    //     model,
    //     messages: [{ role: "user", content: chunkPrompt }],
    //   });

    //   const chunkSummary = result.text?.trim() ?? "";
    //   console.log({ result });

    //   // results.push({
    //   //   id: chunk.id,
    //   //   ...aiResponse,
    //   //   metadata: chunk.metadata,
    //   // });
    // }

    return "results";
  },
});
