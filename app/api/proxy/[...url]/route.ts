"use server";

import { redirect } from "next/navigation";
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

    if (!res.ok) {
        redirect(completeUrl);
    }
    if (!res.ok) {
        return Response.json(
            { error: true },
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
            "Cache-Control": "private, max-age=3600",
        },
    });
}