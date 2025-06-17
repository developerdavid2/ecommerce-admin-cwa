import React from "react";
import prismadb from "@/lib/prismadb";
import BillboardForm from "@/app/(dashboard)/stores/[storeId]/(routes)/billboards/[billboardId]/components/billboard-form";

interface BillboardPageProps {
  params: {
    billboardId: string;
  };
}

const BillboardPage: React.FC<BillboardPageProps> = async ({
  params,
}: BillboardPageProps) => {
  const { billboardId } = params;
  const billboard = await prismadb.billboard.findUnique({
    where: {
      id: billboardId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
};
export default BillboardPage;
