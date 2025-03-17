"use client";
import { createImageUrl } from "@/lib/utils";
import {
  FileWarningIcon,
  Info,
  Play,
  SquareArrowOutUpRight,
} from "lucide-react";
import Link from "@/components/link";
import { useState } from "react";
import { easings, useInView, animated } from "@react-spring/web";

export default function MovieItem({
  type,
  movie,
  size,
}: {
  type: string;
  movie: MovieResults;
  size?: String;
}) {
  const {
    id,
    title,
    backdrop_path,
    overview,
    first_air_date,
    synopsis,
    poster_path,
    image,
    release_date,
    name,
    media_type,
    profile_path,
  } = movie;

  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

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
    }
  );

  return (
    <animated.div
      ref={ref}
      style={{
        display:
          media_type === "person" || media_type === "collection"
            ? "none"
            : "flex",
        ...springs,
      }}
      className={`relative inline-block focus:outline text-white rounded-lg overflow-hidden mx-2 transition-all duration-200 ${
        size ? size : "h-[210px] w-[145px] md:h-[300px] md:w-[200px]"
      } `}
    >
      {!loaded && (
        <div className="absolute top-0 size-full animate-pulse bg-gray-400"></div>
      )}
      {!error ? (
        <img
          fetchPriority="low"
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`absolute top-0 size-full object-cover object-center`}
          src={
            image
              ? image
              : createImageUrl(
                  profile_path || poster_path || backdrop_path,
                  "w500"
                )
          }
          alt={title}
        />
      ) : (
        <div className="size-full bg-gray-400  flex items-center justify-center flex-col">
          <FileWarningIcon />
          <span className="text-sm leading-none text-center">Image Error</span>
        </div>
      )}
      <div className="absolute h-full flex items-center justify-between flex-col top-0 left-0 w-full focus:hover:bg-red-700 transition-all   backdrop-blur-md opacity-0  focus-within:opacity-100 hover:opacity-100  p-3 group">
        <div>
          <p
            className={` whitespace-normal font-semibold mb-2 leading-[12px] transition-all  group-hover:leading-[22px] text-md md:text-xl `}
          >
            {title ? title : name}
          </p>
          <div className=" flex gap-2 opacity-70">
            <p className="text-[13px] md:text-md text-nowrap  duration-500  ">
              {release_date ? release_date : first_air_date}
            </p>
            <p className="text-[13px] capitalize md:text-md   duration-500  focus-within:opacity-70">
              {media_type}
            </p>
          </div>
          <p className=" whitespace-normal line-clamp-2  duration-500  text-[15px] pt-1 opacity-70">
            {overview ? overview : synopsis}
          </p>
        </div>
        <div className="flex gap-2 w-full">
          <Link
            href={`/video/${type || media_type}/${id}/${
              type === "tv" || media_type === "tv"
                ? "?season=1&episode=1&provider=vidsrc"
                : "?provider=vidsrc"
            }`}
          >
            <div className=" rounded-full w-full p-4 transition-all text-xl flex items-center justify-start gap-2 hover:bg-red-700 ">
              <Play size={20} />
            </div>
          </Link>
          <Link target="_blank" href={`/info/${type || media_type}/${id}`}>
            <div className=" rounded-full w-full p-4 transition-all text-xl flex items-center justify-start gap-4 hover:bg-gray-400/30">
              <SquareArrowOutUpRight size={20} />
            </div>
          </Link>
        </div>
      </div>
    </animated.div>
  );
}
