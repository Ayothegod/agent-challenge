type Input = {
  id: string;
  connector: {
    type: "pdf" | "docs" | "text" | "email" | "slack" | "url";
  };
};

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
