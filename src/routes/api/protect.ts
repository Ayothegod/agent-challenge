import { auth } from "@/util/auth";
import prisma from "@/util/prisma";
import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";

// POST /upload — upload doc → emits event.
// GET /query?q= — query the brain.
// GET /logs — agent logs.
// GET /graph — data graph snapshot.
// Add JWT auth + rate limiting + role control later.

export const Route = createFileRoute("/api/protect")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const session = await auth.api.getSession({
          headers: request.headers,
        });
        console.log(session);

        return json(session);
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
