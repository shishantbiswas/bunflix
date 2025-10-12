import { MicIcon, CaptionsIcon } from "lucide-react";
import Link from "@/components/link";

type Params = Promise<{ type: string }>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Params;
}) {
  const { type } = await searchParams;

  const term = type
    .replace(/-/, " ")
    .split(" ")
    .map(
      (word) =>
        word &&
        typeof word === "string" &&
        word.charAt(0).toUpperCase() + word.slice(1) + " "
    )
    .join("");

  return {
    title: `${term} - Anime Category`,
  };
}

export default async function Categories({
  searchParams,
}: {
  searchParams: Params;
}) {
  const { type } = await searchParams;
  
  const producerName = type.replace(/-/, " ").split(" ").join("");
  const data = await fetchAniwatchProducer(type.replace(" ","-").trim(), true, 1);
  return (
    <div className="min-h-screen   p-4">
      <h1 className="text-3xl my-2 font-semibold">{producerName}</h1>
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
        {data?.data.animes.map((episode, animeIndex) => (
          <Link
            key={episode.id + animeIndex}
            href={`/anime/${episode.id}`}
            className="w-full h-[350px] rounded-md overflow-hidden group  relative text-end"
          >
            <img fetchPriority="low" loading="lazy"
              className="size-full object-cover group-hover:scale-105 transition-all"
              src={episode.poster}
              alt={episode.name}
            />

            <div className=" absolute bottom-0 left-0 p-2 bg-linear-to-br from-transparent to-black/80 transition-all group-hover:backdrop-blur-md size-full flex items-end flex-col justify-end capitalize">
              <h1 className="text-xl font-semibold">{episode.name}</h1>
              <p className="text-sm">{episode.jname}</p>
              <div className="flex text-sm gap-2">
                <p>{episode.type}</p>
                <p className="flex items-center gap-1 bg-purple-500/70 rounded-xs py-0.5 px-1">
                  <MicIcon size={12} />
                  {episode.episodes.dub || "NA"}
                </p>
                <p className="flex items-center gap-1 bg-yellow-500/80 rounded-xs py-0.5 px-1">
                  <CaptionsIcon size={12} />
                  {episode.episodes.sub}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

const fetchAniwatchProducer = async (
  name: string,
  hasNextPage: boolean,
  pageToFetch: number
) => {
  if (!hasNextPage) {
    return;
  }

  const res = await fetch(
    `${process.env.ANIWATCH_API}/api/v2/hianime/producer/${name}`,
    { next: { revalidate: 3600, tags: ["anime"] } }
  );
  const data = (await res.json()) as AniwatchSearch;
  return data;
};
