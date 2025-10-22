// src/mastra/server/routes/ingest.ts
import { httpStatus } from "../util/constants";
import { safeErrorMessage } from "../util/safeErrorMessage";
import { Context } from "hono";
import { ApiError, ApiResponse } from "../util/services";
import { connectors } from "../module/ingest/transform";
import { ingestTool } from "../../tools/ingest-tool";
import { UnifiedDoc } from "../../types";
import { RuntimeContext } from "@mastra/core/runtime-context";

interface Source {
  source: "pdf" | "docx" | "csv"; // "email" | "notion" | "drive"
}

const runtimeContext = new RuntimeContext();

export const ingestSourcesHandler = async (c: Context) => {
  try {
    const source = c.req.param("source");
    const body = await c.req.parseBody();

    const file = body["file"];

    if (!(file instanceof File)) {
      return c.json(
        { error: "No file to ingest, choose a file and try again!" },
        500
      );
    }

    if (source !== file.name.split(".")[1])
      return c.json(
        { error: "File type not the same as connector option!" },
        400
      );

    const connector = connectors[source as keyof typeof connectors];
    if (!connector)
      c.json(
        {
          error:
            "No such connector exists, pick a valid connector to get started.",
        },
        404
      );

    const result = (await connector(file)) as UnifiedDoc[];

    const toolResult = await ingestTool.execute({
      context: result,
      runtimeContext,
    });

    // console.log({ toolResult });

    return c.json({ msg: "workflow.extract.completed", result }, 200);
  } catch (err) {
    return c.json({ error: safeErrorMessage(err) }, 500);
  }
};
