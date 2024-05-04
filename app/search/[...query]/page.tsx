import { AniwatchSearch } from "@/components/aniwatch/aniwatch-search";
import  SearchSkeleton  from "@/components/fallback-ui/search-skeleton";
import TmdbSearch from "@/components/tmdb/tmdb-search";
import { Suspense } from "react";

export async function generateMetadata({
  params,
}: {
  params: { query: [string, string] };
}) {
  const type = params.query[0];
  const searchTerm = params.query[1];

  return {
    title: `'${decodeURIComponent(searchTerm)}' in ${
      type == "movie" ? "Movie" : type==='anime'? 'Anime' : 'TV Shows'
    } - Nextflix`,
    description: "Nextflix clone built with Next.js and Tailwind CSS",
  };
}
export default async function Query({
  params,
}: {
  params: { query: [string, string, number] };
}) {
  const type = params.query[0];
  const searchTerm = params.query[1];
  const pageNo = params.query[2];

  if (type === "anime") {
    return (
      <Suspense fallback={<SearchSkeleton />}>
        <AniwatchSearch searchTerm={searchTerm} page={pageNo} />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<SearchSkeleton />}>
      <TmdbSearch type={type} page={pageNo} search={searchTerm} />
    </Suspense>
  );
}
