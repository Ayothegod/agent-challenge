import { MCPServer } from "@mastra/mcp"
import { weatherTool } from "../tools";
import { weatherAgent } from "../agents";
import { greetingTool } from "../tools/greetings";

export const server = new MCPServer({
  name: "My Custom Server",
  version: "1.0.0",
  tools: { weatherTool, greetingTool },
  agents: { weatherAgent }, // this agent will become tool "ask_weatherAgent"
  // workflows: {
  // dataProcessingWorkflow, // this workflow will become tool "run_dataProcessingWorkflow"
  // }
});
