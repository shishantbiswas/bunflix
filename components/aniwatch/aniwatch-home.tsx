"use client";
import { CaptionsIcon, MicIcon } from "lucide-react";
import Link from "@/components/link";
import { useState } from "react";

export default function AniwatchHome({ anime:{data} }: { anime: AniwatchHome }) {
  const [date, setDate] = useState(data.top10Animes.week);

  return (
    <>
      <h1 className="text-3xl py-2 font-semibold px-4">Newly Added</h1>
      <div className="lg:flex">
        <div className="grid align-top self-start gap-4 md:gap-3 p-4 grid-cols-2 sm:grid-cols-3  md:grid-cols-4 xl:grid-cols-6 w-full motion-delay-150">
          {data.latestEpisodeAnimes.map((episode,i) => (
            <Link
              key={episode.id}
              href={`/anime/${episode.id}`}
              className={`min-w-[150px] lg:w-full intersect:motion-preset-slide-up motion-delay-[${i*50}ms] h-[300px] rounded-md overflow-hidden group  relative text-end`}
            >
              <img loading="lazy"
                className="w-full h-full object-cover absolute top-0 group-hover:scale-105 transition-all"
                src={episode.poster}
                alt={episode.name}
              />

              <div className=" absolute bottom-0 left-0 p-2 bg-gradient-to-br from-transparent to-black/80 transition-all group-hover:backdrop-blur-md size-full flex items-end flex-col justify-end capitalize">
                <h1 className="text-xl font-semibold">{episode.name}</h1>
                <div className="flex text-sm gap-1">
                  <p>{episode.type}</p>
                  <p className="flex items-center gap-1 bg-purple-500/70 rounded-sm  px-1">
                    <MicIcon size={10} />
                    {episode.episodes.dub || "NA"}
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

        <div className="px-4 flex flex-col gap-2 sticky top-4 pb-4 h-fit">
          <h1 className="text-3xl py-2 font-semibold ">Popular Anime</h1>
          <div className="flex gap-2 my-1">
            <button
              onClick={() => setDate(data.top10Animes.today)}
              style={{
                backgroundColor:
                  date === data.top10Animes.today ? "white" : "",
                color: date === data.top10Animes.today ? "black" : "",
              }}
              className="px-2 py-1 rounded hover:bg-red-600 transition-all"
            >
              Daily
            </button>
            <button
              style={{
                backgroundColor: date === data.top10Animes.week ? "white" : "",
                color: date === data.top10Animes.week ? "black" : "",
              }}
              className="px-2 py-1 rounded hover:bg-red-600 transition-all"
              onClick={() => setDate(data.top10Animes.week)}
            >
              Weekly
            </button>
            <button
              className="px-2 py-1 rounded hover:bg-red-600 transition-all"
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
                <img loading="lazy"
                  className="aspect-square object-cover size-[70px] rounded-md"
                  src={episode.poster}
                  alt={episode.name}
                />
                <div className="px-2">
                  <p className="text-sm">{episode.name}</p>
                  <div className="flex gap-1 text-sm">
                    <span className="px-1 bg-purple-500/70 flex gap-2 items-center w-fit rounded">
                      <MicIcon size={10} />
                      {episode.episodes.dub || "NA"}
                    </span>
                    <span className="px-2 bg-yellow-500/70 flex gap-2 items-center w-fit rounded">
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

      {/* <div className="">
        <h1 className="text-3xl py-2 font-semibold px-4">Top Airing</h1>
        <div className="px-4 flex  gap-3 overflow-x-scroll scrollbar-hide">
          {topAiringAnimes.map((episode) => (
            <div
              className="min-w-[200px] h-[300px] rounded-md overflow-hidden group relative"
              key={episode.id}
            >
              <Link href={`/anime/${episode.id}`}>
                <img loading="lazy"
                  className="size-full object-cover group-hover:scale-105 transition-all"
                  src={episode.poster}
                  alt={episode.name}
                />

                <div className=" absolute bottom-0 left-0 p-2 bg-gradient-to-br from-transparent to-black/80 transition-all group-hover:backdrop-blur-md size-full flex items-end flex-col justify-end capitalize">
                  <h1 className="text-xl font-semibold">{episode.name}</h1>
                  <p>{episode.description}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h1 className="text-3xl py-2 font-semibold px-4">Upcoming Anime</h1>
        <div className="px-4 flex  gap-3 overflow-x-scroll scrollbar-hide">
          {anime.topUpcomingAnimes.map((episode) => (
            <div
              className="min-w-[200px] h-[300px] rounded-md overflow-hidden group  relative"
              key={episode.id}
            >
              <Link href={`/anime/${episode.id}`}>
                <img loading="lazy"
                  className="size-full object-cover group-hover:scale-105 transition-all"
                  src={episode.poster}
                  alt={episode.name}
                />

                <div className=" absolute bottom-0 left-0 p-2 bg-gradient-to-br from-transparent to-black/80 transition-all group-hover:backdrop-blur-md size-full flex items-end flex-col justify-end capitalize">
                  <h1 className="text-xl font-semibold">{episode.name}</h1>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div> */}
      
    </>
  );
}
