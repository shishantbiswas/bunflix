"use client";
import { useEffect, useState } from "react";
import { animated, useSpring, useTransition } from "@react-spring/web";
import Link from "../link";

export default function AnimeSlider({ anime }: { anime: AniwatchHome }) {
  const [imageindex, setImageindex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setImageindex((pre) => (pre + 1) % anime.data.spotlightAnimes.length);
    }, 8000);

    return () => clearInterval(intervalId);
  }, [imageindex]);

  const item = anime.data.spotlightAnimes[imageindex];
  const transitions = useTransition(item, {
    from: { opacity: 0, transform: "scale(0.9)" },
    enter: { opacity: 1, transform: "scale(1)" },
    leave: { opacity: 0, transform: "scale(0.9)" },
    config: { duration: 200 },
  });

  return (
    <div className="relative w-full h-[270px] sm:h-[350px] lg:h-[450px]">
      {transitions((style, item, key) => (
        <div className={`absolute top-0  p-4 right-0 w-full h-full `}>
          <animated.div
            key={key.key}
            className="rounded-lg w-full h-full object-cover "
            style={{
              ...style,
              backgroundImage: `url(${item.poster})`,
            }}
          />
          <Link href={`/anime/${item.id}`}>
            <animated.div
              style={{
                ...style,
              }}
              className="absolute bottom-0 py-4 mb-4 right-4 px-6 z-10 opacity-80 text-right bg-gradient-to-br from-transparent to-black/30 backdrop-blur-md  w-[60%] lg:w-[50%] space-y-1 rounded-tl-lg"
            >
              <div>
                <h1 className="text-lg md:text-2xl font-bold">{item.name}</h1>
                <p className="text-sm ">
                  {item.description.length > 170
                    ? item.description.slice(0, 167) + "..."
                    : item.description}
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
