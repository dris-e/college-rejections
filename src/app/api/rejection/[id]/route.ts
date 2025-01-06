import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { z } from "zod";
import { updateSchema } from "@/types";

export const runtime = "edge";

type UpdateData = {
  views?: 1;
  upvotes?: 1 | -1;
};

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { env } = getRequestContext();
  const adapter = new PrismaD1(env.DB);
  const prisma = new PrismaClient({ adapter });
  const { id } = await params;

  try {
    const data = updateSchema.parse(await req.json()) as UpdateData;
    const [field, value] = Object.entries(data)[0] as ["views" | "upvotes", 1 | -1];

    const rejection = await prisma.rejection.update({
      where: { id },
      data: { [field]: { increment: value } },
    });

    return NextResponse.json(rejection);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Failed to update rejection" }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  const { env } = getRequestContext();
  const adapter = new PrismaD1(env.DB);
  const prisma = new PrismaClient({ adapter });

  try {
    const rejection = await prisma.rejection.findUnique({
      where: { id: id },
      include: { college: true },
    });

    console.log("rejection", rejection);

    if (!rejection) {
      return NextResponse.json({ error: "Rejection not found" }, { status: 404 });
    }

    return NextResponse.json({ rejection });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch rejection" }, { status: 500 });
  }
}
