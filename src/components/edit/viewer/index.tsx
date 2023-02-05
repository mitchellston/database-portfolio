import type { NextPage } from "next/types";
import { api } from "../../../utils/api";
import Loading from "../../utils/loading";
import Table from "./tables";
type props = {
  userId: string;
  pageId: string;
};
const Viewer: NextPage<props> = (props) => {
  const tables = api.portfolio.tables.getTable.useQuery({
    page: props.pageId,
    id: null,
  });
  if (tables.isLoading || tables.isRefetching) return <Loading />;
  if (tables.isError) return <p className="text-center text-red-700">Error</p>;
  return (
    <>
      <div className="z-1 absolute top-0 left-0 m-2 rounded-full bg-gray-100 p-2 shadow-xl">
        <button
          onClick={() => {
            tables.refetch().catch(() => {
              return;
            });
          }}
        >
          <svg
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            className="mr-1 inline-block"
          >
            <path
              d="M.5 7.5A7 7 0 0113 3.17m1.5 4.33A7 7 0 012 11.83m3-.33H1.5V15m12-15v3.5H10"
              stroke="currentColor"
            ></path>
          </svg>
          Refresh
        </button>
      </div>
      {tables.data.map((table, index) => {
        return <Table key={index} userId={props.userId} table={table} />;
      })}
    </>
  );
};
export default Viewer;
