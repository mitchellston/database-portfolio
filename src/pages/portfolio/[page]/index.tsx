import { type NextPage } from "next/types";
import Head from "next/head";
import { useRouter } from "next/router";
import { api } from "../../../utils/api";

const Page: NextPage = () => {
  // get id from url
  const router = useRouter();
  if (!router.query.page) return <></>;
  const User = api.portfolio.users.getUser.useQuery({
    id: router.query.page as string,
  });

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
      <main className="h-screen w-screen bg-gradient-to-t from-slate-600 to-slate-300 dark:to-slate-800">
        <section></section>
        <section>
          {/* {tables.data?.map((item, index) => {
            return (
              <Table
                key={index}
                columns={["kasa", "pap", "vla"]}
                data={[{ kasa: "va", pap: "pasfa", vla: "poep" }]}
                position={{ top: item.position.top, left: item.position.left }}
              />
            );
          })} */}
        </section>
      </main>
    </>
  );
};
export default Page;
