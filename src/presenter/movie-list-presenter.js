//presenter для всей отрисовки доски фильмов
import MessageFilmsListEmptyView from '../view/no-films-view.js';
import ContainerCardsView from '../view/container-card-view.js';
import BtnShowMoreView from '../view/btn-show-more.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import FilterView from '../view/site-menu-view.js';
import SortMenuView from '../view/sort-view.js';
import ContainerFilmsView from '../view/container-films-view.js';
import {sortFilmsByDate, sortFilmsByRating} from '../utils/film.js';
import {SortType} from '../view/sort-view.js';

import PopupFilmPresenter from './popup-presenter.js';

import MoviePresenter from './movie-presenter.js';

const FILM_COUNT_PER_STEP = 5;

const UserAction = {
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
  UPDATE_FILM: 'UPDATE_FILM',
};
//patch - добавление/удаелние комментариев
//minor - добавление/удаление фильма в избранное и др.
//major - переключение фильтров
const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

/* const KEYDOWN = 'keydown';
const ESCAPE = 'Escape';
const ESC = 'Esc'; */
export default class MovieListPresenter  {
  #siteMainElement = null;
  #filmsModel = null;
  #commentsModel = null;

  #filmPopupComponent = null;
  #sortMenuFilm = new SortMenuView();
  #noFilmComponent = new MessageFilmsListEmptyView();
  #filmsListContainer  = new ContainerCardsView();//куда поместим все карточки
  #loadMoreButtonComponent = new BtnShowMoreView();
  #generalContainerFilms = new ContainerFilmsView();

  #popupPresenter = null;

  //#listFilms = []; //фильмы
  #filters = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmPresenter = new Map();

  #currentSortType = SortType.DEFAULT;
  //#sourcedListFilms = [];

  //здесь передаем куда этот контейнер надо встроить
  constructor(siteMainElement, filmsModel, commentsModel) {
    this.#siteMainElement = siteMainElement;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;

  }

  #handleViewAction = (actionType, updateType, update) => {
    console.log(actionType, updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update);
        break;
    }
  }

  #handleCommentChange = (actionType, data) => {
    console.log('handleCommentChange', { actionType, data });
    switch (actionType) {
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(actionType, data);
        break;
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(actionType, data);
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    console.log(updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)

    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)

        break;
      case UpdateType.MINOR: {
        this.#filmPresenter.get(data.id).init(data);
        console.log(data);

        const allComments = this.#commentsModel.comments;
        const filmCommentsIds = data.comments;
        const comments = allComments.filter((comment) => filmCommentsIds.includes(comment.id));

        if(this.#popupPresenter){
          this.#popupPresenter.init(data, comments);
        }
        // - обновить список (например, когда задача ушла в архив)
        break;
      }
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        break;
    }
  }

  #handleCommentsModelEvent = (actionType, data) => {
    console.log('handleCommentsModelEvent', {
      actionType,
      data
    });
  };

  //метод инициализации - начала работы модуля
  init = (filters) => {
    this.#filters = [...filters];
    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleCommentsModelEvent);

    render(this.#siteMainElement, this.#generalContainerFilms, RenderPosition.BEFOREEND);
    this.#renderBoard();
    render(this.#siteMainElement, new FilterView(filters), RenderPosition.AFTERBEGIN); //меню
  }

  get films() {
    switch (this.#currentSortType) {
      case SortType.BY_DATE:
        return [...this.#filmsModel.films].sort(sortFilmsByDate);
      case SortType.BY_RATING:
        return [...this.#filmsModel.films].sort(sortFilmsByRating);
    }
    return this.#filmsModel.films;
  }

  //получает ссылку на контейнер куда отрисовываем и данные о фильме
  #renderFilm = (film) => {
    const moviePresenter = new MoviePresenter(this.#filmsListContainer, this.#handleViewAction, this.#handleOpenPopup);
    moviePresenter.init(film);
    this.#filmPresenter.set(film.id, moviePresenter);
  }

  #renderPopup = (film) => {
    //Презентер
    const allComments = this.#commentsModel.comments;
    const filmCommentsIds = film.comments;
    const comments = allComments.filter((comment) => filmCommentsIds.includes(comment.id));

    this.#popupPresenter.init(film, comments);
  }

  #handleOpenPopup = (film) => {
    if(this.#popupPresenter){
      this.#popupPresenter.destroy();
    }

    this.#popupPresenter = new PopupFilmPresenter(
      film,
      this.#handleViewAction,
      this.#handleCommentChange
    );

    this.#renderPopup(film);
  };

  #renderFilms = (films) => {
    films.forEach((film) => this.#renderFilm(film));
  }

  #clearFilmList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this.#loadMoreButtonComponent);
  }

  #renderNoFilms = () => {
    render(this.#filmsListContainer, this.#noFilmComponent, RenderPosition.BEFOREEND);
  }

  #handleLoadMoreButtonClick  = () => {
    const filmCount = this.films.length;
    const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmCount);
    this.#renderFilms(films);
    this.#renderedFilmCount = newRenderedFilmCount;

    if (this.#renderedFilmCount >= filmCount) {
      remove(this.#loadMoreButtonComponent);
    }
  }

  //обработчик изменений
  #handleFilmChange = (updateFilm) => {
    this.#filmPresenter.get(updateFilm.id).init(updateFilm);
  }

  #renderShowMoreButton = () => {
    render(this.#filmsListContainer, this.#loadMoreButtonComponent, RenderPosition.BEFOREEND);
    this.#loadMoreButtonComponent.setClickHandler(this.#handleLoadMoreButtonClick);
  }

  #renderSortMenuFilm = () => {
    render(this.#siteMainElement, this.#sortMenuFilm, RenderPosition.AFTERBEGIN); //сортировка
    this.#sortMenuFilm.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #handleSortTypeChange = (sortType) => {
    // - Сортируем
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    // - Очищаем список
    // - Рендерим список заново
    this.#clearFilmList();
    this.#renderFilmsList();
  }

  #renderFilmsList = () => {
    render(this.#generalContainerFilms, this.#filmsListContainer, RenderPosition.BEFOREEND);
    const filmCount = this.films.length;
    const films = this.films.slice(0, Math.min(filmCount, FILM_COUNT_PER_STEP));
    this.#renderFilms(films);
    if (filmCount > this.#renderedFilmCount) {
      this.#renderShowMoreButton();
    }
  }

  #renderBoard = () => {
    if (this.films.length === 0) {
      this.#renderNoFilms();
    } else {
      this.#renderSortMenuFilm();
    }
    this.#renderFilmsList();
  }
}
