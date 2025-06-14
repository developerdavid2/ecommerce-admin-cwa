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
  SizeColumn,
  sizeColumns,
} from "@/app/(dashboard)/stores/[storeId]/(routes)/sizes/components/column";

interface SizeClientProps {
  data: SizeColumn[];
}

const SizeClient: React.FC<SizeClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Sizes (${data.length})`}
          description="Manage sizes for your store"
        />

        <Button
          onClick={() => router.push(`/stores/${params.storeId}/sizes/new`)}
          className="cursor-pointer"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={sizeColumns} data={data} searchKey="name" />
      <Heading title="API" description="API calls for Sizes" />
      <Separator />
      <ApiList entityName="sizes" entityNameId="sizeId" />
    </>
  );
};
export default SizeClient;
