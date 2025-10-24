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

// Receive query input
// e.g. "Who are the software developers in the dataset?"

// Embed the query
// → same embedding model used during indexing.

// Search vector DB
// → get top-K most relevant chunks (e.g. 5-10).
// Optionally filter using Postgres metadata (source, date, tags).

// Rerank results (optional but recommended)
// → reorder by cosine similarity, recency, or metadata priority.

// Build prompt for LLM
// Include retrieved context:

// {
//   "answer": "REV ONUCHE [1] and Damilola Daramola [2] are software developers.",
//   "citations": [1, 2],
//   "retrievedCount": 5
// }
//NOTE: results example 1. Summary: AI enhances diagnosis accuracy and speeds drug discovery | Bullets: Improves diagnostics; Accelerates drugs | Tags: AI, Healthcare | Entities: Artificial Intelligence, Healthcare | Source: pdf

// {
//   id: '032d354b-e0e8-4eb9-b766-6d757577fafb',
//   score: 0.7064365744590759,
//   metadata: {
//     id: '3d7844b4-4070-431c-a6eb-dbd654b0468b',
//     summary: 'Prospective Corps Members are advised against night travel and should bring Degree/HND Certificates or Statements of Results to camp.',
//     bullets: [Array],
//     title: 'Important Notice for Prospective Corps Members'
//   },
//   vector: undefined,
//   document: undefined
// }
