const moviesGrid = document.getElementById('movies-grid');
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');

// ===== РЕНДЕР КАРТОЧЕК =====
function renderMovies(movies) {
  moviesGrid.innerHTML = '';

  if (movies.length === 0) {
    moviesGrid.innerHTML = '<p class="empty-state">Ничего не найдено 😔</p>';
    return;
  }

  movies.forEach(movie => {
    const poster = movie.poster_path
      ? IMG_BASE + movie.poster_path
      : 'https://placehold.co/300x450?text=No+Poster';

    const year = movie.release_date
      ? movie.release_date.slice(0, 4)
      : 'Год неизвестен';

    const rating = movie.vote_average
      ? movie.vote_average.toFixed(1)
      : 'N/A';

    const card = document.createElement('div');
    card.classList.add('movie-card');
    card.innerHTML = `
      <img class="movie-poster" src="${poster}" alt="${movie.title}" />
      <div class="movie-info">
        <h2 class="movie-title">${movie.title}</h2>
        <p class="movie-year">${year}</p>
        <p class="movie-rating">⭐ ${rating}</p>
      </div>
    `;

    moviesGrid.appendChild(card);
  });
}

// ===== ПОИСК =====
async function handleSearch() {
  const query = searchInput.value.trim();

  moviesGrid.innerHTML = '<p class="loading">Загрузка... ⏳</p>';

  try {
    const movies = query === ''
      ? await getPopularMovies()
      : await searchMovies(query);
    renderMovies(movies);
  } catch (error) {
    moviesGrid.innerHTML = '<p class="error">Что-то пошло не так. Попробуй снова 😞</p>';
  }
}

searchBtn.addEventListener('click', handleSearch);

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    handleSearch();
  }
});

// ===== ЗАГРУЗКА ПОПУЛЯРНЫХ =====
async function init() {
  moviesGrid.innerHTML = '<p class="loading">Загрузка... ⏳</p>';
  try {
    const movies = await getPopularMovies();
    renderMovies(movies);
  } catch (error) {
    moviesGrid.innerHTML = '<p class="error">Что-то пошло не так. Попробуй снова 😞</p>';
  }
}

init();