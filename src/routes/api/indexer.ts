import { httpStatus } from "@/util/constants";
import prisma from "@/util/prisma";
import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";

export const Route = createFileRoute("/api/indexer")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          // console.log(body);

          // const toolResult = await indexerTool.execute({
          //   context: body,
          //   runtimeContext: {} as any,
          // });
          const users = await prisma.indexedChunk.findMany({});
          console.log(users);

          return json(
            { msg: "workflow.indexer.completed", toolResult: "" },
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
