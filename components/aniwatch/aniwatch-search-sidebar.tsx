"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function AnimeSearchSidebar({
  search,
  animeData,
}: {
  search: string;
  animeData: aniwatchSearch;
}) {
  const types = ["ONA", "Special", "Movie", "TV", "OVA"];

  const [type, setType] = useState("");
  const searchParams = useSearchParams();
  const contentType = searchParams.get("type");

  return (
    <>
      <div className="p-4 md:sticky top-4 rounded h-fit pb-4 flex-col flex bg-black/30 w-full md:w-[300px]">
        <h1 className="text-3xl font-semibold">Search</h1>
        <label className="my-3" htmlFor="types">
          Type
        </label>
        <select
          onChange={(e) => {
            setType(e.target.value);
          }}
          id="types"
          className="bg-black/50 p-2 rounded-sm capitalize"
        >
          {types.map((type, i) => (
            <option value={type} key={type + i} className="capitalize">
              {type}
            </option>
          ))}
        </select>

        <Link
          className="w-full text-center"
          href={`/search/anime/${search}${type ? `?type=${type}` : ""}`}
        >
          <button className="p-2 my-2 rounded-md border w-full">Filter</button>
        </Link>
        {contentType && (
          <Link href={`/search/anime/${search}`}>
            <button className="p-2 my-2 rounded-md bg-white text-black w-full">
              Clear
            </button>
          </Link>
        )}
        <h1 className="text-3xl font-semibold my-2">Most Popular</h1>
        <div className="max-h-[50vh] flex gap-2 flex-col overflow-y-scroll ">
          {animeData?.mostPopularAnimes?.map((episode, i) => (
            <div
              key={episode.id}
              className="hover:bg-white/30 p-2 leading-tight mr-2 rounded"
            >
              <h1 className="font-semibold">{episode.name}</h1>
              <div className="flex gap-2 opacity-70">
                <p>{episode.episodes.dub}</p>
                <p>{episode.episodes.sub}</p>
                <p>{episode.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}