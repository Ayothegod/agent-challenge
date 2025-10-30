// // src/mastra/server/routes/searchDocs.ts
// import { queryTool } from "../../tools/query-tool";
// import { safeErrorMessage } from "../util/safeErrorMessage";

// export const searchHandler = async (c: any) => {
//   try {
//     const body = await c.req.json();
//     if (!body)
//       return c.json(
//         { error: "Question is required to query knowledge system." },
//         400
//       );

//     const queryResult = await queryTool.execute({
//       context: body,
//       runtimeContext: {} as any,
//     });

//     return c.json({ msg: "workflow.query.completed", queryResult }, 200);
//   } catch (err) {
//     return c.json({ error: safeErrorMessage(err) }, 500);
//   }
// };


import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/query')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        return new Response('Hello, World!')
      },
    },
  },
})

// When a user opens the dashboard or sends a query, you’ll query Postgres for structured data like:

// Category	Example Fields	Why Frontend Needs It
// User documents list	title, file_type, status, created_at, owner_id	to show all uploads
// Ingest metadata	source, connector_type, file_url, page_count, chunk_count	to show progress or analytics
// Embedding info	embedding_id, indexed_at, vector_status	to show index progress
// Search results	chunk_id, content_preview, similarity_score, doc_title	to display contextual search hits
// Agents / pipelines	agent_id, name, description, last_used, doc_scope	to pick what agent to run on what data
// Permissions	shared_with, visibility, team_id	for access control
// ⚙️ Example API flows

// 1️⃣ Dashboard listing

// GET /api/docs
// → fetches from Postgres:
// [
//   { id: "1", title: "Team Report.pdf", file_type: "pdf", chunk_count: 34, created_at: "2025-10-18" },
//   { id: "2", title: "Expenses.csv", file_type: "csv", chunk_count: 12, created_at: "2025-10-17" }
// ]


// 2️⃣ Search

// POST /api/query
// body: { query: "revenue trends Q4" }

// → backend queries vector store (semantic)
// → joins chunk_ids to Postgres for display context

// returns:
// [
//   {
//     chunk_id: "c_123",
//     content_preview: "Q4 revenue increased by 14%...",
//     doc_title: "Financial Summary.pdf",
//     page: 3
//   }
// ]


// 3️⃣ File detail view

// GET /api/docs/1
// → fetches from Postgres:
// {
//   id: "1",
//   title: "Team Report.pdf",
//   file_url: "s3://bucket/...pdf",
//   connector: "drive",
//   embeddings_ready: true,
//   chunks: [{ id: "c1", text_preview: "Company revenue..." }, ...]
// }