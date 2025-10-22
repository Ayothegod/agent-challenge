// src/mastra/server/routes/ingest.ts
import { httpStatus } from "../util/constants";
import { safeErrorMessage } from "../util/safeErrorMessage";
import { Context } from "hono";

interface Source {
  source: "pdf" | "docx" | "csv"; // "email" | "notion" | "drive"
}

export const ingestSourcesHandler = async (c: Context) => {
  try {
    const { source } = c.req.param();
    const body = await c.req.parseBody();
    // const body = await c.req.json();

    const file = body["file"];

    if (!(file instanceof File)) {
      return c.json(
        {
          error: safeErrorMessage(
            "No file to ingest, choose a file and try again!"
          ),
        },
        500
      );
    }

    const buffer = await file.arrayBuffer();
    console.log({buffer});
    

    // const { ingestSources } = await import('../../tools/ingest-sources');
    // const result = await ingestSources.execute({
    //   context: { sources, files, namespace, allowInsecureTLS },
    // });

    return c.json({ result: "Result" });
  } catch (err) {
    return c.json({ error: safeErrorMessage(err) }, 500);
  }
};
