import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import MovieItem from "./movie-item";
import { useWindowSize } from "@uidotdev/usehooks";
import { createImageUrl } from "@/lib/utils";

export default function TmdbShowRow({
  title,
  type,
  data,
}: {
  title: string;
  type: string;
  data: TMDBMovie | undefined;
}) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const scrollAmount = direction === 'left' ? -500 : 500;
    sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const size = useWindowSize();

  return (
    <div className="mb-20">
      <div className="flex justify-between items-center">
        <Link
          to={"/"}
          className="font-bold text-3xl lg:text-5xl capitalize hover:underline"
        >
          <button className="p-4 text-start">
            {decodeURIComponent(title)}
          </button>
        </Link>
        <div className="flex space-x-4 pr-4">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-gray-800/80 hover:bg-gray-700/80 cursor-pointer transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-gray-800/80 hover:bg-gray-700/80 cursor-pointer transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
      <div className="relative group">
        <div
          ref={sliderRef}
          className="scrollbar-hide overflow-x-auto overflow-y-visible scroll-smooth"
        >
          <div className="flex w-fit space-x-4 py-2">
            {data?.results
              .filter(
                (show) =>
                  show.media_type !== "person" &&
                  show.media_type !== "collection",
              )
              .map((movie) =>
                size.width ?? 0 > 768 ? <MovieItem key={movie.id} type={type} movie={movie} /> : <MobileMovieItem key={movie.id} type={type} movie={movie} />
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}


function MobileMovieItem({
  type,
  movie,
}: {
  type: string;
  movie: MovieResults;
}) {
  const {
    title,
    backdrop_path,
    image,
  } = movie;

  return (
    <Link
      to="/video/$type/$id"
      params={{
        id: movie.id.toString(),
        type: type,
      }}
      className={`focus:outline text-white rounded mx-2 transition-all duration-200 h-[210px] w-[145px] `}
    >
      <img
        fetchPriority="low"
        loading="lazy"
        className={`size-full object-cover object-center`}
        src={image ? image : createImageUrl(backdrop_path, "w500")}
        alt={title}
      />
    </Link>
  )
}