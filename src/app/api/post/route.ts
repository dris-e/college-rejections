import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { rejectionSchema } from "@/types";

export async function POST(req: NextRequest) {
  const { env } = getRequestContext();
  const adapter = new PrismaD1(env.DB);
  const prisma = new PrismaClient({ adapter });

  const data = await req.json();
  const parsedData = rejectionSchema.parse(data);

  try {
    const rejection = await prisma.rejection.create({
      data: {
        ...parsedData,
        dateRejected: new Date(parsedData.dateRejected),
        dateApplied: new Date(parsedData.dateApplied),
      },
      include: {
        college: true,
      },
    });

    return NextResponse.json(rejection);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create rejection" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { env } = getRequestContext();
  const adapter = new PrismaD1(env.DB);
  const prisma = new PrismaClient({ adapter });

  const search = req.nextUrl.searchParams.get("search");

  try {
    const colleges = await prisma.college.findMany({
      where: {
        name: {
          contains: search || "",
        },
      },
    });

    return NextResponse.json(colleges);
  } catch (error) {
    return NextResponse.json({ error: "Failed to search colleges" }, { status: 500 });
  }
}
