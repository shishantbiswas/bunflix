import AniwatchSearch from "@/components/aniwatch/aniwatch-search";
import {TmdbSearchSidebar,AnimeSearchSidebar} from "@/components/aniwatch/aniwatch-search-sidebar";
import SearchSkeleton from "@/components/fallback-ui/search-skeleton";
import TmdbSearch from "@/components/tmdb/tmdb-search";
import { Suspense } from "react";

type Params = Promise<{ query: ["anime" | "multi" | (string & {}), string] }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { query } = await params;
  const type = query[0];
  const searchTerm = query[1];

  return {
    title: `'${decodeURIComponent(searchTerm)}' in ${type == "movie" ? "Movie" : type === "anime" ? "Anime" : "TV Shows"
      } - Nextflix`,
  };
}
export default async function SearchPage({
  params,
}: {
  params: Params;
}) {
  const { query } = await params;

  const type = query[0];
  const searchTerm = query[1];


  return (
    <div className="   min-h-screen">
      <div className="pb-24 p-4 md:flex-row flex-col flex gap-4">
        {type == "anime" ? (
          <>
            <AnimeSearchSidebar />
            <Suspense fallback={<SearchSkeleton />}>
              <AniwatchSearch searchTerm={searchTerm} />
            </Suspense>
          </>
        ) : (
          <>
            <TmdbSearchSidebar search={searchTerm} />
            <Suspense fallback={<SearchSkeleton />}>
              <TmdbSearch searchTerm={searchTerm} />
            </Suspense>
          </>
        )}
      </div>
    </div>
  );
}
