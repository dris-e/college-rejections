import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { createRejectionSchema } from "@/types";
import { z } from "zod";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { env } = getRequestContext();
  const adapter = new PrismaD1(env.DB);
  const prisma = new PrismaClient({ adapter });

  const formData = await req.formData();

  const image = formData.get("image") as File;
  console.log(image);

  const data = JSON.parse(formData.get("data") as string);
  const parsedData = createRejectionSchema.parse(data);

  try {
    const imageKey = `rejections/${crypto.randomUUID()}`;
    await env.BUCKET.put(imageKey, image);
    const imageUrl = `${env.PUBLIC_BUCKET_URL}/${imageKey}`;

    const rejection = await prisma.rejection.create({
      data: {
        ...parsedData,
        image: imageUrl,
        dateRejected: new Date(parsedData.dateRejected),
        dateApplied: new Date(parsedData.dateApplied),
      },
      include: {
        college: true,
      },
    });

    return NextResponse.json(rejection);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Failed to create rejection" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { env } = getRequestContext();
  const adapter = new PrismaD1(env.DB);
  const prisma = new PrismaClient({ adapter });

  const search = req.nextUrl.searchParams.get("search") || "";
  const sort = req.nextUrl.searchParams.get("sort") || "recent";
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
  // const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10");
  const limit = 10;
  const skip = (page - 1) * limit;

  const orderBy = {
    recent: { dateCreated: "desc" },
    oldest: { dateCreated: "asc" },
    popular: { upvotes: "desc" },
    views: { views: "desc" },
  }[sort] as any;

  const where = search
    ? {
        OR: [
          { college: { name: { contains: search } } },
          { name: { contains: search } },
          { highSchool: { contains: search } },
          { major: { contains: search } },
          { gpa: parseFloat(search) ? { equals: parseFloat(search) } : undefined },
          { sat: parseInt(search) ? { equals: parseInt(search) } : undefined },
          { act: parseInt(search) ? { equals: parseInt(search) } : undefined },
          { classRank: parseInt(search) ? { equals: parseInt(search) } : undefined },
          { extracurriculars: { contains: search } },
        ].filter(Boolean),
      }
    : {};

  try {
    const rejections = await prisma.rejection.findMany({
      where,
      include: { college: true },
      orderBy,
      take: limit,
      skip,
    });

    const total = await prisma.rejection.count({ where });

    return NextResponse.json({
      rejections,
      total,
      pages: Math.ceil(total / limit),
      page,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to search rejections" }, { status: 500 });
  }
}
