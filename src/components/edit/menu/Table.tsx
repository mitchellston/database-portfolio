import type { Tables } from "@prisma/client";
import type { NextPage } from "next/types";
import { useState } from "react";
import { api } from "../../../utils/api";
import List from "./ListColumns";

type TableProps = {
  table: Tables;
  onError?: (error: string) => void;
  userId: string;
};
const Table: NextPage<TableProps> = (props) => {
  const [tableInfo, setTableInfo] = useState<boolean | undefined>(false);
  const [rename, setRename] = useState<string | null>(null);
  const [name, setName] = useState<string>(props.table.name);
  const deleteTable = api.portfolio.tables.deleteTable.useMutation({
    onError: (error) => {
      if (props.onError) props.onError(error.message);
    },
  });
  const renameTable = api.portfolio.tables.updateTableName.useMutation({
    onError: (error) => {
      if (props.onError) props.onError(error.message);
    },
  });
  return tableInfo == undefined ? null : (
    <div
      key={props.table.id}
      className="mb-2 flex flex-col space-y-4 rounded-lg bg-white p-4 shadow-xl dark:bg-slate-800"
    >
      <p
        onClick={() => {
          if (rename != null) return;
          setTableInfo(!tableInfo);
        }}
        className="flex cursor-pointer text-black dark:text-white"
      >
        <span className=" flex-grow">
          {rename ? (
            <input
              className="w-3/4 bg-slate-200 dark:bg-slate-900"
              defaultValue={rename}
              onChange={(e) => {
                setRename(e.target.value);
              }}
            />
          ) : (
            name
          )}
        </span>{" "}
        <span> {tableInfo ? "▲" : "▼"} </span>
      </p>
      <hr />
      {tableInfo && (
        <div className="flex flex-col space-y-4 text-black dark:text-white">
          <p className="flex gap-5">
            <span
              className="flex-grow cursor-pointer"
              onClick={() => {
                if (rename != null) {
                  if (rename != name) {
                    renameTable
                      .mutateAsync({ id: props.table.id, name: rename })
                      .then(() => {
                        setName(rename);
                      })
                      .catch(() => {
                        setRename(null);
                      });
                  }
                }
                setRename(rename == null ? name : null);
              }}
            >
              {rename == null ? "RENAME" : "SAVE"}
            </span>{" "}
            <span
              className="flex-grow cursor-pointer text-right"
              onClick={() => {
                deleteTable
                  .mutateAsync({ id: props.table.id })
                  .then(() => {
                    setTableInfo(undefined);
                  })
                  .catch(() => {
                    return;
                  });
              }}
            >
              DELETE
            </span>
          </p>
          <List userId={props.userId} table={props.table} />
          <hr />
        </div>
      )}
    </div>
  );
};
export default Table;
