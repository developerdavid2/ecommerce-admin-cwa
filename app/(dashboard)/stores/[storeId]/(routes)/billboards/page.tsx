import React from "react";
import BillboardClient from "@/app/(dashboard)/stores/[storeId]/(routes)/billboards/components/billboard-client";
import prismadb from "@/lib/prismadb";
import { BillboardColumn } from "@/app/(dashboard)/stores/[storeId]/(routes)/billboards/components/column";
import { format } from "date-fns";

const BillboardsSetupPage = async ({
  params,
}: {
  params: { storeId: string };
}) => {
  const { storeId } = await params;

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    imageUrl: item.imageUrl,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
};
export default BillboardsSetupPage;
