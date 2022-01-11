import PopupFilmView from '../view/film-details-popup-view.js';
import CardFilmView from '../view/card-view.js';
import { render, RenderPosition, replace, remove } from '../utils/render.js';
import AbstractView from '../view/abstract-view.js';

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

  #removePrevPopupComponent= null;

  constructor(filmListContainer, changeData, changeMode, removePrevPopupComponent) {
    this.#filmListContainer = filmListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#removePrevPopupComponent = removePrevPopupComponent;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmCardComponent = this.#filmComponent;
    this.#filmComponent = new CardFilmView(film);
    this.#filmComponent.setOpenPopupHandler(this.#handleOpenPopup);
    this.#filmComponent.setWatchlistClickHandler(this.#handleWatchlist);
    this.#filmComponent.setWatchedClickHandler(this.#handleWatched);
    this.#filmComponent.setFavoriteClickHandler(this.#handleFavorite);

    const prevPopupComponent = this.#filmPopupComponent;
    this.#filmPopupComponent = new PopupFilmView(film);
    this.#filmPopupComponent.setClosePopupHandler(this.#handleClosePopup);
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
  };

  destroy = () => {
    remove(this.#filmComponent);
    remove(this.#filmPopupComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceClosePopup();
    }
  }

  #replaceOpenPopup = () => {
    this.#removePrevPopupComponent();
    const popup = this.#filmPopupComponent instanceof AbstractView ? this.#filmPopupComponent.element : this.#filmPopupComponent;
    document.body.appendChild(popup);
    document.body.classList.add('hide-overflow');
    document.addEventListener(KEYDOWN, this.#escKeyDownHandler);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceClosePopup = () => {
    const popup = this.#filmPopupComponent instanceof AbstractView ? this.#filmPopupComponent.element : this.#filmPopupComponent;
    document.body.removeChild(popup);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener(KEYDOWN, this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #escKeyDownHandler = (evt) => {
    if(evt.key === ESCAPE || evt.key === ESC) {
      evt.preventDefault();
      this.#replaceClosePopup();
      document.removeEventListener(KEYDOWN, this.#escKeyDownHandler);
      document.body.classList.remove('hide-overflow');
    }
  };

  #handleOpenPopup = () => {
    this.#replaceOpenPopup();
  };

  #handleClosePopup = () => {
    this.#replaceClosePopup();
  };

  #handleWatchlist = () => {
    this.#changeData({...this.#film, isWatchlist: !this.#film.isWatchlist});
  }

  #handleWatched = () => {
    this.#changeData({...this.#film, isWatched: !this.#film.isWatched});
  }

  #handleFavorite = () => {
    this.#changeData({...this.#film, isFavorites: !this.#film.isFavorites});
  }
}
