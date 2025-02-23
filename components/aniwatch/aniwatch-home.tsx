"use client";
import { CaptionsIcon, MicIcon } from "lucide-react";
import Link from "@/components/link";
import { useState } from "react";
import { indexDB } from "@/lib/index-db";
import { useLiveQuery } from "dexie-react-hooks";
import { Menu } from "./context-menu";
import AniwatchAnimeCard from "./aniwatch-anime-card";

export default function AniwatchHome({ anime: { data } }: { anime: AniwatchHome }) {
  const [date, setDate] = useState(data.top10Animes.week);
  const widthPreference = useLiveQuery(() => indexDB.userPreferences.get(1))
  const [menu, setMenu] = useState<{
    open: boolean,
    x: number,
    y: number,
    show: Anime
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
    }
  })

  return (
    <>
      <h1 className="text-3xl py-2 font-semibold px-4">Newly Added</h1>
      <div className="lg:flex">
        <div
          className={`grid align-top self-start gap-4 md:gap-3 p-4 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3  md:grid-cols-4 
          ${widthPreference && widthPreference.centerContent == true ? "" : "xl:grid-cols-5"}
          w-full motion-delay-150`
          }>
          {data.latestEpisodeAnimes.map((episode, i) => (
            <AniwatchAnimeCard setMenu={setMenu} episode={{ ...episode, rating: "" }} key={episode.id} />
          ))}
          <Menu  data={menu} setMenu={setMenu} />
        </div>

        <div className="px-4 flex flex-col gap-2 sticky top-24 pb-4 h-fit">
          <h1 className="text-3xl py-2 font-semibold ">Popular Anime</h1>
          <div className="flex gap-2 my-1">
            <button
              onClick={() => setDate(data.top10Animes.today)}
              style={{
                backgroundColor:
                  date === data.top10Animes.today ? "white" : "",
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
                backgroundColor:
                  date === data.top10Animes.month ? "white" : "",
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
                href={`/anime/${episode.id}`}
                className="flex bg-black/30 p-2 rounded-lg "
              >
                <img fetchPriority="low" loading="lazy"
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
