import { createRouter } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { routeTree } from "./routeTree.gen";
import { NotFound } from "./components/NotFound";
import { DefaultCatchBoundary } from "./components/DefaultCatchBoundary";

// Create a new router instance
export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: 'intent',
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
  })

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });

  return router;
};
