import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "./init";

const baseUrl = "https://api.themoviedb.org/3";
const key = process.env.TMDB_KEY;

const theMovieDatabase = {
  t_home: publicProcedure.query(async () => {
    const response = await fetch(`${baseUrl}/movie/popular?api_key=${key}`);
    return (await response.json()) as TMDBMovie;
  }),
  t_popularMovies: publicProcedure.query(async () => {
    const response = await fetch(`${baseUrl}/movie/popular?api_key=${key}`);
    return (await response.json()) as TMDBMovie;
  }),
  t_trendingMovies: publicProcedure.query(async () => {
    const response = await fetch(
      `${baseUrl}/trending/movie/week?api_key=${key}&region=IN&with_original_language=hi`,
    );
    return (await response.json()) as TMDBMovie;
  }),
  t_upcomingMovies: publicProcedure.query(async () => {
    const response = await fetch(`${baseUrl}/movie/upcoming?api_key=${key}`);
    return (await response.json()) as TMDBMovie;
  }),
  t_topRatedMovies: publicProcedure.query(async () => {
    const response = await fetch(`${baseUrl}/movie/top_rated?api_key=${key}`);
    return (await response.json()) as TMDBMovie;
  }),
  t_nowPlayingMovies: publicProcedure.query(async () => {
    const response = await fetch(`${baseUrl}/movie/now_playing?api_key=${key}`);
    return (await response.json()) as TMDBMovie;
  }),
  t_topRatedTvShows: publicProcedure.query(async () => {
    const response = await fetch(
      `${baseUrl}/tv/top_rated?api_key=${key}&region=US`,
    );
    return (await response.json()) as TMDBMovie;
  }),
  t_info: publicProcedure
    .input(
      z.object({
        type: z.enum(["movie", "tv"]),
        id: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const response = await fetch(
        `${baseUrl}/${input.type}/${input.id}?api_key=${key}`,
      );
      return (await response.json()) as TMDBInfo;
    }),
  t_season_info: publicProcedure
    .input(
      z.object({
        id: z.number(),
        season: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const response = await fetch(
        `${baseUrl}/tv/${input.id}/season/${input.season}?api_key=${key}`,
      );
      return (await response.json()) as TMDBEpisodesInfo;
    }),
} satisfies TRPCRouterRecord;

export const trpcRouter = createTRPCRouter({
  tmdb: theMovieDatabase,
});
export type TRPCRouter = typeof trpcRouter;
