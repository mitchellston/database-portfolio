import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { api } from "../../utils/api";
import Loading from "../../components/utils/loading";

import List from "../../components/edit/menu";
import Link from "next/link";

import Viewer from "../../components/edit/viewer";
import type { Tables } from "@prisma/client";
import { useState } from "react";
const Auth: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <></>;
  if (status === "unauthenticated" || !session?.user?.id) {
    router.push("/auth/login").catch(() => {
      return;
    });
    return <></>;
  }

  return <Page id={session?.user?.id} />;
};
export default Auth;
type PageProps = {
  id: string;
};
const Page: NextPage<PageProps> = (props) => {
  const router = useRouter();
  const User = api.portfolio.users.getUser.useQuery({
    id: props.id,
  });

  if (User.isLoading)
    return (
      <>
        <Head>
          <title>Portfolio edit - Loading...</title>
        </Head>
        <main className="h-screen w-screen bg-gradient-to-t from-slate-600 to-slate-300 dark:to-slate-800">
          <Loading />
        </main>
      </>
    );
  if (User.isError) {
    router.push("/auth/login").catch((err) => {
      console.log(err);
    });
    return (
      <>
        <Head>
          <title>Portfolio edit - Error</title>
        </Head>
        <main className="h-screen w-screen bg-gradient-to-t from-slate-600 to-slate-300 dark:to-slate-800"></main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Portfolio edit - {User.data?.name}</title>
      </Head>
      <Editor
        tables={User.data?.tables || []}
        pageId={props.id}
        userId={props.id}
      />
    </>
  );
};
type propsEditor = {
  tables: Tables[];
  userId: string;
  pageId: string;
};
const Editor: NextPage<propsEditor> = (props) => {
  return (
    <main className="h-screen w-screen">
      <div className="fixed h-screen  w-screen bg-gradient-to-t from-slate-600 to-slate-300 dark:to-slate-800"></div>
      <div className="flex h-full w-full flex-row">
        <div className="z-10 flex h-full max-h-full w-full max-w-md flex-col space-y-4 rounded-lg bg-white p-4 shadow-lg dark:bg-slate-900">
          <h1 className="text-center text-2xl font-bold text-slate-900 dark:text-white">
            Edit your portfolio
          </h1>
          <hr />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Tables
          </h2>

          <List userId={props.userId} tables={props.tables} />
          <Link href={`/portfolio/${props.userId}`}>Bekijk portfolio</Link>
        </div>
        <div className="relative flex-grow ">
          <Viewer userId={props.userId} pageId={props.pageId} />
        </div>
      </div>
    </main>
  );
};
