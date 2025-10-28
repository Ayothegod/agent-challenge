import { auth } from "@/util/auth";
import prisma from "@/util/prisma";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/protect")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const session = await auth.api.getSession({
            headers: request.headers
        })
        console.log(session);

        const users = await prisma.user.findMany({});
        console.log(users);
        

        return new Response("Hello, World!");
      },
      POST: async ({ request }) => {
        const users = await prisma.indexedChunk.create({
          data: {
            summary: "this ssk",
            canonicalTitle: "Canon hdja jh",
            source: "pdf.drunk",
            chunkId: "hello--jdks-le12",
            sourceType: "drunk",
            metadata: "{name: 'hello there'}",
            bullets: "hello, fire, strength",
            tags: "this the tags",
          },
        });
        console.log(users);

        return new Response("Hello, World!");
      },
    },
  },
});
