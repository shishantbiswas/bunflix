"use client";
import { CaptionsIcon, MicIcon } from "lucide-react";
import Link from "@/components/link";

export function AniwatchInfo({ data }: { data: aniwatchInfo }) {
  return (
    <div className="p-4">
      <div>
        <img
          className="-z-10 fixed top-0 size-full object-cover blur-2xl "
          src={data.data.anime.info.poster}
          alt={data.data.anime.info.name}
        />
        <div className=" lg:flex ">
          <div className=" lg:mt-0 mt-6 lg:px-4">
            <h1 className=" my-2 text-4xl font-semibold">
              {data.data.anime.info.name}
            </h1>
            <h2 className=" italic text-xl opacity-70 my-2 flex gap-2">
              {data.data.anime.moreInfo.japanese}
            </h2>
            <p className=" leading-6 text-[18px]">
              {data.data.anime.info.description}
            </p>
            <div className=" my-4 flex flex-col gap-2 opacity-70">
              {data.data.anime.moreInfo.genres && (
                <div className="flex items-center gap-2 flex-wrap">
                  Genres :
                  {data.data.anime.moreInfo.genres?.map((e) => (
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
              {data.data.anime.moreInfo.studios && (
                <p className=" flex gap-2 flex-wrap">
                  Studio :
                  {data.data.anime.moreInfo.studios
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
              {data.data.anime.moreInfo.producers && (
                <p className=" flex gap-2 flex-wrap">
                  Producers :
                  {data.data.anime.moreInfo.producers.map((studio: string) => (
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
                Release Date : {data.data.anime.moreInfo.aired}
              </p>
              <p className=" flex gap-2">
                Premiered : {data.data.anime.moreInfo.premiered}
              </p>
              <p className=" flex gap-2">
                Duration : {data.data.anime.moreInfo.duration}
              </p>
              <p className=" flex gap-2">
                Status : {data.data.anime.moreInfo.status}
              </p>

              <div className="flex gap-2">
                <p className=" flex gap-2">
                  Sub : {data.data.anime.info.stats.episodes.sub}
                </p>
                <p className=" flex gap-2">
                  Dub :{" "}
                  {data.data.anime.info.stats.episodes.dub || "Not Available"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:flex">
        <div className="flex flex-col w-full">
          <h1 className="text-3xl font-semibold my-4">More Like This</h1>

          <div className="grid grid-cols-2 sm:grid-cols-3  lg:grid-cols-4 xl:grid-cols-6 w-full gap-3  ">
            {data.data.recommendedAnimes.map((episode, i) => (
              <Link
                key={episode.id + i}
                href={`/anime/${episode.id}`}
                className="min-w-[150px] w-full lg:w-full h-[300px] rounded-md overflow-hidden group  relative text-end"
              >
                <img
                  className="w-full h-full object-cover absolute top-0 group-hover:scale-105 transition-all"
                  src={episode.poster}
                  alt={episode.name}
                />
                <div className=" absolute bottom-0 left-0 p-2 bg-gradient-to-br from-transparent to-black/80 transition-all group-hover:backdrop-blur-md size-full flex items-end flex-col justify-end capitalize">
                  <h1 className="text-lg font-semibold leading-tight">
                    {episode.name}
                  </h1>
                  <h1 className="text-sm leading-tight my-1.5">
                    {episode.jname}
                  </h1>
                  <div className="flex text-sm gap-1">
                    <p>{episode.type}</p>
                    <p className="flex items-center gap-1 bg-purple-500/70 rounded-sm  px-1">
                      <MicIcon size={10} />
                      {episode.episodes?.dub || "NA"}
                    </p>
                    <p className="flex items-center gap-1 bg-yellow-500/80 rounded-sm  px-1">
                      <CaptionsIcon size={10} />
                      {episode.episodes.sub}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <h1 className="text-3xl font-semibold my-4">Most Popular</h1>

          <div className="grid grid-cols-2 sm:grid-cols-3  lg:grid-cols-4 xl:grid-cols-6 w-full gap-3  ">
            {data.data.mostPopularAnimes.map((episode, i) => (
              <Link
                key={episode.id + i}
                href={`/anime/${episode.id}`}
                className="min-w-[150px] w-full lg:w-full h-[300px] rounded-md overflow-hidden group  relative text-end"
              >
                <img
                  className="w-full h-full object-cover absolute top-0 group-hover:scale-105 transition-all"
                  src={episode.poster}
                  alt={episode.name}
                />
                <div className=" absolute bottom-0 left-0 p-2 bg-gradient-to-br from-transparent to-black/80 transition-all group-hover:backdrop-blur-md size-full flex items-end flex-col justify-end capitalize">
                  <h1 className="text-lg font-semibold leading-tight">
                    {episode.name}
                  </h1>
                  <h1 className="text-sm leading-tight my-1.5">
                    {episode.jname}
                  </h1>
                  <div className="flex text-sm gap-1">
                    <p>{episode.type}</p>
                    <p className="flex items-center gap-1 bg-purple-500/70 rounded-sm  px-1">
                      <MicIcon size={10} />
                      {episode.episodes?.dub || "NA"}
                    </p>
                    <p className="flex items-center gap-1 bg-yellow-500/80 rounded-sm  px-1">
                      <CaptionsIcon size={10} />
                      {episode.episodes.sub}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="lg:w-1/3 p-4">
          {data.data.seasons.length > 0 && (
            <>
              <h1 className="text-3xl font-semibold my-4">Seasons</h1>
              <div className="flex flex-col gap-3 bg-black/30 p-2 rounded-sm">
                {data.data.seasons.map((episode) => (
                  <Link
                    href={`/anime/${episode.id}`}
                    key={episode.id}
                    className="flex gap-2"
                  >
                    <img
                      src={episode.poster}
                      className="h-20 rounded-sm"
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

          <div className="flex flex-col gap-3 bg-black/30 p-2 rounded-sm">
            {data.data.relatedAnimes.map((episode) => (
              <Link
                href={`/anime/${episode.id}`}
                key={episode.id}
                className="flex gap-2"
              >
                <img
                  src={episode.poster}
                  className="h-20 rounded-sm"
                  alt={episode.name}
                />
                <div className="">
                  <h1>{episode.name}</h1>
                  <div className="flex text-sm gap-1">
                    <p>{episode.type}</p>
                    <p className="flex items-center gap-1 bg-purple-500/70 rounded-sm  px-1">
                      <MicIcon size={10} />
                      {episode.episodes?.dub || "NA"}
                    </p>
                    <p className="flex items-center gap-1 bg-yellow-500/80 rounded-sm  px-1">
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
