import { type NextPage } from "next";
import Head from "next/head";
import { signIn } from "next-auth/react";
const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Login</title>
        <meta
          name="description"
          content="Creer een account of log in om zelf een database portfolio te maken!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="grad h-screen w-screen bg-gradient-to-t from-slate-600 to-slate-300 dark:to-slate-800">
        <section className="flex h-full items-center justify-center">
          <div className="flex h-1/2 w-1/2 flex-col items-center justify-center rounded-lg bg-white shadow-lg dark:bg-slate-800">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
              Login
            </h1>

            <button
              onClick={() => {
                signIn("discord", { redirect: true, callbackUrl: "/" }).catch(
                  () => {
                    return;
                  }
                );
              }}
              type="button"
              className="mr-2 mb-2 inline-flex items-center rounded-lg bg-[#5865F2] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#5865F2]/90 focus:outline-none focus:ring-4 focus:ring-[#000000]/50 dark:focus:ring-[#FFFFFF]/50"
            >
              <svg
                className="mr-2 -ml-1 h-4 w-4"
                viewBox="0 0 127.14 96.36"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m107.7 8.07a105.15 105.15 0 0 0 -26.23-8.07 72.06 72.06 0 0 0 -3.36 6.83 97.68 97.68 0 0 0 -29.11 0 72.37 72.37 0 0 0 -3.36-6.83 105.89 105.89 0 0 0 -26.25 8.09c-16.6 24.56-21.1 48.51-18.85 72.12a105.73 105.73 0 0 0 32.17 16.15 77.7 77.7 0 0 0 6.89-11.11 68.42 68.42 0 0 1 -10.85-5.18c.91-.66 1.8-1.34 2.66-2a75.57 75.57 0 0 0 64.32 0c.87.71 1.76 1.39 2.66 2a68.68 68.68 0 0 1 -10.87 5.19 77 77 0 0 0 6.89 11.1 105.25 105.25 0 0 0 32.19-16.14c2.64-27.38-4.51-51.11-18.9-72.15zm-65.25 57.62c-6.27 0-11.45-5.69-11.45-12.69s5-12.74 11.43-12.74 11.57 5.74 11.46 12.74-5.05 12.69-11.44 12.69zm42.24 0c-6.28 0-11.44-5.69-11.44-12.69s5-12.74 11.44-12.74 11.54 5.74 11.43 12.74-5.04 12.69-11.43 12.69z"
                  fill="#fff"
                />
              </svg>
              Sign in with Discord
            </button>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
