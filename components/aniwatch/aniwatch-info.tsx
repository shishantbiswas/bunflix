"use client";
import { CaptionsIcon, MicIcon } from "lucide-react";
import Link from "@/components/link";
import { useShow } from "@/context/show-provider";
import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { indexDB } from "@/lib/index-db";
import AniwatchAnimeCard from "./aniwatch-anime-card";
import { Menu } from "./context-menu";

export function AniwatchShowInfo({ data, ep, lang, currentEpisodeNum }: {
  data: AniwatchInfo, ep: string;
  lang: "en" | "jp"
  currentEpisodeNum: string;
}) {

  const { setShow, show } = useShow();

  useEffect(() => {
    setShow({ ...data, ep, lang, epNum: currentEpisodeNum });
  }, [])

  const userPreferences = useLiveQuery(() => indexDB.userPreferences.get(1))

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

  if (!show) return

  return (
    <div className="p-4">
      <div>
        <div
          className="-z-10 fixed right-0 top-0 w-[100vw] h-[100vh] "
        >
          <div className="bg-black/50 size-full object-cover blur-2xl" />
          <img fetchPriority="low" loading="lazy"
            className="-z-[9] fixed right-0 top-0 size-full object-cover blur-2xl"
            src={show.data.anime.info.poster}
            alt={show.data.anime.info.name}
          />
        </div>

        <section className="md:flex">

          <img fetchPriority="low" loading="lazy"
            className="h-full  object-cover rounded-md md:sticky w-full lg:w-fit top-12"
            src={show.data.anime.info.poster}
            alt={show.data.anime.info.name}
          />
          <div className=" lg:flex ">
            <div className=" lg:mt-0 mt-6 px-4">
              <h1 className=" my-2 text-4xl font-semibold">
                {show.data.anime.info.name}
              </h1>
              <h2 className=" italic text-xl opacity-70 my-2 flex gap-2">
                {show.data.anime.moreInfo.japanese}
              </h2>
              <p className=" leading-6 text-[18px]">
                {show.data.anime.info.description}
              </p>
              <div className=" my-4 flex flex-col gap-2 opacity-70">
                {show.data.anime.moreInfo.genres && (
                  <div className="flex items-center gap-2 flex-wrap">
                    Genres :
                    {show.data.anime.moreInfo.genres?.map((e) => (
                      <Link
                        target="_blank"
                        href={`/genre/${e.toLowerCase()}`}
                        className="flex gap-2 underline py-1 px-2 text-sm rounded-md items-center bg-black/30"
                        key={e}
                      >
                        <span className=" flex gap-2">{e}</span>
                      </Link>
                    ))}
                  </div>
                )}
                {show.data.anime.moreInfo.studios && (
                  <p className=" flex gap-2 flex-wrap">
                    Studio :
                    {show.data.anime.moreInfo.studios
                      .split(",")
                      .map((studio: string) => (
                        <Link
                          key={studio}
                          target="_blank"
                          className="flex gap-2 underline py-1 px-2 text-sm rounded-md items-center bg-black/30"
                          href={`/anime-producers?type=${studio.toLowerCase()}`}
                        >
                          {studio}
                        </Link>
                      ))}
                  </p>
                )}
                {show.data.anime.moreInfo.producers && (
                  <p className=" flex gap-2 flex-wrap">
                    Producers :
                    {show.data.anime.moreInfo.producers.map((studio: string) => (
                      <Link
                        key={studio}
                        target="_blank"
                        className="flex gap-2 underline py-1 px-2 text-sm rounded-md items-center bg-black/30"
                        href={`/anime-producers?type=${studio.toLowerCase()}`}
                      >
                        {studio}
                      </Link>
                    ))}
                  </p>
                )}
                <p className=" flex gap-2">
                  Release Date : {show.data.anime.moreInfo.aired}
                </p>
                <p className=" flex gap-2">
                  Premiered : {show.data.anime.moreInfo.premiered}
                </p>
                <p className=" flex gap-2">
                  Duration : {show.data.anime.moreInfo.duration}
                </p>
                <p className=" flex gap-2">
                  Status : {show.data.anime.moreInfo.status}
                </p>

                <div className="flex gap-2">
                  <p className=" flex gap-2">
                    Sub : {show.data.anime.info.stats.episodes.sub}
                  </p>
                  <p className=" flex gap-2">
                    Dub :{" "}
                    {show.data.anime.info.stats.episodes.dub || "Not Available"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="lg:flex">
        <div className="flex flex-col w-full">
          <h1 className="text-3xl font-semibold my-4">More Like This</h1>

          <div className={`grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 ${userPreferences && userPreferences.centerContent ? "xl:grid-cols-5 " : "xl:grid-cols-6"} w-full gap-3  `}>
            {show.data.recommendedAnimes.map((episode, i) => (
              <AniwatchAnimeCard setMenu={setMenu} episode={episode} key={episode.id} />
            ))}
          </div>
          {show.data.mostPopularAnimes.length > 0 && <h1 className="text-3xl font-semibold my-4">Most Popular</h1>}

          <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 w-full gap-3  ">
            {show.data.mostPopularAnimes.map((episode, i) => (
              <AniwatchAnimeCard setMenu={setMenu} episode={episode} key={episode.id} />
            ))}
          </div>
          <Menu data={menu} setMenu={setMenu} />
        </div>
        <div className="lg:w-1/3 xl:p-4">
          {show.data.seasons.length > 0 && (
            <>
              <h1 className="text-3xl font-semibold my-4">Seasons</h1>
              <div className="flex flex-col gap-3 bg-black/30 p-2 rounded-xs">
                {data.data.seasons.map((episode) => (
                  <Link
                    href={`/anime/${episode.id}`}
                    key={episode.id}
                    className="flex gap-2"
                  >
                    <img fetchPriority="low" loading="lazy"
                      src={episode.poster}
                      className="h-20 rounded-xs"
                      alt={episode.name}
                    />
                    <div className="">
                      <h1>{episode.name}</h1>
                      <div className="flex text-sm gap-1">
                        <p>{episode?.title}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          <h1 className="text-3xl font-semibold my-4">Related Animes</h1>

          <div className="flex flex-col gap-3 bg-black/30 p-2 rounded-xs">
            {show.data.relatedAnimes.map((episode) => (
              <Link
                href={`/anime/${episode.id}`}
                key={episode.id}
                className="flex gap-2"
              >
                <img
                  fetchPriority="low"
                  loading="lazy"
                  src={episode.poster}
                  className="h-20 rounded-xs"
                  alt={episode.name}
                />
                <div className="">
                  <h1>{episode.name}</h1>
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
        </div>
      </div>
    </div>
  );
}
