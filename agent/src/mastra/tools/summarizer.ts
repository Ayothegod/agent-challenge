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
import { createOllama } from "ollama-ai-provider-v2";

export const ollama = createOllama({
  baseURL: process.env.NOS_OLLAMA_API_URL || process.env.OLLAMA_API_URL,
});

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
      canonicalTitle: "",
      tags: [],
    }));
  }

  while (parsedArray.length < batch.length) {
    parsedArray.push({
      summary: "",
      bullets: [],
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
    const batchSize = 2;
    const delayMs = 50;

    const batches = chunkArray(chunks, batchSize);

    for (const batch of batches) {
      console.time("myAsyncAction");
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
      Summarize this text, including all key points, administrative notes, names, dates, or rules mentioned. Do not skip any part.
      If the chunk has important names, dates, or identifiers, include them in the summary and bullets even if text is short.

    You are a summarization AI.
    Instructions:
    - Generate a concise 1-2 line summary.
    - Extract 2–4 key bullet points.
    - Suggest a short canonical title for the chunk.
    - Provide 3–5 relevant topic or keyword tags - (people, organizations, places, topics) present in the chunk.

    Return a **strict JSON** object with this structure:

    {
      "summary": "...",
      "bullets": ["...", "..."],
      "canonicalTitle": "...",
      "tags": ["...", "..."]
    }

    Do not add any explanations outside the JSON.

    Do not include any text outside the JSON. Return an array of JSON objects, one per chunk, in the same order.
    ${batchPrompt}
`;
      console.log(
        "before gen",
        batch.map((i) => i.id)
      );

      const response = await generateText({
        model: ollama("qwen3:8b"),
        // model,
        messages: [{ role: "user", content: fullPrompt }],
      });

      const cleanText = (response.text?.trim() ?? "")
        .replace(/```json|```/g, "")
        .trim();
      // console.log(cleanText);

      const parsedArray = processResponse(cleanText, batch);

      parsedArray.forEach((parsed, idx) => {
        results.push({
          id: batch[idx].id,
          summary: parsed.summary ?? "",
          bullets: parsed.bullets ?? [],
          canonicalTitle: parsed.canonicalTitle ?? "",
          tags: parsed.tags ?? [],
          metadata: batch[idx].metadata,
          source: batch[idx].source,
          fileName: batch[idx].fileName,
        });
      });

      console.log(
        "after gen",
        batch.map((i) => i.id)
      );

      await setTimeout(delayMs);
      console.timeEnd("myAsyncAction");
    }

    console.log(
      results.filter((r) => r.bullets.length < 1 && r.tags.length < 1)
    );

    // console.log({ results });
    return results;
  },
});
