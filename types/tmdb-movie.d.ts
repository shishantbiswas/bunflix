type MovieResults = {
  adult: boolean;
  backdrop_path: string;
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  vote_average: number;
  vote_count: number;
  first_air_date: string;
  title_english: string;
  synopsis: string;
  imdb_id: number;
  name: string;
  image: string;
  known_for?: any[];
  profile_path?: string;
  media_type: "movie" | "tv" | "person" | "collection";
  seasons: TMDBMultiSeason[];
};

type TMDBMovie = {
  page: number;
  results: MovieResults[];
  total_pages: number;
  total_results: number;
};

type TMDBMultiSearch = {
  results: TMDBMultiResult[];
  total_pages: number;
  total_results: number;
  page: number;
};

type TMDBMultiResult = {
  id: number;
  genre_ids: string[];
  video: boolean;
  adult: boolean;
  backdrop_path: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  vote_average: number;
  vote_count: number;
  first_air_date: string;
  title_english: string;
  synopsis: string;
  imdb_id: number;
  name: string;
  image: string;
  media_type: "movie" | "tv" | "person" | "collection" | &(string);
  seasons: TMDBMultiSeason[];
};

type TMDBMultiSeason = {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: string;
  vote_average: number;
};

type TMDBMovieInfo = {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  };
  budget: number;
  genres: { id: number; name: string }[];
  homepage: string;
  id: number;
  imdb_id: number;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  production_countries: { iso_3166_1: string; name: string }[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: { english_name: string; iso_639_1: string; name: string }[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: boolean;
  vote_count: boolean;
};

type TMDBTvInfo = {
  adult: boolean;
  title: string;
  backdrop_path: string;
  created_by: [];
  episode_run_time: number[];
  first_air_date: string;
  genres: { id: string; name: string }[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: {
    id: number;
    overview: string;
    name: string;
    vote_average: number;
    vote_count: number;
    air_date: string;
    episode_number: number;
    episode_type: string;
    production_code: "";
    runtime: number | string;
    season_number: number;
    show_id: number;
    still_path: string;
  };
  name: string;
  next_episode_to_air: null;
  networks: [];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: 85.99;
  poster_path: string;
  production_companies: {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
  }[];
  production_countries: { iso_3166_1: string; name: string }[];
  seasons: {
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    season_number: number;
    vote_average: number;
  }[];
  spoken_languages: { english_name: string; iso_639_1: string; name: string }[];
  status: string;
  tagline: string;
  type: string;
  vote_average: string;
  vote_count: number;
};

type TMDBEpisodesInfo = {
  air_date: string;
  episodes: TMDBEpisodeResult[];
  name: string;
  overview: string;
  id: number;
  poster_path?: string;
  season_number: number;
  vote_average: number;
};

type TMDBEpisodeResult = {
  air_date: string;
  season: number | string;
  episode: number | string;
  episode_number: string;
  episode_type: string;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
  crew: [];
  guest_stars: [];
};
