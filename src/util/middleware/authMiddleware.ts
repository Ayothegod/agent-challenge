import { createMiddleware } from "@tanstack/react-start";
import { auth } from "../auth";

export const authMiddleware = createMiddleware({ type: "request" }).server(
  async ({ next, request }) => {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const result = await next({
      context: { session },
    });
    return result;
  }
);
