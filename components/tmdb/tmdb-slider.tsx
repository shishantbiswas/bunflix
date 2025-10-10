"use client";
import { useEffect, useState } from "react";
import { animated, useSpring, useTransition } from "@react-spring/web";
import Link from "@/components/link";
import { createImageUrl } from "@/lib/utils";

export default function TmdbSlider({ data }: { data: TMDBMovie }) {
  const [imageindex, setImageindex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setImageindex((pre) => (pre + 1) % data.results.length);
    }, 8000);

    return () => clearInterval(intervalId);
  }, [imageindex]);

  const item = data.results[imageindex];
  const transitions = useTransition(item, {
    from: { opacity: 0, transform: "scale(0.9)", height: "0%" },
    enter: { opacity: 1, transform: "scale(1)", height: "100%" },
    leave: { opacity: 0, transform: "scale(0.9)", height: "0%" },
    config: { duration: 500 },
  });

  return (
    <div className="relative w-full h-[300px] sm:h-[350px] lg:h-[450px]">
      {transitions((style, item, key) => (
        <div className={`absolute top-0  p-4 right-0 w-full h-full `}>
          <animated.div
            key={key.key}
            className="rounded-lg w-full h-full object-cover "
            style={{
              ...style,
              backgroundImage: `url(${createImageUrl(
                item.poster_path || item.backdrop_path,
                "original"
              )})`,
            }}
          />
          <Link href={`/video/movie/${item.id}`}>
            <animated.div
              style={{
                ...style,
              }}
              className="absolute bottom-0 py-4 mb-4 right-4 px-6 z-10 opacity-80 text-right bg-gradient-to-br from-transparent to-black/30 backdrop-blur-md max-h-fit w-[60%] lg:w-[50%] space-y-1 rounded-tl-lg"
            >
              <div>
                <h1 className="text-lg md:text-2xl font-bold">
                  {item.name || item.title}
                </h1>
                <p className="text-sm line-clamp-2 lg:line-clamp-3">
                  {(item.overview || item.synopsis).slice(0, 67) + "..."}
                </p>
                <div>
                  <div className="animate-timer rounded bg-red-700/60 h-1 mt-4 w-full duration-[8000ms]" />
                </div>
              </div>
            </animated.div>
          </Link>
        </div>
      ))}
    </div>
  );
}
