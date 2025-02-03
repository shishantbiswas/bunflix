"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { MicIcon, CaptionsIcon } from "lucide-react";
import Link from "@/components/link";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export default function AniwatchCategoryList({ type }: { type: string }) {
  const { data, fetchNextPage,isLoading } = useInfiniteQuery({
    queryKey: ["anime-category", { type }],
    queryFn: ({ pageParam }) =>
      fetchAniwatchCategories(pageParam.hasNextPage, pageParam.pageToFetch),
    initialPageParam: {
      hasNextPage: true,
      pageToFetch: 1,
    },
    getNextPageParam: (lastPage) => {
      return {
        hasNextPage: lastPage?.data?.hasNextPage || false,
        pageToFetch: lastPage?.data.currentPage ? lastPage.data.currentPage + 1 : 1,
      };
    },
  });

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    fetchNextPage();
  }, [inView]);

  const fetchAniwatchCategories = async (
    hasNextPage: boolean,
    pageToFetch: number
  ) => {
    if (!hasNextPage) {
      return;
    }

    const res = await fetch(
      `/api/anime/category?category=${type}&page=${pageToFetch}`,
      { next: { revalidate: 3600 , tags: ["anime"] }  }
    );
    const data = (await res.json()) as AniwatchSearch;
    return data;
  };

  return (
    <>
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
        {data?.pages?.map((page, pageIndex) => {
          return (
            <div className="h-fit w-fit contents" key={pageIndex}>
              {page?.data.animes.map((episode, animeIndex) => (
                <Link
                  key={episode.id + pageIndex + animeIndex}
                  href={`/anime/${episode.id}`}
                  className="w-full h-[350px] rounded-md overflow-hidden group  relative text-end"
                >
                  <img loading="lazy"
                    className="size-full object-cover group-hover:scale-105 transition-all"
                    src={episode.poster}
                    alt={episode.name}
                  />

                  <div className=" absolute bottom-0 left-0 p-2 bg-linear-to-br from-transparent to-black/80 transition-all group-hover:backdrop-blur-md size-full flex items-end flex-col justify-end capitalize">
                    <h1 className="text-xl font-semibold">{episode.name}</h1>
                    <p className="text-sm">{episode.jname}</p>
                    <div className="flex text-sm gap-2">
                      <p>{episode.type}</p>
                      <p className="flex items-center gap-1 bg-purple-500/70 rounded-xs py-0.5 px-1">
                        <MicIcon size={12} />
                        {episode.episodes.dub || "NA"}
                      </p>
                      <p className="flex items-center gap-1 bg-yellow-500/80 rounded-xs py-0.5 px-1">
                        <CaptionsIcon size={12} />
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
      <div ref={ref}></div>
    </>
  );
}
