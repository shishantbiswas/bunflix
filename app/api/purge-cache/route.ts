"use server"

import { revalidateTag } from "next/cache"

export async function GET() {

    revalidateTag("anime");
    revalidateTag("tmdb");

    return Response.json({
        revalidated: true,
        now: Date.now()
    })
}