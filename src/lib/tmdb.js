const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const isTmdbConfigured = Boolean(API_KEY);

/* ---------- Image helpers ---------- */

export const posterUrl = (path, size = 'w342') => (path ? `${IMAGE_URL}/${size}${path}` : null);
export const backdropUrl = (path, size = 'w1280') => (path ? `${IMAGE_URL}/${size}${path}` : null);
export const profileUrl = (path, size = 'w185') => (path ? `${IMAGE_URL}/${size}${path}` : null);

/* ---------- Request layer ---------- */

// Identical requests made during one session share a single network call.
const cache = new Map();

function request(endpoint, params = {}) {
  if (!API_KEY) {
    return Promise.reject(
      new Error('The TMDB API key is missing. Add VITE_TMDB_API_KEY to your .env file and restart the dev server.')
    );
  }

  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', 'en-US');
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  const cacheKey = url.toString();
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const promise = fetch(cacheKey)
    .then(async (response) => {
      if (response.ok) return response.json();
      if (response.status === 401) {
        throw new Error('TMDB rejected the API key. Check the value of VITE_TMDB_API_KEY.');
      }
      if (response.status === 404) {
        throw new Error('That movie could not be found.');
      }
      if (response.status === 429) {
        throw new Error('Too many requests were sent to TMDB. Wait a moment and try again.');
      }
      throw new Error(`TMDB returned an error (${response.status}). Try again shortly.`);
    })
    .catch((error) => {
      cache.delete(cacheKey);
      if (error instanceof TypeError) {
        throw new Error('Could not reach TMDB. Check your internet connection and try again.');
      }
      throw error;
    });

  cache.set(cacheKey, promise);
  return promise;
}

/* ---------- Movie lists ---------- */

export const getTrending = () => request('/trending/movie/week').then((data) => data.results);
export const getPopular = () => request('/movie/popular').then((data) => data.results);
export const getTopRated = () => request('/movie/top_rated').then((data) => data.results);
export const getUpcoming = () => request('/movie/upcoming').then((data) => data.results);

export const searchMovies = (query, page = 1) =>
  request('/search/movie', { query, page, include_adult: 'false' });

/* ---------- Movie details ---------- */

export const getMovieDetails = (id) =>
  request(`/movie/${id}`, { append_to_response: 'credits,videos' });

// Picks the best YouTube clip from a TMDB videos list.
export function pickTrailer(videos = []) {
  const youtube = videos.filter((video) => video.site === 'YouTube');
  const byType = (type) => youtube.filter((video) => video.type === type);
  const official = (list) => list.find((video) => video.official) || list[0];

  return official(byType('Trailer')) || official(byType('Teaser')) || youtube[0] || null;
}

export async function getTrailerKey(id) {
  const data = await request(`/movie/${id}/videos`);
  const trailer = pickTrailer(data.results);
  return trailer ? trailer.key : null;
}

export const youtubeWatchUrl = (key) => `https://www.youtube.com/watch?v=${key}`;
