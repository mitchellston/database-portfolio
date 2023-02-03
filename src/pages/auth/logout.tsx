import type { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Logout: NextPage = () => {
  const { status } = useSession();
  const router = useRouter();
  if (status === "loading") return null;
  if (status === "unauthenticated") {
    router.back();
    return null;
  }
  router.back();
  signOut().catch(() => {
    return;
  });
  return null;
};
export default Logout;
