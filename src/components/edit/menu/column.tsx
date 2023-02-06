import type { Column } from "@prisma/client";
import type { NextPage } from "next/types";
import { useState } from "react";
import { api } from "../../../utils/api";
import Modal from "../../utils/modal";
import SetType from "../setType";

type props = {
  userId: string;
  column: Column;
};
const Colunn: NextPage<props> = (props) => {
  const [editMenu, setEditMenu] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const removeColumn = api.portfolio.columns.deleteColumn.useMutation();
  return (
    <>
      {deleted ? (
        <></>
      ) : (
        <>
          {" "}
          <button
            className="text-center"
            onClick={() => {
              // open menu with options for delete and move
              setEditMenu(true);
            }}
          >
            <div className="flex">
              <div className="flex items-center justify-center text-gray-500">
                [
                <SetType
                  userId={props.userId}
                  type={props.column.type}
                  relationTo={props.column.relationShipTableId as string}
                />
                ]{" "}
              </div>
              <div className="flex-grow overflow-x-auto">
                {props.column.name}
              </div>
              <div className="ml-2 flex items-center justify-center font-serif">
                &#x25B6;
              </div>
            </div>
          </button>
          <Modal
            title={{ text: "Edit de column", color: "black", size: 1.5 }}
            onClose={() => {
              setEditMenu(false);
            }}
            show={editMenu}
          >
            <div className="flex flex-col space-y-4">
              <div className="flex-grow"></div>
              <div>
                <button
                  className="text-center"
                  onClick={() => {
                    removeColumn.mutate({ id: props.column.id });
                    setDeleted(true);
                  }}
                >
                  DELETE
                </button>
              </div>
            </div>
          </Modal>
        </>
      )}
    </>
  );
};
export default Colunn;
