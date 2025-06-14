"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "@/app/(dashboard)/stores/[storeId]/(routes)/colours/components/cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ColourColumn = {
  id: string;
  name: string;
  value: string;
  createdAt: string;
};

export const colourColumns: ColumnDef<ColourColumn>[] = [
  {
    accessorKey: "name",
    header: () => <div className="font-bold">Name</div>,
  },
  {
    accessorKey: "value",
    header: () => <div className="font-bold">Value</div>,
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.value}
        <div
          className="h-6 w-6 rounded-full border"
          style={{ backgroundColor: row.original.value }}
        />
      </div>
    ),
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
