import axios from 'axios';

export interface DiscoverParams {
  certification?: string;
  certification_country?: string;
  certification_gte?: string;
  certification_lte?: string;
  include_adult?: boolean;
  include_video?: boolean;
  language?: string;
  page?: number;
  primary_release_date_gte?: string;
  primary_release_date_lte?: string;
  primary_release_year?: number;
  region?: string;
  release_date_gte?: string;
  release_date_lte?: string;
  sort_by?: string;
  vote_average_gte?: number;
  vote_average_lte?: number;
  vote_count_gte?: number;
  vote_count_lte?: number;
  watch_region?: string;
  with_cast?: string;
  with_companies?: string;
  with_crew?: string;
  with_genres?: string;
  with_keywords?: string;
  with_origin_country?: string;
  with_original_language?: string;
  with_people?: string;
  with_release_type?: number;
  with_runtime_gte?: number;
  with_runtime_lte?: number;
  with_watch_monetization_types?: string;
  with_watch_providers?: string;
  without_companies?: string;
  without_genres?: string;
  without_keywords?: string;
  without_watch_providers?: string;
  year?: number;
}

export interface TvShow {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  first_air_date: string;
  name: string;
  vote_average: number;
  vote_count: number;
}

export interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface PagedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

const tmdbApi = axios.create({
  baseURL: process.env.TMDB_BASE_URL,
  params: {
    api_key: process.env.TMDB_API_KEY,
  },
});

/**
 * Searches for a movie based on the given query.
 *
 * @param {string} query - The search query for the movie.
 * @return {Promise<PagedResponse<Movie>>} A promise that resolves to the search results data.
 */
export const searchMovie = async (
  query: string
): Promise<PagedResponse<Movie>> => {
  const { data } = await tmdbApi.get('search/movie', {
    params: {
      query: encodeURIComponent(query),
    },
  });
  return data;
};

/**
 * Searches for TV shows based on a given query.
 *
 * @param {string} query - The search query.
 * @return {Promise<PagedResponse<TvShow>>} A Promise that resolves to the search results.
 */
export const searchTv = async (
  query: string
): Promise<PagedResponse<TvShow>> => {
  const { data } = await tmdbApi.get('search/tv', {
    params: {
      query: encodeURIComponent(query),
    },
  });
  return data;
};

/**
 * Retrieves a movie by its ID.
 *
 * @param {number} id - The ID of the movie to retrieve.
 * @return {Promise<Movie>} A promise that resolves to the retrieved movie data.
 */
export const getMovie = async (id: number): Promise<Movie> => {
  const { data } = await tmdbApi.get(`movie/${id}`);
  return data;
};

/**
 * Retrieves a TV show by its ID.
 *
 * @param {number} id - The ID of the TV show to retrieve.
 * @return {Promise<TvShow>} A promise that resolves to the retrieved TV show data.
 */
export const getTv = async (id: number): Promise<TvShow> => {
  const { data } = await tmdbApi.get(`tv/${id}`);
  return data;
};

/**
 * Retrieves a paged response of movies based on the provided discoverParams.
 *
 * @param {DiscoverParams} discoverParams - The parameters to use for discovering movies.
 * @return {Promise<PagedResponse<Movie>>} A promise that resolves to the paged response of movies.
 */
export const discoverMovie = async (
  discoverParams: DiscoverParams
): Promise<PagedResponse<Movie>> => {
  const { data } = await tmdbApi.get('discover/movie', {
    params: { ...discoverParams },
  });
  return data;
};
/**
 * Retrieves a paged response of TV shows based on the provided discoverParams.
 *
 * @param {DiscoverParams} discoverParams - The parameters to use for discovering TV shows.
 * @return {Promise<PagedResponse<TvShow>>} A promise that resolves to the paged response of TV shows.
 */
export const discoverTvShow = async (
  discoverParams: DiscoverParams
): Promise<PagedResponse<TvShow>> => {
  const { data } = await tmdbApi.get('discover/tv', {
    params: { ...discoverParams },
  });
  return data;
};

/**
 * Retrieves a paged response of trending movies.
 *
 * @return {Promise<PagedResponse<Movie>>} A promise that resolves to the paged response of trending movies.
 */
export const getTrendingMovies = async (): Promise<PagedResponse<Movie>> => {
  const { data } = await tmdbApi.get('trending/movie/day');
  return data;
};

/**
 * Retrieves a paged response of popular movies.
 *
 * @return {Promise<PagedResponse<Movie>>} A promise that resolves to the paged response of popular movies.
 */
export const getPopularMovies = async (): Promise<PagedResponse<Movie>> => {
  const { data } = await tmdbApi.get('movie/popular');
  return data;
};

/**
 * Retrieves a paged response of upcoming movies.
 *
 * @return {Promise<PagedResponse<Movie>>} A promise that resolves to the paged response of upcoming movies.
 */
export const getUpcomingMovies = async (): Promise<PagedResponse<Movie>> => {
  const { data } = await tmdbApi.get('movie/upcoming');
  return data;
};

/**
 * Retrieves a paged response of trending TV shows.
 *
 * @return {Promise<PagedResponse<TvShow>>} A promise that resolves to the paged response of trending TV shows.
 */
export const getTrendingTv = async (): Promise<PagedResponse<TvShow>> => {
  const { data } = await tmdbApi.get('trending/tv/day');
  return data;
};

/**
 * Retrieves a paged response of popular TV shows.
 *
 * @return {Promise<PagedResponse<TvShow>>} A promise that resolves to the paged response of popular TV shows.
 */
export const getPopularTv = async (): Promise<PagedResponse<TvShow>> => {
  const { data } = await tmdbApi.get('tv/popular');
  return data;
};

/**
 * Retrieves a paged response of upcoming TV shows.
 *
 * @return {Promise<PagedResponse<TvShow>>} A promise that resolves to the paged response of upcoming TV shows.
 */
export const getUpcomingTv = async (): Promise<PagedResponse<TvShow>> => {
  const { data } = await tmdbApi.get('tv/upcoming');
  return data;
};

/**
 * Retrieves data from the TMDB API using the provided external ID.
 *
 * @param {string} externalId - The external ID used to search for data.
 * @return {Promise<any>} A Promise that resolves to the data retrieved from the API.
 */
export const findUsingExternalId = async (externalId: string) => {
  const { data } = await tmdbApi.get(`find/${externalId}`);
  return data;
};
