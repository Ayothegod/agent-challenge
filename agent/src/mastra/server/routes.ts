// src/mastra/server/routes.ts

import { ingestSourcesHandler } from "./routes/ingest";

// import { ingestSourcesHandler } from './routes/ingest';
// import { searchDocsHandler } from './routes/searchDocs';

// Optional, handy for quick checks in browser or health probes
const rootRoute = {
  method: 'GET',
  path: '/api/get',
  handler: (c: any) => c.text('OK'),
};

export const apiRoutes: Array<any> = [
  rootRoute,
  {
    method: 'POST',
    path: '/api/tools/ingest/:source',
    handler: ingestSourcesHandler,
  },

  // upload.single("file"),
  // {
  //   method: 'POST',
  //   path: '/api/tools/searchDocs',
  //   // handler: searchDocsHandler,
  // },
];