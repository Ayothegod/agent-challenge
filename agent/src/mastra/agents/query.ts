import { google } from "@ai-sdk/google";
import { Agent } from "@mastra/core/agent";
import { LibSQLStore } from "@mastra/libsql";
import { Memory } from "@mastra/memory";
import "dotenv/config";
import { queryTool } from "../tools/query-tool";

export const queryAgent = new Agent({
  name: "Query-Agent",
  instructions: `You are an AI assistant answering questions based only on the provided context. Do not use outside knowledge.
`,
  model: google("gemini-2.5-flash"),
  tools: { queryTool },
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:../mastra.db",
    }),
  }),
});
