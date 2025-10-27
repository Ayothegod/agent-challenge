import z from "zod";

export interface Link {
  text: string;
  url: string;
}

export interface UnifiedDoc {
  id: string;
  source: string; // "csv" | "pdf" | "docx"
  fileName: string;
  title: string; // filename or document title
  content: string; // plain text
  metadata: {
    page: number; // for pdf
    row: number; // for csv
    createdAt: string;
    author?: string;
    links?: Link[];
    [key: string]: any;
  };
}

export interface ParsedText {
  summary: string;
  bullets: string[];
  canonicalTitle: string;
  tags: string[];
}

export const Link = z.object({
  text: z.string().describe("Link name"),
  url: z.url().describe("Link url"),
});

export const UnifiedDocsSchema = z.array(
  z.object({
    id: z.string().describe("City name"),
    source: z.string().describe("Specific source of document for chunk"),
    fileName: z.string().describe("Filename for chunk object"),
    title: z.string().describe("Chunk title"), // filename or document title
    content: z.string().describe("Chunk content"), // plain text
    metadata: z.object({
      page: z.number().describe("Document page number (for PDF)"),
      row: z.number().describe("CSV row number"),
      author: z.string().optional().describe("Document author"),
      createdAt: z.string().describe("Creation date"),
      links: z.array(Link).optional(),
    }),
  })
);

export const SummarizedChunkSchema = z.object({
  id: z.string(),
  summary: z.string(),
  bullets: z.array(z.string()),
  canonicalTitle: z.string(),
  tags: z.array(z.string()),
  source: z.string(),
  fileName: z.string(),
  metadata: z.object({
    page: z.number().describe("Document page number (for PDF)"),
    row: z.number().describe("CSV row number"),
    author: z.string().optional().describe("Document author"),
    createdAt: z.string().describe("Creation date"),
    links: z.array(Link).optional(),
  }),
});

export const SummarizerInputSchema = z.object({
  chunks: UnifiedDocsSchema,
});

export const SummarizerOutputSchema = z.array(SummarizedChunkSchema);

export type SummarizedChunk = z.infer<typeof SummarizedChunkSchema>;

interface QueryFilters {
  sources?: string[]; // ["pdf", "csv"]
  tags?: string[]; // ["AI", "Healthcare"]
  dateRange?: { from: string; to: string };
}

export const queryInstructions = `
Instructions:
- Use only the context to answer the question.
- Provide complete, informative answers, including all relevant details from the context.
- Cite sources by chunk number (e.g., [1], [3]) if relevant.
- Include summaries, bullets, entities, or tags when they help clarify the answer.
- If the context lacks the answer, say: "The information is not available."
`;
