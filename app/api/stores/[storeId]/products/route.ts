import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const {
      name,
      images,
      price,
      categoryId,
      colourId,
      sizeId,
      isFeatured,
      isArchived,
    } = body;
    const { storeId } = await params;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Product name is required", { status: 400 });
    }

    if (!images) {
      return new NextResponse("Product Image is required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Product price is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category ID is required", { status: 400 });
    }
    if (!colourId) {
      return new NextResponse("Colour ID is required", { status: 400 });
    }
    if (!sizeId) {
      return new NextResponse("Size ID is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const product = await prismadb.product.create({
      data: {
        name,

        price,
        categoryId,
        colourId,
        sizeId,
        isFeatured,
        isArchived,
        storeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colourId = searchParams.get("colourId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    const { storeId } = await params;

    const products = await prismadb.product.findMany({
      where: {
        categoryId,
        colourId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
        storeId,
      },
      include: {
        images: true,
        category: true,
        colour: true,
        size: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const serializedProducts = products.map((product) => ({
      ...product,
      price: parseFloat(product.price.toString()),
    }));

    return NextResponse.json(serializedProducts);
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
