"use client";
import { createImageUrl } from "@/lib/utils";
import { Ref, useEffect, useRef, useState } from "react";

import Link from "@/components/link";

export default function TmdbSlider({ data }: { data: TMDBMovie }) {
  const [imageindex, setImageindex] = useState(0);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shownext = () => {
      if (imageindex == data.results.length - 1) {
        setImageindex(0);
        ref.current?.scrollBy({ behavior: "smooth", top: -9999 });
      } else {
        setImageindex(imageindex + 1);
        ref.current?.scrollBy({ behavior: "smooth", top: 128 });
      }
    };

    const intervalId = setInterval(() => {
      shownext();
    }, 8000);

    return () => clearInterval(intervalId);
  }, [imageindex]);   

  return (
    <div className="flex w-full">
      <section className="lg:p-6 p-4  w-full">
        <div className="flex relative h-[250px] sm:h-[350px] md:h-[400px] lg:h-[500px] w-full">
          {data.results.map((res, i) => (
            <Link
              href={`/video/movie/${res.id}?provider=vidsrc`}
              key={res.id}
              style={{
                pointerEvents: i === imageindex ? "all" : "none",
              }}
              className="absolute size-full bg-gradient-to-br from-transparent to-black/10 rounded-md overflow-hidden cursor-pointer"
            >
              <img loading="lazy"
                style={{
                  height: i === imageindex ? "" : "50%",
                  opacity: i === imageindex ? "100%" : "0%",
                }}
                className="h-full  w-full transition-all duration-500 object-cover"
                src={createImageUrl(
                  res.backdrop_path || res.poster_path,
                  "original"
                )}
                alt={res.name}
              />
              <div
                style={{
                  opacity: i === imageindex ? "" : "0%",
                }}
                className="absolute bottom-8 right-0 px-6 z-10 opacity-80 text-right w-[80%] space-y-1"
              >
                <h1 className="text-lg md:text-2xl font-bold">
                  {res.name || res.title}
                </h1>
                <p className="text-sm md:block hidden line-clamp-2">
                  {res.overview || res.synopsis}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <div
        ref={ref}
        className=" flex overflow-x-scroll scrollbar-hide gap-4 m-4 lg:m-6 ml-0 lg:ml-0 flex-col h-[250px] w-[250px] sm:h-[350px] md:h-[400px] lg:h-[500px] overflow-scroll  "
      >
        {data.results.map((res, i) => (
          <div
            style={{
              border: imageindex === i ? "2px solid rgb(185 28 28 / 0.8)" : "",
            }}
            key={res.id}
            onClick={() => setImageindex(i)}
            className="flex w-full transition-all  duration-500 cursor-pointer rounded-md overflow-hidden  min-h-28 relative "
          >
            <img loading="lazy"
              src={createImageUrl(
                res.backdrop_path || res.poster_path,
                "original"
              )}
              className="w-full h-full object-cover"
              alt=""
            />
            <div
              style={{
                animation: `${i === imageindex ? "timer 8s forwards linear" : ""}`,
              }}
              className="h-2 bg-red-700/80 absolute bottom-0 w-0"
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}
