import { ApiError } from "@/util/services";
import { createFileRoute } from "@tanstack/react-router";

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
            { status: 200 }
          );
        } catch (error) {
          throw new ApiError(500, "Unknown error!");
        }
      },
    },
  },
});
