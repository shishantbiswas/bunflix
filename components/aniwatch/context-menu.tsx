"use client"

import { indexDB } from "@/lib/index-db";
import { useLiveQuery } from "dexie-react-hooks";
import { Check, Clock, PlayCircle, Save } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import Link from "../link";

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
    show: Anime
  }>>

}) {

  const watchHistory = useLiveQuery(() => indexDB.watchLater.toArray());

  return (
    <div
      onMouseLeave={() => {
        setMenu((pre) => { return { ...pre, open: false } })
      }}
      style={{
        opacity: data.open ? "100%" : "0",
        pointerEvents: data.open ? "all" : "none",
        height: data.open ? "" : "0px",
        top: data.y - 30,
        left: data.x > 650 ? `${data.x - 150}px` : data.x
      }}
      className={` absolute transition-all duration-200`}>
      <div
        className="p-3 backdrop-blur-lg bg-black/40 rounded-lg flex text-start flex-col gap-2 text-base text-nowrap">
        <Link className="flex text-red-500 hover:bg-white/10 px-2 py-1  rounded items-center gap-2 " href={`/anime/${data.show.id}`}>
          <PlayCircle size={14} /> Play
        </Link>
        {data.show.episodes.dub > 0 && <Link className="flex hover:bg-white/10 px-2 py-1  rounded items-center gap-2 "
          href={`/anime/${data.show.id}?lang=en`}>
          <PlayCircle size={14} /> Play (Engligh ver.)
        </Link>}
        <button className="flex not-disabled:hover:bg-white/10 px-2 py-1 rounded items-center gap-2 disabled:opacity-25 group"
          disabled={watchHistory ? watchHistory.filter((el) => el.show.id == data.show.id).length > 0 : false}
          onClick={() => {
            indexDB.watchLater.add({
              show: data.show
            })
          }}
        >
          {
            watchHistory && watchHistory.filter((el) => el.show.id == data.show.id).length > 0 ?
              (
                <>
                  <Check size={14} />
                  <span className="">Already Saved</span>
                </>
              ) : (
                <>
                  <Clock size={14} />
                  <span className="">Watch Later</span>
                </>
              )
          }
        </button>
      </div>
    </div>
  )
}