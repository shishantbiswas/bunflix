"use client";
import Hls, { Level } from "hls.js";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FastForwardIcon,
  FullscreenIcon,
  HandIcon,
  LoaderIcon,
  PauseIcon,
  PlayIcon,
  RotateCcwIcon,
  RotateCwIcon,
  Volume1Icon,
  Volume2Icon,
  VolumeXIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useSearchBarFocus } from "@/context/searchContext";
import Dexie, { EntityTable } from "dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { pendingShows } from "@/lib/pending-show";
import { useSearchParams } from "next/navigation";

export function HlsPlayer({
  videoSrc,
  data,
  track,
  lang,
  episode,
  ep,
  episodeId,
}: {
  videoSrc: string;
  data: aniwatchInfo;
  track: { file: string; kind: string; label: string; default: boolean }[];
  lang: string;
  episode: number;
  ep: string;
  episodeId: string;
}) {
  const player = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState<[number, number]>([0, 0]);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [duration, setDuration] = useState<[number, number]>([0, 0]);
  const [durationSec, setDurationSec] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showControl, setShowControl] = useState(false);
  const [animation, setAnimation] = useState<
    | "backward"
    | "forward"
    | "increase"
    | "decrease"
    | "playPause"
    | "mute"
    | null
  >(null);
  const [volume, setVolume] = useState<number>(1);
  const [levels, setLevels] = useState<Level[]>([]);
  const [hlsInstance, setHlsInstance] = useState<null | Hls>(null);

  const { isSearchBarFocused } = useSearchBarFocus();
  const searchParams = useSearchParams()

  const time = searchParams.get('time')


  // hls initialization and attaching soucres
  useEffect(() => {
    if (Hls.isSupported() && player.current) {
      const hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(player.current);

      player.current.addEventListener("canplaythrough", () => {
        setLoading(false);
      });

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        setLevels(data.levels);
      });
      setHlsInstance(hls);
      updateCurrentTime();

      hls.on(Hls.Events.ERROR, function (event, data) {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              toast.warning("fatal network error encountered, try to recover");
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              toast.warning("fatal media error encountered, try to recover");
              hls.recoverMediaError();
              break;
            case Hls.ErrorTypes.OTHER_ERROR:
              toast.error("fatal error encountered");
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });

      if(time){
        player.current.currentTime = parseInt(time)
      }

      return () => {
        if (player.current) {
          player.current.addEventListener("canplaythrough", () => {
            setLoading(false);
          });
        }
        hls.destroy();
      };
    }
  }, [player, videoSrc, hasInteracted]);

  const tooglePlayPause = useCallback(() => {
    if (player.current) {
      if (isPlaying) {
        player.current.pause();
      } else {
        player.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [player, isPlaying]);

  const toogleMute = useCallback(() => {
    if (player.current) {
      if (isMuted) {
        player.current.muted = false;
        setIsMuted(false);
      } else {
        player.current.muted = true;
        setIsMuted(true);
      }
    }
  }, [isMuted, player]);

  const toggleFullscreen = async () => {
    if (isFullscreen) {
      document.exitFullscreen();
      if (screen.orientation) {
        screen.orientation.unlock();
        setIsFullscreen(false);
      }
    } else {
      containerRef?.current?.requestFullscreen();
      if (
        (screen.orientation as any) &&
        typeof (screen.orientation as any).lock === "function"
      ) {
        (screen.orientation as any).lock("landscape");
        setIsFullscreen(true);
      }
    }
  };

  const sec2Min = (sec: number) => {
    const min = Math.floor(sec / 60);
    const secRemain = Math.floor(sec % 60);
    return {
      min: min,
      sec: secRemain,
    };
  };

  const updateCurrentTime = useCallback(() => {
    if (player.current) {
      const { min, sec } = sec2Min(player.current.duration);
      setDurationSec(player.current.duration);
      setDuration([min, sec]);

      const interval = setInterval(() => {
        if (!player.current) return;

        const { min, sec } = sec2Min(player.current.currentTime);
        setCurrentTimeSec(player.current.currentTime);
        setCurrentTime([min, sec]);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, player]);

  const volumnControl = (control: "increase" | "decrease") => {
    if (player.current) {
      setVolume(player.current.volume);
      if (control === "increase") {
        if (player.current.volume === 1) {
          toast.warning("Maximum volumn reached");
          return;
        } else player.current.volume += 0.1;
      } else if (control === "decrease") {
        if (player.current.volume > 0.1) {
          player.current.volume -= 0.1;
        } else {
          toast.warning("Minimum volumn reached");
          return;
        }
      }
    }
  };

  const shortcutPopups = (
    control:
      | "forward"
      | "backward"
      | "increase"
      | "decrease"
      | "playPause"
      | "mute"
  ) => {
    if (player.current) {
      switch (control) {
        case "forward":
          player.current.currentTime = player.current.currentTime + 5;
          setAnimation("forward");
          break;
        case "backward":
          player.current.currentTime = player.current.currentTime - 5;
          setAnimation("backward");
          break;
        case "increase":
          volumnControl("increase");
          setAnimation("increase");
          break;
        case "decrease":
          volumnControl("decrease");
          setAnimation("decrease");
          break;
        case "playPause":
          tooglePlayPause();
          setAnimation("playPause");
          break;
        case "mute":
          toogleMute();
          setAnimation("mute");
          break;
      }
    }
    setTimeout(() => {
      setAnimation(null);
    }, 500);
  };

  // keyboard shortcut for play,pause,etc
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isSearchBarFocused) {
        return;
      }
      switch (event.code) {
        case "Space":
          event.preventDefault();
          tooglePlayPause();
          shortcutPopups("playPause");
          break;
        case "KeyF":
          event.preventDefault();
          toggleFullscreen();
          break;
        case "KeyM":
          toogleMute();
          shortcutPopups("mute");
          break;
        case "ArrowUp":
          event.preventDefault();
          shortcutPopups("increase");
          break;
        case "ArrowDown":
          event.preventDefault();
          shortcutPopups("decrease");
          break;
        case "ArrowLeft":
          event.preventDefault();
          shortcutPopups("backward");
          break;
        case "ArrowRight":
          event.preventDefault();
          shortcutPopups("forward");
          break;
        case "Escape":
          event.preventDefault();
          if (isFullscreen) {
            toggleFullscreen();
          }
      }
    };
    updateCurrentTime();
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    isPlaying,
    isFullscreen,
    isMuted,
    currentTimeSec,
    toogleMute,
    isSearchBarFocused,
  ]);

  // checking user interactions(click,keyboard presses) to start auto play
  // special note : fuck autoplay policies
  useEffect(() => {
    const handleUserInteraction = () => {
      setHasInteracted(true);
    };
    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("keydown", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };
  }, []);

  const iconSize: number = 20;


  const existingShow = useLiveQuery(() => pendingShows.shows?.where("id").equals(`${episodeId}?ep=${ep}`).count());  
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (existingShow){    
        console.log(existingShow);
        
        pendingShows.shows.update(`${episodeId}?ep=${ep}`, {
          time: player.current?.currentTime || 0,
        });
      } else {
        pendingShows.shows.add({
          lang,
          name:data.anime.info.name,
          image:data.anime.info.poster,
          episode,
          id: `${episodeId}?ep=${ep}`,
          time: player.current?.currentTime||0,
        });
      }
    }, 10_000);

    return () => clearInterval(interval);
  }, [existingShow]);

  return (
    <div className=" md:p-4 focus:outline-none">
      <div
        onMouseEnter={() => setShowControl(true)}
        onMouseLeave={() => setShowControl(false)}
        onClick={() => setShowControl(!showControl)}
        ref={containerRef}
        className=" group md:h-[450px] lg:h-[550px] xl:h-[600px] w-full relative overflow-hidden md:rounded-lg"
      >
         {hasInteracted && (
          <div
            style={{ opacity: loading ? "100%" : "0%" }}
            className="pointer-events-none cursor-default absolute -translate-y-1/2 -translate-x-1/2 text-xl left-1/2 top-1/2 rounded-lg p-3 flex items-center gap-2 z-50 "
          >
            <LoaderIcon
              color="white"
              size={18}
              style={{
                animation: "spin 2s linear infinite",
              }}
              className=" transition-all"
            />
            <span>Loading ...</span>
          </div>
        )}
        {hasInteracted ? (
          <>
            <video
              className="w-full h-full  bg-black/60 relative"
              crossOrigin="anonymous"
              controlsList="nodownload"
              autoPlay
              ref={player}
            >
              {track.map((e) => (
                <track
                  key={e.file}
                  kind={e.kind}
                  src={e.file}
                  default={e.default}
                  label={e.label}
                ></track>
              ))}
            </video>
          </>
        ) : (
          <div className="flex items-center gap-2 p-4 md:p-0 text-2xl">
            <HandIcon color="white" size={18} /> Waiting for user input
          </div>
        )}
        <div
          className={`absolute  bottom-16 right-1/2 -translate-x-1/2 text-white text-2xl pointer-events-none `}
        >
          <div
            className="absolute duration-500 text-[16px] top-0  right-0"
            style={{
              opacity: animation === "backward" ? "100%" : "0%",
              transform:
                animation === "backward"
                  ? "translateX(-25px)"
                  : "translateX(00px)",
            }}
          >
            {/* lucide doesn't have a go backward button of such style */}
            <FastForwardIcon size={iconSize} className="rotate-180" />
          </div>
          <div
            className="absolute duration-500 text-[16px] top-0  right-0"
            style={{
              opacity: animation === "forward" ? "100%" : "0%",
              transform:
                animation === "forward"
                  ? "translateX(25px)"
                  : "translateX(00px)",
            }}
          >
            <FastForwardIcon size={iconSize} />
          </div>
          <div
            className="w-fit text-nowrap absolute top-0 right-0"
            style={{
              opacity: animation === "decrease" ? "100%" : "0%",
            }}
          >
            {(volume * 100).toFixed()} %
          </div>
          <div
            className="text-nowrap w-fit absolute top-0 right-0"
            style={{
              opacity: animation === "increase" ? "100%" : "0%",
            }}
          >
            {(volume * 100).toFixed()} %
          </div>
          <div
            className="  absolute top-0 right-0"
            style={{
              opacity: animation === "mute" ? "100%" : "0%",
            }}
          >
            {isMuted ? (
              <VolumeXIcon size={iconSize} />
            ) : volume > 0.5 ? (
              <Volume2Icon size={iconSize} />
            ) : (
              <Volume1Icon size={iconSize} />
            )}
          </div>
          <div
            className="  absolute top-0 right-0"
            style={{
              opacity: animation === "playPause" ? "100%" : "0%",
            }}
          >
            {isPlaying ? <PlayIcon /> : <PauseIcon />}
          </div>
        </div>

        <div
          style={{
            opacity: loading ? "0%" : showControl ? "100%" : "0%",
            pointerEvents: loading ? "none" : showControl ? "all" : "none",
          }}
          className="absolute top-0  right-0 flex items-center justify-center size-full space-x-3"
        >
          <button
            onClick={() => shortcutPopups("backward")}
            className="rounded-full hover:scale-110  hover:bg-black bg-black/60 aspect-square p-1 size-12  flex items-center justify-center  transition-all"
          >
            <RotateCcwIcon color="white" size={20} />
          </button>
          <button
            className="rounded-full hover:bg-black hover:scale-110 bg-black/60 aspect-square p-1 size-16  flex items-center justify-center  transition-all"
            onClick={tooglePlayPause}
          >
            {isPlaying ? (
              <PauseIcon color="white" size={30} />
            ) : (
              <PlayIcon color="white" size={30} />
            )}
          </button>
          <button
            onClick={() => shortcutPopups("forward")}
            className="rounded-full hover:bg-black hover:scale-110 bg-black/60 aspect-square p-1 size-12 flex items-center justify-center   transition-all"
          >
            <RotateCwIcon color="white" size={20} />
          </button>
        </div>
        <div
          style={{
            opacity: !loading ? "100%" : "0%",
            transform: showControl ? "translateY(0px)" : "translateY(96px)",
          }}
          className="flex  transition-all  items-center justify-center gap-2 px-4 absolute bottom-0 w-full py-2 bg-black/20"
        >
          <button
            className="rounded-full aspect-square p-2 transition-all hover:scale-110"
            onClick={tooglePlayPause}
          >
            {isPlaying ? (
              <PauseIcon size={iconSize} />
            ) : (
              <PlayIcon size={iconSize} />
            )}
          </button>
          <button
            style={{
              backgroundColor: isMuted || volume <= 0.1 ? " #ef4444" : "",
            }}
            className="rounded-full aspect-square p-2 transition-all hover:scale-110"
            onClick={toogleMute}
          >
            {isMuted || volume <= 0.1 ? (
              <VolumeXIcon size={iconSize} />
            ) : volume > 0.5 ? (
              <Volume2Icon size={iconSize} />
            ) : (
              <Volume1Icon size={iconSize} />
            )}
          </button>
          <p className=" text-nowrap text-sm mt-1">
            {currentTime[0]}:{currentTime[1]} / {duration[0] ? duration[0] : 0}:
            {duration[1] ? duration[1] : 0}
          </p>
          <input
            type="range"
            min="0"
            max={durationSec || 0}
            value={currentTimeSec || 0}
            className="cursor-pointer focus:outline-none w-full accent-red-500 "
            onChange={(e) => {
              e.preventDefault();
              if (player.current && player.current.currentTime) {
                player.current.currentTime = parseInt(e.target.value);
              }
            }}
          />
          <div className="py-2 px-3 text-start flex gap-2">
            {levels.map((level, index) => (
              <p
                key={index}
                style={{
                  textDecorationLine:
                    index === hlsInstance?.currentLevel ? "underline" : "none",
                }}
                className="underline cursor-pointer"
                onClick={() =>
                  hlsInstance ? (hlsInstance.currentLevel = index) : null
                }
              >
                {level.height}p
              </p>
            ))}
          </div>

          <button
            className="rounded-full aspect-square p-2 "
            onClick={toggleFullscreen}
          >
            <FullscreenIcon
              size={iconSize}
              className="hover:scale-125 transition-all"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
