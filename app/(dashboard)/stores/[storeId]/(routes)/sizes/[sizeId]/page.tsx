import React from "react";
import prismadb from "@/lib/prismadb";
import SizeForm from "@/app/(dashboard)/stores/[storeId]/(routes)/sizes/[sizeId]/components/size-form";

interface SizePageProps {
  params: {
    sizeId: string;
    storeId: string;
  };
}

const SizePage: React.FC<SizePageProps> = async ({ params }) => {
  const { sizeId } = params;
  const size = await prismadb.size.findUnique({
    where: {
      id: sizeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={size} />
      </div>
    </div>
  );
};
export default SizePage;
