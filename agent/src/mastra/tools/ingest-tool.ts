import { createTool } from "@mastra/core/tools";
import { UnifiedDocsSchema } from "../types/index";
import { summarizerTool } from "./summarizer";

export const ingestTool = createTool({
  id: "ingest-tool",
  description: "Get Unified docs from extract API and send to other tools.",
  inputSchema: UnifiedDocsSchema,
  outputSchema: UnifiedDocsSchema,
  execute: async ({ context }) => {
    console.log({ context });

    const commitsRes = await summarizerTool.execute({
      context: { chunks: context },
      runtimeContext: {} as any,
    });

    console.log({ commitsRes });

    return context;
  },
});
