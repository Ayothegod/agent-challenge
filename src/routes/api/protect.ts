import { auth } from "@/util/auth";
import { prisma } from "@/util/prisma";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/protect")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        // const session = await auth.api.getSession({
        //   headers: request.headers,
        // });
        // console.log(session);
        const users = await prisma.indexedChunk.findMany({})
        console.log(users);

        return new Response("Hello, World!");
      },
    },
  },
});
