"use server"

import { revalidateTag } from "next/cache"

export async function GET() {

    revalidateTag("anime", 'hours');
    revalidateTag("tmdb", 'hours');

    return Response.json({
        success: true,
        now: Date.now()
    })
}