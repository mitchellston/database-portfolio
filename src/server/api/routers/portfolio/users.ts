import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../../trpc";
import { prisma } from "../../../db";
import { TRPCError } from "@trpc/server";

export const usersRouter = createTRPCRouter({
  getUser: publicProcedure
    .input(z.object({ id: z.string() }))

    .query(async ({ input }) => {
      const user = await prisma.user
        .findFirstOrThrow({
          where: { id: input.id },
          select: { name: true, tables: true, displayName: true },
          // cacheStrategy: { swr: 60, ttl: 60 },
        })
        .catch(() => {
          throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
        });

      return {
        name: user.displayName != null ? user.displayName : user.name,
        tables: user.tables,
      };
    }),
});
