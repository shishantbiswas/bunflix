"use client";

import { createImageUrl } from "@/lib/utils";
import { Info } from "lucide-react";
import Link from "@/components/link";

export function TmdbVideo({
  type,
  id,
  data,
  seasonData,
  url,
  provider,
  epNo,
}: {
  type: string;
  id: string;
  data: MovieResults;
  url: string;
  provider: string;
  seasonData?: TMDBEpisodesInfo | undefined;
  epNo?: number | string;
}) {
  return (
    <div className=" pb-24 bg-black/60">
      <img fetchPriority="low" loading="lazy"
        className="-z-10 fixed top-0 size-full object-cover blur-2xl "
        src={createImageUrl(data.backdrop_path, "original")}
        alt={data.name}
      />
      <div className="h-[300px] md:p-4 sm:h-[400px] md:h-[500px] xl:h-[600px]">
        <iframe
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
                {data.overview || data.synopsis}
              </p>
              <p className="text-lg my-2">Server : </p>
              <div className=" flex gap-2 flex-wrap ">
                <Link
                  href={`/video/${type}/${id}/${
                    type === "tv"
                      ? `?season=${seasonData?.season_number}&episode=${epNo}&provider=vidsrc`
                      : `?provider=vidsrc`
                  }`}
                >
                  <button
                    disabled={provider === "vidsrc"}
                    style={{
                      backgroundColor: provider === "vidsrc" ? "red" : "",
                      fontWeight: provider === "vidsrc" ? "700" : "",
                      border: provider === "vidsrc" ? "" : "1px solid white",
                    }}
                    className=" hover:bg-slate-600  px-2 py-1 rounded-sm disabled:opacity-50"
                  >
                    Source 1
                  </button>
                </Link>
                <Link
                  href={`/video/${type}/${id}/${
                    type === "tv"
                      ? `?season=${seasonData?.season_number}&episode=${epNo}&provider=twoEmbed`
                      : `?provider=twoEmbed`
                  }`}
                >
                  <button
                    disabled={provider === "twoEmbed"}
                    style={{
                      backgroundColor: provider === "twoEmbed" ? "red" : "",
                      fontWeight: provider === "twoEmbed" ? "700" : "",
                      border: provider === "twoEmbed" ? "" : "1px solid white",
                    }}
                    className=" hover:bg-slate-600  px-2 py-1 rounded-sm disabled:opacity-50"
                  >
                    Source 2
                  </button>
                </Link>
                <Link
                  href={`/video/${type}/${id}/${
                    type === "tv"
                      ? `?season=${seasonData?.season_number}&episode=${epNo}&provider=super`
                      : `?provider=super`
                  }`}
                >
                  <button
                    disabled={provider === "super"}
                    style={{
                      backgroundColor: provider === "super" ? "red" : "",
                      fontWeight: provider === "super" ? "700" : "",
                      border: provider === "super" ? "" : "1px solid white",
                    }}
                    className=" hover:bg-slate-600  px-2 py-1 rounded-sm disabled:opacity-50"
                  >
                    Source 3
                  </button>
                </Link>
                <Link
                  href={`/video/${type}/${id}/${
                    type === "tv"
                      ? `?season=${seasonData?.season_number}&episode=${epNo}&provider=smashystream`
                      : `?provider=smashystream`
                  }`}
                >
                  <button
                    disabled={provider === "smashystream"}
                    style={{
                      backgroundColor: provider === "smashystream" ? "red" : "",
                      fontWeight: provider === "smashystream" ? "700" : "",
                      border:
                        provider === "smashystream" ? "" : "1px solid white",
                    }}
                    className=" hover:bg-slate-600  px-2 py-1 rounded-sm disabled:opacity-50"
                  >
                    Source 4
                  </button>
                </Link>
              </div>
              <div className="my-5 gap-2 flex font-bold">
                <Link
                  target="_blank"
                  href={`/info/${type || data.media_type}/${data.id}`}
                >
                  <button
                    className="
                  flex  border border-white transition-all py-1 disabled:border-black  disabled:text-white/60 disabled:bg-black/60 xl:justify-center gap-2 items-center w-fit px-3  font-semibold rounded-md"
                  >
                    <Info size={15} />
                    {type === "movie" || data.media_type === "movie"
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
                    href={`/video/${type}/${id}?season=${e.season_number}&episode=${e.episode_number}`}
                    key={e.id}
                    className="flex gap-2 w-full bg-black/10 hover:bg-black/40 rounded-md p-2"
                  >
                    <img fetchPriority="low" loading="lazy"
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
