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
// beforeLoad: ({ context }) => {
//   // if (!context.) {
//   //   throw new Error('Not authenticated')
//   // }
// },
// errorComponent: ({ error }) => {
//   if (error.message === "Not authenticated") {
//     return <p>Hello</p>;
//   }

//   throw error;
// },
// loader: async () => {
//   const user = await requireAuth();
//   return user;
// },

// async function logout() {
//   await authClient.signOut({
//     fetchOptions: {
//       onSuccess: () => {
//         router.navigate({ to: "/auth/login" });
//       },
//     },
//   });
// }
