// It handles retrieval, ranking, prompt assembly, and answer generation.
// The query → turned into a vector
// Vector store finds top-k most similar chunks (say 3–5)
// Backend merges those chunks’ text (and maybe adjacent ones)
// The merged text is sent as context to your agent/LMM

import { createTool } from "@mastra/core/tools";
import { UnifiedDocsSchema } from "../types/index";
import { summarizerTool } from "./summarizer";

export const Tool = createTool({
  id: "ingest-tool",
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
