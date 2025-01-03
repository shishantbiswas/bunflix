import MovieItem from "@/components/movie-item";
import Link from "@/components/link";

export default async function TmdbShowRow({
  title,
  type,
  endpoint,
}: {
  title: string;
  type: string;
  endpoint: string;
}) {
  const results = await fetchData(endpoint);

  return (
    <div className=" mb-6">
      <div>
        <Link
          href={`/categories/${title
            .charAt(0)
            .toLocaleLowerCase()
            .concat(title.slice(1))}/movie/1`}
          className="font-bold text-3xl lg:text-5xl  capitalize hover:underline "
        >
          <button className="p-4 text-start">
            {decodeURIComponent(title)}
          </button>
        </Link>
      </div>
      <div className=" w-full overflow-x-scroll scrollbar-hide ">
        <div className="flex w-fit px-2 ">
          {results?.results.map((movie) => (
            <MovieItem type={type} key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
}

export async function fetchData(endpoint: string): Promise<TMDBMovie | null> {
  try {
    const response = await fetch(endpoint, {
      
      cache:"no-store" ,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}
