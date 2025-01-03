import { createImageUrl } from "@/lib/utils";
import { Play, SquareArrowOutUpRight } from "lucide-react";
import Link from "@/components/link";

export async function TmdbTvInfo({ id }: { id: number }) {
  const data: TMDBTvInfo = await fetchTmdbInfo("tv", id);

  return (
    <div className=" xl:p-0 p-2 pb-24 bg-black/70 min-h-screen w-full">
      <img loading="lazy"
        className="-z-10 fixed top-0 size-full object-cover blur-2xl "
        src={createImageUrl(data.backdrop_path, "original")}
        alt={data.name}
      />
      <div className=" xl:flex p-4">
        <img loading="lazy"
          className="rounded-md xl:w-fit w-full object-cover h-[500px] xl:h-[400px] "
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
                  <img loading="lazy"
                    className=" w-[30px]"
                    src={createImageUrl(e.logo_path, "w500")}
                    alt={e.name}
                  />
                )}
                <p className="gap-2 flex">{e.name}</p>
              </div>
            ))}
          </div>

          <h1 className="text-xl mt-4 font-semibold mb-2">Available Seasons</h1>

          <div className=" xl:flex gap-4 flex-wrap">
            {data.seasons.map((e) => (
              <div className=" flex gap-2" key={e.id}>
                <Link
                  href={`/video/tv/${id}?season=${e.season_number}&episode=1&provider=vidsrc`}
                  className=" px-4 py-2 font-semibold rounded-md bg-red-600 w-full justify-center mt-2 xl:w-fit  flex xl:justify-center gap-2 items-center"
                >
                  <span>
                    <Play fill="white" size={15} />
                  </span>
                  <p>S{e.season_number}E1</p>
                </Link>
                <Link
                  target="_blank"
                  href={`/video/tv/${id}?season=${e.season_number}&episode=1&provider=vidsrc`}
                  className=" px-4 py-2 font-semibold rounded-md border justify-center mt-2 w-fit  flex xl:justify-center gap-2 items-center"
                >
                  <SquareArrowOutUpRight size={15} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

async function fetchTmdbInfo(type: string, id: number | string) {
  const key = process.env.TMDB_KEY;

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/${type}/${id}?api_key=${key}`,
      {  cache:"no-store"  }
    );

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`Failed to fetch data for ${id}`);
  }
}
