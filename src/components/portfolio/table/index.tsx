import type { Tables } from "@prisma/client";
import type { NextPage } from "next/types";
import { api } from "../../../utils/api";
import SetType from "../../edit/setType";

type props = {
  table: Tables;
  userId: string;
};
const Table: NextPage<props> = (props) => {
  const columns = api.portfolio.columns.getColumns.useQuery({
    id: props.table.id,
  });

  if (columns.isLoading) return null;
  if (columns.isError) return null;
  return (
    <div
      style={{
        transform: `translate(${props.table.top}px, ${props.table.left}px)`,
      }}
      className="absolute flex h-min w-min cursor-pointer flex-col rounded-lg bg-white shadow-lg dark:bg-slate-800"
    >
      <div>
        <h1 className="pt-2 text-center text-xl font-bold text-slate-900 dark:text-white">
          {props.table.name}
        </h1>
        <hr />
      </div>
      <div className="flex w-max flex-row space-x-4 p-4 pt-0">
        <div className="flex flex-col">
          {columns.data?.map((column, index) => {
            return (
              <p key={index} className="text-slate-900 dark:text-white">
                <SetType
                  relationTo={column.relationTo}
                  type={column.type}
                  userId={props.userId}
                />
              </p>
            );
          })}
        </div>
        <div className="flex flex-col">
          {columns.data?.map((column, index) => {
            return (
              <p key={index} className="text-slate-900 dark:text-white">
                {column.name}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default Table;
