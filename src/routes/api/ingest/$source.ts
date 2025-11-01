import { indexerTool } from "@/mastra/tools/indexer-tool";
import { UnifiedDoc } from "@/mastra/types";
import { connectors } from "@/module/ingest/transform";
import { httpStatus } from "@/util/constants";
import { authMiddleware } from "@/util/middleware/authMiddleware";
import { ApiError } from "@/util/services";
import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";

export const Route = createFileRoute("/api/ingest/$source")({
  server: {
    middleware: [authMiddleware],
    handlers: {
      POST: async ({ request, params, context }) => {
        try {
          const { source } = params;
          const formData = await request.formData();

          const file = formData.get("file");
          const user = context.session?.user;

          if (!user)
            throw new ApiError(
              httpStatus.unauthorized,
              "You are not logged in, not authorized!"
            );

          if (!(file instanceof File))
            throw new ApiError(
              httpStatus.badRequest,
              "No file to ingest, choose a file and try again!"
            );

          if (source !== file.name.split(".")[1])
            throw new ApiError(
              httpStatus.forbidden,
              "File type not the same as connector option!"
            );

          const connector = connectors[source as keyof typeof connectors];
          if (!connector)
            throw new ApiError(
              httpStatus.badRequest,
              "No such connector exists, pick a valid connector to get started."
            );

          const result = (await connector(file)) as UnifiedDoc[];

          const body = { chunks: result, userId: user.id };

          const toolResult = await indexerTool.execute({
            context: body,
            runtimeContext: {} as any,
          });

          return json(
            { msg: "workflow.completed", toolResult },
            { status: httpStatus.ok }
          );
        } catch (err) {
          console.log(err);
          if (err instanceof ApiError)
            return json(err.message, { status: err.statusCode });

          return json("Unknown error! please try again.", {
            status: httpStatus.internalServerError,
          });
        }
      },
    },
  },
});
