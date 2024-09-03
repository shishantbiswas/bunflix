"use server";

import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const reqUrl: string[] = req.nextUrl.pathname.split("/").slice(3);
  const completeUrl = reqUrl
    .map((part) => (part === "https:" ? part + "//" : part + "/"))
    .join("");

  const urlArray = completeUrl.split(".");

  if (urlArray[urlArray.length - 1] === "m3u8/") {
    const res = await fetch(completeUrl, {
      next: { revalidate: 3600 },
      cache: "no-store",
    });

    if (!res.ok) {
      return Response.json(
        { Error: "failed to fetch requested url" },
        { status: 404 }
      );
    }

    const data = await res.arrayBuffer();

    return new Response(data, { status: 200 });
  } else {
    redirect(completeUrl);
  }
}
