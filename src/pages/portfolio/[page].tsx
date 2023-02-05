import { type NextPage } from "next/types";
import Head from "next/head";
import { useRouter } from "next/router";
import { api } from "../../utils/api";
import Loading from "../../components/utils/loading";
import Table from "../../components/portfolio/table";

const Page: NextPage = () => {
  // get id from url
  const router = useRouter();
  if (!router.query.page) return <></>;
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
      <main className="min-screen h-screen">
        <div className="fixed h-screen w-screen bg-gradient-to-t from-slate-600 to-slate-300 dark:to-slate-800">
          {User.isLoading ? <Loading /> : null}
          {User.isError ? (
            <p className="text-center text-red-700">error</p>
          ) : null}
        </div>
        <div className="relative">
          {User.isSuccess &&
            User.data.tables.map((table, index) => {
              return (
                <Table
                  table={table}
                  key={index}
                  userId={router.query.page as string}
                />
              );
            })}
        </div>
      </main>
    </>
  );
};
export default Page;
