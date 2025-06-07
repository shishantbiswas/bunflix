"use server";
import TmdbSlider from "@/components/tmdb/tmdb-slider";
import TmdbShowRow from "@/components/tmdb/tmdb-shows-row";
import { Suspense } from "react";
import TmdbHomeSkeleton from "@/components/fallback-ui/tmdb-home-row";


export default async function Home() {
  const data: TMDBMovie = await fetchHeroData();

  const key = process.env.TMDB_KEY;
  const baseUrl = "https://api.themoviedb.org/3";

  const endpoint = {
    popularMovies: `${baseUrl}/movie/popular?api_key=${key}`,
    trendingMovies: `${baseUrl}/trending/movie/week?api_key=${key}&region=IN&with_original_language=hi`,
    upcomingMovies: `${baseUrl}/movie/upcoming?api_key=${key}`,
    topRatedMovies: `${baseUrl}/movie/top_rated?api_key=${key}`,
    nowPlayingMovies: `${baseUrl}/movie/now_playing?api_key=${key}`,
    topRatedTvShows: `${baseUrl}/tv/top_rated?api_key=${key}&region=US`,
  };

  return (
    <div>
      <TmdbSlider data={data} />
      <Suspense fallback={<TmdbHomeSkeleton />}>
        <TmdbShowRow
          title="Trending Movies"
          endpoint={endpoint.trendingMovies}
          type="movie"
        />
        <TmdbShowRow
          title="Upcoming Movies"
          endpoint={endpoint.upcomingMovies}
          type="movie"
        />
        <TmdbShowRow
          title="Trending Movies At The Moment"
          endpoint={endpoint.topRatedTvShows}
          type="tv"
        />
        <TmdbShowRow
          title="Now Playing in Theaters"
          endpoint={endpoint.nowPlayingMovies}
          type="movie"
        />
      </Suspense>
    </div>
  );
}

async function fetchHeroData() {
  const key = process.env.TMDB_KEY;

  const response = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${key}`,
    { next: { revalidate: 3600, tags: ["tmdb"] } }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch Slider data");
  }
  const data = await response.json();
  return data;
}
