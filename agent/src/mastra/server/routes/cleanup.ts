import { Context } from "hono";
import { indexerTool } from "../../tools/indexer-tool";
import { safeErrorMessage } from "../util/safeErrorMessage";
import { store } from "../util/services";


export const cleanupHandler = async (c: Context) => {
  try {
    // const body = await c.req.json();

    return c.json({ msg: "cleanup.completed" }, 200);
  } catch (err) {
    return c.json({ error: safeErrorMessage(err) }, 500);
  }
};


