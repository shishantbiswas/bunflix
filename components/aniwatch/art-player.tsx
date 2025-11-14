"use client";
import { useEffect, useRef, useState } from "react";
import Artplayer from "artplayer";
import artplayerPluginHlsControl from "artplayer-plugin-hls-control";
import Hls, {
  HlsConfig,
} from "hls.js";
import { useShow } from "@/context/show-provider";
import { indexDB } from "@/lib/index-db";
import { useLiveQuery } from "dexie-react-hooks";
import { useRouter, useSearchParams } from "next/navigation";
import artplayerPluginChapter from "artplayer-plugin-chapter";
import { toast } from "sonner";

// --------------------- see file node_modules/artplayer-plugin-chapter/types/artplayer-plugin-chapter.d.ts
type Chapters = {
  start: number;
  end: number;
  title: string;
}[];

type Option = {
  chapters?: Chapters;
};

type Result = {
  name: 'artplayerPluginChapter';
  update: (option: Option) => void;
};
// ----------------------
export default function Player({
  data,
  nextEpUrl,
}: {
  data: AniwatchEpisodeSrc;
  nextEpUrl?: string;

  getInstance?: (art: Artplayer) => void;
}) {
  const {
    data: { sources, tracks, outro, intro },
  } = data;

  const src = sources[0].url;
  // const thumbnail = tracks.filter((item) => item.lang === "thumbnails")[0].url;
  const voiceTracks = tracks.filter((item) => item.lang !== "thumbnails");

  const [playerOpts, setPlayerOpts] = useState({
    speed: 1,
    // resolution: "1080",
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const artRef = useRef<Artplayer | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);

  class loader extends Hls.DefaultConfig.loader {
    constructor(config: HlsConfig) {
      super(config);
      const load = this.load.bind(this);

      this.load = function (context, ...rest) {
        const finalUrl = getProxiedUrl(context.url);
        load({ ...context, url: finalUrl }, ...rest);

        function getProxiedUrl(originalUrl: string) {
          const prefix = process.env.NEXT_PUBLIC_PROXY_PREFIX;
          if (!prefix) return originalUrl;

          const cleanUrl = originalUrl.replaceAll("//", "/");
          const cleanPrefix = prefix.replaceAll("//", "/");

          return cleanUrl.startsWith(cleanPrefix)
            ? originalUrl
            : `${prefix}${cleanUrl}`;
        }
      };
    }
  }

  const hlsConfig: Partial<HlsConfig> = {
    fragLoadingMaxRetry: 200,
    fragLoadingRetryDelay: 500,
    fragLoadingTimeOut: 40_000,
    fragLoadingMaxRetryTimeout: 1000,
    maxBufferLength: 300,
    maxMaxBufferLength: 300,
    maxBufferHole: 0.5,
    enableSoftwareAES: true,
    loader: loader,
  };

  const { show } = useShow();

  const showId = `${show?.data.anime.info.id}`;
  const existingShow = useLiveQuery(
    () => indexDB.watchHistory.get(showId),
    [showId]
  );

  const searchParams = useSearchParams();
  const router = useRouter();
  const time = Number(searchParams.get("t"));
  const lang = searchParams.get("lang") ?? "jp";
  const num = Number(searchParams.get("num")) ?? 0;
  const nextUrl = `/watch/${nextEpUrl}&${lang ? "lang=" + lang : ""}&${num ? "num=" + (num + 1) : ""
    }`;

  Artplayer.PLAYBACK_RATE = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25];
  Artplayer.LOG_VERSION = false;
  Artplayer.USE_RAF = true;
  const hls = useRef<Hls | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    artRef.current = new Artplayer({
      url: src,
      container: containerRef.current!,
      setting: true,
      fullscreen: true,
      fullscreenWeb: true,
      playbackRate: true,
      autoPlayback: true,
      screenshot: true,
      gesture: true,
      backdrop: true,
      hotkey: true,
      volume: 0.5,
      muted: false,
      autoplay: true,
      moreVideoAttr: {
        crossOrigin: "anonymous",
      },
      plugins: [
        // artplayerPluginVttThumbnail({
        //   vtt: thumbnail,
        // }),
        artplayerPluginChapter({
          chapters: [
            {
              title: "Opening Song",
              start: intro.start,
              end: intro.end,
            },
            {
              title: "Ending Song",
              start: outro.start,
              end: outro.end,
            },
          ],
        }),
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
              switch: true,
              onSwitch: function (item) {
                item.tooltip = item.switch ? "Hide" : "Show";
                if (artRef.current) {
                  artRef.current.subtitle.show = !item.switch;
                }
                return !item.switch;
              },
            },
            ...voiceTracks.map((sub) => {
              return {
                html: sub.lang,
                url: sub.url,
                default: sub.lang === "English",
              };
            }),
          ],
          onSelect: function (item) {
            if (!artRef.current) return;
            artRef.current.subtitle.switch(item.url, {
              name: item.html,
            });
            return item.html;
          },
        },
      ],
      controls: [
        {
          name: "speed",
          position: "right",
          html: "Speed",
          selector: [
            {
              html: "1x",
            },
            {
              html: "2x",
            },
          ],
          onSelect: function (item) {
            if (!artRef.current) return;
            const speed = Number((item.html as string).charAt(0));
            artRef.current.storage.set("speed", speed);
            setPlayerOpts({ ...playerOpts, speed });
            artRef.current.video.playbackRate = speed;
            return item.html;
          },
        },
      ],
      subtitle: {
        url:
          voiceTracks.filter((sub) => sub.lang === "English")[0]?.url ||
          "Label Missing",
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
            if (!hls.current) {
              hls.current = new Hls({
                ...hlsConfig,
              });
            }
            hls.current?.loadSource(url); // this load for the initial video
            hls.current?.attachMedia(video);
            (art as any).hls = hls.current;

            if (time) {
              video.currentTime = time;
            }
            if (existingShow?.time) {
              video.currentTime = existingShow?.time;
            }
            const speed = Number(art.storage.get("speed")) ?? 1;
            if (speed) {
              video.playbackRate = speed;
            }
            videoRef.current = video;
            art.on("destroy", () => hls?.current?.destroy());
          } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
          } else {
            art.notice.show = "Unsupported playback format: m3u8";
          }
        },
      },
    });

    return () => {
      controller.abort();
      if (artRef.current && artRef.current.destroy) {
        artRef.current.destroy(false);
      }
      if (hls) {
        hls.current?.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || !videoRef.current) return;

    const controller = new AbortController();

    const shortcuts = containerRef.current;

    videoRef.current?.focus({
      preventScroll: true,
    });
    const handlePlay = () => {
      videoRef.current?.play();
      setIsPlaying(true)
    };

    const handlePause = () => {
      videoRef.current?.pause();
      setIsPlaying(false)
    };

    videoRef.current.addEventListener("play", handlePlay, {
      signal: controller.signal,
    });
    videoRef.current.addEventListener("pause", handlePause, {
      signal: controller.signal,
    });
    window.addEventListener(
      "keydown",
      (eve) => {
        const key = eve.key;

        switch (key) {
          case " ":
            if (isPlaying) {
              handlePause();
            } else {
              handlePlay();
            }
            eve.preventDefault();
            break;
          case ".":
            videoRef.current!.currentTime += 5;
            break;
          case ",":
            videoRef.current!.currentTime -= 5;
            break;
          case "=":
            videoRef.current!.playbackRate = 1;
            break;
          case "f":
            if (document.fullscreenElement) {
              document.exitFullscreen();
            } else {
              shortcuts.requestFullscreen();
            }
            break;
          case "Escape":
            if (document.fullscreenElement) {
              document.exitFullscreen();
            }
            break;
        }
      },
      {
        signal: controller.signal,
      }
    );

    return () => {
      controller.abort();
    };
  }, [videoRef.current, isPlaying]);

  useEffect(() => {
    const controller = new AbortController();
    hls.current?.loadSource(src); // this runs for every subsequent video
    const speed = Number(videoRef.current?.playbackRate) ?? playerOpts.speed;
    if (speed && videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    videoRef.current?.addEventListener(
      "ended",
      () => {       
        if (nextEpUrl) {
          toast.info("Playing next episode m'lord");
          const shouldAutoplay = Boolean(
            localStorage.getItem("autoplay")
          );
          if (shouldAutoplay) router.push(nextUrl);
        }
      },
      { signal: controller.signal }
    );
    (artRef.current?.plugins.artplayerPluginChapter as Result).update({
      chapters: [
        {
          title: "Opening Song",
          start: intro.start,
          end: intro.end,
        },
        {
          title: "Ending Song",
          start: outro.start,
          end: outro.end,
        },
      ],
    });
    videoRef.current?.focus({
      preventScroll: true,
    });
  }, [src, nextUrl]);

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
              time: Math.trunc(videoRef.current.currentTime),
              duration: currentShow.duration,
              epNum: show.epNum,
              lang: show.lang,
              updatedAt: new Date(),
              ep: show.ep,
            });
          });
        } else {
          indexDB.watchHistory.add({
            id: showId,
            ep: show.ep,
            lang: show.lang,
            updatedAt: new Date(),
            epNum: show.epNum,
            time: Math.trunc(videoRef.current.currentTime),
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
      ref={containerRef}
      tabIndex={1}
      className="w-full sm:p-4 h-[300px] sm:h-[350px] md:h-[450px] lg:h-[550px] xl:h-[600px] focus:outline-0 focus-within:outline-0"
    />
  );
}
