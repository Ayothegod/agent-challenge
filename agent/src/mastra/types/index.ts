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

export type SummarizedChunk = z.infer<typeof SummarizedChunkSchema>;

export const SummarizerOutputSchema = z.array(SummarizedChunkSchema);

// ```json
// {
//   "id": "workflow-xyz",
//   "type": "ingest_doc",
//   "steps": [
//     { "name": "extract", "status": "done" },
//     { "name": "summarize", "status": "in_progress" }
//   ],
//   "context": {...}
// }

// {
//   "workflow_id": "123",
//   "step": "summarize",
//   "status": "done",
//   "output": {...},
//   "next": "index"
// }

// 3 — Data model (core tables / objects)
// id (uuid)
// source (url/file/connector)
// title
// text_snippet
// summary
// keypoints (json)
// entities (json)
// tags (array)
// embedding_id (vector db id)
// created_at, updated_at
// version
// Cluster

// id
// canonical_chunk_id
// member_chunk_ids
// cluster_summary
// AuditLog
