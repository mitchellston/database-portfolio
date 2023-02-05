import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "../../trpc";
import { prisma } from "../../../db";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
export const columnsRouter = createTRPCRouter({
  getColumns: publicProcedure
    .input(z.object({ id: z.string() }).required())
    .query(async ({ input }) => {
      return await prisma.column.findMany({
        where: {
          tableId: input.id,
        },
      });
    }),
  createColumn: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Er moet een naam zijn"),
        tableId: z.string().min(1),
        type: z.enum([
          "string",
          "number",
          "date",
          "boolean",
          "relation",
          "markdown",
          "image",
        ]),
        relationShip: z
          .object({
            type: z.enum(["one", "many"]),
            table: z.string().optional(),
          })
          .optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await prisma.tables
        .findFirstOrThrow({
          where: {
            id: input.tableId,
            userId: ctx.session.user.id,
          },
        })
        .catch(() => {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Table not found",
          });
        });
      const count = await prisma.column.count({
        where: {
          name: input.name,
          tableId: input.tableId,
        },
      });
      if (count > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Column already exists in this table",
        });
      }
      if (input.type === "relation") {
        if (
          !input.relationShip?.table ||
          !input.relationShip?.type ||
          input.relationShip.table == ""
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "RelationShip is required",
          });
        }
        if (input.relationShip.table === input.tableId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "RelationShip can't be the same table",
          });
        }
        return await prisma.column.create({
          data: {
            name: input.name,
            type: input.relationShip?.type,
            tableId: input.tableId,
            relationTo: input.relationShip?.table,
          },
        });
      }
      return await prisma.column.create({
        data: {
          name: input.name,
          type: input.type,
          tableId: input.tableId,
        },
      });
    }),
  deleteColumn: protectedProcedure
    .input(
      z
        .object({
          id: z.string(),
        })
        .required()
    )
    .mutation(async ({ input, ctx }) => {
      const column = await prisma.column
        .findFirstOrThrow({
          where: {
            id: input.id,
          },
          include: {
            table: true,
          },
        })
        .catch(() => {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Column not found",
          });
        });
      if (column.table.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });
      }
      return await prisma.column.delete({
        where: {
          id: column.id,
        },
      });
    }),
  updateColumn: protectedProcedure

    .input(
      z
        .object({
          id: z.string(),
          name: z.string().min(1, "Er moet een naam zijn"),
          type: z.string(),
        })
        .required()
    )
    .mutation(async ({ input, ctx }) => {
      const column = await prisma.column
        .findFirstOrThrow({
          where: {
            id: input.id,
          },
          include: {
            table: true,
          },
        })
        .catch(() => {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Column not found",
          });
        });
      if (column.table.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });
      }
      return await prisma.column.update({
        where: {
          id: column.id,
        },
        data: {
          name: input.name,
          type: input.type,
        },
      });
    }),
});
