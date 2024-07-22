import Hero from "@/components/tmdb/tmdb-slider";
import MovieRow from "@/components/movie-row";
import { fetchHeroData } from "@/data/fetch-data";
import endpoint from "@/data/apiEndpoint";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home - Nextflix",
};

export default async function Home() {
  const data: TmdbMovie = await fetchHeroData();

  return (
   <div className=" pb-24 bg-black/80">
    <Hero data={data} />
    <MovieRow title="Trending Movies" endpoint={endpoint.trendingMovies} type="movie" />
    <MovieRow title="Upcoming Movies" endpoint={endpoint.upcomingMovies} type="movie" />
    <MovieRow title="Trending Movies At The Moment" endpoint={endpoint.topRatedTvShows} type="tv" />
    <MovieRow title="Now Playing in Theaters" endpoint={endpoint.nowPlayingMovies} type="movie" />
   </div>
  );
}
