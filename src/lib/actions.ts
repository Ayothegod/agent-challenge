import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/util/middleware/authMiddleware";
import prisma from "@/util/prisma";

// Run cache
export const requireAuth = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    throw new Error("Unable to get context data");
    return context.session?.user;
  });

export const getDocumentNodes = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const documents = await prisma.indexedChunk.findMany({
      where: {},
    });
    return;
  });
