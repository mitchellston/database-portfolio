import type { Column } from "@prisma/client";
import type { NextPage } from "next/types";
import { useState } from "react";
import { api } from "../../../utils/api";
import Modal from "../../utils/modal";

type props = {
  tableId: string;
  onCreate: (table: Column) => void;
};
export const CreateColumn: NextPage<props> = (props) => {
  const [createTableModal, setCreateTableModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const createTable = api.portfolio.columns.createColumn.useMutation({
    onError: (error) => {
      setError(error.message);
      return;
    },
  });
  const [columnName, setColumnsName] = useState("");
  const [columnType, setColumnType] = useState<
    "string" | "number" | "date" | "boolean" | "relation" | "markdown" | "image"
  >("string");

  return (
    <>
      <button
        className="text-center"
        onClick={() => {
          setCreateTableModal(true);
        }}
      >
        <div className="flex">
          <div className="flex items-center justify-center text-gray-500">
            [+]{" "}
          </div>
          <div className="flex-grow overflow-x-auto">Add Column</div>
          <div className="ml-2 flex items-center justify-center font-serif">
            &#x25B6;
          </div>
        </div>
      </button>
      <Modal
        onClose={() => {
          setCreateTableModal(false);
          setError(null);
          setColumnType("string");
          setColumnsName("");
          return;
        }}
        className="dark:bg-slate-800  lg:h-2/3"
        show={createTableModal}
        title={{ text: "Maak een colom", color: "black", size: 1.5 }}
      >
        <div className="flex flex-col space-y-4">
          <label htmlFor="name">Colom naam:</label>
          <input
            onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
              setColumnsName(event.target?.value.toString() ?? "");
              return;
            }}
            type="text"
            className="border border-stone-700"
            name="name"
          />
          <label htmlFor="name">Colom type:</label>
          {/* dropdown */}
          <select
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
              if (
                event.target.value === "relation" ||
                event.target.value === "image" ||
                event.target.value === "markdown" ||
                event.target.value === "date" ||
                event.target.value === "boolean" ||
                event.target.value === "number" ||
                event.target.value === "string"
              )
                setColumnType(event.target.value);
              return;
            }}
            className="border border-stone-700"
          >
            <option value="string">string</option>
            <option value="number">number</option>
            <option value="boolean">boolean</option>
            <option value="date">date</option>
            <option value="relation">relation</option>
            <option value="markdown">markdown</option>
            <option value="image">image</option>
          </select>
          {columnType === "relation" && (
            <div className="flex flex-col space-y-4">
              <label htmlFor="name">Relation table:</label>
              <input
                onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setColumnsName(event.target?.value.toString() ?? "");
                  return;
                }}
                type="text"
                className="border border-stone-700"
                name="name"
              />
              <label htmlFor="name">Relation type:</label>
              <select className="border border-stone-700">
                <option value="many">Many</option>
                <option value="one">One</option>
              </select>
            </div>
          )}

          {error && <p className="text-center text-red-700">{error}</p>}
          <button
            onClick={() => {
              createTable
                .mutateAsync({
                  name: columnName,
                  type: columnType,
                  tableId: props.tableId,
                })
                .then((res) => {
                  props.onCreate(res);
                  setCreateTableModal(false);
                })
                .catch(() => {
                  return;
                });
            }}
            className="absolute bottom-0 left-0 w-full bg-blue-700 text-white hover:bg-blue-700/50"
          >
            Create - {columnName}
          </button>
        </div>
      </Modal>
    </>
  );
};
