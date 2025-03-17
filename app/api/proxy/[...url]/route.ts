"use server";

import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const reqUrl: string[] = req.nextUrl.pathname.split("/").slice(3); // removes http : api proxy

  const completeUrl = reqUrl
    .map((part) => (part === "https:" ? part + "//" : part + "/"))
    .join("");

  const res = await fetch(decodeURIComponent(completeUrl), {
    cache: "no-store",
    headers: {
      Referer: "https://megacloud.club/",
    },
  });

  console.log(res);
  
  if (!res.ok) {
    return Response.json(
      { res },
      {
        status: 500,
      }
    );
  }

  const data = await res.arrayBuffer();

  return new Response(data, {
    status: 200,
    headers: {
      "Content-Type":
        res.headers.get("Content-Type") || "application/octet-stream",
    },
  });
}
