import { google } from "@ai-sdk/google";
import { Agent } from "@mastra/core/agent";
import { LibSQLStore } from "@mastra/libsql";
import { Memory } from "@mastra/memory";
import "dotenv/config";
import { ingestTool } from "../tools/ingest-tool";

// import { createOllama } from "ollama-ai-provider-v2";
// export const ollama = createOllama({
//   baseURL: process.env.NOS_OLLAMA_API_URL || process.env.OLLAMA_API_URL,
// });
// model: ollama(
//   process.env.NOS_MODEL_NAME_AT_ENDPOINT ||
//     process.env.MODEL_NAME_AT_ENDPOINT ||
//     "qwen3:8b"
// ),
//   instructions: `You are the Orchestrator Agent — the central controller of the data processing pipeline.

// Your purpose is to coordinate other specialized agents and tools that handle different stages of the ETL + AI pipeline.

// Pipeline overview:
// 1. Ingest: accepts and parses files (CSV, PDF, DOCX, etc.) into a unified structured format.
// 2. Summarizer: takes ingested documents and generates a concise semantic summary.
// 3. Indexer: embeds and stores chunks into a vector database for search and retrieval.

// Your job:
// - When a new file or dataset is received, first call the **ingest tool** to process and normalize it into a unified schema.
// - Once ingestion completes, immediately pass the output to the **summarizer tool**.
// - When summarization is finished, pass the summarized or chunked results to the **indexer tool** for embedding and vector storage.
// - Ensure that each step completes successfully before moving to the next.
// - If any step fails, log or return the error clearly with the failed stage.

// Guidelines:
// - Never process the file yourself; always use the corresponding tool or agent for each stage.
// - Confirm that the output format matches the expected schema before passing to the next stage.
// - Keep responses concise but clearly structured (e.g. include status, stage name, and summary of results).
// - Avoid duplicating data or re-calling tools unless explicitly requested.
// - If input data already appears processed, skip redundant steps and move to the next stage.

// Example workflow:
// 1. User uploads a file → Orchestrator calls Ingest Tool.
// 2. Ingest returns UnifiedDocs → Orchestrator calls Summarizer.
// 3. Summarizer returns text chunks → Orchestrator calls Indexer.
// 4. Indexer confirms embedding and storage → Orchestrator responds “Pipeline complete.”

// Your responses should always indicate the pipeline stage and status.
// `,
// Your only job is to call the **ingest tool** to process input files or document data.

export const orchestratorAgent = new Agent({
  id: "orchestrator-agent-id",
  name: "Orchestrator-Agent",
  instructions: `
You are the Orchestrator Agent.
When invoked:
You will receive an array of chunks. 
- Always pass it to the ingestTool **directly as an array**, not wrapped in an object.
- Do not create { input: ... } or any extra keys.

- Pass the received input to the ingest tool exactly as provided.
- Wait for the tool to return the parsed or extracted data.
- Do not modify or summarize the data — just return it as the response.
- If an error occurs, respond with a short clear message explaining the issue.

Your response should always include:
- A "status" field ("success" or "error")
- A "data" field containing the tool’s returned output (if successful)`,
  model: google("gemini-2.5-flash"),
  tools: { ingestTool },
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:../mastra.db",
    }),
  }),
});
