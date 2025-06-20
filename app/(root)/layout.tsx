import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";

interface HomeSetupLayoutProps {
  children: React.ReactNode;
}

const HomeSetupLayout: React.FC<HomeSetupLayoutProps> = async ({
  children,
}) => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const store = await prismadb.store.findFirst({
    where: {
      userId,
    },
  });

  if (store) {
    redirect(`/stores/${store.id}`);
  }
  return <div>{children}</div>;
};
export default HomeSetupLayout;
