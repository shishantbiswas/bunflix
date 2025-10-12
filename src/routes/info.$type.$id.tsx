import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PlayIcon, SquareArrowOutUpRight } from "lucide-react";
import z from "zod";
import { useTRPC } from "@/integrations/trpc/react";
import { createImageUrl } from "@/lib/utils";

export const Route = createFileRoute("/info/$type/$id")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const schema = z.object({
      id: z.string().transform((val) => Number(val)),
      type: z.enum(["tv", "movie"]),
    });
    const { data, error } = schema.safeParse(params);
    if (error) {
      throw new Error("Invalid params");
    }
    context.queryClient.prefetchQuery(
      context.trpc.tmdb.t_info.queryOptions({
        id: data.id,
        type: data.type,
      }),
    );

    return data;
  },
});

function RouteComponent() {
  const { id, type } = Route.useLoaderData();
  const trpc = useTRPC();
  const { data } = useQuery(
    trpc.tmdb.t_info.queryOptions({
      id,
      type,
    }),
  );

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className=" xl:p-0 p-2 pb-24 min-h-screen w-full bg-black/50">
      <img
        fetchPriority="low"
        loading="lazy"
        className="-z-10 fixed top-0 size-full object-cover blur-2xl "
        src={createImageUrl(data.backdrop_path, "original")}
        alt={data.name}
      />
      <div className=" xl:flex p-4">
        <img
          fetchPriority="low"
          loading="lazy"
          className="rounded xl:w-fit w-full object-cover h-[500px] xl:h-[400px] "
          src={createImageUrl(data.poster_path, "w500")}
          alt={data.name}
        />
        <div className=" lg:mt-0 mt-6 lg:px-4">
          <h1 className=" my-2 text-4xl font-semibold">{data.name}</h1>
          <p className=" leading-6 text-[18px]">{data.overview}</p>
          <div className=" my-4 flex gap-2 opacity-70">
            <p>{data.status} |</p>
            <p>{data.popularity} |</p>
            <p>{data.first_air_date} |</p>
          </div>
          <h1 className="text-xl font-semibold">Categories</h1>
          <div className=" flex gap-2 opacity-70">
            {data.genres.map((e) => (
              <p key={e.id}>{e.name}</p>
            ))}
          </div>
          <h1 className="text-xl font-semibold mt-4">Production Companies</h1>
          <div className=" flex-col flex gap-2 opacity-70">
            {data.production_companies.map((e) => (
              <div key={e.id} className=" flex gap-2 items-center ">
                {e.logo_path && (
                  <img
                    fetchPriority="low"
                    loading="lazy"
                    className=" w-[30px]"
                    src={createImageUrl(e.logo_path, "w500")}
                    alt={e.name}
                  />
                )}
                <p className="gap-2 flex">{e.name}</p>
              </div>
            ))}
          </div>

          {type === "tv" ? (
            <>
              <h1 className="text-xl mt-4 font-semibold mb-2">
                Available Seasons
              </h1>

              <div className=" xl:flex gap-4 flex-wrap">
                {data.seasons.map((e) => (
                  <div className=" flex gap-2" key={e.id}>
                    <Link
                      to="/video/$type/$id"
                      params={{
                        id: data.id.toString(),
                        type: "tv",
                      }}
                      search={{
                        season: e.season_number,
                        episode: 1,
                        provider: "twoEmbed",
                      }}
                      className=" px-4 py-2 font-semibold rounded bg-red-600 w-full justify-center mt-2 xl:w-fit  flex xl:justify-center gap-2 items-center"
                    >
                      <span>
                        <PlayIcon fill="white" size={15} />
                      </span>
                      <p>S{e.season_number}E1</p>
                    </Link>
                    <Link
                      target="_blank"
                      to="/video/$type/$id"
                      params={{
                        id: data.id.toString(),
                        type: "tv",
                      }}
                      search={{
                        season: e.season_number,
                        episode: 1,
                        provider: "twoEmbed",
                      }}
                      className=" px-4 py-2 font-semibold rounded border justify-center mt-2 w-fit  flex xl:justify-center gap-2 items-center"
                    >
                      <SquareArrowOutUpRight size={15} />
                    </Link>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <Link
              to="/video/$type/$id"
              params={{
                id: data.id.toString(),
                type: "movie",
              }}
              search={{
                season: 1,
                episode: 1,
                provider: "twoEmbed",
              }}
              className="mt-4 rounded px-4 py-2 font-semibold bg-red-600 w-full justify-center  xl:w-fit  flex xl:justify-center gap-2 items-center"
            >
              <span>
                <PlayIcon fill="white" size={15} />
              </span>
              <p>Play</p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
