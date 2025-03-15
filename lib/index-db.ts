import Dexie, { EntityTable } from "dexie";

interface SearchHistory {
  id: number;
  type: string;
  term: string;
}

export interface UserPreference {
  id: number;
  hideWatchedShows: boolean
  hideWatchedShowsInSearch: boolean
  disableFloatingNavbar:boolean
  centerContent: boolean
  lang: "en" | "jp" | "all"
}
export interface WatchedShows {
  show: Anime
  id: string
}

export interface WatchLater {
  show: Anime
  id: string
}


export interface WatchHistory {
  show: Anime,
  id: string
  time: number
  duration: number
  ep: string
  epNum: number|string
  lang: "en" | "jp"
}

export const indexDB = new Dexie("BunflixDB") as Dexie & {
  searches: EntityTable<SearchHistory, "id">;
  userPreferences: EntityTable<UserPreference, "id">;
  watchLater: EntityTable<WatchLater,"id">,
  watchedShows: EntityTable<WatchedShows,"id">,
  watchHistory: EntityTable<WatchHistory, "id">
};

indexDB.version(1).stores({
  searches: "++id",
  userPreferences: "id",
  watchHistory: "++id",
  watchedShows: "++id",
  watchLater: "++id"
});

