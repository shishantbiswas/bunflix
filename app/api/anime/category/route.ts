"use server";

import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const category = searchParams.get("category");
  const page = searchParams.get("page");

  if (!category) {
    return Response.json({ error: "category param is required" });
  }
  const response = await fetch(
    `${process.env.ANIWATCH_API}/api/v2/hianime/category/${category}?page=${
      page || 1
    }`,
    { cache: "no-store" }
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
