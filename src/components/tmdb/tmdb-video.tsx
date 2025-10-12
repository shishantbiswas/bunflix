"use client";

import { Link, useSearch } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { createImageUrl } from "@/lib/utils";

export function TmdbVideo({
  type,
  id,
  data,
  seasonData,
  url,
  setUrl,
}: {
  type: string;
  id: number;
  data: MovieResults | TMDBInfo;
  url: string;
  seasonData?: TMDBEpisodesInfo | undefined;
  setUrl: (url: string) => void;
}) {
  const { provider, season, episode } = useSearch({
    from: "/video/$type/$id",
  });

  const providers: ("vidsrc" | "twoEmbed" | "super" | "smashystream")[] = [
    "vidsrc",
    "twoEmbed",
    "super",
    "smashystream",
  ];

  const urls = {
    tv: [
      `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`,
      `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}`,
      `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${season}&e=${episode}`,
      `https://player.smashy.stream/tv/${id}?s=${season}&e=${episode}`,
    ],
    movie: [
      `https://vidsrc.to/embed/movie/${id}`,
      `https://www.2embed.cc/embed/${id}`,
      `https://multiembed.mov/?video_id=${id}`,
      `https://embed.smashystream.com/playere.php?tmdb=${id}`,
    ],
  };

  type UrlType = keyof typeof urls;
  const values = urls[type as UrlType];

  return (
    <div className=" pb-24 ">
      <img
        fetchPriority="low"
        loading="lazy"
        className="-z-10 fixed top-0 size-full object-cover blur-2xl "
        src={createImageUrl(data.backdrop_path, "original")}
        alt={data.name}
      />
      <div className="h-[300px] md:p-4 sm:h-[400px] md:h-[500px] xl:h-[600px]">
        <iframe
          title="d"
          allowFullScreen={true}
          className="w-full md:rounded-lg h-full overflow-hidden"
          src={url}
        ></iframe>
      </div>

      <div>
        <div className=" p-4">
          <div className="p-4  rounded-xl flex-col  xl:flex-row flex">
            <div className={` ${seasonData ? "xl:w-[800px]" : "w-full"} `}>
              <h1 className="text-5xl font-semibold lg:mb-4">
                {data.title ? data.title : data.name}
              </h1>
              <p className="text-lg ">Overview : </p>
              <p className="text-md leading-tight opacity-70">
                {data.overview || (data as MovieResults).synopsis}
              </p>
              <p className="text-lg my-2">Server : </p>
              <div className=" flex gap-2 flex-wrap ">
                {values.map((value, index) => (
                  <Link
                    to={"/video/$type/$id"}
                    params={{
                      type,
                      id: id.toString(),
                    }}
                    search={{
                      provider: providers[index],
                      season,
                      episode,
                    }}
                    key={index}
                  >
                    <button
                      onClick={() => setUrl(value)}
                      disabled={provider === providers[index] || value === url}
                      style={{
                        backgroundColor:
                          provider === providers[index] ? "red" : "",
                        fontWeight: provider === providers[index] ? "700" : "",
                        border:
                          provider === providers[index]
                            ? ""
                            : "1px solid white",
                      }}
                      className=" hover:bg-slate-600  px-2 py-1 rounded-sm disabled:opacity-50"
                    >
                      Source {index + 1}
                    </button>
                  </Link>
                ))}
              </div>
              <div className="my-5 gap-2 flex font-bold">
                <Link
                  to="/info/$type/$id"
                  params={{
                    type,
                    id: id.toString(),
                  }}
                >
                  <button className="flex  border border-white transition-all py-1 disabled:border-black  disabled:text-white/60 disabled:bg-black/60 xl:justify-center gap-2 items-center w-fit px-3  font-semibold rounded-md">
                    <Info size={15} />
                    {type === "movie" || (data as MovieResults).media_type === "movie"
                      ? "Movie Info"
                      : "Season Info"}
                  </button>
                </Link>
              </div>
            </div>
            {seasonData && (
              <div className="flex flex-col gap-2 w-full max-h-[60vh] overflow-y-scroll">
                {seasonData.episodes.map((e) => (
                  <Link
                    to={"/video/$type/$id"}
                    params={{
                      type,
                      id: id.toString(),
                    }}
                    search={{
                      season: e.season_number,
                      episode: Number(e.episode_number),
                      provider: "twoEmbed",
                    }}
                    key={e.id}
                    className="flex gap-2 w-full bg-black/10 hover:bg-black/40 rounded-md p-2"
                  >
                    <img
                      fetchPriority="low"
                      loading="lazy"
                      className=" rounded-xs  h-full aspect-video"
                      src={createImageUrl(e.still_path, "w500")}
                      alt={e.name}
                    />
                    <div className=" flex flex-col  gap-2">
                      <h1 className=" text-2xl font-semibold">
                        {e.episode_number}. {e.name}
                      </h1>

                      <p className=" leading-tight text-md opacity-50">
                        {e.overview}
                      </p>
                      <p>Runtime : {e.runtime}M</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
