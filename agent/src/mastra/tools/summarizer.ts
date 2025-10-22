import { createTool } from "@mastra/core/tools";
import {
  SummarizerInputSchema,
  SummarizerOutputSchema,
  ParsedText,
  type SummarizedChunk,
} from "../types/index";
import z from "zod";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { setTimeout } from "timers/promises";
const model = google("gemini-2.0-flash");

function chunkArray<T>(arr: T[], size: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    batches.push(arr.slice(i, i + size));
  }
  return batches;
}

// const batches = chunkArray(chunks, 5);
// for (const batch of batches) {
//   const prompt = batch.map((c) => c.content).join("\n\n");
//   const response = await llm.generateJson(prompt);
// }

export const summarizerTool = createTool({
  id: "summarizer-tool",
  description:
    "Summarizes and enriches document chunks with bullet points, entities, and tags.",
  inputSchema: SummarizerInputSchema,
  outputSchema: SummarizerOutputSchema,
  // outputSchema: z.string(),
  execute: async ({ context, runtimeContext }) => {
    const { chunks } = context;
    console.log("this is summarizer tool");

    const results: SummarizedChunk[] = [];
    const batchSize = 3; // adjust based on token size & context
    const delayMs = 500;

    const batches = chunkArray(chunks, batchSize);

    //     for await (const chunk of chunks) {
    //       const title = chunk.title;
    //       const content = chunk.content;
    //       const source = chunk.source;

    //       const chunkPrompt = `
    // You are a summarization AI.

    // Summarize the following chunk:

    // Title: ${title}
    // Content: ${content}
    // Source: ${source}

    // Instructions:
    // - Generate a concise 2–4 line summary.
    // - Extract 2–4 key bullet points.
    // - Identify named entities (people, organizations, places, topics) present in the chunk.
    // - Suggest a short canonical title for the chunk.
    // - Provide 3–5 relevant topic or keyword tags.

    // Return a **strict JSON** object with this structure:

    // {
    //   "summary": "...",
    //   "bullets": ["...", "..."],
    //   "entities": ["...", "..."],
    //   "canonicalTitle": "...",
    //   "tags": ["...", "..."]
    // }

    // Do not add any explanations outside the JSON.
    // `;

    //       const result = await generateText({
    //         model,
    //         messages: [
    //           {
    //             role: "user",
    //             content: chunkPrompt,
    //           },
    //         ],
    //       });

    //       const chunkSummary = result.text?.trim() ?? "";
    //       const cleanText = chunkSummary.replace(/```json|```/g, "").trim();
    //       const parsedText: ParsedText = JSON.parse(cleanText);

    //       results.push({
    //         id: chunk.id,
    //         summary: parsedText.summary ?? "",
    //         bullets: parsedText.bullets ?? [],
    //         entities: parsedText.entities ?? [],
    //         canonicalTitle: parsedText.canonicalTitle ?? "",
    //         tags: parsedText.tags ?? [],
    //         metadata: chunk.metadata,
    //       });

    //       await setTimeout(delayMs);
    //     }

    for (const batch of batches) {
      const batchPrompt = batch
        .map(
          (chunk) => `
      Title: ${chunk.title}
      Content: ${chunk.content}
      Source: ${chunk.source}
`
        )
        .join("\n\n");

      const fullPrompt = `
    You are a summarization AI.
    Instructions:
    - Generate a concise 2–4 line summary.
    - Extract 2–4 key bullet points.
    - Identify named entities (people, organizations, places, topics) present in the chunk.
    - Suggest a short canonical title for the chunk.
    - Provide 3–5 relevant topic or keyword tags.

    Return a **strict JSON** object with this structure:

    {
      "summary": "...",
      "bullets": ["...", "..."],
      "entities": ["...", "..."],
      "canonicalTitle": "...",
      "tags": ["...", "..."]
    }

    Do not add any explanations outside the JSON.

    Do not include any text outside the JSON. Return an array of JSON objects, one per chunk, in the same order.
    ${batchPrompt}
`;

      const response = await generateText({
        model,
        messages: [{ role: "user", content: fullPrompt }],
      });

      const cleanText = (response.text?.trim() ?? "")
        .replace(/```json|```/g, "")
        .trim();
      const parsedArray: ParsedText[] = JSON.parse(cleanText);

      // Map results back to original chunks
      parsedArray.forEach((parsed, idx) => {
        results.push({
          id: batch[idx].id,
          summary: parsed.summary ?? "",
          bullets: parsed.bullets ?? [],
          entities: parsed.entities ?? [],
          canonicalTitle: parsed.canonicalTitle ?? "",
          tags: parsed.tags ?? [],
          metadata: batch[idx].metadata,
        });
      });

      // Simple delay between batches
      await setTimeout(delayMs);
    }

    console.log({ results });

    return results;
  },
});

// const parsed = JSON.parse(cleanText);
// const validated = SummarizerOutputSchema.parse(parsed);
