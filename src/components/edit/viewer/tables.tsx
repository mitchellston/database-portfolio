import type { Tables } from "@prisma/client";
import type { NextPage } from "next/types";
import { useState } from "react";
import { api } from "../../../utils/api";
import Dragable from "../../utils/dragable";
import SetType from "../setType";

type props = {
  table: Tables;
  userId: string;
};
const Table: NextPage<props> = (props) => {
  const [position, setPosition] = useState({
    x: props.table.top,
    y: props.table.left,
  });

  const columns = api.portfolio.columns.getColumns.useQuery({
    id: props.table.id,
  });
  const updatePosition = api.portfolio.tables.updateTablePosition.useMutation();
  if (columns.isLoading) return null;
  if (columns.isError) return null;

  return (
    <>
      <Dragable
        onStop={(data) => {
          console.log(data);
          if (!data) return;
          if (position.y == data.y && position.x == data.x) return;
          if (props.table.top == data.x && props.table.left == data.y) return;
          if (data.x < 0 || data.y < 0) {
            setPosition({ x: position.x, y: position.y });
            return;
          }
          updatePosition.mutate({
            id: props.table.id,
            position: { top: data.x, left: data.y },
          });
          setPosition({ x: data.x, y: data.y });
        }}
        position={{ x: props.table.top, y: props.table.left }}
      >
        <div className="absolute flex h-min w-min cursor-move flex-col rounded-lg bg-white shadow-lg dark:bg-slate-800">
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
                      relationTo={column.relationShipTableId as string}
                      type={column.type}
                      userId={props.userId}
                    />
                  </p>
                );
              })}
            </div>
            <div className="fromTEST flex flex-col">
              {columns.data?.map((column, index) => {
                return (
                  <>
                    <p key={index} className={`text-slate-900 dark:text-white`}>
                      {column.name}
                    </p>
                  </>
                );
              })}
            </div>
          </div>
        </div>
      </Dragable>
    </>
  );
};
export default Table;
