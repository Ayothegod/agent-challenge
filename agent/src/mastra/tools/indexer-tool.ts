import { createTool } from "@mastra/core/tools";
import { UnifiedDocsSchema } from "../types/index";
import { summarizerTool } from "./summarizer";

export const indexerTool = createTool({
  id: "indexer-tool",
  description: "Get Unified docs from extract API and send to other tools.",
  inputSchema: UnifiedDocsSchema,
  outputSchema: UnifiedDocsSchema,
  execute: async ({ context }) => {

    const summarizerResponse = await summarizerTool.execute({
      context: { chunks: context },
      runtimeContext: {} as any,
    });

    return context;
  },
});
