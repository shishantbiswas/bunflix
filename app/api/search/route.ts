"use server";

import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");
  const q = searchParams.get("q");
  const page = searchParams.get("page");
  const key = process.env.TMDB_KEY;

  if (!q) {
    return Response.json({ Error: "query not provided" });
  }

  if (type === "multi") {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?query=${q}&page=${page || 1
        }&api_key=${key}`,
        { next: { revalidate: 3600, tags: ["tmdb"] } }
      );

      const data = await response.json();
      return Response.json(data, {
        headers: {
          "Cache-Control": "no-store",
        },
      });
    } catch {
      return Response.json({ Error: "error searching" });
    }
  } else {
    try {
      const response = await fetch(
        `${process.env.ANIWATCH_API}/api/v2/hianime/search?q=${q}&page=${page || 1
        }`,
        { next: { revalidate: 3600, tags: ["anime"] } }
      );
      const data = await response.json();

      return Response.json(data, {
        headers: {
          "Cache-Control": "no-store",
        },
      });
    } catch (error) {
      return Response.json({ Error: "error searching" });
    }
  }
}
