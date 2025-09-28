"use client";
import { useEffect, useRef, useState } from "react";
import Artplayer from "artplayer";
import artplayerPluginHlsControl from "artplayer-plugin-hls-control";
import Hls, {
  FragmentLoaderContext,
  HlsConfig,
  Loader,
  LoaderCallbacks,
  LoaderConfiguration,
  LoaderContext,
  PlaylistLoaderContext,
} from "hls.js";
import { useShow } from "@/context/show-provider";
import { indexDB } from "@/lib/index-db";
import { useLiveQuery } from "dexie-react-hooks";
import { useSearchParams } from "next/navigation";

export default function Player({
  src,
  track,
}: {
  src: string;
  track: {
    file: string;
    kind: string;
    label: string;
    default: boolean;
  }[];
  getInstance?: (art: Artplayer) => void;
}) {
  const artRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  class loader extends Hls.DefaultConfig.loader {
    constructor(config: HlsConfig) {
      super(config);
      const load = this.load.bind(this);

      this.load = function (context, ...rest) {
        load(
          {
            ...context,
            url: `${
              process.env.NEXT_PUBLIC_PROXY_PREFIX
                ? process.env.NEXT_PUBLIC_PROXY_PREFIX + context.url.replaceAll("//", "/")
                : context.url
            }`, // this prevents re-routing
          },
          ...rest
        );
      };
    }
  }

  const hlsConfig: Partial<HlsConfig> = {
    fragLoadingMaxRetry: 200,
    fragLoadingRetryDelay: 500,
    fragLoadingTimeOut: 30000,
    fragLoadingMaxRetryTimeout: 1000,
    maxBufferLength: 300,
    maxMaxBufferLength: 300,
    maxBufferHole: 0.5,
    loader: loader,
  };

  const searchParams = useSearchParams();
  const time = Number(searchParams.get("t")) || 0;
  useEffect(() => {
    let hls: Hls | null = null;
    const art = new Artplayer({
      url: src,
      container: artRef.current!,
      setting: true,
      fullscreen: true,
      fullscreenWeb: true,
      playbackRate: true,
      autoPlayback: true,
      volume: 0.5,
      muted: false,
      autoplay: true,
      moreVideoAttr: {
        crossOrigin: "anonymous",
      },
      plugins: [
        artplayerPluginHlsControl({
          quality: {
            control: true,
            setting: true,
            getName: (level: { height: string }) => level.height,
            title: "Quality",
            auto: "Auto",
          },
          audio: {
            control: true,
            setting: true,
            getName: (track: { name: string }) => track.name,
            title: "Audio",
            auto: "Auto",
          },
        }),
      ],
      settings: [
        {
          width: 200,
          html: "Subtitle",
          tooltip: "Subtitle",
          selector: [
            {
              html: "Display",
              tooltip: "Show",
              switch: false,
              onSwitch: function (item) {
                item.tooltip = item.switch ? "Hide" : "Show";
                art.subtitle.show = !item.switch;
                return !item.switch;
              },
            },
            ...track.map((sub) => {
              return {
                html: sub.label,
                url: sub.file,
              };
            }),
          ],
          onSelect: function (item) {
            art.subtitle.switch(item.url, {
              name: item.html,
            });
            return item.html;
          },
        },
      ],
      subtitle: {
        url: track.filter((sub) => sub.label === "English")[0]?.file || "",
        escape: true,
        name: "English",
        onVttLoad: (vtt) => {
          return vtt.replace(/<[^>]+>/g, "");
        },
        type: "vtt",
        encoding: "utf-8",
        style: {
          fontWeight: "600",
          fontSize: "28px",
        },
      },
      customType: {
        m3u8: function playM3u8(video, url, art) {
          if (Hls.isSupported()) {
            if ((art.hls as Hls)?.destroy) (art.hls as Hls).destroy();
            hls = new Hls(hlsConfig);
            hls.loadSource(url);
            hls.attachMedia(video);
            (art as any).hls = hls;
            video.currentTime = time;
            art.on("destroy", () => hls?.destroy());
            video.addEventListener("ended", () => {
              if (hls) {
                // hls.destroy();
                // console.log("HLS instance destroyed");
              }
            });
            videoRef.current = video;
            const handlePlay = () => setIsPlaying(true);
            const handlePause = () => setIsPlaying(false);

            video.addEventListener("play", handlePlay);
            video.addEventListener("pause", handlePause);
          } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
          } else {
            art.notice.show = "Unsupported playback format: m3u8";
          }
        },
      },
    });

    return () => {
      if (art && art.destroy) {
        art.destroy(false);
      }
      if (hls) hls.destroy();
    };
  }, []);

  const { show } = useShow();
  const showId = `${show?.data.anime.info.id + (show?.ep || "jp")}`;

  const existingShow = useLiveQuery(() => indexDB.watchHistory.get(showId));

  const [createdShow, setCreatedShow] = useState(false);

  useEffect(() => {
    if (existingShow) {
      setCreatedShow(true);
    }
  }, [existingShow]);

  useEffect(() => {
    if (!isPlaying || !show) return;
    const interval = setInterval(() => {
      if (videoRef.current && !videoRef.current.paused) {
        if (createdShow) {
          indexDB.watchHistory.get(showId).then((currentShow) => {
            if (!currentShow || !videoRef.current) return;

            indexDB.watchHistory.update(showId, {
              time: Math.trunc(videoRef.current.currentTime) || 0,
              duration: currentShow.duration,
            });
          });
        } else {
          indexDB.watchHistory.add({
            id: showId,
            ep: show.ep,
            lang: show.lang,
            epNum: show.epNum,
            time: videoRef.current.currentTime,
            duration: videoRef.current.duration,
            show: {
              duration: show.data.anime.moreInfo.duration,
              episodes: {
                dub: Number(show.data.anime.info.stats.episodes.dub),
                sub: Number(show.data.anime.info.stats.episodes.sub),
              },
              poster: show.data.anime.info.poster,
              id: show.data.anime.info.id,
              name: show.data.anime.info.name,
              rating: show.data.anime.info.stats.rating,
              type: show.data.anime.info.stats.type,
            },
          });
          setCreatedShow(true);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, createdShow]);

  return (
    <div
      ref={artRef}
      className="w-full sm:p-4 h-[300px] sm:h-[350px] md:h-[450px] lg:h-[550px] xl:h-[600px]"
    />
  );
}
