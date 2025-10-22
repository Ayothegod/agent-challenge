import { ingestSourcesHandler } from "./routes/ingest";

const rootRoute = {
  method: 'GET',
  path: '/api/get',
  // handler: (c: any) => c.text('OK'),
  handler: async(c: any) => {

    const agent = await fetch("http://localhost:4111/api/agents/orchestratorAgent").then(res => res.json())
    console.log(agent);

    return c.text('OK')
  }

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