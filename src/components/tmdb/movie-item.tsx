"use client";
import { a, easings, useInView, useSpring } from "@react-spring/web";
import { Link } from "@tanstack/react-router";
import { useDebounce, useWindowSize } from "@uidotdev/usehooks";
import {
  // EllipsisVerticalIcon,
  FileWarningIcon,
  PlayIcon,
  PlusIcon,
  SquareArrowOutUpRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createImageUrl } from "@/lib/utils";

export default function MovieItem({
  type,
  movie,
  size,
}: {
  type: string;
  movie: MovieResults;
  size?: string;
}) {
  const {
    id,
    title,
    backdrop_path,
    overview,
    first_air_date,
    synopsis,
    image,
    release_date,
    name,
    media_type,
  } = movie;

  // const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [isBeingHovered, setIsBeingHovered] = useState(false);

  const debouncedHovered = useDebounce(hovered, 500);

  const [props, api] = useSpring(
    () => ({
      from: { opacity: 0, scale: 0.75, display: "none", y: 20 },
    }),
    [],
  );

  const [isInView, inView] = useInView({
    rootMargin: "100%",
    amount: 1,
  });

  useEffect(() => {
    if (isBeingHovered && inView) return;
    const timeOut = setTimeout(() => {
      if (debouncedHovered) {
        api.start({
          to: async (next) => {
            await next({
              opacity: 0,
              scale: 0.75,
              y: 20,
            });
            await next({ display: "none" });
          },
          config: {
            duration: 350,
          },
        });
        setHovered(false);
      }
    }, 250);
    return () => {
      clearTimeout(timeOut);
    };
  }, [debouncedHovered, isBeingHovered, api, inView]);

  useEffect(() => {
    if (debouncedHovered && inView) {
      api.start({
        to: {
          opacity: 1,
          scale: 1,
          display: "flex",
          y: 0,
        },
      });
    }
  }, [debouncedHovered, api, inView]);

  const [ref, springs] = useInView(
    () => ({
      from: {
        opacity: 0,
        scale: 0.75,
      },
      to: {
        opacity: 1,
        scale: 1,
      },
      config: {
        easing: easings.easeOutCubic,
      },
    }),
    {
      once: true,
      rootMargin: "-10% 0%",
    },
  );

  const dialogRef = ref.current as HTMLDialogElement | undefined;
  const magicNumber = (dialogRef?.getBoundingClientRect().width ?? 0) / 8;
  const middlePoint = (dialogRef?.getBoundingClientRect().x ?? 0) - magicNumber;

  // console.log("%s is %s", title, entry?.isIntersecting);

  const screenSize = useWindowSize().width ?? 0;
  const isInFirstQuater = (15 / 100) * screenSize > middlePoint;
  const isInLastQuater = (75 / 100) * screenSize < middlePoint;

  return (
    <a.div
      ref={(elem) => {
        ref.current = elem;
        isInView.current = elem;
      }}
      onMouseEnter={() => {
        setHovered(true);
        setIsBeingHovered(true);
      }}
      onMouseLeave={() => {
        setIsBeingHovered(false);
      }}
      style={springs}
      className={`focus:outline text-white rounded mx-2 transition-all duration-200 ${
        size ? size : "h-[140px] w-[240px]"
      }`}
    >
      {/* {!loaded && <div className="size-full animate-pulse bg-gray-400"></div>} */}
      {!error ? (
        <img
          fetchPriority="low"
          loading="lazy"
          // onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`size-full object-cover object-center`}
          src={image ? image : createImageUrl(backdrop_path, "w500")}
          alt={title}
        />
      ) : (
        <div className="size-full bg-gray-400  flex items-center justify-center flex-col">
          <FileWarningIcon />
          <span className="text-sm leading-none text-center">Image Error</span>
        </div>
      )}

      <a.dialog
        style={{
          pointerEvents: isBeingHovered ? "auto" : "none",
          left: isInFirstQuater
            ? middlePoint + 28
            : isInLastQuater
              ? middlePoint - 28
              : middlePoint,
          ...props,
        }}
        className="min-w-[250px] max-w-[300px] p-2 z-50 absolute -top-16 bg-card text-white flex flex-col gap-y-2 rounded"
      >
        <img
          src={image ? image : createImageUrl(backdrop_path, "w500")}
          alt={title || name}
        />
        <h1 className="text-lg font-bold">{title || name}</h1>
        <p className="text-xs opacity-75">{overview || synopsis}</p>
        <time className="text-sm opacity-75">
          {new Date(release_date || first_air_date).toLocaleDateString("en", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <div className="flex items-center justify-between gap-2 mt-4">
          <div className="flex items-center gap-2">
            <Link
              to={"/video/$type/$id"}
              params={{
                id: id.toString(),
                type: (type || media_type) as "tv" | "movie",
              }}
              search={{
                provider: "twoEmbed",
              }}
            >
              <button className="rounded px-12 h-8 flex items-center cursor-pointer justify-center gap-2 bg-white text-black text-nowrap">
                <PlayIcon className="size-4 text-card fill-card" /> Play Now
              </button>
            </Link>
            <Link
              to={"/info/$type/$id"}
              params={{ id: id.toString(), type: (type || media_type) as "tv" | "movie" }}
              target="_blank"
            >
              <button className="rounded size-8 aspect-square flex items-center border cursor-pointer justify-center">
                <SquareArrowOutUpRight className="size-4 " />
              </button>
            </Link>
          </div>
          <button className="rounded size-8 aspect-square flex items-center border cursor-pointer justify-center">
            <PlusIcon className="size-4 " />
          </button>
          {/* <button className="rounded size-8 aspect-square flex items-center border justify-center">
              <EllipsisVerticalIcon className="size-4 " />
            </button> */}
        </div>
      </a.dialog>
    </a.div>
  );
}
