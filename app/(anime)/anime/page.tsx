"use server";
import AniwatchHome from "@/components/aniwatch/aniwatch-home";
import AniwatchSlider from "@/components/aniwatch/aniwatch-slider";
import Link from "@/components/link";
import { Suspense } from "react";
import AniwatchCategoryList from "@/components/aniwatch/aniwatch-category-list";

export async function generateMetadata() {
  return { title: "Anime - Nextflix" };
}

export default async function Anime() {
  const data = await aniwatchHomeApi();

  return (
    <div className=" min-h-screen">
      <AniwatchSlider anime={data} />
      <AniwatchHome anime={data} />
      <div className="p-4">
        <Suspense fallback={<CategoryFallback />}>
          <h1 className="text-3xl font-semibold mt-4">Most Popular</h1>
          <AniwatchCategoryList type="most-popular" homePageLayout disablePagination/>
        </Suspense>
        <Suspense fallback={<CategoryFallback />}>
        <h1 className="text-3xl font-semibold mt-4">Fan Favorite</h1>
          <AniwatchCategoryList type="most-favorite" homePageLayout disablePagination/>
        </Suspense>
      </div>

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
    { next: { revalidate: 3600, tags: ["anime"] } }
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

  if (typeof window !== 'undefined') return

  return (
    <section className="p-4 md:grid grid-cols-2">
      <div>
        <h2 className="text-2xl py-2 font-semibold mt-4">Genres</h2>
        <div className="flex flex-wrap gap-2">
          {anime.data.genres.map((genre, index) => (
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

// const AnimeCategoryList = async ({
//   category,
// }: {
//   category: AniwatchCategoriesName;
// }) => {
//   const data = await fetchAniwatchCategories(category);
//   const [menu, setMenu] = useState<{
//     open: boolean,
//     x: number,
//     y: number,
//     show: Anime
//   }>({
//     open: false,
//     x: 0,
//     y: 0,
//     show: {
//       duration: "",
//       episodes: { dub: 0, sub: 0 },
//       id: "",
//       name: "",
//       poster: "",
//       rating: "",
//       type: "",
//     }
//   })
//   return (
//     <>
//       <h1 className="text-3xl mt-4 py-2 font-semibold px-4 capitalize ">
//         {category.split("-").join(" ")}
//       </h1>

//       <div className="px-4 flex  gap-3 overflow-x-scroll scrollbar-hide">
//         {data.data.animes.map((episode) => (
//           <AniwatchAnimeCard setMenu={setMenu} episode={episode} key={episode.id} />
//         ))}
//       </div>
//     </>
//   );
// };

// async function fetchAniwatchCategories(
//   category: AniwatchCategoriesName,
//   page?: number | string
// ) {
//   const response = await fetch(
//     `${process.env.ANIWATCH_API}/api/v2/hianime/category/${category}?page=${page || 1
//     }`,
//     { next: { revalidate: 3600, tags: ["anime"] } }
//   );
//   if (!response.ok) {
//     throw new Error(`Search failed in Categories`);
//   }
//   const data = (await response.json()) as AniwatchCategories;

//   return data;
// }
