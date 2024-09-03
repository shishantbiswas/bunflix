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
    `${process.env.ANIWATCH_API}/anime/${category}?page=${page || 1}`
  );
  if (!response.ok) {
    return Response.json({ error: "failed to fetch category info" });
  }
  const data = (await response.json()) as aniwatchCategories;

  return Response.json(data);
}
