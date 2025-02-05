"use client";
import { Search, CircleX, X, FileWarningIcon, HistoryIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "@/components/link";
import { useSearchBarFocus } from "@/context/search-context";
import { createImageUrl } from "@/lib/utils";
import { useLiveQuery } from "dexie-react-hooks";
import { searchHistory } from "@/lib/search-history";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";

export default function SearchInput() {
  const [term, setTerm] = useState("");
  const [IsEmpty, setIsEmpty] = useState(false);
  const [type, setType] = useState<"multi" | "anime">("multi");
  const [result, setResult] = useState<TMDBMultiSearch | null>();
  const [anime, setAnime] = useState<AniwatchSearch | null>();

  const debounceSearch = useDebounce(term);
  const router = useRouter();

  const { setIsSearchBarFocused, isSearchOpen, setIsSearchOpen } =
    useSearchBarFocus();

  useEffect(() => {
    if (!term) {
      setTerm("");
      return;
    } else {
      fetch(`/api/search?q=${debounceSearch}&type=${type}`, {
        next: { revalidate: 3600, tags: ["anime","tmdb"]  },
      })
        .then((response) => {
          if (!response.ok) {
            toast.error("Error please try again");
          }
          return response.json();
        })
        .then((data) => {
          type === "anime" ? setAnime(data) : setResult(data);
        })
        .catch((error) => {
          console.error(
            "There has been a problem with your fetch operation:",
            error
          );
        });
    }
  }, [debounceSearch]);

  const clearAndClose = () => {
    setResult(null);
    setAnime(null);
    setTerm("");
    setIsSearchOpen(!isSearchOpen);
  };

  const search = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!term) {
      setIsEmpty(true);
    } else {
      searchHistory.searches.add({ term: term, type: type });
      clearAndClose();
      router.push(`/search/${type}/${term}`);
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);

  // allows the search to be opened from anywhere when '/' is pressed
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case "Slash":
          event.preventDefault();
          setIsSearchOpen(!isSearchOpen);
          if (!isSearchOpen) {
            setTimeout(() => {
              inputRef.current?.focus();
            }, 100);
          }
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSearchOpen]);

  const history = useLiveQuery(() => searchHistory.searches.toArray());

  return (
    <div
      style={{
        bottom: "0px",
        left: "0px",
        transform: isSearchOpen ? "translateY(0px)" : "translateY(6000px)",
        visibility: isSearchOpen ? "visible" : "hidden",
      }}
      className="flex w-full flex-col duration-500 fixed z-80  h-fit transition-all px-2 md:px-4 items-center justify-center"
    >
      <div className=" bg-gray-700 w-full z-50 max-w-[800px] p-4 rounded-t-xl">
        <div className="mb-2 flex items-center justify-between ">
          <div className=" flex-col flex justify-center gap-2">
            <h1 className=" text-start  text-4xl font-semibold">Search</h1>
          </div>
          <button
            onClick={() => clearAndClose()}
            className=" transition-all  hover:bg-red-600 items-center rounded-full p-2 size-10 aspect-square"
          >
            <X />
          </button>
        </div>
        <div className=" flex items-center gap-2 ">
          <button
            style={{
              backgroundColor: type === "multi" ? "lightgreen" : "",
              color: type === "multi" ? "green" : "",
            }}
            onClick={() => {
              setType("multi");
              setAnime(null);
            }}
            className=" px-2 py-.5 rounded-sm bg-gray-500 cursor-pointer"
          >
            Movie/TV
          </button>
          <button
            style={{
              backgroundColor: type === "anime" ? "lightgreen" : "",
              color: type === "anime" ? "green" : "",
            }}
            onClick={() => {
              setType("anime");
              setResult(null);
            }}
            className=" px-2 py-.5 rounded-sm bg-gray-500 cursor-pointer"
          >
            Anime
          </button>
        </div>
        <div
          style={{ padding: term.length > 0 ? "8px" : "0px" }}
          className="my-4 max-h-[400px] overflow-y-scroll rounded-md transition-all text-lg w-full bg-gray-500 "
        >
          {term.length > 0 &&
            type === "multi" &&
            result?.results?.map((res) => (
              <TmdbInSearchArray show={res} term={term} key={res.id} />
            ))}

          {term.length > 0 &&
            type === "anime" &&
            anime?.data.animes?.map((res) => (
              <AnimeInSearchArray anime={res} term={term} key={res.id} />
            ))}
        </div>
        <form
          onSubmit={search}
          className="flex flex-row-reverse rounded-md overflow-hidden px-2 w-full bg-gray-600 h-[40px]"
        >
          <input
            type="text"
            ref={inputRef}
            className=" w-full placeholder:text-white/50 focus:outline-hidden bg-transparent  h-full px-2 "
            placeholder="Press '/' to open Search anywhere"
            value={term}
            onFocus={() => setIsSearchBarFocused(true)}
            onBlur={() => setIsSearchBarFocused(false)}
            onChange={(e) => {
              setTerm(e.target.value);
              setIsEmpty(false);
            }}
          />
          <button>
            <Search size={20} opacity={0.5} />
          </button>
        </form>

        <div className="flex flex-wrap text-sm max-h-64 overflow-x-hidden overflow-y-scroll items-center gap-2 my-2">
          {history && history.length > 0 && (
            <>
              <button
                className=" text-red-500 transition-all text-md bg-red-100 py-1 rounded-md px-2 font-medium w-fit flex items-center justify-between cursor-pointer"
                onClick={() => searchHistory.searches.clear()}
              >
                <CircleX className=" mr-2 cursor-pointer " size={15} />
                Clear
              </button>
              <Link
                className=" text-blue-500 transition-all text-md bg-blue-100 py-1 rounded-md px-2 font-medium w-fit flex items-center justify-between cursor-pointer"
                href={"/history"}
              >
                <HistoryIcon className=" mr-2 cursor-pointer " size={15} />
                History
              </Link>
            </>
          )}
          {history?.map((value, index) => (
            <Link
              href={`/search/${value.type}/${encodeURIComponent(value.term)}`}
              key={index}
              className="bg-gray-100  text-nowrap text-gray-900 w-fit py-1 px-2 rounded-md flex items-center justify-between cursor-pointer hover:bg-gray-300 "
            >
              {value.term}
            </Link>
          ))}
        </div>

        <p
          onClick={() => setIsEmpty(false)}
          style={{
            transform: IsEmpty ? "translateY(0px)" : "translateY(75px)",
          }}
          className="mt-2 text-red-500 transition-all text-md bg-red-100 py-1 rounded-md px-2 font-medium w-fit flex items-center justify-between cursor-pointer"
        >
          <CircleX className=" mr-2 cursor-pointer " size={15} />
          Empty Search are Not Allowed !
        </p>
      </div>
    </div>
  );
}

