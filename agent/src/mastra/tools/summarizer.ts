import { createTool } from "@mastra/core/tools";
import { SummarizerInputSchema, SummarizerOutputSchema, ParsedText } from "../types/index";
import z from "zod";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
const model = google("gemini-2.0-flash");

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

    const results = [];
    for await (const chunk of chunks) {
      const title = chunk.title;
      const content = chunk.content;
      const source = chunk.source;

      const chunkPrompt = `
You are a summarization AI.

Summarize the following chunk:

Title: ${title}
Content: ${content}
Source: ${source}


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
`;

      const result = await generateText({
        model,
        messages: [
          {
            role: "user",
            content: chunkPrompt,
          },
        ],
      });

      const chunkSummary = result.text?.trim() ?? "";
      const cleanText = chunkSummary.replace(/```json|```/g, "").trim();
      const parsedText: ParsedText = JSON.parse(cleanText);

      results.push({
        id: chunk.id,
        summary: parsedText.summary ?? "",
        bullets: parsedText.bullets ?? [],
        entities: parsedText.entities ?? [],
        canonicalTitle: parsedText.canonicalTitle ?? "",
        tags: parsedText.tags ?? [],
        metadata: chunk.metadata,
      });
    }

    console.log({ results });

    return results
  },
});
