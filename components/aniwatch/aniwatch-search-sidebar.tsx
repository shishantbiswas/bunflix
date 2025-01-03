"use client";

import Link from "@/components/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function AnimeSearchSidebar({
  search,
}: {
  search: string;
}) {
  const types = ["ONA", "Special", "Movie", "TV", "OVA"];

  const [type, setType] = useState("");
  const searchParams = useSearchParams();
  const contentType = searchParams.get("type");

  return (
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

    </div>
  );
}

export const TmdbSearchSidebar = ({
  search,
}: {
  search: string;
}) => {
  const types = ["TV", "Movie"];

  const [type, setType] = useState("");
  const searchParams = useSearchParams();
  const contentType = searchParams.get("type");

  return (
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
        href={`/search/multi/${search}${type ? `?type=${type}` : ""}`}
      >
        <button className="p-2 my-2 rounded-md border w-full">Filter</button>
      </Link>
      {contentType && (
        <Link href={`/search/multi/${search}`}>
          <button className="p-2 my-2 rounded-md bg-white text-black w-full">
            Clear
          </button>
        </Link>
      )}

    </div>
  )
}