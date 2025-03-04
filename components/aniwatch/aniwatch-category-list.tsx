"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Menu } from "./context-menu";
import AniwatchAnimeCard from "./aniwatch-anime-card";

export default function AniwatchCategoryList({
  type,
  disablePagination = false,
  homePageLayout = false
}: {
  type: string,
  disablePagination?: boolean
  homePageLayout?: boolean
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
      { next: { revalidate: 3600, tags: ["anime"] } }
    );
    const data = (await res.json()) as AniwatchSearch;
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
      <div className={`${homePageLayout ? "flex transition-all hover:pl-1 py-4 items-center w-100% overflow-x-scroll scrollbar-hide gap-4" : "grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6"}`}>
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
      {!disablePagination && <div ref={ref} className="contents">
        {isFetchingNextPage && <CategoryFallback />}
      </div>}
      <Menu data={menu} setMenu={setMenu} />
    </>
  );
}


function CategoryFallback() {
  return (
    <>      {[...Array.from(Array(8).keys())].map((i) => (
      <div
        key={i}
        style={{
          animationDelay: `${i * 0.9}s`,
          animationDuration: "2s",
        }}
        className="min-w-[190px] bg-white/10 lg:w-full h-[300px] animate-pulse rounded-md overflow-hidden group "
      ></div>
    ))}
    </>
  );
}