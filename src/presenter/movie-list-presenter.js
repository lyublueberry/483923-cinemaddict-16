//presenter для всей отрисовки доски фильмов
import MessageFilmsListEmptyView from './view/no-films-view.js';
import ContainerCardsView from './view/container-card-view.js';
import BtnShowMoreView from './view/btn-show-more.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import FilterView from './view/site-menu-view.js';
import SortMenuView from './view/sort-view.js';
import MoviePresenter from './movie-presenter.js';

const FILM_COUNT_PER_STEP = 5;

export default class MovieListPresenter  {
  #siteMainElement = null;
  #filmsListContainerElement = null;
  #filmsListElement = null;

  #sortMenuFilm = new SortMenuView();
  #noFilmComponent = new MessageFilmsListEmptyView();
  #filmsListContainer  = new ContainerCardsView();
  #loadMoreButtonComponent  = new BtnShowMoreView();

  #listFilms = []; //фильмы
  #filters = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmPresenter = new Map();

  //здесь передаем куда этот контейнер надо встроить
  constructor(siteMainElement, filmsListContainerElement, filmsListElement) {
    this.#siteMainElement = siteMainElement;
    this.#filmsListContainerElement = filmsListContainerElement;
    this.#filmsListElement = filmsListElement;
  }

  //метод инициализации - начала работы модуля
  init = (listFilms, filters) => {
    this.#listFilms = [...listFilms];
    this.#filters = [...filters];

    render (this.#siteMainElement, this.#filmsListContainer, RenderPosition.BEFOREEND);//контейнер куда поместим карточки фильмов
    render(this.#siteMainElement, new FilterView(filters), RenderPosition.AFTERBEGIN); //меню

    this.#renderFilmsBoard();
  };

  #renderNoFilms = () => {
    render(this.#filmsListContainer, this.#noFilmComponent, RenderPosition.BEFOREEND);
  };

  #renderFilm = (film) => {
    //отрисовка одного фильма
    const filmPresenter = new MoviePresenter(this.#filmsListContainer);
    filmPresenter.init(film);
    this.#filmPresenter.set(filmPresenter);
  };

  #renderFilms = (from, to) => {
    //отрисовка № фильмов за раз
    this.#listFilms.slice(from, to).forEach((film) => this.#renderFilm(film));
  };

  #renderFilmList = () => {
    for (let i = 0; i < Math.min(this.#listFilms.length, FILM_COUNT_PER_STEP); i++) {
      this.#renderFilms(this.#filmsListContainerElement, this.#listFilms[i]); //карточки фильмов
    }
  };

  #renderSortMenuFilm = () => {
    render(this.#siteMainElement, this.#sortMenuFilm, RenderPosition.AFTEREND); //сортировка
  };

  #renderShowMoreButton = () => {
    render(this.#filmsListElement, this.#loadMoreButtonComponent, RenderPosition.BEFOREEND);

    this.#loadMoreButtonComponent.setClickHandler(this.#setClickHandler);
  };

  #setClickHandler = () => {
    this.#listFilms.slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP).forEach((film) => this.#renderFilm(this.#filmsListContainerElement,film));
    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#listFilms.length) {
      remove(this.#loadMoreButtonComponent);
    }
  };

  #renderFilmsBoard = () => {
    if(this.#listFilms.length === 0) {
      this.#renderNoFilms();
      this.#renderFilmList();
    }
    else {
      this.#renderSortMenuFilm();
    }
    if (this.#listFilms.length > FILM_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  };

}
