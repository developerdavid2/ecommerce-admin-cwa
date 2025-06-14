import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

interface Params {
  storeId?: string;
  sizeId?: string;
}

export async function GET(req: NextRequest, { params }: { params: Params }) {
  try {
    const { sizeId } = await params;

    if (!sizeId) {
      return new Response("Size ID is required", { status: 400 });
    }

    const size = await prismadb.size.findUnique({
      where: {
        id: sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_GET]", error);
    return new Response("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  try {
    const { userId } = await auth();

    const body = await req.json();
    const { name, value } = body;
    const { storeId, sizeId } = await params;

    if (!userId) {
      return new Response("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new Response("Size name is required", { status: 400 });
    }
    if (!value) {
      return new Response("Size value is required", { status: 400 });
    }

    if (!sizeId) {
      return new Response("Size ID is required", { status: 400 });
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

    const size = await prismadb.size.updateMany({
      where: {
        id: sizeId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_PATCH]", error);
    return new Response("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  try {
    const { userId } = await auth();
    const { storeId, sizeId } = await params;

    if (!userId) {
      return new Response("Unauthenticated", { status: 401 });
    }

    if (!sizeId) {
      return new Response("Size ID is required", { status: 400 });
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

    const size = await prismadb.size.deleteMany({
      where: {
        id: sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_DELETE]", error);
    return new Response("Internal Error", { status: 500 });
  }
}
