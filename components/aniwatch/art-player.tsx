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
import { useGlobalTransition } from "@/context/transition-context";

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
  prevEpUrl,
}: {
  data: AniwatchEpisodeSrc;
  nextEpUrl?: string;
  prevEpUrl?: string;

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
  const { startTransition } = useGlobalTransition();
  const router = useRouter();
  const time = Number(searchParams.get("t"));
  const lang = searchParams.get("lang") ?? "jp";
  const num = Number(searchParams.get("num")) ?? 0;
  const nextUrl = `/watch/${nextEpUrl}&${lang ? "lang=" + lang : ""}&${num ? "num=" + (num + 1) : ""}`;
  const prevUrl = `/watch/${prevEpUrl}&${lang ? "lang=" + lang : ""}&${num ? "num=" + (num - 1) : ""}`;

  function playNext() {
    toast.info("Playing next episode m'lord");
    startTransition(() => {
      router.push(nextUrl);
    })
  }
  function playPrevious() {
    toast.info("Playing previous episode m'lord");
    startTransition(() => {
      router.push(prevUrl);
    })
  }

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
      // icons: {
      //   play: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play-icon lucide-play"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/></svg>',
      //   pause: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pause-icon lucide-pause"><rect x="14" y="3" width="5" height="18" rx="1"/><rect x="5" y="3" width="5" height="18" rx="1"/></svg>',
      //   setting: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings-icon lucide-settings"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/></svg>',
      //   check: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5"/></svg>',
      //   loading: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-circle-icon lucide-loader-circle"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>',
      //   screenshot: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-camera-icon lucide-camera"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/><circle cx="18" cy="13" r="4"/><path d="M14 17h.01"/></svg>',
      //   arrowLeft: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-step-back-icon lucide-step-back"><path d="M13.971 4.285A2 2 0 0 1 17 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z"/><path d="M21 20V4"/></svg>',
      //   arrowRight:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-step-forward-icon lucide-step-forward"><path d="M10.029 4.285A2 2 0 0 0 7 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z"/><path d="M3 4v16"/></svg>',
      //   error:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-triangle-alert-icon lucide-triangle-alert"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
      //   pip:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-picture-in-picture-icon lucide-picture-in-picture"><path d="M2 10h6V4"/><path d="m2 4 6 6"/><path d="M21 10V7a2 2 0 0 0-2-2h-7"/><path d="M3 14v2a2 2 0 0 0 2 2h3"/><rect x="12" y="14" width="10" height="7" rx="1"/></svg>',
      //   close:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
      //   switchOff:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-toggle-left-icon lucide-toggle-left"><circle cx="9" cy="12" r="3"/><rect width="20" height="14" x="2" y="5" rx="7"/></svg>',
      //   switchOn:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-toggle-right-icon lucide-toggle-right"><circle cx="15" cy="12" r="3"/><rect width="20" height="14" x="2" y="5" rx="7"/></svg>',
      //   fullscreenOff:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-maximize-icon lucide-maximize"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>',
      //   fullscreenOn:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minimize-icon lucide-minimize"><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></svg>',
      //   playbackRate:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-gauge-icon lucide-gauge"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>',
      //   fullscreenWebOff:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shrink-icon lucide-shrink"><path d="m15 15 6 6m-6-6v4.8m0-4.8h4.8"/><path d="M9 19.8V15m0 0H4.2M9 15l-6 6"/><path d="M15 4.2V9m0 0h4.8M15 9l6-6"/><path d="M9 4.2V9m0 0H4.2M9 9 3 3"/></svg>',
      //   fullscreenWebOn:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-expand-icon lucide-expand"><path d="m15 15 6 6"/><path d="m15 9 6-6"/><path d="M21 16v5h-5"/><path d="M21 8V3h-5"/><path d="M3 16v5h5"/><path d="m3 21 6-6"/><path d="M3 8V3h5"/><path d="M9 9 3 3"/></svg>',
      //   volume:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume2-icon lucide-volume-2"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.364 18.364a9 9 0 0 0 0-12.728"/></svg>',
      //   volumeClose:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-x-icon lucide-volume-x"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/></svg>',
      //   flip:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flip-horizontal-icon lucide-flip-horizontal"><path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3"/><path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3"/><path d="M12 20v2"/><path d="M12 14v2"/><path d="M12 8v2"/><path d="M12 2v2"/></svg>',
      //   airplay:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-airplay-icon lucide-airplay"><path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"/><path d="m12 15 5 6H7Z"/></svg>',
      //   lock:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock-icon lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
      //   unlock:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock-open-icon lucide-lock-open"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>',
      // },
      plugins: [
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
          name: "prev",
          html: "<svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='lucide lucide-skip-back-icon lucide-skip-back'><path d='M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z'/><path d='M3 20V4'/></svg>",
          tooltip: "Previous",
          position: "left",
          disable: !Boolean(prevEpUrl),
          click: function () {
            if (!artRef.current) return;
            if (!prevEpUrl) return;
            artRef.current.notice.show = "Playing previous episode";
            playPrevious();
          },
        },
        {
          name: "next",
          html: "<svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='lucide lucide-skip-forward-icon lucide-skip-forward'><path d='M21 4v16'/><path d='M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z'/></svg>",
          tooltip: "Next",
          position: "right",
          disable: !Boolean(nextEpUrl),
          click: function () {
            if (!artRef.current) return;
            if (!nextEpUrl) return;
            artRef.current.notice.show = "Playing next episode";
            playNext();
          },
        },
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
            artRef.current.notice.show = `Speed reset to ${speed}x`;
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

    const formatTime = (time: number): `${string}:${string}` => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${formattedMinutes}:${formattedSeconds}`;
    }

    window.addEventListener(
      "keydown",
      (eve) => {
        const key = eve.key;
        if (!artRef.current) return;
        const art = artRef.current;

        switch (key) {
          case " ":
            if (isPlaying) {
              handlePause();
              art.notice.show = "Paused";
            } else {
              handlePlay();
              art.notice.show = "Playing";
            }
            eve.preventDefault();
            break;
          case ".":
            videoRef.current!.currentTime += 5;
            const currentTimeFormatted = formatTime(art.currentTime);
            const durationFormatted = formatTime(art.duration);
            art.notice.show = `${currentTimeFormatted} / ${durationFormatted}`;
            break;
          case ",":
            videoRef.current!.currentTime -= 5;
            art.notice.show = `${formatTime(art.currentTime)} / ${formatTime(art.duration)}`;
            break;
          case "=":
            videoRef.current!.playbackRate = 1;
            art.notice.show = "Speed reset to 1x";
            break;
          case "s":
            art.notice.show = "";
            if (art.subtitle.show) {
              art.notice.show = "Subtitle off";
            } else {
              art.notice.show = "Subtitle on";
            }
            art.subtitle.show = !art.subtitle.show;
            break;
          case "f":
            if (document.fullscreenElement) {
              document.exitFullscreen();
            } else {
              shortcuts.requestFullscreen();
            }
            break;
          case "n":
            if (!nextEpUrl) return;
            art.notice.show = "Playing next episode";
            playNext();
            break;
          case "p":
            if (!prevEpUrl) return;
            art.notice.show = "Playing previous episode";
            playPrevious();
            break;
          case "[":
            art.video.playbackRate -= (0.1);
            art.notice.show = `Speed to ${art.video.playbackRate.toFixed(1)}x`;
            break;
          case "]":
            art.video.playbackRate += 0.1;
            art.notice.show = `Speed to ${art.video.playbackRate.toFixed(1)}x`;
            break;
          case "t":
            if (art.fullscreenWeb) {
              art.fullscreenWeb = false
            } else {
              art.fullscreenWeb = true
            }
            break;
          case "m":
            art.muted = !art.muted;
            art.notice.show = art.muted ? "Muted" : "Unmuted";
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

    if (!artRef.current) return;
    if (lang === "jp") {
      tracks.forEach((track) => {
        if (artRef.current && track.lang == "English") {
          artRef.current.subtitle.switch(track.url, {
            name: track.lang,
          });
        }
      });
    }
    if (speed && artRef.current) {
      artRef.current.video.playbackRate = speed ?? artRef.current.video.playbackRate;
    }
    if (artRef.current && artRef.current.hls) {
      (artRef.current.hls as Hls).currentLevel = Number(artRef.current.storage.get("speed")) ?? (artRef.current.hls as Hls).currentLevel ?? artRef.current.video.playbackRate;
    }

    videoRef.current?.addEventListener(
      "ended",
      () => {
        if (nextEpUrl) {
          playNext();
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

    return () => {
      controller.abort();
    };
  }, [src, nextUrl, videoRef.current]);


  useEffect(() => {
    const video = videoRef.current;
    if (!video || !show) return;

    const controller = new AbortController();

    video.addEventListener("timeupdate", (eve) => {
      indexDB.watchHistory.get(showId).then((savedShow) => {
        if (!savedShow) {
          indexDB.watchHistory.add({
            id: showId,
            ep: show.ep,
            lang: show.lang,
            updatedAt: new Date(),
            epNum: show.epNum,
            time: Math.trunc(video.currentTime),
            duration: video.duration,
            show: {
              duration: show.data.anime.moreInfo.duration,
              episodes: {// retain resolutionspeed
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
          return;
        }
        indexDB.watchHistory.update(showId, {
          time: Math.trunc(video.currentTime),
          duration: video.duration,
          epNum: show.epNum,
          lang: show.lang,
          updatedAt: new Date(),
          ep: show.ep,
        });
      });

    }, { signal: controller.signal });

    return () => {
      controller.abort();
    };
  }, [artRef.current, videoRef.current, show]);

  useEffect(() => {
    if (!artRef.current || !videoRef.current) return;
    const art = artRef.current;
    const video = videoRef.current;
    const controller = new AbortController();

    video.addEventListener("timeupdate", () => {
      let inChapter = false;
      let section = "";

      const currentTime = video.currentTime;

      if (currentTime > intro.start && currentTime < intro.end) {
        inChapter = true;
        section = "intro";
      }
      if (currentTime > outro.start && currentTime < outro.end) {
        inChapter = true;
        section = "outro";
      }

      if (art.layers['skip']) {
        art.layers.update({
          name: 'skip',
          disable: !inChapter,
          html: `<button class="bg-red-600 text-white px-4 py-2 rounded cursor-pointer capitalize z-50 font-bold focus:outline-none focus:ring-2 focus:ring-white">Skip ${section}</button>`,
          style: {
            display: inChapter ? 'block' : 'none',
            bottom: '5rem',
            right: '3rem',
            position: 'absolute',

          },
          click: function () {
            video.currentTime = section === "intro" ? intro.end : outro.end;
            art.notice.show = `Skipped ${section}`;
            art.play();
          },
        });
        return;
      }
      if (inChapter) {
        art.layers.add({
          name: 'skip',
          style: {
            display: 'none',
          },
        });
      } else {
        if (art.layers['skip']) {
          art.layers.remove('skip');
        }
      }
    }, { signal: controller.signal });

    return () => {
      controller.abort();
    };

  }, [artRef.current, videoRef.current]);

  return (
    <div
      ref={containerRef}
      tabIndex={1}
      className="w-full sm:p-4 h-[300px] sm:h-[350px] md:h-[450px] lg:h-[550px] xl:h-[600px] focus:outline-0 focus-within:outline-0"
    />
  );
}
