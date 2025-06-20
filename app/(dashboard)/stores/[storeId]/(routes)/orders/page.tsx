import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import { priceFormatter } from "@/lib/utils";

import { OrderColumn } from "@/app/(dashboard)/stores/[storeId]/(routes)/orders/components/column";
import { OrderClient } from "@/app/(dashboard)/stores/[storeId]/(routes)/orders/components/order-client";

interface OrdersPageProps {
  params: Promise<{ storeId: string }>;
}

const OrdersPage = async ({ params }: OrdersPageProps) => {
  const { storeId } = await params;
  const orders = await prismadb.order.findMany({
    where: {
      storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.orderItems
      .map((orderItem) => orderItem.product.name)
      .join(", "),
    totalPrice: priceFormatter(
      item.orderItems.reduce((total, item) => {
        return total + Number(item.product.price);
      }, 0),
    ),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
