import AniwatchHome from "@/components/aniwatch/aniwatch-home";
import AniwatchSlider from "@/components/aniwatch/aniwatch-slider";
import { MicIcon, CaptionsIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Anime - Nextflix",
};

export default async function Anime() {
  const data: aniwatchApi = await aniwatchHomeApi();

  return (
    <div className="pb-24 bg-black/80 min-h-screen">
      <AniwatchSlider anime={data} />
      <AniwatchHome anime={data} />
      <Suspense>
        <AnimeCategoryList category="most-popular" />
        <AnimeCategoryList category="most-favorite" />
      </Suspense>
      <AniwatchCategories anime={data} />
    </div>
  );
}

async function aniwatchHomeApi() {
  try {
    const response = await fetch(`${process.env.ANIWATCH_API}/anime/home`,
      {  cache: "no-store" }
    );
    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`Fetch failed at Anime Slider`);
  }
}

const AniwatchCategories = ({ anime }: { anime: aniwatchApi }) => {
  const categories = [
    "most-favorite",
    "most-popular",
    "subbed-anime",
    "dubbed-anime",
    "recently-updated",
    "recently-added",
    "top-upcoming",
    "top-airing",
    "movie",
    "special",
    "ova",
    "ona",
    "tv",
    "completed",
  ];

  return (
    <section className="p-4 md:grid grid-cols-2">
      <div>
        <h2 className="text-2xl py-2 font-semibold mt-4">Genres</h2>
        <div className="flex flex-wrap gap-2">
          {anime.genres.map((genre, index) => (
            <Link
              key={genre + index}
              className=" px-2 py-1 bg-white/10 rounded-md hover:bg-red-700"
              href={`/genre/${genre.toLowerCase()}`}
            >
              {genre}
            </Link>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-2xl py-2 font-semibold mt-4">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <Link
              key={category + index}
              className="capitalize px-2 py-1 bg-white/10 rounded-md hover:bg-red-700"
              href={`/anime-categories?type=${category.toLowerCase()}`}
            >
              {category.replace(/-/, " ")}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const AnimeCategoryList = async ({
  category,
}: {
  category: aniwatchCategoriesName;
}) => {
  const data = await fetchAniwatchCategories(category);

  return (
    <>
      <h1 className="text-3xl mt-4 py-2 font-semibold px-4 capitalize">
        {category.split("-").join(" ")}
      </h1>

      <div className="px-4 flex  gap-3 overflow-x-scroll scrollbar-hide">
        {data.animes.map((episode) => (
          <Link
            key={episode.id}
            href={`/anime/${episode.id}`}
            className="min-w-[190px] lg:w-full h-[300px] rounded-md overflow-hidden group  relative text-end"
          >
            <img
              className="w-full h-full object-cover absolute top-0 group-hover:scale-105 transition-all"
              src={episode.poster}
              alt={episode.name}
            />

            <div className=" absolute bottom-0 left-0 p-2 bg-gradient-to-br from-transparent to-black/80 transition-all group-hover:backdrop-blur-md size-full flex items-end flex-col justify-end capitalize">
              <h1 className="text-xl font-semibold">{episode.name}</h1>
              <div className="flex text-sm gap-1">
                <p>{episode.type}</p>
                <p className="flex items-center gap-1 bg-purple-500/70 rounded-sm  px-1">
                  <MicIcon size={10} />
                  {episode.episodes.dub || "NA"}
                </p>
                <p className="flex items-center gap-1 bg-yellow-500/80 rounded-sm  px-1">
                  <CaptionsIcon size={10} />
                  {episode.episodes.sub}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

async function fetchAniwatchCategories(
  category: aniwatchCategoriesName,
  page?: number | string
) {
  try {
    const response = await fetch(
      `${process.env.ANIWATCH_API}/anime/${category}?page=${page || 1}`,
      {  cache: "no-store" }
    );
    const data = (await response.json()) as aniwatchCategories;

    return data;
  } catch (error) {
    throw new Error(`Search failed in Categories`);
  }
}
