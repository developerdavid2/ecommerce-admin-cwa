import React from "react";
import prismadb from "@/lib/prismadb";
import CategoryForm from "@/app/(dashboard)/stores/[storeId]/(routes)/categories/[categoryId]/components/category-form";

interface CategoryPageProps {
  params: Promise<{
    categoryId: string;
    storeId: string;
  }>;
}

const CategoryPage: React.FC<CategoryPageProps> = async ({ params }) => {
  const { categoryId, storeId } = await params;

  const category = await prismadb.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm billboards={billboards} initialData={category} />
      </div>
    </div>
  );
};

export default CategoryPage;
