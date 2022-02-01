//presenter для всей отрисовки доски фильмов
import MessageFilmsListEmptyView from '../view/no-films-view.js';
import ContainerCardsView from '../view/container-card-view.js';
import SortMenuView from '../view/sort-view.js';
import ContainerFilmsView from '../view/container-films-view.js';
import BtnShowMoreView from '../view/btn-show-more.js';

import PopupFilmPresenter from './popup-presenter.js';
import MoviePresenter from './movie-presenter.js';

import {render, RenderPosition, remove} from '../utils/render.js';
import {sortFilmsByDate, sortFilmsByRating} from '../utils/film.js';
import {FILM_COUNT_PER_STEP, UpdateType, UserAction, FilterType, SortType } from '../utils/const.js';
import {filter} from '../utils/filter.js';


const Mode = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE'
};

export default class MovieListPresenter  {
  #siteMainElement = null;
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;
  #filmPopupComponent = null;
  #popupPresenter = null;
  #noFilmComponent = null;
  #mode = Mode.CLOSE;

  #sortMenuFilm = new SortMenuView();
  #filmsListContainer  = new ContainerCardsView();//куда поместим все карточки
  #loadMoreButtonComponent = new BtnShowMoreView();
  #generalContainerFilms = new ContainerFilmsView();


  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmPresenter = new Map();
  #filterType = FilterType.ALL;
  #currentSortType = SortType.DEFAULT;

  //здесь передаем куда этот контейнер надо встроить
  constructor(siteMainElement, filmsModel, commentsModel, filterModel) {
    this.#siteMainElement = siteMainElement;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;

    this.#popupPresenter = new PopupFilmPresenter(
      this.#handleViewAction,
      this.#handleClosePopup
    );
  }

  get films() {
    this.#filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[this.#filterType](films);

    // console.trace(this.#currentSortType);

    switch (this.#currentSortType) {
      case SortType.BY_DATE:
        return filteredFilms.sort(sortFilmsByDate);
      case SortType.BY_RATING:
        return filteredFilms.sort(sortFilmsByRating);
    }
    return filteredFilms;
  }

  //метод инициализации - начала работы модуля
  init = () => {
    console.log('movie list presenter init');
    this.#currentSortType = SortType.DEFAULT;
    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    render(this.#siteMainElement, this.#generalContainerFilms, RenderPosition.BEFOREEND);
    this.#clearFilmList();
    this.#renderBoard();
  }

  destroy = () => {
    this.#clearFilmList();
    remove(this.#sortMenuFilm);
    remove(this.#filmsListContainer);
    remove(this.#generalContainerFilms);
    this.#filmsModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
  }

  #handleViewAction = (actionType, updateType, update) => {
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(updateType, update);
        break;
    }
  }

  #getFilmComments = (film) => this.#commentsModel.comments.filter((comment) => film.comments.includes(comment.id));

  #handleModelEvent = (updateType, data) => {
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)

    console.log('handleModelEvent', { updateType, data });

    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this.#filmPresenter.get(data.id).init(data);
        this.#renderPopup(data);
        break;
      case UpdateType.MINOR: {
        this.#clearFilmList();
        this.#renderFilmsList();
        this.#renderedFilmCount = FILM_COUNT_PER_STEP;
        break;
      }
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this.#clearFilmList();
        this.#renderFilmsList();
        this.#renderedFilmCount = FILM_COUNT_PER_STEP;
        break;
    }
  }

  //получает ссылку на контейнер куда отрисовываем и данные о фильме
  #renderFilm = (film) => {
    const moviePresenter = new MoviePresenter(this.#filmsListContainer, this.#handleViewAction, this.#handleOpenPopup);
    moviePresenter.init(film);
    this.#filmPresenter.set(film.id, moviePresenter);
  }

  #renderPopup = (film) => {
    //Презентер
    if(this.#mode === Mode.OPEN) {
      this.#popupPresenter.init(film, this.#getFilmComments(film));
    }

  }

  #handleOpenPopup = (film) => {
    this.#mode= Mode.OPEN;
/*     console.trace();
    if(this.#popupPresenter){
      this.#popupPresenter.destroy();
    } */



    this.#renderPopup(film);
  };

  #handleClosePopup = () => {
    this.#mode = Mode.CLOSE;
  }


  #renderFilms = (films) => {
    films.forEach((film) => this.#renderFilm(film));
  }

  #clearFilmList = () => {
    console.log('clearFilmList');
/*     if(this.#popupPresenter){
      this.#popupPresenter.destroy();
    } */
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this.#loadMoreButtonComponent);
    // this.#currentSortType = SortType.DEFAULT;
    this.#handleClosePopup();
  }

  #renderNoFilms = () => {
    this.#noFilmComponent = new MessageFilmsListEmptyView(this.#filterType);
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
    this.#sortMenuFilm.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#siteMainElement, this.#sortMenuFilm, RenderPosition.AFTERBEGIN); //сортировка
  }

  #handleSortTypeChange = (sortType) => {
    console.log({ sortType });
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
    console.log('renderFilmsList');
    render(this.#generalContainerFilms, this.#filmsListContainer, RenderPosition.BEFOREEND);
    const filmCount = this.films.length;
    const films = this.films.slice(0, Math.min(filmCount, FILM_COUNT_PER_STEP));
    this.#renderFilms(films);
    if (filmCount > this.#renderedFilmCount) {
      this.#renderShowMoreButton();
    }
  }

  #renderBoard = () => {
    console.log('renderBoard');
    if (this.films.length === 0) {
      this.#renderNoFilms();
      return;
    }
    this.#renderSortMenuFilm();
    this.#renderFilmsList();
  }
}
