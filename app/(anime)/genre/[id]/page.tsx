import cache from "@/lib/cache";
import { CaptionsIcon, MicIcon } from "lucide-react";
import Link from "next/link";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const data: aniwatchGenre = await fetchAnimeStudio(params.id);

  return {
    title: `${data.genreName} - Genres`,
  };
}

export default async function Genre({ params }: { params: { id: string } }) {

  const data: aniwatchGenre = await fetchAnimeStudio(params.id);
  
  return (
    <div className="min-h-screen bg-black/80 p-4 pb-24">
      <h1 className="text-3xl font-semibold capitalize">{data.genreName}</h1>
      <div className="grid mt-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 text-end">
        {data.animes.map((show) => (
          <div
            className="w-full h-full rounded-md overflow-hidden group   relative"
            key={show.id}
          >
            <Link href={`/anime/${show.id}`}>
              <img
                className="size-full object-cover group-hover:scale-105 transition-all"
                src={show.poster}
                alt={show.name}
              />

              <div className=" absolute bottom-0 left-0 p-2 bg-gradient-to-br from-transparent to-black/80 transition-all group-hover:backdrop-blur-md size-full flex items-end flex-col justify-end capitalize">
                <h1 className="text-xl font-semibold">{show.name}</h1>
                <p>{show.duration}</p>
                <div className="flex text-sm gap-2">
                  <p>{show.type}</p>
                  <p className="flex items-center gap-1 bg-yellow-500/70 rounded-sm py-0.5 px-1">
                    <MicIcon size={12} />
                    {show.episodes.dub || "NA"}
                  </p>
                  <p className="flex items-center gap-1 bg-purple-500/80 rounded-sm py-0.5 px-1">
                    <CaptionsIcon size={12} />
                    {show.episodes.sub}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

async function fetchAnimeStudio(genreName: string) {
  const kababCased = decodeURIComponent(genreName).replace(/\s+/g, "-");

  const cacheKey = `aniwatchStudio${genreName}`;
  try {
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    const response = await fetch(
      `${process.env.ANIWATCH_API}/anime/genre/${kababCased}`
    );

    const data = await response.json();
    cache.set(cacheKey, data, 60 * 60 * 24);

    return data;
  } catch (error) {
    throw new Error(`Search failed in Categories`);
  }
}
