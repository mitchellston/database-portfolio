import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc";
import { prisma } from "../../../db";
import { TRPCError } from "@trpc/server";

export const tablesRouter = createTRPCRouter({
  getTable: publicProcedure
    .input(
      z
        .object({ id: z.string().nullable().optional(), page: z.string() })
        .required()
    )
    .query(async ({ input }) => {
      const where =
        input.id === null
          ? { userId: input.page }
          : {
              id: input.id,
              userId: input.page,
            };

      const tables = await prisma.tables.findMany({
        where: where,
        cacheStrategy: { swr: 60, ttl: 60 },
      });
      return tables;
    }),
  createTable: protectedProcedure
    .input(
      z
        .object({
          name: z.string().min(1, "Er moet een naam zijn"),
          position: z.object({ top: z.number(), left: z.number() }),
        })
        .required()
    )
    .mutation(async ({ input, ctx }) => {
      const count = await prisma.tables
        .count({
          where: { name: input.name, userId: ctx.session.user.id },
          cacheStrategy: { swr: 60, ttl: 60 },
        })
        .catch(() => {
          return null;
        });
      if (count == null) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
      if (count > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Table already exists",
        });
      }
      return await prisma.tables.create({
        data: {
          name: input.name,
          left: input.position.left,
          top: input.position.top,
          userId: ctx.session.user.id,
        },
      });
    }),
  deleteTable: protectedProcedure
    .input(
      z
        .object({
          id: z.string(),
        })
        .required()
    )
    .mutation(async ({ input, ctx }) => {
      const table = await prisma.tables
        .findFirstOrThrow({
          where: {
            id: input.id,
            userId: ctx.session.user.id,
          },
          cacheStrategy: { swr: 60, ttl: 60 },
        })
        .catch(() => {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Unauthorized",
          });
        });

      return await prisma.tables.delete({
        where: {
          id: table.id,
        },
      });
    }),
  updateTableName: protectedProcedure
    .input(
      z
        .object({
          id: z.string(),
          name: z.string().min(1, "Er moet een naam zijn"),
        })
        .required()
    )
    .mutation(async ({ input, ctx }) => {
      const table = await prisma.tables
        .findFirstOrThrow({
          where: {
            id: input.id,
            userId: ctx.session.user.id,
          },
          cacheStrategy: { swr: 60, ttl: 60 },
        })
        .catch(() => {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Unauthorized",
          });
        });

      const count = await prisma.tables
        .count({
          where: { name: input.name, userId: ctx.session.user.id },
          cacheStrategy: { swr: 60, ttl: 60 },
        })
        .catch(() => {
          return null;
        });
      if (count == null) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
      if (count > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Table already exists",
        });
      }
      return await prisma.tables.update({
        where: {
          id: table.id,
        },
        data: {
          name: input.name,
        },
      });
    }),
  updateTablePosition: protectedProcedure
    .input(
      z
        .object({
          id: z.string(),
          position: z.object({ top: z.number(), left: z.number() }),
        })
        .required()
    )
    .mutation(async ({ input, ctx }) => {
      const table = await prisma.tables
        .findFirstOrThrow({
          where: {
            id: input.id,
            userId: ctx.session.user.id,
          },
          cacheStrategy: { swr: 60, ttl: 60 },
        })
        .catch(() => {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Unauthorized",
          });
        });

      return await prisma.tables.update({
        where: {
          id: table.id,
        },
        data: {
          left: input.position.left,
          top: input.position.top,
        },
      });
    }),
});
