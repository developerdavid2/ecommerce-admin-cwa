"use client";

import { ColumnDef } from "@tanstack/react-table";
// import CellAction from "@/app/(dashboard)/stores/[storeId]/(routes)/orders/components/cell-action";
//import Image from "next/image";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type OrderColumn = {
  id: string;
  // userName: string;
  phone: string;
  address: string;
  isPaid: boolean;
  totalPrice: string;
  products: string;
  createdAt: string;
};

export const orderColumns: ColumnDef<OrderColumn>[] = [
  // {
  //   accessorKey: "imageUrl",
  //   header: () => <div className="font-bold">Name</div>,
  //   // cell: ({ row }) => (
  //   //   <div className="flex w-1/2">
  //   //     <Image
  //   //       src={row.original.imageUrl}
  //   //       alt="Order"
  //   //       width={12}
  //   //       height={12}
  //   //       className="h-12 w-12 object-cover rounded-md"
  //   //     />
  //   //   </div>
  //   // ),
  // },
  {
    accessorKey: "products",
    header: () => <div className="font-bold">Products</div>,
  },
  {
    accessorKey: "userName",
    header: () => <div className="font-bold">Customer</div>,
  },
  {
    accessorKey: "phone",
    header: () => <div className="font-bold">Phone</div>,
  },
  {
    accessorKey: "address",
    header: () => <div className="font-bold">Address</div>,
  },
  {
    accessorKey: "isPaid",
    header: () => <div className="font-bold">IsPaid</div>,
  },
  {
    accessorKey: "totalPrice",
    header: () => <div className="font-bold">Total Price</div>,
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="font-bold">Date</div>,
  },
];
