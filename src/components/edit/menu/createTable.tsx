import type { Tables } from "@prisma/client";
import type { NextPage } from "next/types";
import { useState } from "react";
import { api } from "../../../utils/api";
import Modal from "../../utils/modal";

type props = {
  onCreate: (table: Tables) => void;
};
export const CreateTable: NextPage<props> = (props) => {
  const [createTableModal, setCreateTableModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const createTable = api.portfolio.tables.createTable.useMutation({
    onError: (error) => {
      setError(error.message);
      return;
    },
  });
  const [tableInput, setTableInput] = useState("");
  return (
    <>
      <button
        onClick={() => {
          setCreateTableModal(true);
        }}
        className="w-full bg-blue-700 text-white hover:bg-blue-700/50"
      >
        +
      </button>
      <Modal
        onClose={() => {
          setCreateTableModal(false);
          setError(null);
          return;
        }}
        className="dark:bg-slate-800"
        show={createTableModal}
        title={{ text: "Maak Tabel", color: "black", size: 1.5 }}
      >
        <div className="flex flex-col space-y-4">
          <label htmlFor="name">Table name:</label>
          <input
            onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
              setTableInput(event.target?.value.toString() ?? "");
              return;
            }}
            type="text"
            className="border border-stone-700"
            name="name"
          />
          {error && <p className="text-center text-red-700">{error}</p>}
          <button
            onClick={() => {
              createTable
                .mutateAsync({
                  name: tableInput,
                  position: { top: 0, left: 0 },
                })
                .then((res) => {
                  props.onCreate(res);
                  setCreateTableModal(false);
                })
                .catch(() => {
                  return;
                });
              setTableInput("");
            }}
            className="absolute bottom-0 left-0 w-full bg-blue-700 text-white hover:bg-blue-700/50"
          >
            Create - {tableInput}
          </button>
        </div>
      </Modal>
    </>
  );
};
