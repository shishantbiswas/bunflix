"use server";

import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const reqUrl: string[] = req.nextUrl.pathname.split("/").slice(3); // removes http : //

  const completeUrl = reqUrl
    .map((part) => (part === "https:" ? part + "//" : part + "/"))
    .join("");

  const res = await fetch(decodeURIComponent(completeUrl), {
    cache: "no-store",
    headers: {
      Referer: "https://megacloud.club/",
    },
  });

  const reader: ReadableStreamDefaultReader | null = res.body?.getReader() || null;

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