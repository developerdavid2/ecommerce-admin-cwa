import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import Navbar from "@/components/navbar";

interface StoreDashboardLayoutProps {
  params: Promise<{ storeId: string }>;
  children: React.ReactNode;
}

const StoreDashboardLayout = async ({
  children,
  params,
}: StoreDashboardLayoutProps) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { storeId } = await params;

  const store = await prismadb.store.findFirst({
    where: {
      id: storeId,
      userId,
    },
  });

  if (!store) {
    redirect("/");
  }
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};
export default StoreDashboardLayout;
