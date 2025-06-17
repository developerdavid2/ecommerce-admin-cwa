import React from "react";
import prismadb from "@/lib/prismadb";
import ProductForm from "@/app/(dashboard)/stores/[storeId]/(routes)/products/[productId]/components/product-form";

interface ProductPageProps {
  params: Promise<{
    productId: string;
    storeId: string;
  }>;
}

const ProductPage: React.FC<ProductPageProps> = async ({ params }) => {
  const { productId, storeId } = await params;

  const product = await prismadb.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      images: true,
    },
  });

  const categories = await prismadb.category.findMany({
    where: {
      storeId,
    },
  });

  const sizes = await prismadb.size.findMany({
    where: {
      storeId,
    },
  });

  const colours = await prismadb.colour.findMany({
    where: {
      storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={product}
          categories={categories}
          sizes={sizes}
          colours={colours}
        />
      </div>
    </div>
  );
};

export default ProductPage;
