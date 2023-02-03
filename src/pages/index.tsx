import { type NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Portfolio - Mitchell Steenwijk</title>
        <meta
          name="description"
          content="Een portfolio van Mitchell Steenwijk"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen w-screen bg-gradient-to-t from-slate-600 to-slate-300 dark:to-slate-800">
        <section></section>
      </main>
    </>
  );
};

export default Home;
