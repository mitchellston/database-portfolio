import type { Column, Rows } from "@prisma/client";
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
  const [newData, setNewData] = useState<{ columnId: string; data: string }[]>(
    []
  );

  const getData = api.portfolio.data.getRows.useQuery({
    columnID: null,
    tableID: props.tableID,
  });

  const createRow = api.portfolio.data.createRow.useMutation({
    onSuccess: () => {
      getData.refetch().catch(() => {
        return;
      });
    },
  });
  const setInData = (index: number, columnId: string, data: string) => {
    if (newData[index] === undefined) {
      setNewData([...newData, { columnId: columnId, data: data }]);
    } else {
      const newDataCopy = newData;
      newDataCopy[index] = { columnId: columnId, data: data };
      setNewData(newDataCopy);
    }
  };

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
        onClose={() => {
          setCreateNewDataMenu(false);
        }}
        className="dark:bg-slate-800 lg:h-2/3"
        show={createNewDataMenu}
      >
        <>
          {getData.isLoading && <Loading />}
          {getData.isError && (
            <div className="text-center text-red-700">error</div>
          )}
          <div className="flex flex-col space-y-4 p-4">
            <div className="max-w-full overflow-auto">
              <table>
                <thead>
                  <tr>
                    <th className="text-black dark:text-white">Nieuwe row</th>
                    {props.columns.map((column, index) => {
                      if (column.type == "many" || column.type == "one")
                        return <></>;
                      return (
                        <th className="text-black dark:text-white" key={index}>
                          {column.name}
                        </th>
                      );
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
                              onChange={(e) => {
                                setInData(index, column.id, e.target.value);
                              }}
                              className="border border-stone-700"
                              type="text"
                            />
                          )}
                          {column.type === "number" && (
                            <input
                              onChange={(e) => {
                                setInData(index, column.id, e.target.value);
                              }}
                              className="border border-stone-700"
                              type="number"
                            />
                          )}
                          {column.type === "boolean" && (
                            <select
                              onChange={(e) => {
                                setInData(index, column.id, e.target.value);
                              }}
                            >
                              <option value="true">true</option>
                              <option value="false">false</option>
                            </select>
                          )}
                          {column.type === "date" && (
                            <input
                              onChange={(e) => {
                                setInData(index, column.id, e.target.value);
                              }}
                              className="border border-stone-700"
                              type="date"
                            />
                          )}
                          {column.type === "markdown" && (
                            <textarea
                              onChange={(e) => {
                                setInData(index, column.id, e.target.value);
                              }}
                              className="border border-stone-700"
                              // only height is allowed to be changed
                              style={{ resize: "vertical" }}
                            />
                          )}
                        </td>
                      );
                    })}
                    <td>
                      <button
                        onClick={() => {
                          console.log(newData);
                          createRow.mutate({
                            tableId: props.tableID,
                            data: newData,
                          });
                          return;
                        }}
                      >
                        Create
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              {getData.data && getData.data != undefined && (
                <>
                  <button
                    onClick={() => {
                      getData.refetch().catch(() => {
                        return;
                      });
                    }}
                  >
                    Refresh rows
                  </button>
                  <table>
                    <thead>
                      <tr>
                        <th>Rows</th>
                        {props.columns.map((column, index) => {
                          return <th key={index}>{column.name}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      <MakeRows row={getData.data} tableId={props.tableID} />
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        </>
      </Modal>
    </>
  );
};
export default EditData;
type Row = {
  row: { columnId: string; column: Column; rows: Rows[] }[];
  tableId: string;
};
const MakeRows: NextPage<Row> = (props) => {
  const [rowData, setRowData] = useState<
    { columnId: string; column: Column; rows: Rows[] }[]
  >(props.row);
  const deleteRow = api.portfolio.data.deleteRow.useMutation({
    onSuccess: (data) => {
      console.log(data);
      const newData: { columnId: string; column: Column; rows: Rows[] }[] = [];
      for (const column of rowData) {
        if (column.columnId != data) {
          newData.push(column);
        }
      }
      setRowData(newData);
    },
  });
  const ammountOfColumns: number | undefined = props.row.length;
  const rows: { rowId: string; data: string[] }[] = [];
  for (let i = 0; i < ammountOfColumns; i++) {
    const row = rowData[i]?.rows;
    row?.map((row) => {
      // check if row is already in array if not push it
      if (!rows.find((rowl) => row.rowId === rowl.rowId)) {
        rows.push({ rowId: row.rowId, data: [row.data] });
      }
      // if row is already in array add data to data array
      else {
        rows.find((rowl) => row.rowId === rowl.rowId)?.data.push(row.data);
      }
    });
  }

  return (
    <>
      {rows.map((row, index) => {
        return (
          <tr key={index}>
            <td>{index}</td>
            {row.data.map((data, index) => {
              return (
                <td className="text-black dark:text-white" key={index}>
                  {data}
                </td>
              );
            })}
            <td>
              <button
                onClick={() => {
                  deleteRow.mutate({
                    tableId: props.tableId,
                    rowId: row.rowId,
                  });
                }}
              >
                Delete
              </button>
            </td>
          </tr>
        );
      })}
    </>
  );
};
