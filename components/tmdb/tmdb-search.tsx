"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import MovieItem from "../movie-item";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Link from "../link";
import { createImageUrl } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

export default function TmdbSearch({ searchTerm }: { searchTerm: string }) {

  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const { ref, inView } = useInView({
    threshold: 1,
  });

  const { data, fetchNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["tmdb-search", { searchTerm }],
    queryFn: ({ pageParam }) =>
      fetchMulti(pageParam.hasNextPage, pageParam.pageToFetch),
    initialPageParam: {
      hasNextPage: true,
      pageToFetch: 1,
    },
    getNextPageParam: (lastPage) => {
      if (lastPage) {
        return {
          hasNextPage: lastPage?.page < lastPage?.total_results || false,
          pageToFetch: lastPage?.page ? lastPage.page + 1 : 1,
        };
      }
    },
  });

  useEffect(() => {
    fetchNextPage();
  }, [inView]);


  const fetchMulti = async (hasNextPage: boolean, pageToFetch: number) => {
    if (!hasNextPage) {
      return null;
    }

    const res = await fetch(
      `/api/search?q=${searchTerm}&type=multi&page=${pageToFetch}`,
      { next: { revalidate: 3600, tags: ["tmdb"]  }}
    );
    const data = (await res.json()) as TMDBMultiSearch;    
    return data;
  };

  return (
    <div className="flex flex-col w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3  lg:grid-cols-4 xl:grid-cols-6 w-full gap-3  ">
        {data?.pages.map((page, i) => {
          return (
            <div className="contents" key={i}>
              {page?.results
                .filter((ep) => (!type ? ep : ep.media_type.toLocaleLowerCase() == type.toLocaleLowerCase()))
                .map((episode, i) => (
                  <Link
                    key={episode.id + i}
                    href={`/video/${episode.media_type}/${episode.id}?provider=vidsrc`}
                    className="min-w-[150px] w-full lg:w-full h-[300px] rounded-md overflow-hidden group  relative text-end"
                  >
                    <img fetchPriority="low"
                      loading="lazy"
                      className="w-full h-full object-cover absolute top-0 group-hover:scale-105 transition-all"
                      src={createImageUrl(episode.poster_path, "w500")}
                      alt={episode.name}
                    />
                    <div className=" absolute bottom-0 left-0 p-2 bg-linear-to-br from-transparent to-black/80 transition-all group-hover:backdrop-blur-md size-full flex items-end flex-col justify-end capitalize">
                      <h1 className="text-lg font-semibold leading-tight">
                        {episode.name || episode.title_english || episode.title}
                      </h1>
                      <div className="flex text-sm gap-1">
                        <p>{episode.media_type == "tv" ? "TV" : episode.media_type}</p>

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
