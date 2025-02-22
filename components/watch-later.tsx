"use client";

import { indexDB } from "@/lib/index-db";
import { useLiveQuery } from "dexie-react-hooks";
import { CaptionsIcon, MicIcon } from "lucide-react";
import Link from "@/components/link";

export default function WatchLater() {
  const watchHistory = useLiveQuery(() => indexDB.watchLater.toArray());

  return (
    <div className="p-4 min-h-screen flex flex-col">
      <h1 className="text-3xl font-semibold text-start w-fit">Watch Later</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3  lg:grid-cols-4 xl:grid-cols-6 w-full gap-3 mt-2 ">
        {watchHistory && watchHistory?.map(({show:episode}) => (
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
            <div className=" absolute bottom-0 left-0 p-2 bg-linear-to-br from-transparent to-black/80 transition-all group-hover:backdrop-blur-md size-full flex items-end flex-col justify-end capitalize">
              <h1 className="text-lg font-semibold leading-tight">
                {episode.name || episode.jname}
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
        ))}
        {watchHistory && watchHistory.length <= 0 && <p>No Watch History Found</p>}
      </div>
    </div>
  );
}
