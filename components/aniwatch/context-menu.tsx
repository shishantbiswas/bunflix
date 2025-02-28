"use client"

import { indexDB, WatchLater } from "@/lib/index-db";
import { CheckIcon, Clock, Link2Icon, PlayCircle, XCircle, XIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import Link from "../link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLiveQuery } from "dexie-react-hooks";

export function Menu({ data, setMenu }: {
  data: {
    open: boolean,
    x: number,
    y: number
    show: Anime
  },
  setMenu: Dispatch<SetStateAction<{
    open: boolean;
    x: number;
    y: number;
    show: Anime,
  }>>
}) {

  const [copied, setCopied] = useState(false);
  const [customEpisode, setCustomEpisode] = useState(1);
  const router = useRouter();

  const watchedShows = useLiveQuery(() => indexDB.watchedShows.toArray());
  const watchHistory = useLiveQuery(() => indexDB.watchLater.toArray());

  return (
    <div
      onMouseLeave={() => {
        setMenu((pre) => { return { ...pre, open: false } })
        setCustomEpisode(1)
      }}
      style={{
        opacity: data.open ? "100%" : "0",
        pointerEvents: data.open ? "all" : "none",
        height: data.open ? "" : "0px",
        top: data.y - 30,
        left: data.x > 650 ? `${data.x - 150}px` : data.x
      }}
      className={` absolute transition-all duration-200 z-50`}>
      <div
        className="p-3 backdrop-blur-lg bg-black/40 rounded-lg flex text-start flex-col gap-2 text-base text-nowrap">
        <h1 className="text-xl font-semibold text-wrap max-w-[240px] leading-tight m-2">{data.show.name || data.show.jname}</h1>
        <Link className="flex  hover:bg-white/10 px-2 py-1  rounded items-center gap-2 " href={`/anime/${data.show.id}`}>
          <PlayCircle size={14} /> Play
        </Link>
        {data.show.episodes.dub > 0 && <Link className="flex hover:bg-white/10 px-2 py-1  rounded items-center gap-2 "
          href={`/anime/${data.show.id}?lang=en`}>
          <PlayCircle size={14} /> Play (Engligh ver.)
        </Link>}
        <button
          className="flex not-disabled:hover:bg-white/10 px-2 py-1 rounded items-center gap-2 disabled:opacity-25 group"
          disabled={copied}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(`${window.location.href.split("/").splice(0, 3).join("/")}/anime/${data.show.id}`);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000)
            } catch (err) {
              console.error("Failed to copy: ", err);
            }
          }}>
          <Link2Icon size={14} /> {!copied ? "Copy Link" : "Copied !"}
        </button>

        {watchHistory &&
          (!watchHistory?.some((show) => show.show.id == data.show.id) ? (
            <button
              className="flex hover:bg-white/10 px-2 py-1 rounded items-center gap-2"
              onClick={() => {
                indexDB.watchLater.add({
                  id: data.show.id,
                  show: data.show
                })
                toast.success(`${data.show.name} added to Watch Later`)
              }}
            >
              <Clock size={14} />
              <span className="">Watch Later</span>

            </button>
          ) : (
            <button
              className="flex hover:bg-white/10 px-2 py-1 rounded items-center gap-2"
              onClick={() => {
                indexDB.watchLater.delete(data.show.id)
                toast.warning(`${data.show.name} removed from Watch Later`)
              }}
            >
              <XIcon size={14} /> Remove from Watch Later
            </button>
          ))}
        {watchedShows && (!watchedShows?.some((show) => show.show.id == data.show.id) ? (<button
          className="flex hover:bg-white/10 px-2 py-1 rounded items-center gap-2"
          onClick={() => {
            indexDB.watchedShows.add({ id: data.show.id, show: data.show })
            toast.success(`${data.show.name} added to Watched Shows`)
          }}
        >
          <span className="ml-0.5">?</span>Watched Already
        </button>) : (
          <button
            className="flex hover:bg-white/10 px-2 py-1 rounded items-center gap-2"
            onClick={() => {
              indexDB.watchedShows.delete(data.show.id)
              toast.warning(`${data.show.name} removed from Watched Shows`)
            }}
          >
            <XIcon size={14} />
            Remove from Watched Shows
          </button>
        ))}
        <div className=" flex flex-col">
          <p className="opacity-60 text-sm ml-2">Custom Episode:</p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <input
              type="number"
              placeholder="1"
              onChange={(e) => { setCustomEpisode(parseInt(e.target.value)) }}
              max={data.show.episodes.sub}
              min={1}
              className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-moz-appearance:textfield] w-16 mt-2 ml-2 border border-white/40 px-2 rounded-md" />
            <div className="mt-2 flex flex-col">
              {data.show.episodes.sub > 0 && data.show.episodes.sub >= customEpisode &&
                <button type="submit"
                  className="flex hover:bg-white/10 px-2 py-1 rounded items-center gap-2"
                  onClick={() => {
                    if (customEpisode > data.show.episodes.sub) {
                      toast.error("Select a valid Episode Number")
                      return
                    } else {
                      router.push(`/anime/${data.show.id}?num=${customEpisode}`)
                    }
                  }}>
                  Play {customEpisode} Episode
                </button>}
              {data.show.episodes.dub > 0 && data.show.episodes.dub >= customEpisode &&
                <button type="submit"
                  className="flex hover:bg-white/10 px-2 py-1 rounded items-center gap-2"
                  onClick={() => {
                    if (customEpisode > data.show.episodes.dub) {
                      toast.error("Select a valid Episode Number")
                      return
                    } else {
                      router.push(`/anime/${data.show.id}?num=${customEpisode}&lang=en`)
                    }
                  }}>
                  Play {customEpisode} Episode Dubbed
                </button>}
            </div>
          </form>
        </div>
        <button
          className="flex text-red-500 hover:bg-white/10 px-2 py-1 rounded items-center gap-2"
          onClick={() => {
            setMenu({ ...data, open: false })
          }}
        >
          <XCircle size={14} />
          <span className="">Close</span>

        </button>
      </div>
    </div>
  )
}