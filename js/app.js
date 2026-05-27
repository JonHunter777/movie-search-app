const moviesGrid = document.getElementById('movies-grid');
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const modalPoster = document.getElementById('modal-poster');
const modalTitle = document.getElementById('modal-title');
const modalYear = document.getElementById('modal-year');
const modalRating = document.getElementById('modal-rating');
const modalOverview = document.getElementById('modal-overview');
const modalFavBtn = document.getElementById('modal-fav-btn');
const favTabBtn = document.getElementById('fav-tab-btn');

let showingFavourites = false;
let currentMovie = null;

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
    card.addEventListener('click', () => openModal(movie));
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

// ===== МОДАЛКА =====
function openModal(movie) {
  currentMovie = movie;

  const poster = movie.poster_path
    ? IMG_BASE + movie.poster_path
    : 'https://placehold.co/200x300?text=No+Poster';

  const year = movie.release_date
    ? movie.release_date.slice(0, 4)
    : 'Год неизвестен';

  const rating = movie.vote_average
    ? movie.vote_average.toFixed(1)
    : 'N/A';

  modalPoster.src = poster;
  modalPoster.alt = movie.title;
  modalTitle.textContent = movie.title;
  modalYear.textContent = '📅 ' + year;
  modalRating.textContent = '⭐ ' + rating;
  modalOverview.textContent = movie.overview || 'Описание отсутствует';

  updateFavBtn(movie.id);
  modalOverlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.add('hidden');
  document.body.style.overflow = '';
  currentMovie = null;
}

modalClose.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    closeModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});

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
  try {
    const movies = await getPopularMovies();
    renderMovies(movies);
  } catch (error) {
    console.log('Ошибка init:', error);
    moviesGrid.innerHTML = '<p class="error">Что-то пошло не так. Попробуй снова 😞</p>';
  }
}

init();
// ===== ИЗБРАННОЕ =====
function getFavourites() {
  return JSON.parse(localStorage.getItem('favourites') || '[]');
}

function saveFavourites(favourites) {
  localStorage.setItem('favourites', JSON.stringify(favourites));
}

function isFavourite(movieId) {
  const favourites = getFavourites();
  return favourites.some(movie => movie.id === movieId);
}

function toggleFavourite(movie) {
  let favourites = getFavourites();

  if (isFavourite(movie.id)) {
    favourites = favourites.filter(m => m.id !== movie.id);
  } else {
    favourites.push(movie);
  }

  saveFavourites(favourites);
  updateFavBtn(movie.id);
}

function updateFavBtn(movieId) {
  if (isFavourite(movieId)) {
    modalFavBtn.textContent = '💔 Удалить из избранного';
    modalFavBtn.classList.add('saved');
  } else {
    modalFavBtn.textContent = '❤️ В избранное';
    modalFavBtn.classList.remove('saved');
  }
}

modalFavBtn.addEventListener('click', () => {
  if (currentMovie) {
    toggleFavourite(currentMovie);
  }
});


// ===== РАЗДЕЛ ИЗБРАННОЕ =====
favTabBtn.addEventListener('click', () => {
  showingFavourites = !showingFavourites;

  if (showingFavourites) {
    favTabBtn.classList.add('active');
    const favourites = getFavourites();

    if (favourites.length === 0) {
      moviesGrid.innerHTML = '<p class="empty-state">Пока ничего не добавлено 💔</p>';
    } else {
      renderMovies(favourites);
    }
  } else {
    favTabBtn.classList.remove('active');
    init();
  }
});