import { Agent } from "@mastra/core/agent";
import { ollama } from "./weather-agent";
import { testTool } from "../tools/test-tool";

export const testAgent = new Agent({
  name: "test-agent",
  instructions: [
    "You are a helpful assistant.",
    "Provide detailed answers.",
    "create dad jokes based on the number gotten from the test tool"
  ],
  model: ollama(
    process.env.NOS_MODEL_NAME_AT_ENDPOINT ||
      process.env.MODEL_NAME_AT_ENDPOINT ||
      "qwen3:8b"
  ),
  tools:{testTool}
});
