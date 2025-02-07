import AniwatchCategoryList from "@/components/aniwatch/aniwatch-category-list";

// https://stackoverflow.com/questions/79119608/pageprops-type-resolution-with-basic-example
type SearchParams = Promise<{ type: AniwatchCategoriesName }>

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams
}) {
    const {type} = await searchParams

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
  searchParams: SearchParams
}) {
    const {type} = await searchParams

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
    <div className="min-h-screen   p-4">
      <h1 className="text-3xl my-2 font-semibold">{term}</h1>
        <AniwatchCategoryList type={type} />
    </div>
  );
}


