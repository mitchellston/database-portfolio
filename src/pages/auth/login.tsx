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
            <button
              onClick={() => {
                signIn("github", { redirect: true, callbackUrl: "/" }).catch(
                  () => {
                    return;
                  }
                );
              }}
              type="button"
              className="mr-2 mb-2 inline-flex items-center rounded-lg bg-[#24292F] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#24292F]/90 focus:outline-none focus:ring-4 focus:ring-[#24292F]/50 dark:hover:bg-[#050708]/30 dark:focus:ring-gray-500"
            >
              <svg
                className="mr-2 -ml-1 h-4 w-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="github"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 496 512"
              >
                <path
                  fill="currentColor"
                  d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
                ></path>
              </svg>
              Sign in with Github
            </button>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
