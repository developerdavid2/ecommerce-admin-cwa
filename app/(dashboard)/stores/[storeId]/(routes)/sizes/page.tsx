import React from "react";
import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { SizeColumn } from "@/app/(dashboard)/stores/[storeId]/(routes)/sizes/components/column";
import SizeClient from "@/app/(dashboard)/stores/[storeId]/(routes)/sizes/components/size-client";

const SizesSetupPage = async ({ params }: { params: { storeId: string } }) => {
  const { storeId } = await params;

  const sizes = await prismadb.size.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedSizes: SizeColumn[] = sizes.map((item: any) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeClient data={formattedSizes} />
      </div>
    </div>
  );
};
export default SizesSetupPage;
