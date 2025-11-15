"use client";
import { CaptionsIcon, MicIcon } from "lucide-react";
import Link from "@/components/link";
import { useState } from "react";
import { indexDB } from "@/lib/index-db";
import { useLiveQuery } from "dexie-react-hooks";
import { Menu } from "./context-menu";
import AniwatchAnimeCard from "./aniwatch-anime-card";
import { HistoryMenu } from "../history-page";

export default function AniwatchHome({
  anime: { data },
}: {
  anime: AniwatchHome;
}) {
  const [date, setDate] = useState(data.top10Animes.week);
  const widthPreference = useLiveQuery(() => indexDB.userPreferences.get(1));
  const watchHistory = useLiveQuery(() => indexDB.watchHistory.toArray());

  const titlesInHistory = watchHistory?.map((history) => history.show.name) ?? [];

  const [menu, setMenu] = useState<{
    open: boolean;
    x: number;
    y: number;
    show: Anime;
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
  });

  return (
    <>
      <PreviouslyWatching />
      <h1 className="text-3xl py-2 font-semibold px-4">Newly Added</h1>
      <div className="lg:flex">
        <div
          className={`grid align-top self-start gap-4 md:gap-3 p-4 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3  md:grid-cols-4 
          ${widthPreference && widthPreference.centerContent == true
              ? ""
              : "xl:grid-cols-5"
            }
          w-full motion-delay-150`}
        >
          {data.latestEpisodeAnimes
          .sort((a, b) => Number(titlesInHistory.includes(b.name)) - Number(titlesInHistory.includes(a.name)))
          .map((episode, i) => (
            <AniwatchAnimeCard
              setMenu={setMenu}
              episode={{ ...episode, rating: "" }}
              key={episode.id}
            />
          ))}
          <Menu data={menu} setMenu={setMenu} />
        </div>

        <div className="px-4 flex flex-col gap-2 sticky top-24 pb-4 h-fit">
          <h1 className="text-3xl py-2 font-semibold ">Popular Anime</h1>
          <div className="flex gap-2 my-1">
            <button
              onClick={() => setDate(data.top10Animes.today)}
              style={{
                backgroundColor: date === data.top10Animes.today ? "white" : "",
                color: date === data.top10Animes.today ? "black" : "",
              }}
              className="px-2 py-1 rounded-sm hover:bg-red-600 transition-all"
            >
              Daily
            </button>
            <button
              style={{
                backgroundColor: date === data.top10Animes.week ? "white" : "",
                color: date === data.top10Animes.week ? "black" : "",
              }}
              className="px-2 py-1 rounded-sm hover:bg-red-600 transition-all"
              onClick={() => setDate(data.top10Animes.week)}
            >
              Weekly
            </button>
            <button
              className="px-2 py-1 rounded-sm hover:bg-red-600 transition-all"
              style={{
                backgroundColor: date === data.top10Animes.month ? "white" : "",
                color: date === data.top10Animes.month ? "black" : "",
              }}
              onClick={() => setDate(data.top10Animes.month)}
            >
              Monthly
            </button>
          </div>

          <div className="flex flex-col gap-2 w-full lg:w-[350px] lg:max-w-[350px]">
            {date.slice(0, 4).map((episode) => (
              <Link
                key={episode.id}
                href={`/watch/${episode.id}`}
                className="flex bg-black/30 p-2 rounded-lg "
              >
                <img
                  fetchPriority="low"
                  loading="lazy"
                  className="aspect-square object-cover size-[70px] rounded-md"
                  src={episode.poster}
                  alt={episode.name}
                />
                <div className="px-2">
                  <p className="text-sm">{episode.name}</p>
                  <div className="flex gap-1 text-sm">
                    <span className="px-1 bg-purple-500/70 flex gap-2 items-center w-fit rounded-sm">
                      <MicIcon size={10} />
                      {episode.episodes.dub || "NA"}
                    </span>
                    <span className="px-2 bg-yellow-500/70 flex gap-2 items-center w-fit rounded-sm">
                      <CaptionsIcon size={10} />
                      {episode.episodes.sub}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function PreviouslyWatching() {
  const watchHistory = useLiveQuery(() => indexDB.watchHistory.toArray());

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

  if (watchHistory?.length === 0) return;
  return (
    <>
      <HistoryMenu menu={menu} setMenu={setMenu} />
      <h1 className="text-3xl font-semibold px-4">Previously Watching</h1>
      <div className="p-4 grid grid-cols-2 sm:grid-cols-3  lg:grid-cols-4 xl:grid-cols-6 w-full gap-3 mt-2 ">
        {watchHistory &&
          watchHistory
            .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
            .slice(0, 6)
            .map(({ show: episode, ep, lang, time, duration, epNum }, i) => (
              <Link
                key={episode.id + i}
                href={`/watch/${episode.id}?ep=${ep}&lang=${lang}&num=${epNum || 0
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
    </>
  );
}
