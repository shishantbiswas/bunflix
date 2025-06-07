"use server";

import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const producer = searchParams.get("producer");
  const page = searchParams.get("page");

  if (!producer) {
    return Response.json({ error: "producer param is required" });
  }
  const response = await fetch(
    `${process.env.ANIWATCH_API}/api/v2/hianime/producer/${producer}?page=${
      page || 1
    }`,
    { next: { revalidate: 3600, tags: ["anime"] } }
  );
  if (!response.ok) {
    return Response.json({ error: "failed to fetch category info" });
  }
  const data = (await response.json()) as AniwatchCategories;

  return Response.json(data, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
