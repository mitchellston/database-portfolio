import type { NextPage } from "next";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
// pill shaped box with profile picture and username in it on the top right of the screen
// profile picture is a dropdown menu with logout button
const LoggedIn: NextPage = () => {
  const [show, setShow] = useState(false);

  const { data: session, status } = useSession();
  if (status === "loading") return <></>;
  if (
    status == "unauthenticated" ||
    !session ||
    !session?.user ||
    !session?.user?.name
  ) {
    return (
      <div className="absolute top-0 right-0 flex flex-row items-center justify-center rounded-full bg-white dark:bg-slate-900">
        <div className="p-1">
          <Link
            href={"/auth/login"}
            className="text-xl font-bold text-slate-600 dark:text-white"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="absolute right-0 top-0 z-50 flex min-w-min flex-row items-center justify-center rounded-full bg-white dark:bg-slate-900">
      <div className="p-1">
        <p className="text-xl font-bold text-slate-600 ">{session.user.name}</p>
      </div>
      <Menu as="div" className="relative inline-block text-left">
        <div className="p-1">
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt="profile picture"
              width={40}
              height={40}
              className="rounded-full"
              onClick={() => setShow(!show)}
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-slate-600 dark:bg-slate-900">
              {session.user.name[0]}
            </div>
          )}
        </div>
        <Transition
          show={show}
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-slate-900">
            <div className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href={"/account/edit"}
                    className={`${
                      active ? "bg-gray-100" : ""
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm text-slate-600 dark:text-white`}
                  >
                    Edit portfolio
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href={"/auth/logout"}
                    className={`${
                      active ? "bg-gray-100" : ""
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm text-slate-600 dark:text-white`}
                  >
                    Logout
                  </Link>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};
export default LoggedIn;
