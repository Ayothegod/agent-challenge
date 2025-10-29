import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/util/middleware/authMiddleware";
import prisma from "@/util/prisma";

// Run cache

export const requireAuth = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    return context.session?.user;
  });

export const getDocumentNodes = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const documents = await prisma.indexedChunk.findMany({
      where: {}
    })
    return 
  });

// async function logout() {
//   await authClient.signOut({
//     fetchOptions: {
//       onSuccess: () => {
//         router.navigate({ to: "/auth/login" });
//       },
//     },
//   });
// }
