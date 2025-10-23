import { createTool } from "@mastra/core/tools";
import { SummarizerOutputSchema, UnifiedDocsSchema } from "../types/index";
import { summarizerTool } from "./summarizer";
import z from "zod";

import { MongoDBVector } from '@mastra/mongodb'
 
// const store = new MongoDBVector({
//   uri: process.env.MONGODB_URI as string,
//   dbName: process.env.MONGODB_DATABASE as string
// })
// await store.createIndex({
//   indexName: "myCollection",
//   dimension: 1536,
// });
// await store.upsert({
//   indexName: "myCollection",
//   vectors: embeddings,
//   metadata: chunks.map(chunk => ({ text: chunk.text })),
// });

export const indexerTool = createTool({
  id: "indexer-tool",
  description:
    "Generate embeddings for enriched chunks and store in vector DB + Postgres.",
  inputSchema: SummarizerOutputSchema,
  // outputSchema: SummarizerOutputSchema,
    outputSchema: z.object({
    status: z.string(),
    indexed: z.number(),
    skipped: z.number(),
    errors: z.array(z.string()),
  }),
  execute: async ({ context }) => {
    const chunks = context;
    const results = [];
    const errors: string[] = [];

//     (const chunk of chunks) {
//       try {
//       //         let textToEmbed = summarizedChunk.summary;
//       // if (!textToEmbed) textToEmbed = summarizedChunk.canonicalTitle;
//       // embedSummaryTexts.push(textToEmbed);
//         const textToEmbed = chunk.summary || chunk.content;

//         // generate embedding with embedSummaryTexts
//         const embedding = await embedder.embed(textToEmbed);

// //         const { embeddings } = await embedMany({
// //   values: chunks.map((chunk) => chunk.text),
// //   model: openai.embedding("text-embedding-3-small"),
// // });
 
// // // 4. Store in vector database
// // const pgVector = new PgVector({
// //   connectionString: process.env.POSTGRES_CONNECTION_STRING,
// // });
// // await pgVector.upsert({
// //   indexName: "embeddings",
// //   vectors: embeddings,
// // }); // using an index name of 'embeddings'
 
// // // 5. Query similar chunks
// // const results = await pgVector.query({
// //   indexName: "embeddings",
// //   queryVector: queryVector,
// //   topK: 3,
// // }); // queryVector is the embedding of the query
 
// // console.log("Similar chunks:", results);

//         // Upsert embedding to vector db along with metadata (id, vector, metadata, tags, bullets)
//         await vectorDb.upsert({
//           id: chunk.id,
//           values: embedding,
//           metadata: {
//             title: chunk.canonicalTitle,
//             tags: chunk.tags,
//             source: chunk.source,
//           },
//         });

//         // persist summarizedChunk in postgres DB
//         await prisma.indexedChunks.upsert({
//           where: { id: chunk.id },
//           update: {
//             canonicalTitle: chunk.canonicalTitle,
//             tags: chunk.tags,
//             entities: chunk.entities,
//             summary: chunk.summary,
//             source: chunk.source,
//           },
//           create: {
//             id: chunk.id,
//             canonicalTitle: chunk.canonicalTitle,
//             tags: chunk.tags,
//             entities: chunk.entities,
//             summary: chunk.summary,
//             source: chunk.source,
//           },
//         });

//         results.push(chunk.id);
//       } catch (err: any) {
//         console.error("Indexing failed for chunk:", chunk.id, err);
//         errors.push(chunk.id);
//       }
//     }

    return {
      status: errors.length ? "partial" : "success",
      indexed: results.length,
      skipped: errors.length,
      errors,
    };
  },
});
