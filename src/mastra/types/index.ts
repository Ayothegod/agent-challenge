import z from "zod";

export interface Link {
  text: string;
  url: string;
}

export interface UnifiedDoc {
  id: string;
  source: string; // "csv" | "pdf" | "docx"
  fileName: string;
  canonicalTitle: string; // filename or document title
  summary: string; // plain text
  bullets?: string[];
  tags?: string[];
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
    canonicalTitle: z.string().describe("Chunk title"), 
    summary: z.string().describe("Chunk content"), // plain text
    bullets: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
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

export const queryInstructions = `
Instructions:
- Use only the context to answer the question.
- Provide complete, informative answers, including all relevant details from the context.
- Cite sources by chunk number (e.g., [1], [3]) if relevant.
- Include summaries, bullets, entities, or tags when they help clarify the answer.
- If the context lacks the answer, say: "The information is not available."
`;

export const IndexerInputSchema = z.object({
  id: z.string(),
  summary: z.string(),
  bullets: z.array(z.string()).optional(),
  canonicalTitle: z.string(),
  tags: z.array(z.string()).optional(),
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
