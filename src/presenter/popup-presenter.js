import PopupFilmView from '../view/film-details-popup-view.js';
import {render, RenderPosition, remove, replace} from '../utils/render.js';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';
import { FilmComment, getRandomAuthor } from '../mock/comments.js';
import { isEscapeKey } from '../utils/common.js';
import { UpdateType, UserAction } from '../utils/const.js';


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
    const prevFilmPopupComponent = this.#filmPopupComponent;

    this.#filmPopupComponent = new PopupFilmView(this.#film, this.#comments);
    this.#filmPopupComponent.setClosePopupHandler(this.#handleClosePopup);
    this.#filmPopupComponent.setWatchlistClickHandler(this.#watchlistClickHandler);
    this.#filmPopupComponent.setWatchedClickHandler(this.#watchedClickHandler);
    this.#filmPopupComponent.setFavoriteClickHandler(this.#favoriteClickHandler);
    this.#filmPopupComponent.setDeleteCommentHandler(this.#deleteCommentClickHandler);
    this.#filmPopupComponent.setSubmitCommentHandler(this.#handlerCommentFormSubmit);


    if(prevFilmPopupComponent === null){
      document.body.classList.add('hide-overflow');
      document.addEventListener('keydown', this.#escKeyDownHandler);
      render(document.body, this.#filmPopupComponent, RenderPosition.BEFOREEND);
      return;
    }
    const scrollTop = prevFilmPopupComponent.element.scrollTop;//скролл использовать через функцию updateElement из Smarts class
    replace(this.#filmPopupComponent, prevFilmPopupComponent);
    this.#filmPopupComponent.element.scrollTop = scrollTop;
    remove(prevFilmPopupComponent);
  }


  destroy = () => {
    this.#handleClosePopup();
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

  // add comment
  #handlerCommentFormSubmit = ({ emotion, comment }) => {
    const filmComment = new FilmComment({
      id: nanoid(),
      author: getRandomAuthor(),
      comment,
      date: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
      emotion
    });

    // update comments
    this.#handleCommentChange(
      UserAction.ADD_COMMENT,
      filmComment
    );
    // update film
    this.#handleFilmChange(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {
        ...this.#film,
        comments: [...this.#film.comments, filmComment.id]
      }
    );
  }

  #handleClosePopup = () => {
    document.body.classList.remove('hide-overflow');
    remove(this.#filmPopupComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#filmPopupComponent = null;
  };

  #escKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#handleClosePopup();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };
}


