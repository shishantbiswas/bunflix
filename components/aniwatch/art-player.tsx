"use client";
import { useEffect, useRef } from "react";
import Artplayer from "artplayer";
import Hls from "hls.js/dist/hls.light.js";
import artplayerPluginHlsControl from "artplayer-plugin-hls-control";

export default function Player({
  src,
  getInstance,
  track,
}: {
  src: string;
  getInstance?: (art: Artplayer) => void;
  track: {
    file: string;
    kind: string;
    label: string;
    default: boolean;
  }[];
}) {
  const artRef = useRef<HTMLDivElement>(null);

  const artInstanceRef = useRef<Artplayer | null>(null);

  useEffect(() => {
    if (!artRef.current) return;

    const art = new Artplayer({
      url: src,
      container: artRef.current,
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
            getName: (level: { height: string }) => level.height + 'P',
            title: 'Quality',
            auto: 'Auto',
          },
          audio: {
            control: true,
            setting: true,
            getName: (track: { name: string }) => track.name,
            title: 'Audio',
            auto: 'Auto',
          }
        }),
      ],
      settings: [
        {
          name: 'Speed',
          position: 'right',
          html: 'Speed',
          tooltip: 'Playback Speed',
          selector: [
            {
              html: '0.5x',
              value: 0.5
            },
            {
              html: '0.75x',
              value: 0.75
            },
            {
              html: 'Normal',
              value: 1,
              default: true
            },
            {
              html: '1.25x',
              value: 1.25
            },
            {
              html: '1.5x',
              value: 1.5
            },
            {
              html: '2x',
              value: 2
            },
          ]
        },
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
        url: track?.filter((sub) => sub.label === "English")[0]?.file || "",
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
            if (art.hls) art.hls.destroy();
            const hls = new Hls({
              fragLoadingMaxRetry: 200,
              fragLoadingRetryDelay: 500,
              fragLoadingTimeOut: 30000,
              fragLoadingMaxRetryTimeout: 1000,
              maxBufferLength: 300,
              maxMaxBufferLength: 300,
              maxBufferHole: 0.5,
            });
            hls.loadSource(url);
            hls.attachMedia(video);
            art.hls = hls;
            art.on("destroy", () => hls.destroy());
            video.addEventListener("ended", () => {
              if (hls) {
                // hls.destroy();
                // console.log("HLS instance destroyed");
              }
            });
          } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
          } else {
            art.notice.show = "Unsupported playback format: m3u8";
          }
        },
      },
    });

    artInstanceRef.current = art;

    if (getInstance && typeof getInstance === "function") {
      console.log(getInstance(art));
    }

    return () => {
      if (artInstanceRef.current) {
        artInstanceRef.current.destroy(false);
        artInstanceRef.current = null;
      }
    };
  }, [src, track]);

  return (
    <div
      ref={artRef}
      className="w-full sm:p-4 h-[300px] sm:h-[350px ] md:h-[450px] lg:h-[550px] xl:h-[600px]"
    ></div>
  );
}
