import CardFilmView from '../view/card-view.js';
import { remove, render, RenderPosition, replace } from '../utils/render.js';
import { UpdateType, UserAction } from '../utils/const.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export default class MoviePresenter {
  #filmListContainer = null;
  #handleOpenPopup = null;
  #filmComponent = null;
  #film = null;
  #changeData = null;
  #prevFilmCardComponent = null;

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

    if (this.#prevFilmCardComponent === null) {
      render(this.#filmListContainer.container, this.#filmComponent, RenderPosition.BEFOREEND);
    }
    else {
      replace(this.#filmComponent, this.#prevFilmCardComponent);
    }
    this.#prevFilmCardComponent = this.#filmComponent;
  };

  //удалить компоненты
  destroy = () => {
    console.log('destroy movie compnent');
    remove(this.#filmComponent);
  };

  #handleWatchlist = () => {
    this.#changeData(UserAction.UPDATE_FILM, UpdateType.PATCH, {...this.#film, isWatchlist: !this.#film.isWatchlist});
  }

  #handleWatched = () => {
    this.#changeData(UserAction.UPDATE_FILM, UpdateType.PATCH, {
      ...this.#film,
      isWatched: !this.#film.isWatched,
      watchingDate: !this.#film.isWatched ? null : dayjs.utc().format('YYYY-MM-DDTHH:mm:SSSZ')
    });
  }

  #handleFavorite = () => {
    this.#changeData(UserAction.UPDATE_FILM, UpdateType.PATCH, {...this.#film, isFavorites: !this.#film.isFavorites});
  }
}
