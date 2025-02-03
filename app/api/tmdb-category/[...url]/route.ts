"use server";

import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {

    const reqUrl = req.nextUrl.pathname.split("/").slice(3).join("/");
    const sp = req.nextUrl.search.replaceAll("?", "&")

    const baseUrl = "https://api.themoviedb.org/3"
    const key = process.env.TMDB_KEY
    const completeUri = `${baseUrl}/${reqUrl.split("&")[0]}?api_key=${key}${sp}`

    const res = await fetch(completeUri,{
        next: { revalidate: 3600, tags: ["tmdb"]  }
    })
    if (!res.ok) {
        
        return Response.json({ error: "fetch failed" })
    }
    const data = await res.json()

    return Response.json(data, {
        status: 200,
        headers: {
            "Cache-Control": "no-store",
        },
    });
}
