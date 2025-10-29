import { auth } from "@/util/auth";
import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";

export const Route = createFileRoute("/api/protect")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const session = await auth.api.getSession({
          headers: request.headers,
        });

        return json(session);
      },
      POST: async ({ }) => {
        return new Response("Hello, World!");
      },
    },
  },
});
