"use client"

import { MicIcon, CaptionsIcon } from "lucide-react"
import Link from "../link"

export default function AniwatchAnimeCard({ episode, setMenu }: {
    episode: {
        id: string
        poster: string
        name: string
        jname?: string | undefined
        type: string
        episodes: {
            sub: number
            dub: number
        }
        rating?: string
    },
    setMenu: ({ open, x, y, show }: { open: boolean, x: number, y: number, show: Anime }) => void;
}) {
    return (
        <Link
            key={episode.id}
            href={`/anime/${episode.id}`}
            className="min-w-[150px] w-full lg:w-full h-[300px] rounded-md overflow-hidden group  relative text-end"
        >
            <img fetchPriority="low" loading="lazy"
                className="w-full h-full object-cover absolute top-0 group-hover:scale-105 transition-all"
                src={episode.poster}
                alt={episode.name}
            />
            <div
                onContextMenu={(e) => {
                    e.preventDefault();
                    setMenu({
                        open: true, x: e.pageX, y: e.pageY, show: {
                            ...episode,
                            rating: "",
                            duration: ""
                        }
                    });
                }}
                className=" absolute bottom-0 left-0 p-2 bg-linear-to-br from-transparent to-black/80 transition-all group-hover:backdrop-blur-md size-full flex items-end flex-col justify-end capitalize">
                <h1 className="text-lg font-semibold leading-tight">
                    {episode.name}
                </h1>
                <h1 className="text-sm leading-tight my-1.5">
                    {episode.jname}
                </h1>
                <div className="flex text-sm gap-1">
                    <p>{episode.type}</p>
                    <p className="flex items-center gap-1 bg-purple-500/70 rounded-xs  px-1">
                        <MicIcon size={10} />
                        {episode.episodes?.dub || "NA"}
                    </p>
                    <p className="flex items-center gap-1 bg-yellow-500/80 rounded-xs  px-1">
                        <CaptionsIcon size={10} />
                        {episode.episodes.sub}
                    </p>
                </div>
            </div>
        </Link>
    )
}