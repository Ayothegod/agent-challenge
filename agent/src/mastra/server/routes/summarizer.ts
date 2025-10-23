import { Context } from "hono";
import { summarizerTool } from "../../tools/summarizer";
import { safeErrorMessage } from "../util/safeErrorMessage";


export const summarizerHandler = async (c: Context) => {
  try {
    const body = await c.req.json();

    const summarizerResponse = await summarizerTool.execute({
      context: { chunks: body.chunks },
      runtimeContext: {} as any,
    });

    return c.json(
      { msg: "workflow.summarizer.completed",  summarizerResponse},
      200
    );
  } catch (err) {
    return c.json({ error: safeErrorMessage(err) }, 500);
  }
};
