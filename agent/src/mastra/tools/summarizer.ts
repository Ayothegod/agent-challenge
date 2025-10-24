import { createTool } from "@mastra/core/tools";
import { generateText } from "ai";
import { setTimeout } from "timers/promises";
import {
  ParsedText,
  type SummarizedChunk,
  SummarizerInputSchema,
  SummarizerOutputSchema,
  UnifiedDoc,
} from "../types/index";
import { model } from "../server/util/services";

function chunkArray<T>(arr: T[], size: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    batches.push(arr.slice(i, i + size));
  }
  return batches;
}

function processResponse(cleanText: string, batch: UnifiedDoc[]) {
  let parsedArray: ParsedText[];

  try {
    parsedArray = JSON.parse(cleanText);
    if (!Array.isArray(parsedArray)) {
      console.warn("LLM did not return an array, wrapping in array");
      parsedArray = [parsedArray as ParsedText];
    }
  } catch (err) {
    console.error("Failed to parse LLM output:", err);
    parsedArray = batch.map(() => ({
      summary: "",
      bullets: [],
      entities: [],
      canonicalTitle: "",
      tags: [],
    }));
  }

  while (parsedArray.length < batch.length) {
    parsedArray.push({
      summary: "",
      bullets: [],
      entities: [],
      canonicalTitle: "",
      tags: [],
    });
  }

  if (parsedArray.length > batch.length) {
    parsedArray = parsedArray.slice(0, batch.length);
  }

  return parsedArray;
}

export const summarizerTool = createTool({
  id: "summarizer-tool",
  description:
    "Summarizes and enriches document chunks with bullet points, entities, and tags.",
  inputSchema: SummarizerInputSchema,
  outputSchema: SummarizerOutputSchema,
  execute: async ({ context, runtimeContext }) => {
    const { chunks } = context;
    console.log("this is summarizer tool");

    const results: SummarizedChunk[] = [];
    const batchSize = 5;
    const delayMs = 500;

    const batches = chunkArray(chunks, batchSize);

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
    - Generate a concise 1-2 line summary.
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

      // const parsedArray: ParsedText[] = JSON.parse(cleanText);
      const parsedArray = processResponse(cleanText, batch);

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
          source: batch[idx].fileName,
        });
      });

      await setTimeout(delayMs);
    }

    // console.log({ results });
    return results;
  },
});
