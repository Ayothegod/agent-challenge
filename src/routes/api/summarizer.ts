import { httpStatus } from "@/util/constants";
import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";

export const Route = createFileRoute("/api/summarizer")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          console.log(body);
          //     const summarizerResponse = await summarizerTool.execute({
          //       context: { chunks: body.chunks },
          //       runtimeContext: {} as any,
          //     });

          // { msg: "workflow.summarizer.completed",  summarizerResponse}

          return new Response(
            JSON.stringify({
              msg: "workflow.summarizer.completed",
              summarizerResponse: "",
            }),
            { status: httpStatus.ok }
          );
        } catch (error) {
          return json("Unknown error! please try again.", {
            status: httpStatus.internalServerError,
          });
        }
      },
    },
  },
});
