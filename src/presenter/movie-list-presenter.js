//presenter для всей отрисовки доски фильмов
import FilterView from './view/site-menu-view.js';
import StatisticsView from './view/statistic-view.js';
import ProfileRatingView from './view/profile-rating-view.js';
import SortMenuView from './view/sort-view.js';
import MessageFilmsListEmptyView from './view/no-films-view.js';
import ContainerCardsView from './view/container-card-view.js';
import BtnShowMoreView from './view/btn-show-more.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import MoviePresenter from './movie-presenter.js';

const FILM_COUNT_PER_STEP = 5;

export default class MovieListPresenter  {

  #filmsContainer = null;

  #filterComponent = new FilterView();
  #profileRatingComponent = new ProfileRatingView();
  #sortMenuComponent = new SortMenuView();
  #noFilmComponent = new MessageFilmsListEmptyView();
  #filmsListContainer  = new ContainerCardsView();
  #loadMoreButtonComponent  = new BtnShowMoreView();

  #films = []; //фильмы

  #renderedFilmCount = FILM_COUNT_PER_STEP;

  //здесь передаем куда этот контейнер надо встроить
  constructor(filmsListContainer) {
    this.#filmsListContainer = filmsListContainer;
  }

  //метод инициализации - начала работы модуля
  init = (films) => {
    this.#films = [...films];

    render (this.#filmsContainer, this.#filmComponent, RenderPosition.BEFOREEND);
    render (this.#filmComponent, this.filmsListContainer, RenderPosition.BEFOREEND);

    this.#renderFilmsBoard;
  }

  #renderFilter = () => {
    //метод для отрисовки фильтра - меню
    render(this.#filmComponent, this.#filterComponent, RenderPosition.AFTERBEGIN); //меню
  }

  #renderSortMenu = () => {
    //метод отрисовки сортировки
    render(this.#filmComponent, this.#sortMenuComponent, RenderPosition.AFTEREND); //сортировка
  }

  #renderProfileRating = () => {
    //отрисовка рейтинга пользователя
    render(this.#filmComponent, this.#profileRatingComponent, RenderPosition.BEFOREEND); //звание пользователя
  }

  #renderNoFilms = () => {
    render(this.#filmComponent, this.#noFilmComponent, RenderPosition.BEFOREEND);
  }

  #renderFilm = (film) => {
    //отрисовка одного фильма
    const filmPresenter = new MoviePresenter(this.#filmsListContainer);
    filmPresenter.init(film);
  }

  #renderFilms = (from, to) => {
    //отрисовка № фильмов за раз
    this.#films.slice(from, to).forEach((film) => this.#renderFilm(film));
  }

  #handleLoadMoreButtonClick = () => {
    this.#renderFilms(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#films.length) {
      remove(this.#loadMoreButtonComponent);
    }
  }

  #renderLoadMoreButton = () => {
    render(this.#filmsListContainer, this.#loadMoreButtonComponent, RenderPosition.BEFOREEND);

    this.#loadMoreButtonComponent.setClickHandler(this.#handleLoadMoreButtonClick);
  }

  #renderFilmList = () => {
    this.#renderFilms(0, Math.min(this.#films.length, FILM_COUNT_PER_STEP));

    if (this.#films.length > FILM_COUNT_PER_STEP) {
      this.#renderLoadMoreButton();
    }
  }

  #renderFilmsBoard = () => {
    if (this.#films.length === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSortMenu();
    this.#renderFilter();
    this.#renderProfileRating();
    this.#renderFilmList();
  }


}

