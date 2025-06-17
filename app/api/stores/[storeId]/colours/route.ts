import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";

interface Params {
  storeId: string;
}
export async function POST(
  req: Request,
  { params }: { params: Promise<Params> },
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name, value } = body;
    const { storeId } = await params;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Colour name is required", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Colour value is required", { status: 400 });
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

    const colour = await prismadb.colour.create({
      data: {
        name,
        value,
        storeId,
      },
    });

    return NextResponse.json(colour);
  } catch (error) {
    console.log("[COLOUR_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<Params> },
) {
  try {
    const { storeId } = await params;

    const colours = await prismadb.colour.findMany({
      where: {
        storeId,
      },
    });

    return NextResponse.json(colours);
  } catch (error) {
    console.log("[COLOURS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
