import { MovieDetails, TvResults } from '#/types';

export const findByIdImdb = async (
  id: string,
  tmdbApiKey: string,
  language: string
) => {
  const url = `https://api.themoviedb.org/3/find/${id}?external_source=imdb_id&language=${language}`;

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${tmdbApiKey}`,
    },
  };

  const response = await fetch(url, options);
  return response.json() as Promise<{ tv_results: TvResults[] }>;
};

export const movieDetails = async (
  id: number,
  tmdbApiKey: string,
  language: string
) => {
  const url = `https://api.themoviedb.org/3/movie/${id}?language=${language}`;

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${tmdbApiKey}`,
    },
  };

  const response = await fetch(url, options);

  return response.json() as Promise<MovieDetails>;
};

export const movieTrailer = async (
  id: string,
  tmdbApiKey: string,
  language: string
) => {
  const url = `https://api.themoviedb.org/3/movie/${id}/videos?language=${language}`;

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${tmdbApiKey}`,
    },
  };

  const response = await fetch(url, options);

  return response.json() as Promise<{
    results: {
      type: string;
      key: string;
    }[];
  }>;
};
