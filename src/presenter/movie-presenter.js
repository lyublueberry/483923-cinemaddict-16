import CardFilmView from '../view/card-view.js';
import { remove, render, RenderPosition } from '../utils/render.js';

export default class MoviePresenter {
  #filmListContainer = null;
  #handleOpenPopup = null;

  #filmComponent = null;
  #filmPopupComponent = null;

  #film = null;
  #changeData = null;

  constructor(filmListContainer, changeData, handleOpenPopup) {
    this.#filmListContainer = filmListContainer;
    this.#changeData = changeData;
    this.#handleOpenPopup = handleOpenPopup;
  }

  init = (film) => {
    this.#film = film;

    this.#filmComponent = new CardFilmView(film);
    this.#filmComponent.setOpenPopupHandler(this.#handleOpenPopup);
    this.#filmComponent.setWatchlistClickHandler(this.#handleWatchlist);
    this.#filmComponent.setWatchedClickHandler(this.#handleWatched);
    this.#filmComponent.setFavoriteClickHandler(this.#handleFavorite);
    render(this.#filmListContainer.container, this.#filmComponent, RenderPosition.BEFOREEND);

/*
    if (prevFilmCardComponent === null || prevPopupComponent === null) {
      return;
    } */

/*     if (this.#mode === Mode.DEFAULT) {
      replace(this.#filmComponent, prevFilmCardComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#filmPopupComponent, prevPopupComponent);
    } */
  };

  //удалить компоненты
  destroy = () => {
    remove(this.#filmComponent);
    remove(this.#filmPopupComponent);
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
