import React from "react";
import CategoryClient from "@/app/(dashboard)/stores/[storeId]/(routes)/categories/components/category-client";
import prismadb from "@/lib/prismadb";
import { CategoryColumn } from "@/app/(dashboard)/stores/[storeId]/(routes)/categories/components/column";
import { format } from "date-fns";

interface CategoriesSetupPageProps {
  params: Promise<{ storeId: string }>;
}

const CategoriesSetupPage = async ({ params }: CategoriesSetupPageProps) => {
  const { storeId } = await params;

  const categories = await prismadb.category.findMany({
    where: {
      storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-4 pt-6 sm:p-8">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};
export default CategoriesSetupPage;
