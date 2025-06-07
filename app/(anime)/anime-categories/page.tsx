import AniwatchCategoryList from "@/components/aniwatch/aniwatch-category-list";

type SearchParams = Promise<{ type: AniwatchCategoriesName }>

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { type } = await searchParams

  const term = decodeURIComponent(type)
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
  searchParams: SearchParams
}) {
  const { type } = await searchParams

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
  return (
    <div className="min-h-screen  p-4">
      <h1 className="text-3xl my-2 font-semibold">{term}</h1>
      <AniwatchCategoryList disablePagination={false} type={type} />
    </div>
  );
}


