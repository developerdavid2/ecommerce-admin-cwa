"use client";

import React from "react";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import { DataTable } from "@/components/ui/data-table";
import ApiList from "@/components/ui/api-list";
import {
  CategoryColumn,
  categoryColumns,
} from "@/app/(dashboard)/stores/[storeId]/(routes)/categories/components/column";

interface CategoryClientProps {
  data: CategoryColumn[];
}

const CategoryClient: React.FC<CategoryClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categories (${data.length})`}
          description="Manage categories for your store"
        />

        <Button
          onClick={() =>
            router.push(`/stores/${params.storeId}/categories/new`)
          }
          className="cursor-pointer"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={categoryColumns} data={data} searchKey="name" />
      <Heading title="API" description="API calls for Categories" />
      <Separator />
      <ApiList entityName="categories" entityNameId="categoryId" />
    </>
  );
};
export default CategoryClient;
