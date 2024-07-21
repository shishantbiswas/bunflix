"use client";
import { CaptionsIcon, MicIcon, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { useState } from "react";

export function AniwatchInfo({
  currentEpisode,
  data,
  episode,
  lang
}: {
  currentEpisode: number;
  data: aniwatchInfo;
  episode: aniwatchEpisodeData;
  lang: "english" | "japanesse" 
}) {
  const [audioToogle, setAudioToogle] = useState<"english" | "japanesse">(
    "english"
  );

  return (
    <div className="p-4">
      <div>
        <img
          className="-z-10 fixed top-0 size-full object-cover blur-2xl "
          src={data.anime.info.poster}
          alt={data.anime.info.name}
        />
        <div className=" lg:flex ">
          <div className="lg:mr-4">
            <h1 className="text-3xl font-semibold ">Episode </h1>
            <Label className="capitalize">You&apos;re currently watching in {lang}</Label>
            <div className="flex items-center py-4 space-x-2">
              <Label htmlFor="audio">English</Label>
              <Switch
                defaultChecked={false}
                onCheckedChange={() =>
                  setAudioToogle(
                    audioToogle === "english" ? "japanesse" : "english"
                  )
                }
                id="audio"
              />
              <Label htmlFor="audio">Japanesse</Label>
            </div>
            <div className="flex items-center mb-6">
              <ul className="max-h-[400px] w-full lg:w-[500px] bg-slate-500 overflow-y-scroll rounded-lg">
                {episode.episodes.map((episode, index) => (
                  <Link
                    key={episode.episodeId}
                    href={`/anime/${episode.episodeId}&episode=${episode.number}&lang=${audioToogle}`}
                  >
                    <button
                      disabled={
                        audioToogle === "english"
                          ? data.anime.info.stats.episodes.dub < episode.number
                          : false
                      }
                      style={{
                        backgroundColor:
                          currentEpisode == episode.number && audioToogle===lang
                            ? "#b91c1c"
                            : index % 2 === 0
                            ? "#334155"
                            : "#1e293b",
                      }}
                      className="px-4 text-start py-2 flex w-full items-center justify-between disabled:opacity-35"
                    >
                      {episode.number}. {episode.title}
                      {audioToogle === "english" && (
                        <span className="px-2 bg-purple-700 flex gap-2 items-center w-fit rounded text-nowrap">
                          <MicIcon size={15} />
                          {data.anime.info.stats.episodes.dub < episode.number
                            ? "Dub not available"
                            : `ENG ${episode.number}`}
                        </span>
                      )}
                      {audioToogle === "japanesse" && (
                        <span className="px-2 bg-yellow-700 flex gap-2 items-center w-fit rounded text-nowrap">
                          <CaptionsIcon size={15} />
                          {data.anime.info.stats.episodes.sub < episode.number
                            ? "Sub not available"
                            : `JP ${episode.number}`}
                        </span>
                      )}
                    </button>
                  </Link>
                ))}
              </ul>
            </div>
          </div>

          <div className=" lg:mt-0 mt-6 lg:px-4">
            <h1 className=" my-2 text-4xl font-semibold">
              {data.anime.info.name}
            </h1>
            <p className=" leading-6 text-[18px]">
              {data.anime.info.description}
            </p>
            <div className=" my-4 flex flex-col xl:flex-row gap-2 opacity-70">
              <p className=" flex gap-2">
                {data.anime.moreInfo.studios}
                <span className=" hidden xl:block">|</span>
              </p>
              <p className=" flex gap-2">
                {data.anime.moreInfo.duration}
                <span className=" hidden xl:block">|</span>
              </p>
              <p className=" flex gap-2">
                {data.anime.moreInfo.status}
                <span className=" hidden xl:block">|</span>
              </p>
              <p className=" flex gap-2">
                {data.anime.moreInfo.japanese}
                <span className=" hidden xl:block">|</span>
              </p>
              <p className=" flex gap-2">
                Sub : {data.anime.info.stats.episodes.sub}
                <span className=" hidden xl:block">|</span>
              </p>
              <p className=" flex gap-2">
                Dub : {data.anime.info.stats.episodes.dub || "Not Available"}
                <span className=" hidden xl:block">|</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h1 className="font-semibold my-4 text-4xl">Related Content</h1>
        <div className=" mt-4 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-4">
          {data.seasons.map((e) => (
            <Link
            href={`/anime/${e.id}`}
              key={e.id}
              className=" p-2 rounded-lg bg-black/50 flex flex-col "
            >
                <img
                  className="h-[200px] w-full rounded object-cover "
                  src={e.poster}
                  alt={e.title}
                />
                <p className=" opacity-65 my-1 text-sm">{e.title}</p>
                <p className=" opacity-65 leading-tight font-bold ">
                  {e.name}
                </p>
              {/* <Link className=" w-full" href={`/anime/${e.id}`}>
                <button className=" rounded-lg py-1 bg-white/90 flex items-center justify-center gap-2 transition-all  text-black font-semibold w-full mt-8">
                  More Info <SquareArrowOutUpRight size={15} />
                </button>
              </Link> */}
            </Link>
          ))}
        </div>
        {data.seasons.length == 0 && <p>Related Content Found !</p>}
      </div>
    </div>
  );
}
