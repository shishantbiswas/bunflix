"use client";
import { createImageUrl } from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import Link from "../link";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export default function TmdbShowGrid({
  title,
  type,
  endpoint,
}: {
  title: string;
  type: string;
  endpoint: string;
}) {


  const { ref, inView } = useInView({
    threshold: 0,
  });

  const { data, fetchNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["tmdb-category", { endpoint, }],
    queryFn: ({ pageParam }) =>
      fetchData(pageParam.hasNextPage, pageParam.pageToFetch, pageParam.endpoint),
    initialPageParam: {
      hasNextPage: true,
      pageToFetch: 1,
      endpoint: endpoint,
    },
    getNextPageParam: (lastPage) => {
      if (lastPage) {
        return {
          hasNextPage: lastPage?.page < lastPage?.total_results || false,
          pageToFetch: lastPage?.page ? lastPage.page + 1 : 1,
          endpoint,
        };
      }
    },
  });

  useEffect(() => {
    fetchNextPage();
  }, [inView]);

  return (
    <div className="flex flex-col w-full">
      <h1 className="font-bold text-3xl lg:text-5xl p-4 capitalize">
        {decodeURIComponent(title)}
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 p-4 lg:grid-cols-4 xl:grid-cols-6 w-full gap-3  ">
        {data?.pages.map((page, i) => {
          return (
            <div className="contents" key={i}>
              {page?.results
                .map((episode, i) => (
                  <Link
                    key={episode.id + i}
                    href={`/video/${type}/${episode.id}${type.toLocaleLowerCase() == "tv" ? "?season=1&episode=1&provider=vidsrc" : "?provider=vidsrc"}`}
                    className="min-w-[150px] w-full lg:w-full h-[300px] rounded-md overflow-hidden group  relative text-end"
                  >
                    <img
                      loading="lazy"
                      className="w-full h-full object-cover absolute top-0 group-hover:scale-105 transition-all"
                      src={createImageUrl(episode.poster_path || episode.media_type, "w500")}
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
      <div ref={ref} className="size-12" />
    </div>
  );
}

export async function fetchData(hasNextPage: boolean, pageToFetch: number, endpoint: string) {
  if (!hasNextPage) {
    return null;
  }

  try {
    const response = await fetch(`/api/tmdb-category/${endpoint}?page=${pageToFetch}`, 
      { next: { revalidate: 3600, tags: ["tmdb"] } }
    );
    const data = await response.json() as TMDBMultiSearch;
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch data `);
  }
}
