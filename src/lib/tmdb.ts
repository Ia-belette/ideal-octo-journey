import { MovieDetails, TvResults } from '#/types';

export const findByIdImdb = async (
  id: string,
  tmdbApiKey: string,
  language: 'fr' | 'en' = 'fr'
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
  id: string,
  tmdbApiKey: string,
  language: 'fr' | 'en' = 'fr'
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
