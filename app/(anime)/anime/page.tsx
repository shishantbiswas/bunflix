"use server";
import AniwatchHome from "@/components/aniwatch/aniwatch-home";
import AniwatchSlider from "@/components/aniwatch/aniwatch-slider";
import { MicIcon, CaptionsIcon } from "lucide-react";
import Link from "@/components/link";
import { Suspense } from "react";

export async function generateMetadata() {
  return { title: "Anime - Nextflix" };
}

export default async function Anime() {
  const data: AniwatchHome = await aniwatchHomeApi();

  return (
    <div className="pb-24 bg-black/80 min-h-screen">
      <AniwatchSlider anime={data} />
      <AniwatchHome anime={data} />
      <Suspense fallback={<CategoryFallback />}>
        <AnimeCategoryList category="most-popular" />
      </Suspense>
      <Suspense fallback={<CategoryFallback />}>
        <AnimeCategoryList category="most-favorite" />
      </Suspense>

      <AniwatchCategories anime={data} />
    </div>
  );
}

function CategoryFallback() {
  return (
    <div className="px-4 flex mt-4 gap-3 overflow-x-scroll scrollbar-hide">
      {[...Array.from(Array(8).keys())].map((i) => (
        <div
          key={i}
          style={{
            animationDelay: `${i * 0.9}s`,
            animationDuration: "2s",
          }}
          className="min-w-[190px] bg-white/10 lg:w-full h-[300px] animate-pulse rounded-md overflow-hidden group "
        ></div>
      ))}
    </div>
  );
}

async function aniwatchHomeApi() {
  const response = await fetch(
    `${process.env.ANIWATCH_API}/api/v2/hianime/home`,
    {
      cache: "no-store",
    }
  );
  if (!response.ok) {
    throw new Error(`Fetch failed at Anime Slider`);
  }

  const data = (await response.json()) as AniwatchHome;

  return data;
}

const AniwatchCategories = ({ anime }: { anime: AniwatchHome }) => {
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
          {anime.data.genres.map((genre, index) => (
            <Link
              key={genre + index}
              className=" px-2 py-1 bg-white/10 rounded-md hover:bg-red-700 intersect-once intersect:motion-preset-slide-up"
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
              className="capitalize px-2 py-1 bg-white/10 rounded-md hover:bg-red-700 intersect-once intersect:motion-preset-slide-up"
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
  category: AniwatchCategoriesName;
}) => {
  const data = await fetchAniwatchCategories(category);

  return (
    <>
      <h1 className="text-3xl mt-4 py-2 font-semibold px-4 capitalize ">
        {category.split("-").join(" ")}
      </h1>

      <div className="px-4 flex  gap-3 overflow-x-scroll scrollbar-hide">
        {data.data.animes.map((episode, i) => (
          <Link
            key={episode.id}
            href={`/anime/${episode.id}`}
            className={`min-w-[190px] intersect-once intersect:motion-preset-slide-left motion-delay-100 lg:w-full h-[300px] rounded-md overflow-hidden group  relative text-end`}
          >
            <img loading="lazy"
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
  category: AniwatchCategoriesName,
  page?: number | string
) {
  const response = await fetch(
    `${process.env.ANIWATCH_API}/api/v2/hianime/category/${category}?page=${
      page || 1
    }`,
    { cache: "no-store" }
  );
  if (!response.ok) {
    throw new Error(`Search failed in Categories`);
  }
  const data = (await response.json()) as AniwatchCategories;

  return data;
}
