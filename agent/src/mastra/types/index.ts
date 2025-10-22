import z from "zod";

export interface Link {
  text: string;
  url: string;
}

interface UnifiedDoc {
  id: string;
  source: string; // "csv" | "pdf" | "docx"
  fileName: string;
  title: string; // filename or document title
  content: string; // plain text
  metadata: {
    page?: number; // for pdf
    row?: number; // for csv
    author?: string;
    createdAt?: string;
    links?: Link[];
    [key: string]: any;
  };
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
      page: z.number().optional().describe("Document page number (for PDF)"),
      row: z.number().optional().describe("CSV row number"),
      author: z.string().optional().describe("Document author"),
      createdAt: z.string().describe("Creation date"),
      links: z.array(Link).optional(),
    }),
  })
);

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
