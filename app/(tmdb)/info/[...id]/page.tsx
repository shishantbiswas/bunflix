import TmdbInfoSkeleton from "@/components/fallback-ui/tmdb-info-skeleton";
import { TmdbMovieInfo } from "@/components/tmdb/tmdb-movie-info";
import { TmdbTvInfo } from "@/components/tmdb/tmdb-tv-info";
import { Suspense } from "react";
type Params = Promise<{ id: [string, number] }>

export async function generateMetadata({
  params,
}: {
  params: Params
}) {
  const { id } = await params
  const data: TMDBTvInfo = await fetchTmdbInfo(id[0], id[1]);

  return {
    title: `${data.title || data.name || "Info"} - Nextflix`,
  };
}

export default async function Info({
  params,
}: {
  params: Params
}) {
  const { id } = await params

  if (id[0] === "tv") {
    return (
      <Suspense fallback={<TmdbInfoSkeleton />}>
        <TmdbTvInfo id={id[1]} />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<TmdbInfoSkeleton />}>
      <TmdbMovieInfo id={id[1]} />
    </Suspense>
  );
}

async function fetchTmdbInfo(type: string, id: number | string) {

  const key = process.env.TMDB_KEY;

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/${type}/${id}?api_key=${key}`,
      { cache: "no-store" }

    );

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`Failed to fetch data for ${id}`);
  }
}
