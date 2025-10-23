import { RuntimeContext } from "@mastra/core/runtime-context";
import { Context } from "hono";
import { safeErrorMessage } from "../util/safeErrorMessage";
import { indexerTool } from "../../tools/indexer-tool";
import { summarizerTool } from "../../tools/summarizer";

const runtimeContext = new RuntimeContext();

export const summarizerHandler = async (c: Context) => {
  try {
    const body = await c.req.json();
    console.log(body);
    

    // const summarizerResponse = await summarizerTool.execute({
    //   context: { chunks: body },
    //   runtimeContext: {} as any,
    // });

    return c.json(
      { msg: "workflow.indexer.completed",  },
      201
    );
  } catch (err) {
    return c.json({ error: safeErrorMessage(err) }, 500);
  }
};
