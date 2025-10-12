import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import TmdbShowRow from "@/components/tmdb/tmdb-shows-row";
import TmdbSlider from "@/components/tmdb/tmdb-slider";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/integrations/trpc/react";

export const Route = createFileRoute("/")({
  ssr: true,
  component: App,
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(
      context.trpc.tmdb.t_home.queryOptions() 
    );
  },
});

function App() {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(trpc.tmdb.t_home.queryOptions());

  const { data: trendingMovies } = useSuspenseQuery(
    trpc.tmdb.t_trendingMovies.queryOptions(),
  );
  const { data: upcomingMovies } = useSuspenseQuery(
    trpc.tmdb.t_upcomingMovies.queryOptions(),
  );
  const { data: topRatedTvShows } = useSuspenseQuery(
    trpc.tmdb.t_topRatedTvShows.queryOptions(),
  );
  const { data: nowPlayingMovies } = useSuspenseQuery(
    trpc.tmdb.t_nowPlayingMovies.queryOptions(),
  );
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Error</div>;
  }

  return (
    <div>
      <TmdbSlider data={data} />
      <Suspense fallback={<TmdbHomeSkeleton />}>
        <TmdbShowRow
          title="Trending Movies"
          data={trendingMovies}
          type="movie"
        />
      </Suspense>
      <Suspense fallback={<TmdbHomeSkeleton />}>
        <TmdbShowRow
          title="Upcoming Movies"
          data={upcomingMovies}
          type="movie"
        />
      </Suspense>
      <Suspense fallback={<TmdbHomeSkeleton />}>
        <TmdbShowRow
          title="Trending Movies At The Moment"
          data={topRatedTvShows}
          type="tv"
        />
      </Suspense>
      <Suspense fallback={<TmdbHomeSkeleton />}>
        <TmdbShowRow
          title="Now Playing in Theaters"
          data={nowPlayingMovies}
          type="movie"
        />
      </Suspense>
    </div>
  );
}

function TmdbHomeSkeleton() {
  return (
    <div className="flex gap-4 px-2 w-full mt-4">
      {[...Array.from(Array(6).keys())].map((i) => (
        <div className="flex flex-col space-y-3" key={i}>
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
          </div>
        </div>
      ))}
    </div>
  );
}
