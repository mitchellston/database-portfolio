import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "../../trpc";
import { prisma } from "../../../db";
import { TRPCError } from "@trpc/server";
import type { Column, Rows } from "@prisma/client";

export const dataRouter = createTRPCRouter({
  getRows: publicProcedure
    .input(
      z
        .object({
          columnID: z.string().nullable().optional(),
          tableID: z.string(),
        })
        .required()
    )
    .query(async ({ input }) => {
      try {
        const tables = await prisma.tables
          .findFirst({
            where: {
              id: input.tableID,
            },
          })
          .catch(() => {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Table not found",
            });
          });
        if (!tables)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Table not found",
          });
        const where =
          input.columnID === null
            ? { tableId: tables.id }
            : { id: input.columnID, tableId: tables.id };
        const columns = await prisma.column.findMany({
          where: where,
        });
        // return a object with the columns id and a array of rows data
        const rows: { columnId: string; column: Column; rows: Rows[] }[] = [];
        for (const column of columns) {
          await prisma.rows
            .findMany({
              where: { columnId: column.id },
            })
            .then((data) => {
              rows.push({ columnId: column.id, column: column, rows: data });
            })
            .catch(() => {
              return;
            });
        }
        return rows;
      } catch (error) {
        console.log(error);
      }
    }),
  createRow: protectedProcedure
    .input(
      z.object({
        tableId: z.string(),
        data: z.array(z.object({ columnId: z.string(), data: z.string() })),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const table = await prisma.tables
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
      let columns = await prisma.column.findMany({
        where: {
          tableId: table.id,
          NOT: {
            type: {
              in: ["many", "one"],
            },
          },
        },
      });

      for (const column of input.data) {
        if (!columns.find((c) => c.id === column.columnId)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Column not found  ",
          });
        }
      }
      if (columns.length !== input.data.length)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Not all columns are filled expected ${columns.length} got ${input.data.length} `,
        });
      //generate row id
      let rowId = "";
      while (rowId == "") {
        const id =
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15);
        await prisma.rows
          .findFirstOrThrow({
            where: {
              rowId: id,
              column: {
                tableId: table.id,
              },
            },
          })
          .catch(() => {
            rowId = id;
          });
      }
      columns = await prisma.column.findMany({
        where: {
          tableId: table.id,
        },
      });
      const newRows: { columnId: string; column: Column; rows: Rows }[] = [];
      for (const row of input.data) {
        columns = columns.filter((c) => c.id !== row.columnId);
        newRows.push({
          rows: await prisma.rows.create({
            data: {
              rowId: rowId,
              data: row.data,
              columnId: row.columnId,
            },
          }),
          columnId: row.columnId,
          column: (await prisma.column.findFirst({
            where: {
              id: row.columnId,
            },
          })) as Column,
        });
      }
      for (const column of columns) {
        if (column.type != "many" && column.type != "one") continue;
        newRows.push({
          rows: await prisma.rows.create({
            data: {
              rowId: rowId,
              data: `[${
                column.name
              }](https://portfolio-msteenwijk-livenl.vercel.app/portfolio/${
                ctx.session.user.id
              }/${column.relationShipTableId as string}/)`,
              columnId: column.id,
            },
          }),
          columnId: column.id,
          column: column,
        });
      }
      return newRows;
    }),
  deleteRow: protectedProcedure
    .input(
      z.object({
        tableId: z.string(),
        rowId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // check if table exists
      const table = await prisma.tables
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
      // get columns without many and one
      const columns = await prisma.column.findMany({
        where: {
          tableId: table.id,
          NOT: {
            type: {
              in: ["many", "one"],
            },
          },
        },
      });
      // check if row exists
      const row = await prisma.rows.findMany({
        where: {
          rowId: input.rowId,
          columnId: {
            in: columns.map((c) => c.id),
          },
        },
      });
      if (row.length != columns.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Row not found",
        });
      }
      // delete row
      await prisma.rows.deleteMany({
        where: {
          rowId: input.rowId,
          columnId: {
            in: columns.map((c) => c.id),
          },
        },
      });
      return input.rowId;
    }),
});
