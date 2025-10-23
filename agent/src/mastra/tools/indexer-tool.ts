import { createTool } from "@mastra/core/tools";
import { SummarizerOutputSchema, UnifiedDocsSchema } from "../types/index";
import { summarizerTool } from "./summarizer";

export const indexerTool = createTool({
  id: "indexer-tool",
  description: "Get Unified docs from extract API and send to other tools.",
  inputSchema: SummarizerOutputSchema,
  outputSchema: SummarizerOutputSchema,
  execute: async ({ context }) => {

    // NOTE: Embedder → Generates numerical vectors from text.
    // NOTE: Vector Store → Stores and indexes those embeddings for retrieval.
    // NOTE: Relational DB Layer (Postgres) → Keeps canonical chunk metadata.

    // const summarizerResponse = await summarizerTool.execute({
    //   context: { chunks: context },
    //   runtimeContext: {} as any,
    // });

    return context;
  },
});
