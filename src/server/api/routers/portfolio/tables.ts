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
    .input(z.object({ id: z.string().nullable(), page: z.string() }).required())
    .output(
      z.array(
        z.object({
          name: z.string(),
          position: z.object({ top: z.number(), left: z.number() }),
        })
      )
    )
    .query(async ({ input }) => {
      const where =
        input.id === null
          ? { pageId: input.page }
          : {
              id: input.id,
              pageId: input.page,
            };

      const tables = await prisma.tables.findMany({
        where: where,
        select: {
          name: true,
          left: true,
          top: true,
        },
      });
      return tables
        .filter((table) => table.name !== null)
        .map((table) => ({
          position: { top: table.top, left: table.left },
          name: table.name,
        }));
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
        .count({ where: { name: input.name, userId: ctx.session.user.id } })
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
  updateTable: protectedProcedure
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
        })
        .catch(() => {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Unauthorized",
          });
        });
      const count = await prisma.tables
        .count({ where: { name: input.name, userId: ctx.session.user.id } })
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
});
