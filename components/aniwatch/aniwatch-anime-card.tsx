"use client"

import { MicIcon, CaptionsIcon, HistoryIcon, Clock, Check } from "lucide-react"
import Link from "../link"
import { indexDB, WatchedShows, WatchLater } from "@/lib/index-db"
import { useLiveQuery } from "dexie-react-hooks"
import useLongPress from "@/hooks/useLongPress"
import { useRouter } from "next/navigation"
import { MouseEvent, useRef } from "react"
import { useGlobalTransition } from "@/context/transition-context"

export default function AniwatchAnimeCard({ episode, setMenu, widthClassName }: {
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
  widthClassName?: string
}) {

  const settings = useLiveQuery(() => indexDB.userPreferences.get(1));
  const watchHistory = useLiveQuery(() => indexDB.watchLater.toArray());
  const watchedShows = useLiveQuery(() => indexDB.watchedShows.toArray());

  const router = useRouter();
  const ref = useRef<MouseEvent<HTMLDivElement, globalThis.MouseEvent> | null>(null);
  const { startTransition } = useGlobalTransition();

  const hold = useLongPress({
    onLongPress: () => {
      if (!ref.current) return
      setMenu({
        open: true, x: ref.current.pageX, y: ref.current.pageY, show: {
          ...episode,
          rating: "",
          duration: ""
        }
      })
    }, onClick: () => {
      startTransition(() => router.push(`/anime/${episode.id}`)
      )
    }
  }, { delay: 800 });

  return (
    <button
      {...hold}
      className={`appearance-none cursor-pointer ${widthClassName ? widthClassName : "min-w-[150px] w-full lg:w-full"} h-[300px] rounded-md overflow-hidden group hover:scale-[105%] hover:border-2  border-red-600 transition-transform hover:z-50 relative text-end ${settings && settings.hideWatchedShows && watchedShows?.some((show) => show.id == episode.id) ? "hidden" : "block"}`}
    >
      <img fetchPriority="low" loading="lazy"
        className="w-full h-full object-cover absolute top-0 group-hover:scale-105 transition-all"
        src={episode.poster}
        alt={episode.name}
      />
      <div
        onMouseEnter={(e) => {
          ref.current = e;
        }}
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
        className=" absolute bottom-0 left-0 p-2 bg-linear-to-br from-transparent to-black/80 transition-all group-hover:backdrop-blur-md  size-full flex items-end flex-col justify-end capitalize">
        {(settings && settings.lang == "all") ? (
          <>
            <h1 className="text-lg font-semibold leading-tight">
              {episode.name}
            </h1>
            <p className="text-[12px] opacity-70 italic">{episode.jname}</p>
          </>
        ) : (
          <h1 className="text-lg font-semibold leading-tight">
            {settings && settings.lang == "en" ? episode.name : episode.jname}
          </h1>
        )}
        <div className="flex items-center justify-between text-sm w-full">
          <div className="flex gap-1">
            {watchHistory?.some((show) => show.show.id == episode.id) && (
              <Clock size={14} />
            )}
            {watchedShows?.some((show) => show.show.id == episode.id) && (
              <Check size={14} />
            )}
          </div>
          <div className="flex items-center gap-1.5">
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
      </div>
    </button>
  )
}