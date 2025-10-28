import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/util/middleware/authMiddleware";

// Run cache

export const requireAuth = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    return context.session?.user;
  });

// const {
//   data: session,
//   isPending,
//   error: sessionError, //error object
//   refetch, //refetch the session
// } = authClient.useSession();
// console.log(session, sessionError);
