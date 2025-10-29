import { indexerTool } from "@/mastra/tools/indexer-tool";
import { httpStatus } from "@/util/constants";
import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";

export const Route = createFileRoute("/api/indexer")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();

          const toolResult = await indexerTool.execute({
            context: body,
            runtimeContext: {} as any,
          });

          return json(
            { msg: "workflow.indexer.completed", toolResult},
            { status: httpStatus.ok }
          );
        } catch (error) {
          console.log(error);
          
          return json("Unknown error! please try again.", {
            status: httpStatus.internalServerError,
          });
        }
      },
    },
  },
});
