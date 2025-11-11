"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { CaptionsIcon, Check, Clock, MicIcon } from "lucide-react";
import Link from "@/components/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { a, useSpring } from "@react-spring/web";
import { useLiveQuery } from "dexie-react-hooks";
import { indexDB, UserPreference } from "@/lib/index-db";
import { Menu } from "./context-menu";

export default function AniwatchSearch({ searchTerm }: { searchTerm: string }) {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const { data, fetchNextPage, isLoading, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["anime-search", { searchTerm }],
      queryFn: ({ pageParam }) =>
        fetchAnime(pageParam.hasNextPage, pageParam.pageToFetch),
      initialPageParam: {
        hasNextPage: true,
        pageToFetch: 1,
      },
      getNextPageParam: (lastPage) => {
        if (lastPage) {
          return {
            hasNextPage: lastPage?.data.hasNextPage || false,
            pageToFetch: lastPage?.data.currentPage
              ? lastPage.data.currentPage + 1
              : 1,
          };
        }
      },
    });

  const fetchAnime = async (hasNextPage: boolean, pageToFetch: number) => {
    if (!hasNextPage) {
      return null;
    }

    const res = await fetch(
      `/api/search?q=${searchTerm}&type=anime&page=${pageToFetch}`,
      { next: { revalidate: 3600, tags: ["anime"] } }
    );
    const data = (await res.json()) as AniwatchSearch;
    return data;
  };

  const { ref, inView } = useInView({
    threshold: 1,
  });

  useEffect(() => {
    fetchNextPage();
  }, [inView]);

  const [menu, setMenu] = useState<{
    open: boolean;
    x: number;
    y: number;
    show: Anime;
  }>({
    open: false,
    x: 0,
    y: 0,
    show: {
      duration: "",
      episodes: { dub: 0, sub: 0 },
      id: "",
      name: "",
      poster: "",
      rating: "",
      type: "",
    },
  });

  const settings = useLiveQuery(() => indexDB.userPreferences.get(1));

  return (
    <div className="flex flex-col w-full">
      <div
        className={`grid grid-cols-2 sm:grid-cols-3  lg:grid-cols-4  ${
          settings && settings.centerContent == true
            ? "xl:grid-cols-5"
            : "xl:grid-cols-6"
        } w-full gap-3  `}
      >
        {data?.pages.map((page, i) => {
          return (
            <div className="contents" key={i}>
              {page?.data.animes
                .filter((ep) => (!type ? ep : ep.type == type))
                .map((episode, i) => (
                  <Anime
                    key={episode.id}
                    episode={episode}
                    setMenu={setMenu}
                    settings={settings}
                  />
                ))}
            </div>
          );
        })}
        {isLoading && <CategoryFallback />}
        {isFetchingNextPage && <CategoryFallback />}
      </div>
      {hasNextPage && (
        <div ref={ref}></div>
      )}
      <Menu data={menu} setMenu={setMenu} />
    </div>
  );
}

function Anime({
  episode,
  settings,
  setMenu,
}: {
  episode: Anime;
  settings: UserPreference | undefined;
  setMenu: ({
    open,
    x,
    y,
    show,
  }: {
    open: boolean;
    x: number;
    y: number;
    show: Anime;
  }) => void;
}) {
  const watchHistory = useLiveQuery(() => indexDB.watchLater.toArray());
  const watchedShows = useLiveQuery(() => indexDB.watchedShows.toArray());

  const springs = useSpring({
    from: {
      y: 100,
      scale: 0.85,
    },
    to: {
      y: 0,
      scale: 1,
    },
  });

  return (
    <Link
      href={`/watch/${episode.id}`}
      className={`${
        settings &&
        settings.hideWatchedShowsInSearch &&
        watchedShows?.some((show) => show.id == episode.id)
          ? "hidden"
          : "block"
      }`}
    >
      <a.button
        style={springs}
        className={`min-w-[150px]  w-full lg:w-full h-[300px] hover:border-2  border-red-600 transition-transform hover:z-50 hover:scale-105 rounded-md overflow-hidden group  relative text-end`}
      >
        <img
          fetchPriority="low"
          loading="lazy"
          className="w-full h-full object-cover absolute top-0 group-hover:scale-105 transition-all"
          src={episode.poster}
          alt={episode.name}
        />
        <div
          onContextMenu={(e) => {
            e.preventDefault();
            setMenu({
              open: true,
              x: e.pageX,
              y: e.pageY,
              show: episode,
            });
          }}
          className=" absolute bottom-0 left-0 p-2 bg-linear-to-br from-transparent to-black/80 transition-all group-hover:backdrop-blur-md size-full flex items-end flex-col justify-end capitalize"
        >
          {settings && settings.lang == "all" ? (
            <>
              <h1 className="text-lg font-semibold leading-tight">
                {episode.name}
              </h1>
              <p className="text-[12px] opacity-70 italic">{episode.jname}</p>
            </>
          ) : (
            <h1 className="text-lg font-semibold leading-tight">
              {settings && settings.lang == "en" ? episode.name : episode.jname}
            </h1>
          )}

          <div className="flex items-center justify-between text-sm w-full">
            <div className="flex gap-1">
              {watchHistory?.some((show) => show.show.id == episode.id) && (
                <Clock size={14} />
              )}
              {watchedShows?.some((show) => show.show.id == episode.id) && (
                <Check size={14} />
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <p>{episode.type}</p>
              <p className="flex items-center gap-1 bg-purple-500/70 rounded-xs  px-1">
                <MicIcon size={10} />
                {episode.episodes?.dub || "NA"}
              </p>
              <p className="flex items-center gap-1 bg-yellow-500/80 rounded-xs  px-1">
                <CaptionsIcon size={10} />
                {episode.episodes.sub}
              </p>
            </div>
          </div>
        </div>
      </a.button>
    </Link>
  );
}

function CategoryFallback() {
  return (
    <div className="contents">
      {[...Array.from(Array(8).keys())].map((i) => (
        <div
          key={i}
          style={{
            animationDelay: `${i * 0.9}s`,
            animationDuration: "2s",
          }}
          className="min-w-[160px] scale-[0.85] translate-y-[100px] bg-white/10 lg:w-full h-[300px] animate-pulse rounded-md overflow-hidden group "
        ></div>
      ))}
    </div>
  );
}
