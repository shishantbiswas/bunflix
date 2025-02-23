"use client";

import { indexDB } from "@/lib/index-db";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { Menu } from "./aniwatch/context-menu";
import AniwatchAnimeCard from "./aniwatch/aniwatch-anime-card";

export default function WatchLater() {
  const watchHistory = useLiveQuery(() => indexDB.watchLater.toArray());
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
    <div className="p-4 min-h-screen flex flex-col">
      <h1 className="text-3xl font-semibold text-start w-fit">Watch Later</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3  lg:grid-cols-4 xl:grid-cols-6 w-full gap-3 mt-2 ">
        {watchHistory && watchHistory?.map(({ show: episode }) => (
          <AniwatchAnimeCard setMenu={setMenu} episode={episode} key={episode.id} />
        ))}
        <Menu data={menu} setMenu={setMenu} />
        {watchHistory && watchHistory.length <= 0 && <p>No Watch History Found</p>}
      </div>
    </div>
  );
}