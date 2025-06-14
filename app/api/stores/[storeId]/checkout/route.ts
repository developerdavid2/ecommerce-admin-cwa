import Stripe from "stripe";
import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS(request: NextRequest) {
  console.log("OPTIONS request received for checkout route");
  console.log(
    "Request headers:",
    Object.fromEntries(request.headers.entries()),
  );

  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

interface Params {
  storeId: string;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<Params> },
) {
  console.log("POST request received for checkout route");

  try {
    const { productIds } = await req.json();
    const { storeId } = await params;

    console.log("Store ID:", storeId);
    console.log("Product IDs:", productIds);

    if (!productIds || productIds.length === 0) {
      return new NextResponse("Product ids are required", {
        status: 400,
        headers: corsHeaders,
      });
    }

    const products = await prismadb.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    console.log("Found products:", products.length);

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    products.forEach((product) => {
      line_items.push({
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: product.name,
          },
          unit_amount: Number(product.price) * 100,
        },
      });
    });

    const order = await prismadb.order.create({
      data: {
        storeId: storeId,
        isPaid: false,
        orderItems: {
          create: productIds.map((productId: string) => ({
            product: {
              connect: {
                id: productId,
              },
            },
          })),
        },
      },
    });

    console.log("Order created:", order.id);

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      billing_address_collection: "required",
      phone_number_collection: {
        enabled: true,
      },
      success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
      cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?cancelled=1`,
      metadata: {
        orderId: order.id,
      },
    });

    console.log("Stripe session created:", session.id);

    return NextResponse.json({ url: session.url }, { headers: corsHeaders });
  } catch (error) {
    console.error("[CHECKOUT_ERROR]", error);
    return new NextResponse("Internal error", {
      status: 500,
      headers: corsHeaders,
    });
  }
}
