import { Agent } from "@mastra/core/agent";
import { stockPrices } from "../tools/stockPrices";
import { createOllama } from "ollama-ai-provider-v2";

export const ollama = createOllama({
  baseURL: process.env.NOS_OLLAMA_API_URL || process.env.OLLAMA_API_URL,
});

export const stockAgent = new Agent({
  name: "Stock Agent",
  instructions: `You are a helpful assistant that provides current stock price. `,
  model: ollama(
    process.env.NOS_MODEL_NAME_AT_ENDPOINT ||
      process.env.MODEL_NAME_AT_ENDPOINT ||
      "qwen3:8b"
  ),
  tools: { stockPrices: stockPrices },
  // memory: new Memory({
  //   storage: new LibSQLStore({
  //     url: "file:../mastra.db", // path is relative to the .mastra/output directory
  //   }),
  // }),
});
