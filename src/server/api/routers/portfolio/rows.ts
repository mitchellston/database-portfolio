import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import { prisma } from "../../../db";
import { TRPCError } from "@trpc/server";
import type { Rows } from "@prisma/client";
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
        console.log(columns);
        // return a object with the columns id and a array of rows data
        const rows: { columnId: string; rows: Rows[] }[] = [];
        for (const column of columns) {
          await prisma.rows
            .findMany({
              where: { columnId: column.id },
            })
            .then((data) => {
              rows.push({ columnId: column.id, rows: data });
            })
            .catch((err) => {
              console.log(err);
            });
        }
        return rows;
      } catch (error) {
        console.log(error);
      }
    }),
});
