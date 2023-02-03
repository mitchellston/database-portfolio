import { createTRPCRouter } from "./trpc";
import { portfolioRouters } from "./routers/portfolio/root";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  portfolio: portfolioRouters,
});

// export type definition of API
export type AppRouter = typeof appRouter;
