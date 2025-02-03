"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { CaptionsIcon, MicIcon } from "lucide-react";
import Link from "@/components/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export default function AniwatchSearch({
  searchTerm,
}: {
  searchTerm: string;
}) {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const lang = searchParams.get("lang");

  const { data, fetchNextPage } = useInfiniteQuery({
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
          pageToFetch: lastPage?.data.currentPage ? lastPage.data.currentPage + 1 : 1,
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
      { next: { revalidate: 3600, tags: ["anime"]  }}
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

  return (
    <div className="flex flex-col w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3  lg:grid-cols-4 xl:grid-cols-6 w-full gap-3  ">
        {data?.pages.map((page, i) => {
          return (
            <div className="contents  " key={i}>
              {page?.data.animes
                .filter((ep) => (!type ? ep : ep.type == type))
                .map((episode, i) => (
                  <Link
                    key={episode.id + i}
                    href={`/anime/${episode.id}`}
                    className="min-w-[150px] w-full lg:w-full h-[300px] rounded-md overflow-hidden group  relative text-end"
                  >
                    <img loading="lazy"
                      className="w-full h-full object-cover absolute top-0 group-hover:scale-105 transition-all"
                      src={episode.poster}
                      alt={episode.name}
                    />
                    <div className=" absolute bottom-0 left-0 p-2 bg-linear-to-br from-transparent to-black/80 transition-all group-hover:backdrop-blur-md size-full flex items-end flex-col justify-end capitalize">
                      <h1 className="text-lg font-semibold leading-tight">
                        {!lang || lang == "english" ? episode.name : episode.jname}
                      </h1>
                      <div className="flex text-sm gap-1">
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
                  </Link>
                ))}
            </div>
          );
        })}
      </div>

      <div ref={ref} className="size-12"></div>
    </div>
  );
}
