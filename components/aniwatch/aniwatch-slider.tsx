"use client";
import { useEffect, useState } from "react";
import { animated, useSpring, useTransition } from '@react-spring/web'
import Link from "@/components/link";


export default function AnimeSlider({ anime }: { anime: AniwatchHome }) {

  const [imageindex, setImageindex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setImageindex(pre => (pre + 1) % anime.data.spotlightAnimes.length);
    }, 8000);

    return () => clearInterval(intervalId);
  }, [imageindex]);

  const item = anime.data.spotlightAnimes[imageindex]
  const transitions = useTransition(item, ({
    from: { opacity: 0, transform: "scale(0.9)" },
    enter: { opacity: 1, transform: "scale(1)" },
    leave: { opacity: 0, transform: "scale(0.9)" },
    config: { duration: 200 }
  }))

  return (
    <div className="relative w-full h-[300px] sm:h-[350px] lg:h-[450px]">
      {transitions((style, item, key) => (
        <div
          className={`absolute top-0  p-4 right-0 w-full h-full `}
        >
          <animated.img
            key={key.key}
            className="rounded-lg w-full h-full object-cover "
            src={item.poster}
            style={{
              ...style
            }} />
          <animated.div
            style={{
              ...style
            }}
            className="absolute bottom-0 py-4 mb-4 right-4 px-6 z-10 opacity-80 text-right bg-gradient-to-br from-transparent to-black/30 backdrop-blur-md  w-[60%] lg:w-[50%] space-y-1 rounded-tl-lg"
          >
            <div>
              <h1 className="text-lg md:text-2xl font-bold">{item.name}</h1>
              <p className="text-sm line-clamp-2 lg:line-clamp-3">
                {item.description}
              </p>
              <div >
                <div className="animate-timer rounded bg-red-700/60 h-1 mt-4 w-full duration-[8000ms]" />
              </div>
            </div>
          </animated.div>
        </div>
      ))}
    </div>
  )
  // return (

  // <div className="flex w-full">
  //   <section className="lg:p-6 p-4  w-full">
  //     <div className="flex relative h-[250px] sm:h-[350px] md:h-[400px] lg:h-[500px] w-full">
  //       {anime.data.spotlightAnimes.map((res, i) => (
  //         <Link
  //           href={`/anime/${res.id}`}
  //           key={res.id}
  //           style={{
  //             pointerEvents: i === imageindex ? "all" : "none",
  //           }}
  //           className="absolute size-full bg-linear-to-br from-transparent to-black/20 rounded-md overflow-hidden cursor-pointer"
  //         >
  //           <img fetchPriority="low" loading="lazy"
  //             style={{
  //               height: i === imageindex ? "" : "50%",
  //               opacity: i === imageindex ? "100%" : "0%",
  //             }}
  //             className="h-full  w-full transition-all duration-500 object-cover"
  //             src={res.poster}
  //             alt={res.name}
  //           />
  //           <div
  //             style={{
  //               opacity: i === imageindex ? "" : "0%",
  //             }}
  //             className="absolute bottom-8 right-0 px-6 z-10 opacity-80 text-right w-[80%] space-y-1"
  //           >
  //             <h1 className="text-lg md:text-2xl font-bold">{res.name}</h1>
  //             <p className="text-sm line-clamp-2 lg:line-clamp-4">
  //               {res.description}
  //             </p>
  //           </div>
  //         </Link>
  //       ))}
  //     </div>
  //   </section>
  //   <div
  //     ref={ref}
  //     className=" flex overflow-x-scroll scrollbar-hide gap-4 m-4 lg:m-6 ml-0 lg:ml-0 flex-col h-[250px] w-[250px] sm:h-[350px] md:h-[400px] lg:h-[500px] overflow-scroll  "
  //   >
  //     {anime.data.spotlightAnimes.map((res, i) => (
  //       <div
  //         style={{
  //           border: imageindex === i ? "2px solid rgb(185 28 28 / 0.8)" : "",
  //         }}
  //         key={res.id}
  //         onClick={() => setImageindex(i)}
  //         className="flex w-full transition-all  duration-500 cursor-pointer rounded-md overflow-hidden  min-h-28 relative "
  //       >
  //         <img fetchPriority="low" loading="lazy"
  //           src={res.poster}
  //           className="w-full h-full object-cover"
  //           alt=""
  //         />
  //         <div
  //           style={{
  //             animation: `${
  //               i === imageindex ? "timer 8s forwards linear" : ""
  //             }`,
  //           }}
  //           className="h-2 bg-red-700/80 absolute bottom-0 w-0"
  //         ></div>
  //       </div>
  //     ))}
  //   </div>
  // </div>
  // );
}
