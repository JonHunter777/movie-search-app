const API_KEY = CONFIG.API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

async function searchMovies(query) {
  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&language=ru-RU`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results;
}

async function getPopularMovies() {
  const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=ru-RU`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results;
}