import PopupFilmView from '../view/film-details-popup-view.js';
import CardFilmView from '../view/card-view.js';
import { render, RenderPosition, replace, remove } from '../utils/render.js';

const KEYDOWN = 'keydown';
const ESCAPE = 'Escape';
const ESC = 'Esc';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class MoviePresenter {
  #changeMode = null;
  #filmListContainer = null;

  #filmComponent = null;
  #filmPopupComponent = null;

  #film = null;
  #changeData = null;

  #mode = Mode.DEFAULT

  constructor(filmListContainer, changeData, changeMode) {
    this.#filmListContainer = filmListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmCardComponent = this.#filmComponent;
    this.#filmComponent = new CardFilmView(film);
    this.#filmComponent.setPopupClickHandler(this.#handleCardFilmToPopup);
    this.#filmComponent.setWatchlistClickHandler(this.#handleWatchlist);
    this.#filmComponent.setWatchedClickHandler(this.#handleWatched);
    this.#filmComponent.setFavoriteClickHandler(this.#handleFavorite);

    const prevPopupComponent = this.#filmPopupComponent;
    this.#filmPopupComponent = new PopupFilmView(film);
    this.#filmPopupComponent.setClosePopupHandler(this.#handlePopupToCardFilm);
    this.#filmPopupComponent.setWatchlistClickHandler(this.#handleWatchlist);
    this.#filmPopupComponent.setWatchedClickHandler(this.#handleWatched);
    this.#filmPopupComponent.setFavoriteClickHandler(this.#handleFavorite);

    if (prevFilmCardComponent === null || prevPopupComponent === null) {
      render(this.#filmListContainer.container, this.#filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#filmComponent, prevFilmCardComponent);
    }

    if (document.body.contains(prevPopupComponent.element)) {
      replace(this.#filmPopupComponent, prevPopupComponent);
    }

    remove(prevFilmCardComponent);
    remove(prevPopupComponent);

    //render(this.#filmListContainer.container, this.#filmComponent, RenderPosition.BEFOREEND);
  };

  destroy = () => {
    remove(this.#filmComponent);
    remove(this.#filmPopupComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replacePopupToCardFilm();
    }
  }

  #replaceCardFilmToPopup = () => {
    replace(this.#filmPopupComponent, this.#filmComponent);
    document.addEventListener(KEYDOWN, this.#escKeyDownHandler);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replacePopupToCardFilm = () => {
    replace(this.#filmComponent, this.#filmPopupComponent);
    document.removeEventListener(KEYDOWN, this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #escKeyDownHandler = (evt) => {
    if(evt.key === ESCAPE || evt.key === ESC) {
      evt.preventDefault();
      this.#replacePopupToCardFilm();
      document.removeEventListener(KEYDOWN, this.#onEscKeyDown);
      document.body.classList.remove('hide-overflow');
    }
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replacePopupToCardFilm();
      document.removeEventListener('keydown', this.#onEscKeyDown);
      document.body.classList.remove('hide-overflow');
    }
  };

  #handleCardFilmToPopup = () => {
    this.#replaceCardFilmToPopup();
    document.body.classList.remove('hide-overflow');
  };

  #handlePopupToCardFilm = () => {
    this.#replacePopupToCardFilm();
    document.body.classList.remove('hide-overflow');
  };

  #handleWatchlist = () => {
    this.#changeData({...this.#film, isWatchList: !this.#film.isWatchlist});
  }

  #handleWatched = () => {
    this.#changeData({...this.#film, isWatched: !this.#film.isWatched});
  }

  #handleFavorite = () => {
    this.#changeData({...this.#film, isFavorites: !this.#film.isFavorites});
  }
}
