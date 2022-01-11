import { dateFilm } from '../utils/film.js';
import AbstractView from './abstract-view.js';

const createCardFilmTemplate = (films) => {
  const {
    poster,
    filmName,
    rating,
    date,
    duration,
    genre,
    description,
    countComment,
    isWatchlist,
    isWatched,
    isFavorites
  } = films;


  const activeClassName = (item) => item ? 'film-card__controls-item--active' : '';

  const dateFormatRelise = 'YYYY';

  return `<article class="film-card">
        <a class="film-card__link">
          <h3 class="film-card__title">${filmName}</h3>
          <p class="film-card__rating">${rating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${dateFilm(date, dateFormatRelise)}</span>
            <span class="film-card__duration">${duration}</span>
            <span class="film-card__genre">${genre}</span>
          </p>
          <img src="${poster}" alt="" class="film-card__poster">
          <p class="film-card__description">${description}</p>
          <span class="film-card__comments">${countComment} comments</span>
        </a>
        <div class="film-card__controls">
        <button class="film-card__controls-item ${activeClassName(isWatchlist)} film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
        <button class="film-card__controls-item ${activeClassName(isWatched)} film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
        <button class="film-card__controls-item ${activeClassName(isFavorites)} film-card__controls-item--favorite" type="button">Mark as favorite</button>
        </div>
      </article>`;
};

export default class CardFilmView extends AbstractView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createCardFilmTemplate(this.#film);
  }

  setOpenPopupHandler = (callback) => {
    this._callback.popupOpenClick = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#popupOpenClickHandler);
  }

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchlistClickHandler);
  }

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#watchedClickHandler);
  }

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
  }

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  #popupOpenClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.popupOpenClick();
  }
}
