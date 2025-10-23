import { google } from "@ai-sdk/google";
import { Agent } from "@mastra/core/agent";
import { LibSQLStore } from "@mastra/libsql";
import { Memory } from "@mastra/memory";
import "dotenv/config";
import { ingestTool } from "../tools/ingest-tool";

export const orchestratorAgent = new Agent({
  id: "orchestrator-agent-id",
  name: "Orchestrator-Agent",
  instructions: `"data" field containing the tool’s returned output (if successful)`,
  model: google("gemini-2.5-flash"),
  tools: { ingestTool },
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:../mastra.db",
    }),
  }),
});
