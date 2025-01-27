interface AniwatchHome {
  success: boolean;
  data: {
    spotlightAnimes: SpotlightAnimes[];
    trendingAnimes: TrendingAnimes[];
    latestEpisodeAnimes: LatestEpisodeAnimes[];
    topUpcomingAnimes: TopUpcomingAnimes[];
    top10Animes: Top10Animes;
    topAiringAnimes: TopAiringAnimes[];
    genres: string[];
  };
};

interface TopAiringAnimes {
  id: string;
  name: string;
  jname?: string;
  type?: string;
  description: string;
  poster: string;
  otherInfo: string[];
};

interface Top10Animes {
  today: Top10AnimesResult[];
  week: Top10AnimesResult[];
  month: Top10AnimesResult[];
};

interface Top10AnimesResult {
  id: string;
  name: string;
  description: string;
  poster: string;
  episodes: { sub: number; dub: number };
};

interface TopUpcomingAnimes {
  id: string;
  name: string;
  duration: string;
  poster: string;
  type: string;
  rating: string | null;
  episodes: { sub: number; dub: number };
};

interface LatestEpisodeAnimes {
  id: string;
  name: string;
  description: string;
  poster: string;
  type: string;
  rating: string | null;
  episodes: { sub: number; dub: number };
};

interface TrendingAnimes {
  rank: number;
  id: string;
  name: string;
  poster: string;
};

interface SpotlightAnimes {
  rank: number;
  id: string;
  name: string;
  description: string;
  poster: string;
  jname: string;
  episodes: { sub: number; dub: number };
  otherInfo: [string, string, string, string];
};

interface AniwatchInfo {
  data: {
    anime: {
      info: {
        id: string;
        anilistId: number;
        malId: number;
        name: string;
        poster: string;
        description: string;
        stats: {
          rating: string;
          quality: string;
          episodes: { sub: string | number; dub: string | number };
          type: string;
          duration: string;
        };
      };
      moreInfo: {
        japanese: string;
        synonyms: string;
        aired: string;
        premiered: string;
        duration: string;
        status: string;
        malscore: string;
        genres: string[];
        studios: string;
        producers: string[];
      };
    };
    seasons: {
      id: string;
      name: string;
      title: string;
      poster: string;
      isCurrent: boolean;
    }[];
    mostPopularAnimes: {
      id: string;
      name: string;
      poster: string;
      jname: string;
      episodes: {
        sub: number;
        dub: number;
      };
      type: string;
    }[];
    relatedAnimes: {
      id: string;
      name: string;
      poster: string;
      jname: string;
      episodes: {
        sub: number;
        dub: number;
      };
      type: Special;
    }[];
    recommendedAnimes: {
      id: string;
      name: string;
      jname?: string;
      poster: string;
      duration: string;
      type: string;
      rating: string;
      episodes: {
        sub: number;
        dub: number;
      };
    }[];
  };
};

interface AniwatchEpisodeData {
  success: boolean;
  data: {
    totalEpisodes: number;
    episodes: {
      title: string;
      episodeId: string;
      number: string;
      isFiller: boolean;
    }[];
  };
};

interface AniwatchSearch {
  data: {
    animes: Anime[];
    mostPopularAnimes: {
      id: string;
      name: string;
      poster: string;
      jname: string;
      episodes: { sub: number; dub: number };
      type: string;
    }[];
    currentPage: number;
    hasNextPage: boolean;
    totalPages: number;
    searchQuery: string;
    searchFilters: {};
  };
};

interface Anime {
  id: string;
  name: string;
  poster: string;
  duration: string;
  type: string;
  jname?: string;
  rating: string;
  episodes: { sub: number; dub: number };
};

interface AniwatchEpisodeSrc {
  data: {
    tracks: { file: string; kind: string; label: string; default: boolean }[];
    intro: { start: number; end: number };
    outro: { start: number; end: number };
    sources: { url: string; type: string }[];
    anilistID: [];
    malID: [];
  };
};

interface AniwatchGenre {
  data: {
    genreName: string;
    animes: Anime[];
    genres: string[];
    topAiringAnimes: TopAiringAnimes[];
    totalPages: number;
    hasNextPage: boolean;
    currentPage: number;
  };
};

interface AniwatchStudio {
  producerName: string;
  animes: Anime[];
  genres: string[];
  topAiringAnimes: TopAiringAnimes[];
  totalPages: number;
  hasNextPage: boolean;
  currentPage: number;
};

interface AniwatchCategories {
  success: boolean;
  data: {
    genres: string[];
    animes: Anime[];
    top10Animes: Top10Animes;
    category: string;
    totalPages: number;
    hasNextPage: boolean;
    currentPage: number;
  };
};

type AniwatchCategoriesName =
  | "most-favorite"
  | "most-popular"
  | "subbed-anime"
  | "dubbed-anime"
  | "recently-updated"
  | "recently-added"
  | "top-upcoming"
  | "top-airing"
  | "movie"
  | "special"
  | "ova"
  | "ona"
  | "tv"
  | "completed";

interface AniwatchServer {
  success: boolean;
  data: {
    dub: {
      serverName: string, serverId: number
    }[],
    sub: {
      serverName: string, serverId: number
    }[]
    raw: {
      serverName: string, serverId: number
    }[]
    episodeId: string,
    episodeNo: number

  }
}