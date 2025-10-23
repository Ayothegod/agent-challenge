// src/mastra/server/routes/searchDocs.ts
import { queryTool } from "../../tools/query-tool";
import { safeErrorMessage } from "../util/safeErrorMessage";

export const searchHandler = async (c: any) => {
  try {
    const body = await c.req.json();
    if (!body)
      return c.json(
        { error: "Question is required to query knowledge system." },
        400
      );

    const queryResult = await queryTool.execute({
      context: body,
      runtimeContext: {} as any,
    });

    return c.json({ msg: "workflow.query.completed", queryResult }, 200);
  } catch (err) {
    return c.json({ error: safeErrorMessage(err) }, 500);
  }
};
