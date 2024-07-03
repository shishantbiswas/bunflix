"use client";
import Hls from "hls.js";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FullscreenIcon,
  HandIcon,
  LoaderIcon,
  PauseIcon,
  PlayIcon,
  Volume2Icon,
  VolumeXIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";

export function HlsPlayer({
  videoSrc,
  track,
}: {
  videoSrc: string;
  track: { file: string; kind: string; label: string; default: boolean }[];
}) {
  const player = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState([0, 0]);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>();
  const [duration, setDuration] = useState<[number, number]>([0, 0]);
  const [durationSec, setDurationSec] = useState<number>();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (Hls.isSupported() && player.current) {
      const hls = new Hls();

      hls.loadSource(videoSrc);
      hls.attachMedia(player.current);

      player.current.addEventListener("canplaythrough", () => {
        setLoading(false);
      });

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

  const toggleFullscreen = useCallback(() => {
    if (player.current) {
      if (!document.fullscreenElement) {
        if (player.current.requestFullscreen) {
          player.current.requestFullscreen();
          setIsFullscreen(true);
        }
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  }, [player, isFullscreen]);

  const sec2Min = (sec: number) => {
    const min = Math.floor(sec / 60);
    const secRemain = Math.floor(sec % 60);
    return {
      min: min,
      sec: secRemain,
    };
  };

  const updateCurrentTime = useCallback(() => {
    if (!player.current) return;

    const { min, sec } = sec2Min(player.current.duration);
    setDurationSec(player.current.duration);
    setDuration([min, sec]);

    const interval = setInterval(() => {
      if (!player.current) return;

      const { min, sec } = sec2Min(player.current.currentTime);
      setCurrentTimeSec(player.current.currentTime);
      setCurrentTime([min, sec]);
    }, 10);

    return () => clearInterval(interval);
  }, [isPlaying, player]);

  useEffect(() => {
    setTimeout(() => {
      updateCurrentTime();
    }, 1000);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case "Space":
          tooglePlayPause();
          break;
        case "KeyF":
          toggleFullscreen();
          break;
        case "KeyM":
          toogleMute();
          break;
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
    updateCurrentTime,
    toogleMute,
    tooglePlayPause,
    toggleFullscreen,
  ]);

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

  return (
    <div className="p-4 bg-black/50 ">
      <div className="group md:h-[450px] mb-4 lg:h-[600px] relative overflow-hidden">
        {hasInteracted && (
          <div
            style={{ opacity: loading ? "100%" : "0%" }}
            className=" absolute -translate-y-1/2 -translate-x-1/2 left-1/2 top-1/2 rounded-lg text-black p-3 flex items-center gap-2 bg-white"
          >
            <LoaderIcon
              color="black"
              size={18}
              className=" animate-spin transition-all duration-[2000ms]"
            />
            Loading ...
          </div>
        )}
        {hasInteracted ? (
          <video
            className="h-full w-full md:rounded-lg"
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
        ) : (
          <span className="flex items-center gap-2">
            <HandIcon color="white" size={18} /> Waiting for user input{" "}
          </span>
        )}

        <div className="absolute top-0 right-0 flex items-center justify-center size-full">
          <Button
            style={{ opacity: loading ? "0%" : "" }}
            className="rounded-full hover:bg-white bg-white/60 aspect-square p-1 size-16 group-hover:opacity-100 opacity-0 transition-all"
            onClick={tooglePlayPause}
          >
            {isPlaying ? (
              <PauseIcon color="black" size={30} />
            ) : (
              <PlayIcon color="black" size={30} />
            )}
          </Button>
        </div>

        <div
          style={{ opacity: !loading ? "100%" : "0%" }}
          className="flex translate-y-16 group-hover:translate-y-0 transition-all items-center gap-2 px-4 absolute bottom-0 w-full py-2 bg-black/20"
        >
          <Button
            size={"sm"}
            className="rounded-full aspect-square p-2 hover:bg-white bg-white/60"
            onClick={tooglePlayPause}
          >
            {isPlaying ? (
              <PauseIcon color="black" />
            ) : (
              <PlayIcon color="black" />
            )}
          </Button>
          <Button
            size={"sm"}
            style={{ backgroundColor: isMuted ? "#e67b6e" : "" }}
            className="rounded-full aspect-square p-2 hover:bg-white bg-white/60"
            onClick={toogleMute}
          >
            {isMuted ? (
              <VolumeXIcon color="black" />
            ) : (
              <Volume2Icon color="black" />
            )}
          </Button>
          <p className=" text-nowrap">
            {currentTime[0]}:{currentTime[1]} / {duration[0] ? duration[0] : 0}:
            {duration[1] ? duration[1] : 0}
          </p>
          <Slider
            min={0}
            max={durationSec}
            defaultValue={currentTime}
            value={[currentTimeSec ? currentTimeSec : 0, 0]}
            onValueChange={(e) => {
              if (player.current) {
                player.current.currentTime = e[1];
              }
            }}
            className="w-full ml-2 cursor-pointer opacity-60 hover:opacity-100 transition-all"
          />
          <Button
            className="rounded-full hover:bg-white bg-white/60 aspect-square p-2 "
            size={"sm"}
            onClick={toggleFullscreen}
          >
            <FullscreenIcon color="black" />
          </Button>
        </div>
      </div>
    </div>
  );
}
