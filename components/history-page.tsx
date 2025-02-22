"use client";

import { indexDB } from "@/lib/index-db";
import { useLiveQuery } from "dexie-react-hooks";
import { CaptionsIcon, MicIcon, Trash2Icon } from "lucide-react";
import Link from "@/components/link";

export default function History() {
  const searchHistory = useLiveQuery(() => indexDB.searches.toArray());
  const watchHistory = useLiveQuery(() => indexDB.watchHistory.toArray());

  return (
    <div className="p-4 min-h-screen flex flex-col">
      <h1 className="text-3xl font-semibold text-start w-fit">Watch History</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3  lg:grid-cols-4 xl:grid-cols-6 w-full gap-3 mt-2 ">
        {watchHistory && watchHistory?.map(({ show: episode, ep, lang, time, duration, epNum }) => (
          <Link
            key={episode.id}
            href={`/anime/${episode.id}?ep=${ep}&lang=${lang}&num=${epNum || 0}&t=${time}`}
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
              <p>{Number((time) / 60).toFixed()}/{Number((duration) / 60).toFixed()} Min.</p>
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
      <h1 className="text-3xl font-semibold text-start w-fit mt-8 mb-4">Search History</h1>
      <div className="flex w-full flex-col gap-4 ">
        {searchHistory?.map((value) => (
          <div className="relative w-full" key={value.id}>
            <Link
              className="w-full "
              href={`/search/${value.type}/${value.term}`}
            >
              <div className="bg-white/10 p-3 w-full rounded-lg flex justify-between items-center">
                <div className=" w-fit flex flex-col">
                  <p className="text-lg">{value.term}</p>
                  <p className="text-sm">{value.type}</p>
                </div>
              </div>
            </Link>
            <button
              onClick={() => {
                indexDB.searches.delete(value.id);
              }}
              className="absolute top-4 right-2 z-50  p-2 bg-red-500/80 rounded-full"
            >
              <Trash2Icon />
            </button>
          </div>
        ))}
        {searchHistory && searchHistory.length <= 0 && <p>No Search History Found</p>}
      </div>

    </div>
  );
}
