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
  ColourColumn,
  colourColumns,
} from "@/app/(dashboard)/stores/[storeId]/(routes)/colours/components/column";

interface ColourClientProps {
  data: ColourColumn[];
}

const ColourClient: React.FC<ColourClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Colours (${data.length})`}
          description="Manage colours for your store"
        />

        <Button
          onClick={() => router.push(`/stores/${params.storeId}/colours/new`)}
          className="cursor-pointer"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={colourColumns} data={data} searchKey="name" />
      <Heading title="API" description="API calls for Colours" />
      <Separator />
      <ApiList entityName="colours" entityNameId="colourId" />
    </>
  );
};
export default ColourClient;
