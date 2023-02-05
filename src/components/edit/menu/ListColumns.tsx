import type { Column, Tables } from "@prisma/client";
import type { NextPage } from "next/types";
import { useState } from "react";
import { api } from "../../../utils/api";
import Loading from "../../utils/loading";
import Colunn from "./column";
import { CreateColumn } from "./createColumn";
import EditData from "./createData";
type propsFetch = {
  table: Tables;
  userId: string;
};
const Fetch: NextPage<propsFetch> = (props) => {
  const columns = api.portfolio.columns.getColumns.useQuery({
    id: props.table.id,
  });
  if (columns.isLoading) return <Loading />;
  if (columns.error) return <div>{columns.error.message}</div>;
  return (
    <List userId={props.userId} table={props.table} columns={columns.data} />
  );
};
export default Fetch;
type propsList = {
  table: Tables;
  columns: Column[];
  userId: string;
};
const List: NextPage<propsList> = (props) => {
  const [ListColumns, setListColumns] = useState<Column[]>(props.columns);

  return (
    <>
      {ListColumns.map((column, index) => {
        return <Colunn column={column} userId={props.userId} key={index} />;
      })}

      <CreateColumn
        userId={props.userId}
        onCreate={(column) => {
          setListColumns([...ListColumns, column]);
          return;
        }}
        tableId={props.table.id}
      />
      <hr />
      <EditData columns={ListColumns} tableID={props.table.id} />
    </>
  );
};
