"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "@/app/(dashboard)/stores/[storeId]/(routes)/categories/components/cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type CategoryColumn = {
  id: string;
  name: string;
  billboardLabel: string;
  createdAt: string;
};

export const categoryColumns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: () => <div className="font-bold">Name</div>,
  },
  {
    accessorKey: "billboard",
    header: () => <div className="font-bold">Billboard</div>,
    cell: ({ row }) => row.original.billboardLabel,
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
