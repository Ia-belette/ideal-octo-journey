export type Env = {
  DATABASE_URL: string;
  TMDB_API_KEY: string;
  BASIC_USERNAME: string;
  BASIC_PASSWORD: string;
};

export type TvResults = {
  backdrop_path: string;
  poster_path: string;
  id: number;
};

export type MovieDetails = {
  backdrop_path: string;
  poster_path: string;
};
