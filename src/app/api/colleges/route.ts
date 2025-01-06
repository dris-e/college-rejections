import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { z } from "zod";
import { createCollegeSchema } from "@/types/college";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { env } = getRequestContext();
  const adapter = new PrismaD1(env.DB);
  const prisma = new PrismaClient({ adapter });

  const data = await req.json();
  const parsedData = createCollegeSchema.parse(data);

  try {
    const existingCollege = await prisma.college.findFirst({
      where: { name: parsedData.name },
    });

    if (existingCollege) {
      const newAcceptanceRate =
        existingCollege.acceptanceRate !== null ? (existingCollege.acceptanceRate + (parsedData.acceptanceRate || 0)) / 2 : parsedData.acceptanceRate;

      const newGradRate = existingCollege.gradRate !== null ? (existingCollege.gradRate + (parsedData.gradRate || 0)) / 2 : parsedData.gradRate;

      return NextResponse.json(
        await prisma.college.update({
          where: { id: existingCollege.id },
          data: {
            acceptanceRate: newAcceptanceRate,
            gradRate: newGradRate,
          },
        })
      );
    }

    return NextResponse.json(
      await prisma.college.create({
        data: {
          name: parsedData.name,
          acceptanceRate: parsedData.acceptanceRate || null,
          gradRate: parsedData.gradRate || null,
        },
      })
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

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

    if (colleges.length === 0) {
      return NextResponse.json({ error: "No colleges found" }, { status: 404 });
    }

    return NextResponse.json(colleges);
  } catch (error) {
    return NextResponse.json({ error: "Failed to search colleges" }, { status: 500 });
  }
}
