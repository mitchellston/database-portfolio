import type { NextPage } from "next/types";
import { useEffect, useState } from "react";
import { api } from "../../../../utils/api";
import Loading from "../../../utils/loading";
type props = {
  userId: string;
  tableId: string;
  onChange?: (relation: { type: "many" | "one"; table: string }) => void;
};
const RelationShip: NextPage<props> = (props) => {
  const tables = api.portfolio.tables.getTable.useQuery({
    page: props.userId,
    id: null,
  });
  const [relation, setRelation] = useState<{
    type: "many" | "one";
    table: string;
  }>({ type: "many", table: "" });
  useEffect(() => {
    if (props.onChange) props.onChange(relation);
  }, [relation]);

  if (tables.isLoading) return <Loading />;
  if (tables.error) return <div>{tables.error.message}</div>;

  return (
    <div className="flex flex-col space-y-4">
      <label htmlFor="name">Relation table:</label>
      <select
        onChange={(e) => {
          if (e.target.value != relation.table)
            setRelation({ ...relation, table: e.target.value });
        }}
        className="border border-stone-700"
      >
        <option value="">Selecteer</option>
        {tables.data.map((table) => {
          if (table.id == props.tableId) {
            return <></>;
          }
          return (
            <option value={table.id} key={table.id}>
              {table.name}
            </option>
          );
        })}
      </select>
      <label htmlFor="name">Relation type:</label>
      <select
        onChange={(e) => {
          if (e.target.value != relation.type)
            if (e.target.value == "one" || e.target.value == "many")
              setRelation({ ...relation, type: e.target.value });
        }}
        className="border border-stone-700"
      >
        <option value="many">Many</option>
        <option value="one">One</option>
      </select>
    </div>
  );
};
export default RelationShip;
