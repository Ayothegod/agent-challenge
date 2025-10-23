import { Context } from "hono";
import { indexerTool } from "../../tools/indexer-tool";
import { safeErrorMessage } from "../util/safeErrorMessage";


export const indexerHandler = async (c: Context) => {
  try {
    const body = await c.req.json();

    const toolResult = await indexerTool.execute({
      context: body,
      runtimeContext: {} as any,
    });

    return c.json({ msg: "workflow.indexer.completed", toolResult }, 201);
  } catch (err) {
    return c.json({ error: safeErrorMessage(err) }, 500);
  }
};


