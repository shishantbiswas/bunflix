import CategoriesSkeleton from "@/components/fallback-ui/categories-skeleton";
import TmdbShowGrid from "@/components/tmdb/tmdb-shows-grid";
import { Suspense } from "react";

type Params = Promise<{ id: [string, string, number] }>;

export async function generateMetadata({ params }: { params: Params }) {
  const {id} = await params
  const word = id[0];

  const capitaziledWord = word.charAt(0).toUpperCase() + word.slice(1);

  return {
    title: `${decodeURIComponent(capitaziledWord)} - Nextflix`,
    description: "Nextflix clone built with Next.js and Tailwind CSS",
  };
}

export default async function Page({ params }: { params: Params }) {
  const {id} = await params
  const encodedString = id[0];
  const decodedString = encodedString.replace(/%20/g, "");


  const endpoint = {
    popularMovies:`/movie/popular`,
    trendingMovies:`/trending/movie/week?region=IN&with_original_language=hi`,
    upcomingMovies:`/movie/upcoming`,
    topRatedMovies:`/movie/top_rated`,
    nowPlayingMovies:`/movie/now_playing`,
    animeMovies:`/discover/movie?with_keywords=210024|222243`,
    netflix:`/discover/tv?with_networks=213`,
    amazon:`/discover/tv?with_networks=1024`,
    disneyPlus:`/discover/tv?with_networks=2739`,
    hulu:`/discover/tv?with_networks=453`,
    appleTv:`/discover/tv?with_networks=2552`,
    hbo:`/discover/tv?with_networks=49`,
    paramountPlus:`/discover/tv?with_networks=4330`,
    peacock:`/discover/tv?with_networks=3353`,
    topRatedTvShows:`/tv/top_rated?region=US`,
    anime:`/discover/tv?with_keywords=210024|222243`,
  }

  let movieEndpoint: string = "";
  type EndpointKey = keyof typeof endpoint;

  Object.keys(endpoint).forEach((thisEndpointName: string) => {
    if (decodedString === thisEndpointName) {
      movieEndpoint = endpoint[decodedString as EndpointKey];
    }
  });  

  return (
      <div className="pb-24   min-h-screen">
        <Suspense fallback={<CategoriesSkeleton />}>
          <TmdbShowGrid
            endpoint={movieEndpoint}
            type={id[1]}
            title={id[0]}
          />
        </Suspense>
      </div>
  );
}
