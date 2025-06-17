import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

interface Params {
  storeId?: string;
  billboardId?: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<Params> },
) {
  try {
    const { billboardId } = await params;

    if (!billboardId) {
      return new Response("Billboard ID is required", { status: 400 });
    }

    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_GET]", error);
    return new Response("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<Params> },
) {
  try {
    const { userId } = await auth();

    const body = await req.json();
    const { label, imageUrl } = body;
    const { storeId, billboardId } = await params;

    if (!userId) {
      return new Response("Unauthenticated", { status: 401 });
    }

    if (!label) {
      return new Response("Billboard label is required", { status: 400 });
    }
    if (!imageUrl) {
      return new Response("Billboard image is required", { status: 400 });
    }

    if (!billboardId) {
      return new Response("Billboard ID is required", { status: 400 });
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

    const billboard = await prismadb.billboard.updateMany({
      where: {
        id: billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_PATCH]", error);
    return new Response("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<Params> },
) {
  try {
    const { userId } = await auth();
    const { storeId, billboardId } = await params;

    if (!userId) {
      return new Response("Unauthenticated", { status: 401 });
    }

    if (!billboardId) {
      return new Response("Billboard ID is required", { status: 400 });
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

    const billboard = await prismadb.billboard.deleteMany({
      where: {
        id: billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_DELETE]", error);
    return new Response("Internal Error", { status: 500 });
  }
}
