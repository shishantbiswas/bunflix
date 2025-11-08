"use server";

import { NextRequest } from "next/server";

export async function GET(req: NextRequest,ctx: RouteContext<"/api/proxy/[...url]">) {

  const reqUrl = (await ctx.params).url
  // const reqUrl: string[] = req.nextUrl.pathname.split("/").slice(3); // removes http : //

  const completeUrl = reqUrl
    .map((part) => (part === "https:" ? part + "//" : part + "/"))
    .join("");

  const sanitizedUrl = new URL(decodeURIComponent(completeUrl));

  if(sanitizedUrl.host === "thunderstrike77.online"){
    sanitizedUrl.host = "haildrop77.pro"
  }

  const res = await fetch((sanitizedUrl), {
    cache: "no-store",
    priority: "high",
    redirect: "follow",
    keepalive: true,
    headers: {
      ...req.headers,
      Referer: "https://megacloud.club/",
    },
  });

  if (!res.ok) {
    return Response.json({
      error: res.status,
      message: res.statusText,
    });
  }

  const reader: ReadableStreamDefaultReader | null =
    res.body?.getReader() || null;

  function iteratorToStream(
    iterator: ReadableStreamDefaultReader
  ): ReadableStream {
    return new ReadableStream({
      async pull(controller) {
        const { value, done } = await iterator.read();

        if (done) {
          controller.close();
        } else if (value) {
          controller.enqueue(value);
        }
      },
    });
  }

  if (!reader) {
    return new Response("No body in response", { status: 500 });
  }

  const stream = iteratorToStream(reader);

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type":
        res.headers.get("Content-Type") || "application/octet-stream",
      "Cache-Control": "private, max-age=3600",
    },
  });
}
