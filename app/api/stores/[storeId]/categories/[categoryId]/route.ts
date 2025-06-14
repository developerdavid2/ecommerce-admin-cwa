import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

interface Params {
  storeId?: string;
  categoryId?: string;
}

export async function GET(req: NextRequest, { params }: { params: Params }) {
  try {
    const { categoryId } = await params;

    if (!categoryId) {
      return new Response("Category ID is required", { status: 400 });
    }

    const category = await prismadb.category.findUnique({
      where: {
        id: categoryId,
      },
      include: {
        billboard: true,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_GET]", error);
    return new Response("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  try {
    const { userId } = await auth();

    const body = await req.json();
    const { name, billboardId } = body;
    const { storeId, categoryId } = await params;

    if (!userId) {
      return new Response("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new Response("Category name is required", { status: 400 });
    }
    if (!billboardId) {
      return new Response("Billboard ID is required", { status: 400 });
    }

    if (!categoryId) {
      return new Response("Category ID is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new Response("Unauthorized", { status: 403 });
    }

    const category = await prismadb.category.updateMany({
      where: {
        id: categoryId,
      },
      data: {
        name,
        billboardId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_PATCH]", error);
    return new Response("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  try {
    const { userId } = await auth();
    const { storeId, categoryId } = await params;

    if (!userId) {
      return new Response("Unauthenticated", { status: 401 });
    }

    if (!categoryId) {
      return new Response("Category ID is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new Response("Unauthorized", { status: 403 });
    }

    const category = await prismadb.category.deleteMany({
      where: {
        id: categoryId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_DELETE]", error);
    return new Response("Internal Error", { status: 500 });
  }
}
