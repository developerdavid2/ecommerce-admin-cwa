import React from "react";
import prismadb from "@/lib/prismadb";
import ColourForm from "@/app/(dashboard)/stores/[storeId]/(routes)/colours/[colourId]/components/colour-form";

interface ColourPageProps {
  params: Promise<{
    colourId: string;
    storeId: string;
  }>;
}

const ColourPage: React.FC<ColourPageProps> = async ({ params }) => {
  const { colourId } = await params;
  const colour = await prismadb.colour.findUnique({
    where: {
      id: colourId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColourForm initialData={colour} />
      </div>
    </div>
  );
};
export default ColourPage;
