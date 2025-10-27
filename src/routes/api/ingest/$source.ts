// interface Source {
//   source: "pdf" | "docx" | "csv"; // "email" | "notion" | "drive"
// }

import { UnifiedDoc } from "@/mastra/types";
import { connectors } from "@/module/ingest/transform";
import { httpStatus } from "@/util/constants";
import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";

export const Route = createFileRoute("/api/ingest/$source")({
  server: {
    // middleware: [loggerMiddleware],
    handlers: {
      POST: async ({ request, params }) => {
        try {
          const { source } = params;
          const formData = await request.formData();

          const file = formData.get("file");

          if (!(file instanceof File))
            return json(
              { error: "No file to ingest, choose a file and try again!" },
              { status: httpStatus.badRequest }
            );

          if (source !== file.name.split(".")[1])
            return json(
              { error: "File type not the same as connector option!" },
              { status: httpStatus.forbidden }
            );

          const connector = connectors[source as keyof typeof connectors];
          if (!connector)
            return json(
              {
                error:
                  "No such connector exists, pick a valid connector to get started.",
              },
              { status: httpStatus.badRequest }
            );

          const result = (await connector(file)) as UnifiedDoc[];

          // const toolResult = await ingestTool.execute({
          //   context: result,
          //   runtimeContext: {} as any,
          // });

          return json(
            { msg: "workflow.extract.completed", result },
            { status: httpStatus.ok }
          );
        } catch (error) {
          console.log("Ingest Error: ", error);
          // throw new ApiError(500, "Unknown error! please try again.", )
          return json("Unknown error! please try again.", {
            status: httpStatus.internalServerError,
          });
        }
      },
    },
  },
});
