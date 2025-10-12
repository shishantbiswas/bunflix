import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import z from "zod";
import { TmdbVideo } from "@/components/tmdb/tmdb-video";
import { useTRPC } from "@/integrations/trpc/react";

export const Route = createFileRoute("/video/$type/$id")({
  validateSearch: (search) => {
    const schema = z.object({
      season: z.number().optional(),
      episode: z.number().optional(),
      provider: z
        .enum(["vidsrc", "twoEmbed", "super", "smashystream"])
        .optional(),
    });
    const result = schema.safeParse(search);
    if (!result.success) {
      throw new Error("Invalid search params");
    }
    return result.data;
  },
  component: RouteComponent,
  loader: async ({ context, params }) => {
    context.queryClient.prefetchQuery(
      context.trpc.tmdb.t_info.queryOptions({
        id: Number(params.id),
        type: params.type as "movie" | "tv",
      }),
    );
    return {
      id: Number(params.id),
      type: params.type as "movie" | "tv",
    };
  },
});

function RouteComponent() {
  const { id, type } = Route.useLoaderData();
  const { season, episode } = Route.useSearch();

  const trpc = useTRPC();
  const { data } = useQuery(
    trpc.tmdb.t_info.queryOptions({
      id,
      type,
    }),
  );

  const twoEmbedMovieApi = `https://www.2embed.cc/embed/${id}`;
  const twoEmbedtvApi = `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}`;

  const [url, setUrl] = useState(
    type === "movie" ? twoEmbedMovieApi : twoEmbedtvApi,
  );

  if (!data) {
    return <div>loading</div>;
  }

  return (
    <TmdbVideo type={type} id={id} url={url} setUrl={setUrl} data={data} />
  );
}
