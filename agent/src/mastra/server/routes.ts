import { indexerHandler } from "./routes/indexer";
import { ingestSourcesHandler } from "./routes/ingest";
import { searchHandler } from "./routes/query";
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
  {
    method: 'POST',
    path: '/api/tools/query',
    handler: searchHandler,
  },
];
