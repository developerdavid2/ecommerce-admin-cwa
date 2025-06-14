"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "@/app/(dashboard)/stores/[storeId]/(routes)/billboards/components/cell-action";
import Image from "next/image";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type BillboardColumn = {
  id: string;
  label: string;
  imageUrl: string;
  createdAt: string;
};

export const billboardColumns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: "imageUrl",
    header: () => <div className="font-bold">Name</div>,
    cell: ({ row }) => (
      <div className="flex w-1/2">
        <Image
          src={row.original.imageUrl}
          alt="Billboard"
          width={12}
          height={12}
          className="h-12 w-12 object-cover rounded-md"
        />
      </div>
    ),
  },
  {
    accessorKey: "label",
    header: () => <div className="font-bold">Label</div>,
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="font-bold">Date</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
