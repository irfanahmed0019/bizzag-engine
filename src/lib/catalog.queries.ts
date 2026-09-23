import { queryOptions } from "@tanstack/react-query";
import {
  getContactContent,
  getHomeContent,
  getCategories,
  getSiteSettings,
  listProducts,
  adminListProducts,
  adminListRequests,
  adminListMessages,
  adminGetStats,
} from "./catalog.functions";

export const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: () => listProducts(),
  staleTime: 5 * 60_000,
  gcTime: 30 * 60_000,
});

export const contactQuery = queryOptions({
  queryKey: ["site-content", "contact"],
  queryFn: () => getContactContent(),
  staleTime: 5 * 60_000,
  gcTime: 30 * 60_000,
});

export const homeQuery = queryOptions({
  queryKey: ["site-content", "home"],
  queryFn: () => getHomeContent(),
  staleTime: 5 * 60_000,
  gcTime: 30 * 60_000,
});

export const categoriesQuery = queryOptions({
  queryKey: ["site-content", "categories"],
  queryFn: () => getCategories(),
  staleTime: 5 * 60_000,
  gcTime: 30 * 60_000,
});

export const settingsQuery = queryOptions({
  queryKey: ["site-content", "settings"],
  queryFn: () => getSiteSettings(),
  staleTime: 5 * 60_000,
  gcTime: 30 * 60_000,
});


// Admin data: fail fast instead of spinning forever on a cold serverless start.
const adminOpts = { staleTime: 0, retry: 1, retryDelay: 800 } as const;

export const adminProductsQuery = queryOptions({
  queryKey: ["admin", "products"],
  queryFn: () => adminListProducts(),
  ...adminOpts,
});

export const adminRequestsQuery = queryOptions({
  queryKey: ["admin", "requests"],
  queryFn: () => adminListRequests(),
  ...adminOpts,
});

export const adminMessagesQuery = queryOptions({
  queryKey: ["admin", "messages"],
  queryFn: () => adminListMessages(),
  ...adminOpts,
});

export const adminStatsQuery = queryOptions({
  queryKey: ["admin", "stats"],
  queryFn: () => adminGetStats(),
  ...adminOpts,
});
