import PopupFilmView from '../view/film-details-popup-view.js';
import {render, RenderPosition, remove, replace} from '../utils/render.js';

const KEYDOWN = 'keydown';
const ESCAPE = 'Escape';
const ESC = 'Esc';

const UserAction = {
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
  UPDATE_FILM: 'UPDATE_FILM',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export default class PopupFilmPresenter {
  #film = null;
  #filmPopupComponent = null;
  #changeFilm = null;
  #handleFilmChange = null;
  #handleCommentChange = null;
  #comments = null;

  constructor(film, handleFilmChange, handleCommentChange) {
    this.#film = film;
    this.#handleFilmChange = handleFilmChange;
    this.#handleCommentChange = handleCommentChange;
  }

  init = (film, comments) => {
    this.#film = film;
    this.#comments = comments;
    this.#renderPopup();
  }

  #renderPopup = () => {
    const prevFilmPopupComponent = this.#filmPopupComponent;

    console.log(this.#film, this.#comments);

    this.#filmPopupComponent = new PopupFilmView(this.#film, this.#comments);
    this.#filmPopupComponent.setClosePopupHandler(this.#handleClosePopup);
    this.#filmPopupComponent.setWatchlistClickHandler(this.#watchlistClickHandler);
    this.#filmPopupComponent.setWatchedClickHandler(this.#watchedClickHandler);
    this.#filmPopupComponent.setFavoriteClickHandler(this.#favoriteClickHandler);
    this.#filmPopupComponent.setDeleteCommentHandler(this.#deleteCommentClickHandler);

    if(prevFilmPopupComponent === null){
      document.body.classList.add('hide-overflow');
      document.addEventListener(KEYDOWN, this.#escKeyDownHandler);
      render(document.body, this.#filmPopupComponent, RenderPosition.BEFOREEND);
      return;
    }
    const scrollTop = prevFilmPopupComponent.element.scrollTop;
    replace(this.#filmPopupComponent, prevFilmPopupComponent);
    this.#filmPopupComponent.element.scrollTop = scrollTop;
    remove(prevFilmPopupComponent);
  }

  destroy = () => {
    this.#replaceClosePopup();
  };

  #watchlistClickHandler = () => {
    this.#handleFilmChange(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, isWatchlist: !this.#film.isWatchlist}
    );
  }

  #watchedClickHandler = () => {
    this.#handleFilmChange(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, isWatched: !this.#film.isWatched}
    );
  }

  #favoriteClickHandler = () => {
    this.#handleFilmChange(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, isFavorites: !this.#film.isFavorites}
    );
  }

  #deleteCommentClickHandler = (filmId, commentId) => {
    this.#handleCommentChange(
      UserAction.DELETE_COMMENT,
      commentId
    );

    this.#handleFilmChange(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {
        ...this.#film,
        comments: this.#film.comments.filter((filmCommentId) => filmCommentId !== commentId)
      }
    );
  };

  #handleClosePopup = () => {
    this.#replaceClosePopup();
  };

  #replaceClosePopup = () => {
    document.body.classList.remove('hide-overflow');
    remove(this.#filmPopupComponent);
    document.removeEventListener(KEYDOWN, this.#escKeyDownHandler);
    this.#filmPopupComponent = null;
  };

  #escKeyDownHandler = (evt) => {
    if(evt.key === ESCAPE || evt.key === ESC) {
      evt.preventDefault();
      this.#replaceClosePopup();
      document.removeEventListener(KEYDOWN, this.#escKeyDownHandler);
    }
  };
}


