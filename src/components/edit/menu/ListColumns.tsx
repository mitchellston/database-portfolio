import type { Column, Tables } from "@prisma/client";
import type { NextPage } from "next/types";
import { useState } from "react";
import { api } from "../../../utils/api";
import Loading from "../../utils/loading";
import { CreateColumn } from "./createColumn";
type propsFetch = {
  table: Tables;
};
const Fetch: NextPage<propsFetch> = (props) => {
  const columns = api.portfolio.columns.getColumns.useQuery({
    id: props.table.id,
  });
  if (columns.isLoading) return <Loading />;
  if (columns.error) return <div>{columns.error.message}</div>;
  return <List table={props.table} columns={columns.data} />;
};
export default Fetch;
type propsList = {
  table: Tables;
  columns: Column[];
};
const List: NextPage<propsList> = (props) => {
  const [ListColumns, setListColumns] = useState<Column[]>(props.columns);

  return (
    <>
      {ListColumns.map((column) => {
        return (
          <button className="text-center" key={column.name}>
            <div className="flex">
              <div className="flex items-center justify-center text-gray-500">
                [{column.type.trim()}]{" "}
              </div>
              <div className="flex-grow overflow-x-auto">{column.name}</div>
              <div className="ml-2 flex items-center justify-center font-serif">
                &#x25B6;
              </div>
            </div>
          </button>
        );
      })}

      <CreateColumn
        onCreate={(column) => {
          setListColumns([...ListColumns, column]);
          return;
        }}
        tableId={props.table.id}
      />
    </>
  );
};
