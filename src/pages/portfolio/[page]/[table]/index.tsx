import type { Column, Rows } from "@prisma/client";
import Head from "next/head";
import { useRouter } from "next/router";
import type { NextPage } from "next/types";
import Loading from "../../../../components/utils/loading";
import { api } from "../../../../utils/api";
import Link from "next/link";
const Fetch: NextPage = () => {
  // get id from url
  const router = useRouter();
  if (!router.query.page || !router.query.table) return <></>;
  const User = api.portfolio.users.getUser.useQuery({
    id: router.query.page as string,
  });
  if (User.isError) {
    router.push("/404").catch(() => {
      return;
    });
    return <></>;
  }
  return (
    <>
      <Head>
        <title>Portfolio - {User.data?.name}</title>
        <meta
          name="description"
          content="Een portfolio van Mitchell Steenwijk"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-screen h-screen bg-black">
        <div>
          <Link
            href={`/portfolio/${router.query.page as string}/`}
            className="text-white"
          >
            ← Back
          </Link>
        </div>
        {User.isLoading ? <Loading /> : null}
        {User.isError ? (
          <p className="text-center text-red-700">error</p>
        ) : null}
        {User.isSuccess && <TableData tableID={router.query.table as string} />}
      </main>
    </>
  );
};
export default Fetch;
type props = {
  tableID: string;
};
const TableData: NextPage<props> = (props) => {
  const getData = api.portfolio.data.getRows.useQuery({
    tableID: props.tableID,
    columnID: null,
  });

  return (
    <>
      <div className="h-full w-full">
        {getData.isLoading ? <Loading /> : null}
        {getData.isError ? (
          <p className="text-center text-red-700">error</p>
        ) : null}
        {getData.isSuccess && getData.data != null && (
          <table>
            <thead>
              <tr>
                {getData.data.map((column, index) => {
                  return (
                    <th key={index} className="text-white">
                      [{column.column.type}]{column.column.name}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              <MakeRows row={getData.data} />
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};
type Row = {
  row: { columnId: string; column: Column; rows: Rows[] }[];
};
const MakeRows: NextPage<Row> = (props) => {
  const ammountOfColumns: number | undefined = props.row.length;
  const rows: { rowId: string; data: string[] }[] = [];
  for (let i = 0; i < ammountOfColumns; i++) {
    const row = props.row[i]?.rows;
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
            {row.data.map((data, index) => {
              return (
                <td className="text-white" key={index}>
                  {data}
                </td>
              );
            })}
          </tr>
        );
      })}
    </>
  );
};
