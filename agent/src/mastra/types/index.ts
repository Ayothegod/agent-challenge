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
  entities: string[];
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
  entities: z.array(z.string()),
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

export const encrichedChunks = [
  {
    id: "d6ab9c3d-9bdb-492e-9245-3d286e3ddffb",
    summary:
      "NYSC advises prospective corps members to be wary of fraudsters concerning deployment, relocation, and posting matters. It also warns against proceeding to camp if the graduation date on the call-up letter doesn't match the certificate or statement of result.",
    bullets: [""],
    entities: [""],
    canonicalTitle: "NYSC Fraud Warning and Graduation Date Verification",
    tags: [],
    metadata: { page: 3, row: 1, createdAt: "today", links: [] },
  },
];


