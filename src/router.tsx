import { QueryClient, dehydrate, hydrate } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    // Transfer loader data to the browser instead of fetching it again on hydration.
    dehydrate: () => ({ queryClientState: dehydrate(queryClient) }),
    hydrate: (state) => hydrate(queryClient, state.queryClientState),
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
