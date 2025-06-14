"use client";

import React from "react";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  ProductColumn,
  productColumns,
} from "@/app/(dashboard)/stores/[storeId]/(routes)/products/components/column";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "@/components/ui/api-list";

interface ProductClientProps {
  data: ProductColumn[];
}

const ProductClient: React.FC<ProductClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Products (${data.length})`}
          description="Manage products for your store"
        />

        <Button
          onClick={() => router.push(`/stores/${params.storeId}/products/new`)}
          className="cursor-pointer"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={productColumns} data={data} searchKey="name" />
      <Heading title="API" description="API calls for Products" />
      <Separator />
      <ApiList entityName="products" entityNameId="productId" />
    </>
  );
};
export default ProductClient;
