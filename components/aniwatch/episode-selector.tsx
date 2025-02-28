"use client";
import { MicIcon, CaptionsIcon } from "lucide-react";
import Link from "@/components/link";
import React, { useEffect, useRef, useState } from "react";
import { useShow } from "@/context/show-provider";

export default function EpisodeSelector({
  episode,
  lang,
}: {
  episode: AniwatchEpisodeData;
  lang: "en" | "jp";
}) {
  const [audioToogle, setAudioToogle] = useState<"en" | "jp">(
    lang ? lang : "jp"
  );

  const { show: data } = useShow();
  if (!data) {
    return (
      <div className="p-4 lg:p-2 lg:pl-0 lg:w-1/4">
        <div className="rounded h-[400px] w-[calc(100%-8px)] -mr-3 mt-2 bg-gray-400/30  animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-2 lg:pl-0 lg:w-1/4">
      <div className="flex items-center py-4 space-x-2 ">
        <label className="inline-flex cursor-pointer items-center gap-2">
          <span className=" text-sm font-medium dark:text-gray-300">English</span>
          <input
            type="checkbox"
            defaultChecked={lang === "en" || !lang ? false : true}
            onChange={() =>
              setAudioToogle(audioToogle === "en" ? "jp" : "en")
            }
            className="peer sr-only"
          />
          <div
            className="peer-focus:ring-red-700 peer relative h-[25px] w-11 rounded-full border-none bg-gray-200 outline-hidden duration-200 after:absolute after:start-[2px] after:top-[2px]  after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-red-600 peer-checked:after:translate-x-[95%] peer-focus:outline-hidden  peer-checked:rtl:after:-translate-x-full 
             dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-red-800"
          ></div>
          <span className=" text-sm font-medium dark:text-gray-300">
            Japanesse
          </span>
        </label>
      </div>
      <div className="flex items-center mb-6 text-sm">
        <ul className="max-h-[520px] lg:max-h-[470px] w-full lg:w-[500px] bg-slate-500 overflow-y-scroll rounded-lg"
        >
          {episode.data.episodes.map((episode, index) => (
            <Link
              prefetch={false}
              key={episode.episodeId}
              href={`/anime/${episode.episodeId}&lang=${audioToogle}&num=${episode.number}`}
              style={{
                pointerEvents:
                  audioToogle === "en"
                    ? data?.data.anime.info.stats.episodes.dub < episode.number
                      ? "none"
                      : "all"
                    : "all",
              }}
            >
              <button
                disabled={
                  audioToogle === "en"
                    ? data?.data.anime.info.stats.episodes.dub < episode.number
                    : data?.data.anime.info.stats.episodes.sub < episode.number
                }
                style={{
                  backgroundColor:
                    Number(data?.epNum) == Number(episode.number) &&
                      audioToogle === lang
                      ? "#b91c1c"
                      : audioToogle === "en"
                        ? index % 2 === 0
                          ? "#1f2937"
                          : "#374151"
                        : index % 2 === 0
                          ? "#1e293b"
                          : "#334155",
                }}
                className="px-4 h-20 text-start text-[14px] flex w-full items-center justify-between disabled:opacity-35 leading-4"
              >
                {episode.number}. {episode.title}
                {audioToogle === "en" && (
                  <span className="p-2 bg-white/20  hidden sm:flex gap-2 items-center w-fit rounded-sm text-nowrap ml-2">
                    <MicIcon size={15} />
                    {data?.data.anime.info.stats.episodes.dub < episode.number
                      ? "Not available"
                      : `EN`}
                  </span>
                )}
                {audioToogle === "jp" && (
                  <span className="p-2 bg-white/20  hidden sm:flex gap-2 items-center w-fit rounded-sm text-nowrap ml-2">
                    <CaptionsIcon size={15} />
                    {data?.data.anime.info.stats.episodes.sub < episode.number
                      ? "Not available"
                      : `JP`}
                  </span>
                )}
              </button>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
}
