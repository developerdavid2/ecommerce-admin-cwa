import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

interface Params {
  storeId?: string;
  colourId?: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<Params> },
) {
  try {
    const { colourId } = await params;

    if (!colourId) {
      return new Response("Colour ID is required", { status: 400 });
    }

    const colour = await prismadb.colour.findUnique({
      where: {
        id: colourId,
      },
    });

    return NextResponse.json(colour);
  } catch (error) {
    console.log("[COLOUR_GET]", error);
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
    const { name, value } = body;
    const { storeId, colourId } = await params;

    if (!userId) {
      return new Response("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new Response("Colour name is required", { status: 400 });
    }
    if (!value) {
      return new Response("Colour value is required", { status: 400 });
    }

    if (!colourId) {
      return new Response("Colour ID is required", { status: 400 });
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

    const colour = await prismadb.colour.updateMany({
      where: {
        id: colourId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(colour);
  } catch (error) {
    console.log("[COLOUR_PATCH]", error);
    return new Response("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<Params> },
) {
  try {
    const { userId } = await auth();
    const { storeId, colourId } = await params;

    if (!userId) {
      return new Response("Unauthenticated", { status: 401 });
    }

    if (!colourId) {
      return new Response("Colour ID is required", { status: 400 });
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

    const colour = await prismadb.colour.deleteMany({
      where: {
        id: colourId,
      },
    });

    return NextResponse.json(colour);
  } catch (error) {
    console.log("[COLOUR_DELETE]", error);
    return new Response("Internal Error", { status: 500 });
  }
}
