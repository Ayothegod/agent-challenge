import { indexerHandler } from "./routes/indexer";
import { ingestSourcesHandler } from "./routes/ingest";
import { summarizerHandler } from "./routes/summarizer";

const rootRoute = {
  method: "GET",
  path: "/api/get",
  // handler: (c: any) => c.text('OK'),
  handler: async (c: any) => {
    return c.text("OK");
  },
};

export const apiRoutes: Array<any> = [
  rootRoute,
  {
    method: "POST",
    path: "/api/tools/ingest/:source",
    handler: ingestSourcesHandler,
  },
  {
    method: "POST",
    path: "/api/tools/indexer",
    handler: indexerHandler,
  },
  {
    method: "POST",
    path: "/api/tools/summarizer",
    handler: summarizerHandler,
  },
  // upload.single("file"),
  // {
  //   method: 'POST',
  //   path: '/api/tools/searchDocs',
  //   // handler: searchDocsHandler,
  // },
];
