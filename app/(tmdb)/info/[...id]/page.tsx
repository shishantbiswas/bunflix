import TmdbInfoSkeleton from "@/components/fallback-ui/tmdb-info-skeleton";
import { TmdbMovieInfo } from "@/components/tmdb/tmdb-movie-info";
import { TmdbTvInfo } from "@/components/tmdb/tmdb-tv-info";
import cache from "@/lib/cache";
import { Suspense } from "react";

export async function generateMetadata({
  params,
}: {
  params: { id: [string, number] };
}) {
  const data: tmdbTvInfo = await fetchTmdbInfo(params.id[0], params.id[1]);

  return {
    title: `${data.title || data.name || "Info"} - Nextflix`,
  };
}

export default async function Info({
  params,
}: {
  params: { id: [string, number] };
}) {
  if (params.id[0] === "tv") {
    return (
      <Suspense fallback={<TmdbInfoSkeleton />}>
        <TmdbTvInfo id={params.id[1]} />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<TmdbInfoSkeleton />}>
      <TmdbMovieInfo id={params.id[1]} />
    </Suspense>
  );
}

async function fetchTmdbInfo(type: string, id: number | string) {
  
  const key = process.env.TMDB_KEY;
  const cacheKey = `tmdbInfo${type}-${id}`;

  try {
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    const response = await fetch(
      `https://api.themoviedb.org/3/${type}/${id}?api_key=${key}`
    );

    const data = await response.json();
    cache.set(cacheKey, data, 60 * 60 * 24);

    return data;
  } catch (error) {
    throw new Error(`Failed to fetch data for ${id}`);
  }
}
