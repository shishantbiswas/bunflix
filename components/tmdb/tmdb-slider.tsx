"use client";
import { createImageUrl } from "@/utils/create-image-url";
import { useEffect, useState } from "react";

import Link from "next/link";

export default function TmdbSlider({ data }: { data: TmdbMovie }) {
  const [imageindex, setImageindex] = useState(0);
  const [preferAnimation, setPreferAnimation] = useState(false);

  const shownext = () => {
    if (imageindex >= 19) {
      setImageindex(0);
    } else setImageindex(imageindex + 1);
  };

  useEffect(() => {
    if (preferAnimation) {
      const intervalId = setInterval(() => {
        shownext();
      }, 8000);

      return () => clearInterval(intervalId);
    }
  }, [imageindex, preferAnimation]);


  return (
    <section className="md:p-6 p-4 ">
      <div className="flex relative h-[250px] sm:h-[350px] md:h-[400px lg:h-[500px]">
        {data.results.slice(0, 6).map((res, i) => (
          <Link
            href={`/anime/${res.id}`}
            key={res.id}
            style={{
              pointerEvents: i === imageindex ? "all" : "none",
            }}
            className="absolute size-full bg-gradient-to-br from-transparent to-black/40 rounded-md overflow-hidden cursor-pointer"
          >
            <img
              style={{
                width: i === imageindex ? "" : "0%",
                height: i === imageindex ? "" : "0%",
                opacity: i === imageindex ? "100%" : "0%",
              }}
              className="h-full  w-full transition-all duration-500 object-cover"
              src={createImageUrl(res.backdrop_path||res.poster_path,'original')}
              alt={res.name}
            />
            <div
              style={{
                opacity: i === imageindex ? "" : "0%",
              }}
              className="absolute bottom-8 right-0 px-6 z-10 opacity-80 text-right w-[80%] space-y-1"
            >
              <h1 className="text-lg md:text-2xl font-bold">{res.name || res.title}</h1>
              <p className="text-sm md:block hidden line-clamp-2">{res.overview||res.synopsis}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className=" flex overflow-x-scroll scrollbar-hide gap-4 py-4 ">
        {data.results.slice(0, 6).map((res, i) => (
          <div
          style={{
            transform:`translate(-${imageindex*246}px)`,
          }}
            key={res.id}
            onClick={() => setImageindex(i)}
            className="flex min-w-[230px] transition-all  duration-500 cursor-pointer rounded-md overflow-hidden  h-28 relative "
          >
            <img
              src={createImageUrl(res.backdrop_path||res.poster_path,'original')}
              className="w-full h-full object-cover"
              alt=""
            />
            <div
              style={{
                animation: `${i === imageindex ? "timer 8s forwards" : "none"}`,
                opacity: i === imageindex ? "100%" : "0%",
              }}
              className="h-2  bg-red-700/70 absolute bottom-0"
            ></div>
          </div>
        ))}
      </div>
    </section>
  );
}
