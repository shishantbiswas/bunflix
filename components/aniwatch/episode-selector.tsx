"use client";
import { MicIcon, CaptionsIcon } from "lucide-react";
import Link from "@/components/link";
import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

export default function EpisodeSelector({
  currentEpisodeNum,
  data,
  episode,
  lang,
}: {
  currentEpisodeNum: string;
  data: aniwatchInfo;
  episode: aniwatchEpisodeData;
  lang: "english" | "japanese";
}) {
  const [audioToogle, setAudioToogle] = useState<"english" | "japanese">(
    lang ? lang : "japanese"
  );
  const [firstRender, setFirstRender] = useState(true);
  useEffect(() => setFirstRender(false), []);

  return (
    <div className="p-4 lg:p-2 lg:pl-0 lg:w-1/4">
      <div className="flex items-center py-4 space-x-2 ">
        <Label htmlFor="audio">English</Label>
        <Switch
          defaultChecked={lang === "english" ? false : true}
          onCheckedChange={() =>
            setAudioToogle(audioToogle === "english" ? "japanese" : "english")
          }
          id="audio"
        />
        <Label htmlFor="audio">japanese</Label>
      </div>
      <div className="flex items-center mb-6 text-sm">
        <ul
          ref={(el) => {
            if (firstRender) {
              el?.scrollBy(0, 80 * (Number(currentEpisodeNum) - 1));
            }
          }}
          className="max-h-[70vh] w-full lg:w-[500px] bg-slate-500 overflow-y-scroll rounded-lg"
        >
          {episode.data.episodes.map((episode, index) => (
            <Link
              prefetch={false}
              key={episode.episodeId}
              href={`/anime/${episode.episodeId}&lang=${audioToogle}&num=${episode.number}`}
              style={{
                pointerEvents:
                  audioToogle === "english"
                    ? data.data.anime.info.stats.episodes.dub < episode.number
                      ? "none"
                      : "all"
                    : "all",
              }}
            >
              <button
                disabled={
                  audioToogle === "english"
                    ? data.data.anime.info.stats.episodes.dub < episode.number
                    : data.data.anime.info.stats.episodes.sub < episode.number
                }
                style={{
                  backgroundColor:
                    Number(currentEpisodeNum) == Number(episode.number) &&
                    audioToogle === lang
                      ? "#b91c1c"
                      : audioToogle === "english"
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
                {audioToogle === "english" && (
                  <span className="p-2 bg-white/20  hidden sm:flex gap-2 items-center w-fit rounded text-nowrap ml-2">
                    <MicIcon size={15} />
                    {data.data.anime.info.stats.episodes.dub < episode.number
                      ? "Not available"
                      : `EN`}
                  </span>
                )}
                {audioToogle === "japanese" && (
                  <span className="p-2 bg-white/20  hidden sm:flex gap-2 items-center w-fit rounded text-nowrap ml-2">
                    <CaptionsIcon size={15} />
                    {data.data.anime.info.stats.episodes.sub < episode.number
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
