import type { NextPage } from "next";

const Loading: NextPage = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div>
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900 dark:border-slate-100"></div>
        <h1 className="text-center text-slate-600 dark:text-white">
          Loading...
        </h1>
      </div>
    </div>
  );
};
export default Loading;
