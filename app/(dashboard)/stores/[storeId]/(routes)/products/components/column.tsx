"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "@/app/(dashboard)/stores/[storeId]/(routes)/products/components/cell-action";
import Image from "next/image";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColumn = {
  id: string;
  name: string;
  images: { url: string }[];
  isFeatured: boolean;
  isArchived: boolean;
  price: string;
  category: string;
  size: string;
  colour: string;
  createdAt: string;
};

export const productColumns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: () => <div className="font-bold">Name</div>,
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.images ? (
          <Image
            src={row.original.images[0]?.url}
            alt="Product image"
            width={48}
            height={48}
            className="h-12 w-12 object-cover rounded-md"
          />
        ) : (
          <div className="h-12 w-12 bg-gray-200 rounded-md" />
        )}
        <div>{row.original.name}</div>
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: () => <div className="font-bold">Price</div>,
  },
  {
    accessorKey: "colour",
    header: () => <div className="font-bold">Colour</div>,
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.colour}
        <div
          className="h-4 w-4 rounded-full border"
          style={{ backgroundColor: row.original.colour }}
        />
      </div>
    ),
  },

  {
    accessorKey: "category",
    header: () => <div className="font-bold">Category</div>,
  },
  {
    accessorKey: "size",
    header: () => <div className="font-bold">Size</div>,
  },

  {
    accessorKey: "isFeatured",
    header: () => <div className="font-bold">Featured</div>,
  },

  {
    accessorKey: "isArchived",
    header: () => <div className="font-bold">Archived</div>,
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
