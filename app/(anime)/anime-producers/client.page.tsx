"use client";

import AniwatchAnimeCard from "@/components/aniwatch/aniwatch-anime-card";
import { Menu } from "@/components/aniwatch/context-menu";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function AniwatchProducerList({
  type,
}: {
  type: string,
}) {
  const { data, fetchNextPage, isLoading, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["anime-category", { type }],
    queryFn: ({ pageParam }) =>
      fetchAniwatchCategories(pageParam.hasNextPage, pageParam.pageToFetch),
    initialPageParam: {
      hasNextPage: true,
      pageToFetch: 1,
    },
    getNextPageParam: (lastPage) => {
      return {
        hasNextPage: lastPage?.data.hasNextPage || false,
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
      `/api/anime/producer?producer=${decodeURIComponent(type).replaceAll(" ","-")}&page=${pageToFetch}`,
      { next: { revalidate: 3600, tags: ["anime"] } }
    );
    const data = (await res.json()) as AniwatchProducer;
    return data;
  };
  const [menu, setMenu] = useState<{
    open: boolean,
    x: number,
    y: number,
    show: Anime
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
    }
  })

  return (
    <>
    <title>{`${data?.pages[0]?.data.producerName}`}</title>
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
        {data?.pages?.map((page, pageIndex) => {
          return (
            <div className="h-fit w-fit contents" key={pageIndex}>
              {page?.data.animes.map((episode) => (
                <AniwatchAnimeCard widthClassName={"min-w-[190px] w-full"} episode={episode} setMenu={setMenu} key={episode.id} />
              ))}
            </div>
          );
        })}
        {isLoading && (<CategoryFallback />)}
      </div>
      <div ref={ref}>
        <div />
        <div className="mt-4 grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
          {isFetchingNextPage && <CategoryFallback />}
        </div>
      </div>
      <Menu data={menu} setMenu={setMenu} />
    </>
  );
}


function CategoryFallback() {
  return (
    <>
      {[...Array.from(Array(8).keys())].map((i) => (
        <div
          key={i}
          style={{
            animationDelay: `${i * 0.9}s`,
            animationDuration: "2s",
          }}
          className="min-w-[190px] bg-white/10 lg:w-full h-[300px] animate-pulse rounded-md overflow-hidden group "
        />
      ))}
    </>
  );
}