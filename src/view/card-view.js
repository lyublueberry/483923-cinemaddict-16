import { dateFilm } from '../util';
import {createElement} from '../render.js';

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

  const addWatchlistClassName = isWatchlist ? 'film-card__controls-item--active' : '';
  const markWatchedClassName = isWatched ? 'film-card__controls-item--active' : '';
  const markFavorite = isFavorites ? 'film-card__controls-item--active' : '';
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
        <button class="film-card__controls-item ${addWatchlistClassName} film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
        <button class="film-card__controls-item ${markWatchedClassName} film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
        <button class="film-card__controls-item ${markFavorite} film-card__controls-item--favorite" type="button">Mark as favorite</button>
        </div>
      </article>`;
};

export default class CardFilmView {
  #element = null;
  #film = null;

  constructor(film) {
    this.#film = film;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createCardFilmTemplate(this.#film);
  }

  removeElement() {
    this.#element = null;
  }
}
