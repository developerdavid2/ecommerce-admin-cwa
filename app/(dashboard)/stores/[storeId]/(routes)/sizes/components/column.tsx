"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "@/app/(dashboard)/stores/[storeId]/(routes)/sizes/components/cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type SizeColumn = {
  id: string;
  name: string;
  value: string;
  createdAt: string;
};

export const sizeColumns: ColumnDef<SizeColumn>[] = [
  {
    accessorKey: "name",
    header: () => <div className="font-bold">Name</div>,
  },
  {
    accessorKey: "value",
    header: () => <div className="font-bold">Value</div>,
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
