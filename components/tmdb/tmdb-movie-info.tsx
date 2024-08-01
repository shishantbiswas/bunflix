import { createImageUrl } from "@/utils/create-image-url";
import { Play } from "lucide-react";
import Link from "next/link";
import cache from "@/lib/cache";

export async function TmdbMovieInfo({ id }: { id: number }) {
  const data: tmdbMovieInfo = await fetchTmdbInfo("movie", id);
  

  return (
    <div className=" xl:p-0 p-2 pb-24 bg-black/70 min-h-screen">
      <img
        className="-z-10 fixed top-0 size-full object-cover blur-2xl "
        src={createImageUrl(data.backdrop_path, "original")}
        alt={data.title}
      />
      <div className=" xl:flex p-4 ">
        <img
          className="rounded-md xl:w-fit w-full object-cover h-[500px] xl:h-[400px] "
          src={createImageUrl(data.poster_path, "w500")}
          alt={data.title}
        />
        <div className=" lg:mt-0 mt-6 lg:px-4">
          <h1 className=" my-2 text-4xl font-semibold">{data.title}</h1>
          <p className=" leading-6 text-[18px]">{data.overview}</p>
          <div className=" my-4 xl:flex gap-2 opacity-70">
            <p className=" flex gap-2">
              {data.status} <span className="xl:block hidden">|</span>
            </p>
            <p className=" flex gap-2">
              {data.popularity} <span className="xl:block hidden">|</span>
            </p>
            <p className=" flex gap-2">
              {data.release_date} <span className="xl:block hidden">|</span>
            </p>
           
           
          </div>
          <h1 className="text-xl font-semibold">Categories</h1>
          <div className=" flex gap-2 opacity-70">
            {data.genres.map((e) => (
              <p key={e.id}>{e.name}</p>
            ))}
          </div>
          <h1 className="text-xl font-semibold mt-4">Production Companies</h1>
          <div className=" xl:flex gap-2 opacity-70">
            {data.production_companies.map((e) => (
              <div key={e.id} className=" flex gap-2 items-center ">
                {e.logo_path && (
                  <img
                    className=" w-[30px]"
                    src={createImageUrl(e.logo_path, "w500")}
                    alt={e.name}
                  />
                )}
                <p className="gap-2 flex">
                  {e.name}
                  <span className="xl:block hidden">|</span>
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex xl:gap-2 gap-4">
            <Link
              href={`/video/movie/${id}?season=1&episode=1&provider=vidsrc`}
              className=" px-4 py-2 font-semibold rounded-md bg-red-600 w-full justify-center  xl:w-fit  flex xl:justify-center gap-2 items-center"
            >
              <span>
                <Play fill="white" size={15} />
              </span>
              <p>Play</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
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
    cache.set(cacheKey, data, 60 * 60 * 24 * 7);

    return data;
  } catch (error) {
    throw new Error(`Failed to fetch data for ${id}`);
  }
}