import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/util/middleware/authMiddleware";

// Run cache

export const requireAuth = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    return context.session?.user;
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

  