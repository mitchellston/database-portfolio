import type { Tables } from "@prisma/client";
import type { NextPage } from "next";
import { useState } from "react";
import { CreateTable } from "./createTable";
import Table from "./Table";
type props = {
  tables: Tables[];
  userId: string;
  onChange?: (table: Tables[]) => void;
};
const List: NextPage<props> = (props) => {
  const [tables, setTables] = useState(props.tables);
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <div className="flex-grow overflow-y-auto">
        {tables.map((table, index) => (
          <Table
            userId={props.userId}
            onError={(err) => {
              setError(err);
            }}
            table={table}
            key={index}
          />
        ))}
        {error && <p className="text-center text-red-700">{error}</p>}

        <CreateTable onCreate={(table) => setTables([...tables, table])} />
      </div>
    </>
  );
};
export default List;
