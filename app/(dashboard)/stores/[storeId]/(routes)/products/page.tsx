import React from "react";
import ProductClient from "@/app/(dashboard)/stores/[storeId]/(routes)/products/components/product-client";
import prismadb from "@/lib/prismadb";
import { ProductColumn } from "@/app/(dashboard)/stores/[storeId]/(routes)/products/components/column";
import { format } from "date-fns";
import { priceFormatter } from "@/lib/utils";

interface ProductsSetupPageProps {
  params: Promise<{ storeId: string }>;
}

const ProductsSetupPage = async ({ params }: ProductsSetupPageProps) => {
  const { storeId } = await params;

  const products = await prismadb.product.findMany({
    where: {
      storeId,
    },
    include: {
      colour: true,
      size: true,
      category: true,
      images: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    images: item.images,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: priceFormatter(item.price),
    category: item.category.name,
    size: item.size.name,
    colour: item.colour.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};
export default ProductsSetupPage;
