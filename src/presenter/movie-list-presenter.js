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

import PopupFilmView from '../view/film-details-popup-view.js';

import MoviePresenter from './movie-presenter.js';

const FILM_COUNT_PER_STEP = 5;

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

const KEYDOWN = 'keydown';
const ESCAPE = 'Escape';
const ESC = 'Esc';
export default class MovieListPresenter  {
  #siteMainElement = null;
  #filmsModel = null;

  #filmPopupComponent = null;
  #sortMenuFilm = new SortMenuView();
  #noFilmComponent = new MessageFilmsListEmptyView();
  #filmsListContainer  = new ContainerCardsView();//куда поместим все карточки
  #loadMoreButtonComponent  = new BtnShowMoreView();
  #generalContainerFilms = new ContainerFilmsView();

  //#listFilms = []; //фильмы
  #filters = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmPresenter = new Map();

  #currentSortType = SortType.DEFAULT;
  //#sourcedListFilms = [];

  //здесь передаем куда этот контейнер надо встроить
  constructor(siteMainElement, filmsModel) {
    this.#siteMainElement = siteMainElement;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
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
      case UserAction.ADD_COMMENT:
        this.#filmsModel.addFilm(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#filmsModel.deleteFilm(updateType, update);
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
      case UpdateType.MINOR:
        this.#filmPresenter.get(data.id).init(data);
        // - обновить список (например, когда задача ушла в архив)
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        break;
    }
  }

  //метод инициализации - начала работы модуля
  init = (listFilms, filters) => {
    //this.#listFilms = [...listFilms];
    this.#filters = [...filters];

    //this.#sourcedListFilms = [...listFilms];

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
    let scrollTop;
    if(this.#filmPopupComponent) {
      scrollTop = this.#filmPopupComponent.element.scrollTop;
      this.#replaceClosePopup();
    }
    this.#filmPopupComponent = new PopupFilmView(film);
    this.#filmPopupComponent.setClosePopupHandler(this.#handleClosePopup);
    document.body.classList.add('hide-overflow');
    document.body.appendChild(this.#filmPopupComponent.element);
    document.addEventListener(KEYDOWN, this.#escKeyDownHandler);
    this.#filmPopupComponent.setWatchlistClickHandler(this.#watchlistClickHandler);
    this.#filmPopupComponent.setWatchedClickHandler(this.#watchedClickHandler);
    this.#filmPopupComponent.setFavoriteClickHandler(this.#favoriteClickHandler);
    this.#filmPopupComponent.element.scrollTop = scrollTop;
  }

  #watchlistClickHandler = (film) => {
    const updateFilm = {...film, isWatchlist: !film.isWatchlist};
    this.#handleFilmChange(updateFilm);
    this.#renderPopup(updateFilm);
  }

  #watchedClickHandler = (film) => {
    const updateFilm = {...film, isWatched: !film.isWatched};
    this.#handleFilmChange(updateFilm);
    this.#renderPopup(updateFilm);
  }

  #favoriteClickHandler = (film) => {
    const updateFilm = {...film, isFavorites: !film.isFavorites};
    this.#handleFilmChange(updateFilm);
    this.#renderPopup(updateFilm);
  }

  #handleOpenPopup = (film) => {
    if(this.#filmPopupComponent){
      this.#replaceClosePopup();
    }
    this.#renderPopup(film);
  };

  #escKeyDownHandler = (evt) => {
    if(evt.key === ESCAPE || evt.key === ESC) {
      evt.preventDefault();
      this.#replaceClosePopup();
      document.removeEventListener(KEYDOWN, this.#escKeyDownHandler);
    }
  };

  #replaceClosePopup = () => {
    document.body.classList.remove('hide-overflow');
    remove(this.#filmPopupComponent);
    document.removeEventListener(KEYDOWN, this.#escKeyDownHandler);
    this.#filmPopupComponent = null;
  };

  #handleClosePopup = () => {
    this.#replaceClosePopup();
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

    if (this.#renderedFilmCount >= this.filmCount) {
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
    if (filmCount > FILM_COUNT_PER_STEP) {
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
