"use client";

import { indexDB } from "@/lib/index-db";
import { useLiveQuery } from "dexie-react-hooks";
import {
  CaptionsIcon,
  Link2Icon,
  MicIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import Link from "@/components/link";
import { Dispatch, SetStateAction, useState } from "react";

export default function History() {
  const searchHistory = useLiveQuery(() => indexDB.searches.toArray());
  const watchHistory = useLiveQuery(() => indexDB.watchHistory.toArray());
  const watchedShows = useLiveQuery(() => indexDB.watchedShows.toArray());

  const [menu, setMenu] = useState<{
    open: boolean;
    x: number;
    y: number;
    show: Anime;
    ep?: string;
    duration?: number;
    epNum?: number | string;
    lang?: string;
    time?: number;
  }>({
    open: false,
    x: 0,
    y: 0,
    show: {
      duration: "",
      episodes: { dub: 0, sub: 0 },
      id: "",
      name: "",
      poster: "",
      rating: "",
      type: "",
    },
    ep: "",
    duration: 0,
    epNum: 0,
    lang: "",
    time: 0,
  });

  return (
    <div className="p-4 min-h-screen flex flex-col">
      <h1 className="text-3xl font-semibold text-start w-fit">Watch History</h1>
      <HistoryMenu menu={menu} setMenu={setMenu} />

      {/*  */}
      <div className="grid grid-cols-2 sm:grid-cols-3  lg:grid-cols-4 xl:grid-cols-6 w-full gap-3 mt-2 ">
        {watchHistory &&
          watchHistory
            .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
            .slice(0, 6)
            .map(({ show: episode, ep, lang, time, duration, epNum }, i) => (
              <Link
                key={episode.id + i}
                href={`/watch/${episode.id}?ep=${ep}&lang=${lang}&num=${
                  epNum || 0
                }&t=${time}`}
                className="min-w-[150px] w-full lg:w-full h-[300px] rounded-md overflow-hidden group  relative text-end"
              >
                <img
                  fetchPriority="low"
                  loading="lazy"
                  className="w-full h-full object-cover absolute top-0 group-hover:scale-105 transition-all"
                  src={episode.poster}
                  alt={episode.name}
                />
                <div
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setMenu({
                      open: true,
                      x: e.pageX,
                      y: e.pageY,
                      show: episode,
                      ep,
                      duration,
                      epNum,
                      lang,
                      time,
                    });
                  }}
                  className=" absolute bottom-0 left-0 p-2 bg-linear-to-br from-transparent to-black/80 transition-all group-hover:backdrop-blur-md size-full flex items-end flex-col justify-end capitalize"
                >
                  <h1 className="text-lg font-semibold leading-tight">
                    {episode.name || episode.jname}
                  </h1>
                  {(time / duration) * 100 > 90 ? (
                    <p>Completed</p>
                  ) : (
                    <p>
                      {Number((time / 60).toFixed())}/
                      {Number((duration / 60).toFixed())} Min.
                    </p>
                  )}

                  <div className="flex text-sm gap-1">
                    <p>{episode.type}</p>
                    {lang == "en" ? (
                      <p className="flex items-center gap-1 bg-purple-500/70 rounded-xs  px-1">
                        <MicIcon size={10} />
                        {epNum || "NA"}
                      </p>
                    ) : (
                      <p className="flex items-center gap-1 bg-yellow-500/80 rounded-xs  px-1">
                        <CaptionsIcon size={10} />
                        {epNum || "NA"}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
      </div>

      {/*  */}
      <div id="search">
        <h1 className="text-3xl font-semibold text-start w-fit mt-8">
          Search History
        </h1>
        <div className="mt-2 grid w-full md:grid-cols-2 gap-4 ">
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
                onClick={async () => {
                  await indexDB.searches.delete(value.id);
                }}
                className="absolute top-4 right-2 z-50  p-2 bg-red-500/80 rounded-full"
              >
                <Trash2Icon />
              </button>
            </div>
          ))}
          {searchHistory && searchHistory.length <= 0 && (
            <p>No Search History Found</p>
          )}
        </div>
      </div>

      {/*  */}

      <h1 className="text-3xl font-semibold text-start w-fit mt-8">
        Watched Shows
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3  lg:grid-cols-4 xl:grid-cols-6 w-full gap-3 mt-2 ">
        {watchedShows &&
          watchedShows?.map(({ show: episode }) => (
            <Link
              key={episode.id}
              href={`/watch/${episode.id}`}
              className="min-w-[150px] w-full lg:w-full h-[300px] rounded-md overflow-hidden group  relative text-end"
            >
              <img
                fetchPriority="low"
                loading="lazy"
                className="w-full h-full object-cover absolute top-0 group-hover:scale-105 transition-all"
                src={episode.poster}
                alt={episode.name}
              />
              <div
                onContextMenu={(e) => {
                  e.preventDefault();
                  setMenu({
                    open: true,
                    x: e.pageX,
                    y: e.pageY,
                    show: episode,
                  });
                }}
                className=" absolute bottom-0 left-0 p-2 bg-linear-to-br from-transparent to-black/80 transition-all group-hover:backdrop-blur-md size-full flex items-end flex-col justify-end capitalize"
              >
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
      </div>
      {!watchedShows ||
        (watchedShows.length <= 0 && <p>No Watched Show Found</p>)}
    </div>
  );
}

export function HistoryMenu({
  menu,
  setMenu,
}: {
  menu: {
    open: boolean;
    x: number;
    y: number;
    show: Anime;
  };
  setMenu: Dispatch<
    SetStateAction<{
      open: boolean;
      x: number;
      y: number;
      show: Anime;
    }>
  >;
}) {
  const [copied, setCopied] = useState(false);
  const watchedShows = useLiveQuery(() => indexDB.watchedShows.toArray());
  const watchHistory = useLiveQuery(() => indexDB.watchHistory.toArray());

  return (
    <div
      onMouseLeave={() => {
        setMenu((pre) => {
          return { ...pre, open: false };
        });
      }}
      style={{
        opacity: menu.open ? "100%" : "0",
        pointerEvents: menu.open ? "all" : "none",
        height: menu.open ? "" : "0px",
        top: menu.y - 30,
        left: menu.x > 650 ? `${menu.x - 150}px` : menu.x,
      }}
      className={` absolute transition-all duration-200 z-50`}
    >
      <div className="p-3 backdrop-blur-lg bg-black/40 rounded-lg flex text-start flex-col gap-2 text-base text-nowrap">
        <button
          className="flex not-disabled:hover:bg-white/10 px-2 py-1 rounded items-center gap-2 disabled:opacity-25 group"
          disabled={copied}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(
                `${window.location.href
                  .split("/")
                  .splice(0, 3)
                  .join("/")}/watch/${menu.show.id}`
              );
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            } catch (err) {
              console.error("Failed to copy: ", err);
            }
          }}
        >
          <Link2Icon size={14} /> {!copied ? "Copy Link" : "Copied !"}
        </button>

        {watchHistory?.some((show) => show.show.id == menu.show.id) && (
            <button
              className="flex not-disabled:hover:bg-white/10 px-2 py-1 rounded items-center gap-2 disabled:opacity-25 group"
              onClick={async () => {
                await indexDB.watchHistory.delete(menu.show.id);
                setMenu((pre) => {
                  return { ...pre, open: false };
                });
              }}
            >
              <XIcon size={14} /> Remove from History
            </button>
          )}
        {watchedShows &&
          (!watchedShows?.some((show) => show.show.id == menu.show.id) ? (
            <button
              className="flex hover:bg-white/10 px-2 py-1 rounded items-center gap-2"
              onClick={async () => {
                await indexDB.watchedShows.add({
                  id: menu.show.id,
                  show: menu.show,
                });
              }}
            >
              {/* <Undo size={14} /> */}
              <span className="">Add to Watched</span>
            </button>
          ) : (
            <button
              className="flex hover:bg-white/10 px-2 py-1 rounded items-center gap-2"
              onClick={async () => {
                await indexDB.watchedShows.delete(menu.show.id);
              }}
            >
              <XIcon size={14} /> Remove from Watch Later
            </button>
          ))}
      </div>
    </div>
  );
}
