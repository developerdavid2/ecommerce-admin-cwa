import React from "react";
import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { ColourColumn } from "@/app/(dashboard)/stores/[storeId]/(routes)/colours/components/column";
import ColourClient from "@/app/(dashboard)/stores/[storeId]/(routes)/colours/components/colour-client";

interface ColoursSetupPageProps {
  params: Promise<{ storeId: string }>;
}

const ColoursSetupPage: React.FC<ColoursSetupPageProps> = async ({
  params,
}) => {
  const { storeId } = await params;

  const colours = await prismadb.colour.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedColours: ColourColumn[] = colours.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColourClient data={formattedColours} />
      </div>
    </div>
  );
};

export default ColoursSetupPage;
