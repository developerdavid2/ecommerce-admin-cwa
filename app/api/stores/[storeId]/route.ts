import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

interface Params {
  storeId: string;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<Params> },
) {
  try {
    const { userId } = await auth();

    const body = await req.json();
    const { name } = body;

    const { storeId } = await params;

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new Response("Store name is required", { status: 400 });
    }

    if (!storeId) {
      return new Response("Store ID is required", { status: 400 });
    }

    const store = await prismadb.store.updateMany({
      where: {
        id: storeId,
        userId,
      },
      data: {
        name,
      },
    });

    if (!store) {
      return new Response("Store not found", { status: 404 });
    }

    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORE_PATCH]", error);
    return new Response("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<Params> },
) {
  try {
    const { userId } = await auth();

    const { storeId } = await params;

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!storeId) {
      return new Response("Store ID is required", { status: 400 });
    }

    const store = await prismadb.store.deleteMany({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!store) {
      return new Response("Store not found", { status: 404 });
    }

    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORE_DELETE]", error);
    return new Response("Internal Error", { status: 500 });
  }
}
