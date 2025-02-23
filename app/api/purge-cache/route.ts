"use server"

import { revalidateTag } from "next/cache"

export async function GET() {

    revalidateTag("anime");
    revalidateTag("tmdb");

    return Response.json({
        success: true,
        now: Date.now()
    })
}