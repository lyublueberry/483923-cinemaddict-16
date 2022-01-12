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

    if (this.#mode === Mode.EDITING) {
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
    document.body.classList.add('hide-overflow');
    document.body.appendChild(this.#filmPopupComponent.element);
    document.addEventListener(KEYDOWN, this.#escKeyDownHandler);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceClosePopup = () => {
    document.body.classList.remove('hide-overflow');
    document.body.removeChild(this.#filmPopupComponent.element);
    document.removeEventListener(KEYDOWN, this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #escKeyDownHandler = (evt) => {
    if(evt.key === ESCAPE || evt.key === ESC) {
      evt.preventDefault();
      this.#replaceClosePopup();
      document.removeEventListener(KEYDOWN, this.#escKeyDownHandler);
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
