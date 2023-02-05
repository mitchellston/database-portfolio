import type { Column } from "@prisma/client";
import type { NextPage } from "next/types";
import { useState } from "react";
import { api } from "../../../utils/api";
import Loading from "../../utils/loading";
import Modal from "../../utils/modal";

type props = {
  tableID: string;
  columns: Column[];
};
const EditData: NextPage<props> = (props) => {
  const [createNewDataMenu, setCreateNewDataMenu] = useState(false);
  const getData = api.portfolio.data.getRows.useQuery({
    columnID: null,
    tableID: props.tableID,
  });
  if (getData.isSuccess) console.log(getData.data);
  return (
    <>
      <button
        className="text-center"
        onClick={() => {
          setCreateNewDataMenu(true);
        }}
      >
        <div className="flex">
          <div className="flex-grow overflow-x-auto">Create new data</div>
          <div className="ml-2 flex items-center justify-center font-serif">
            &#x25B6;
          </div>
        </div>
      </button>
      <Modal
        title={{ text: "Edit data", color: "black", size: 1.5 }}
        onClose={() => setCreateNewDataMenu(false)}
        show={createNewDataMenu}
      >
        <>
          {getData.isLoading && <Loading />}
          {getData.isError && (
            <div className="text-center text-red-700">error</div>
          )}
          <div className="flex flex-col space-y-4">
            <div className="max-w-full overflow-auto">
              <table>
                <thead>
                  <tr>
                    <th>Nieuwe row</th>
                    {props.columns.map((column, index) => {
                      return <th key={index}>{column.name}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td></td>
                    {props.columns.map((column, index) => {
                      return (
                        <td key={index}>
                          {column.type === "string" && (
                            <input
                              className="border border-stone-700"
                              type="text"
                            />
                          )}
                          {column.type === "number" && (
                            <input
                              className="border border-stone-700"
                              type="number"
                            />
                          )}
                          {column.type === "boolean" && (
                            <select>
                              <option value="true">true</option>
                              <option value="false">false</option>
                            </select>
                          )}
                          {column.type === "date" && (
                            <input
                              className="border border-stone-700"
                              type="date"
                            />
                          )}
                          {column.type === "markdown" && (
                            <textarea
                              className="border border-stone-700"
                              // only height is allowed to be changed
                              style={{ resize: "vertical" }}
                            />
                          )}
                        </td>
                      );
                    })}
                    <td
                      onClick={() => {
                        return;
                      }}
                    >
                      Create
                    </td>
                  </tr>
                </tbody>
              </table>
              <table>
                <thead>
                  <tr>
                    <th>Row</th>
                    {props.columns.map((column, index) => {
                      return <th key={index}>{column.name}</th>;
                    })}
                  </tr>
                </thead>
              </table>
            </div>
          </div>
        </>
      </Modal>
    </>
  );
};
export default EditData;
