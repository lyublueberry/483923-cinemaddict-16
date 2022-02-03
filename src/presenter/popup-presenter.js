import PopupFilmView from '../view/film-details-popup-view.js';
import {render, RenderPosition, remove, replace} from '../utils/render.js';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { FilmComment, getRandomAuthor } from '../mock/comments.js';
import { isEscapeKey } from '../utils/common.js';
import { BACKEND_DATE_FORMAT, UpdateType, UserAction } from '../utils/const.js';



export default class PopupFilmPresenter {
  #popupCloseHandler = null;
  #film = null;
  #filmPopupComponent = null;
  #changeData = null;
  #handleFilmChange = null;
  // #handleCommentChange = null;
  #comments = null;

  constructor(changeData, popupCloseHandler) {
    this.#popupCloseHandler = popupCloseHandler;
    /* this.#film = film; */
    this.#changeData = changeData;
    //this.#handleCommentChange = handleCommentChange;
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
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      {...this.#film, isWatchlist: !this.#film.isWatchlist}
    );
  }

  #watchedClickHandler = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      {...this.#film,
        isWatched: !this.#film.isWatched,
        watchingDate: !this.#film.isWatched ? null : dayjs.utc().format(BACKEND_DATE_FORMAT)}
    );
  }

  #favoriteClickHandler = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      {...this.#film, isFavorites: !this.#film.isFavorites}
    );
  }

  #deleteCommentClickHandler = (filmId, commentId) => {
    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      commentId
    );

    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
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
      date: dayjs.utc().format(BACKEND_DATE_FORMAT),
      emotion
    });

    // update comments
    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      filmComment
    );

    // update film
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
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
    this.#popupCloseHandler();
  };

  #escKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#handleClosePopup();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };
}