const TmdbInSearchArray = ({
  show,
  term,
}: {
  show: TMDBMultiResult;
  term: string;
}) => {
  const [isloaded, setIsloaded] = useState(false);
  const [error, setError] = useState(false);
  return (
    <Link
      key={show.id}
      target="_blank"
      style={{
        display: show.media_type === "movie" || "tv" ? "flex" : "none",
      }}
      href={`/info/${show.media_type}/${show.id}`}
      className=" w-full "
    >
      <button className="p-2 w-full rounded-xs text-start hover:bg-gray-700/50 transition-all flex items-center gap-3">
        <div className="relative h-[100px] min-w-[80px]">
          {!isloaded && !error && (
            <div className="h-[100px]  min-w-[80px] absolute top-0 rounded-md bg-gray-400 animate-pulse"></div>
          )}
          {!error ? (
            <img fetchPriority="low" loading="lazy"
              onLoad={() => setIsloaded(true)}
              onError={() => setError(true)}
              style={{
                opacity: isloaded ? "100%" : "0%",
                scale: isloaded ? "100%" : "0%",
              }}
              className="h-[100px]  min-w-[80px] absolute object-cover top-0 rounded-xs"
              src={createImageUrl(
                show.backdrop_path || show.backdrop_path,
                "w500"
              )}
              alt={show.name || show.title}
            />
          ) : (
            <div className="h-[100px]  w-[80px] absolute top-0 rounded-md bg-black/60 flex items-center justify-center flex-col">
              <FileWarningIcon />
              <span className="text-sm leading-none text-center">
                Image Error
              </span>
            </div>
          )}
        </div>
        <span>
          {highlightSearchText(show.title || show.name, term)}

          <span className="line-clamp-1 text-sm">
            {show.overview || show.synopsis}
          </span>
          <span className=" text-sm bg-gray-700 rounded-md px-3 py-1">
            {show.media_type === "tv" ? "TV Show" : "Movie"}
          </span>
        </span>
      </button>
    </Link>
  );
};

const AnimeInSearchArray = ({
  anime,
  term,
}: {
  anime: {
    id: string;
    name: string;
    poster: string;
    duration: string;
    type: string;
    rating: string;
    episodes: {
      sub: number;
      dub: number;
    };
  };
  term: string;
}) => {
  const [isloaded, setIsloaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <Link
      href={`/anime/${anime.id}`}
      target="_blank"
      className=" w-full "
      key={anime.id}
    >
      <button className="p-2 w-full rounded-md text-start hover:bg-gray-700/50 transition-all flex items-center gap-3">
        <div className="relative h-[100px] w-[80px]">
          {!isloaded && !error && (
            <div className="h-[100px]  min-w-[80px] absolute top-0 rounded-md bg-gray-400 animate-pulse"></div>
          )}
          {!error ? (
            <img fetchPriority="low" loading="lazy"
              onLoad={() => setIsloaded(true)}
              onError={() => setError(true)}
              style={{
                opacity: isloaded ? "100%" : "0%",
                scale: isloaded ? "100%" : "0%",
              }}
              className="h-[100px]  w-[80px] absolute object-cover top-0 rounded-xs"
              src={anime.poster}
              alt={anime.name}
            />
          ) : (
            <div className="h-[100px]  w-[80px] absolute top-0 rounded-md bg-black/60 flex items-center justify-center flex-col">
              <FileWarningIcon />
              <span className="text-sm leading-none text-center">
                Image Error
              </span>
            </div>
          )}
        </div>
        <span>
          {highlightSearchText(anime.name, term)}
          <span className="line-clamp-1 text-sm ">
            Dubbed :{anime.episodes.dub || 0}
          </span>
          <span className="line-clamp-1 text-sm ">
            Subbed :{anime.episodes.sub || 0}
          </span>
          <span className=" text-sm bg-gray-700 rounded-md px-3 py-1">
            {anime.type}
          </span>
        </span>
      </button>
    </Link>
  );
};

const highlightSearchText = (text: string, highlight: string) => {
  const parts = text.split(new RegExp(`(${highlight})`, "gi"));

  return (
    <span>
      {parts.map((part, index) => {
        return part.toLowerCase() === highlight.toLowerCase() ? (
          <b key={index} className="bg-red-500/70">
            {part}
          </b>
        ) : (
          <span key={index}>{part}</span>
        );
      })}
    </span>
  );
};
