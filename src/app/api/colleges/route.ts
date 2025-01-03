import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { collegeSchema } from "@/types";

export async function POST(req: NextRequest) {
  const { env } = getRequestContext();
  const adapter = new PrismaD1(env.DB);
  const prisma = new PrismaClient({ adapter });

  const data = await req.json();
  const parsedData = collegeSchema.parse(data);

  try {
    const college = await prisma.college.upsert({
      where: {
        name: parsedData.name,
      },
      update: {
        acceptanceRate: parsedData.acceptanceRate,
        gradRate: parsedData.gradRate,
      },
      create: {
        name: parsedData.name,
        acceptanceRate: parsedData.acceptanceRate,
        gradRate: parsedData.gradRate,
      },
    });

    return NextResponse.json(college);
  } catch (error) {
    return NextResponse.json({ error: "Failed to find or create college" }, { status: 500 });
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
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(colleges);
  } catch (error) {
    return NextResponse.json({ error: "Failed to search colleges" }, { status: 500 });
  }
}
