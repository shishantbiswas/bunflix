"use server";

import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const reqUrl: string[] = req.nextUrl.pathname.split("/").slice(3);
  const completeUrl = reqUrl
    .map((part) => (part === "https:" ? part + "//" : part + "/"))
    .join("");

  const masterManifest =
    completeUrl.split("/")[completeUrl.split("/").length - 2];

  if (masterManifest === "master.m3u8") {
    const res = await fetch(completeUrl, {
      cache:"no-store",
    });

    if (!res.ok) {
      redirect(completeUrl);
    }

    const data = await res.arrayBuffer();

    return new Response(data, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } else {
    redirect(completeUrl);
  }
}
