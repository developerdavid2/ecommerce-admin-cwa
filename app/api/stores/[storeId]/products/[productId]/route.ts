import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

interface Params {
  storeId?: string;
  productId?: string;
}

export async function GET(req: NextRequest, { params }: { params: Params }) {
  try {
    const { productId } = await params;

    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        images: true,
        category: true,
        size: true,
        colour: true,
      },
    });

    return NextResponse.json({
      ...product,
      price: product?.price ? parseFloat(product.price.toString()) : null,
    });
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
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
    const { storeId, productId } = await params;

    if (!userId) {
      return new Response("Unauthenticated", { status: 401 });
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

    if (!productId) {
      return new NextResponse("product ID is required", { status: 400 });
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

    await prismadb.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        price,
        categoryId,
        sizeId,
        colourId,
        isFeatured,
        isArchived,
        images: {
          deleteMany: {},
        },
      },
    });

    const product = await prismadb.product.update({
      where: {
        id: productId,
      },

      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_PATCH]", error);
    return new Response("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  try {
    const { userId } = await auth();
    const { storeId, productId } = await params;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!productId) {
      return new NextResponse("product ID is required", { status: 400 });
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

    const product = await prismadb.product.deleteMany({
      where: {
        id: productId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
