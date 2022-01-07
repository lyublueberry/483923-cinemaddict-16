//presenter для всей отрисовки доски фильмов
import MessageFilmsListEmptyView from '../view/no-films-view.js';
import ContainerCardsView from '../view/container-card-view.js';
import BtnShowMoreView from '../view/btn-show-more.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import FilterView from '../view/site-menu-view.js';
import SortMenuView from '../view/sort-view.js';
import ContainerFilmsView from '../view/container-films-view.js';

import MoviePresenter from './movie-presenter.js';

const FILM_COUNT_PER_STEP = 5;

export default class MovieListPresenter  {
  #siteMainElement = null;

  #sortMenuFilm = new SortMenuView();
  #noFilmComponent = new MessageFilmsListEmptyView();
  #filmsListContainer  = new ContainerCardsView();//куда поместим все карточки
  #loadMoreButtonComponent  = new BtnShowMoreView();
  #generalContainerFilms = new ContainerFilmsView();

  #listFilms = []; //фильмы
  #filters = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmPresenter = new Map();

  //здесь передаем куда этот контейнер надо встроить
  constructor(siteMainElement) {
    this.#siteMainElement = siteMainElement;
  }

  //метод инициализации - начала работы модуля
  init = (listFilms, filters) => {
    this.#listFilms = [...listFilms];
    this.#filters = [...filters];
    render(this.#siteMainElement, this.#generalContainerFilms, RenderPosition.BEFOREEND);
    this.#renderBoard();
    render(this.#siteMainElement, new FilterView(filters), RenderPosition.AFTERBEGIN); //меню
  }

  //получает ссылку на контейнер куда отрисовываем и данные о фильме
  #renderFilm = (film) => {
    const moviePresenter = new MoviePresenter(this.#filmsListContainer);
    moviePresenter.init(film);
    this.#filmPresenter.set(film.id, moviePresenter);
  }

  #renderFilms = (from, to) => {
    this.#listFilms.slice(from, to).forEach((film) => this.#renderFilm(film));
  }

  #clearFilmsList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this.#loadMoreButtonComponent);
  }

  #renderNoFilms = () => {
    render(this.#filmsListContainer, this.#noFilmComponent, RenderPosition.BEFOREEND);
  }

  #loadMoreButtonClickHandler = () => {
    this.#listFilms.slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => this.#renderFilm(film));
    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#listFilms.length) {
      remove(this.#loadMoreButtonComponent);
    }
  }

  handleFilmCHange = (updateFilm) => {
    this.#listFilms = updateFilm(this.#listFilms, updateFilm);
    this.#filmPresenter.get(updateFilm.id).init(updateFilm);
  }

  #renderShowMoreButton = () => {
    render(this.#filmsListContainer, this.#loadMoreButtonComponent, RenderPosition.BEFOREEND);
    this.#loadMoreButtonComponent.setClickHandler(this.#loadMoreButtonClickHandler);
  }

  #renderSortMenuFilm = () => {
    render(this.#siteMainElement, this.#sortMenuFilm, RenderPosition.AFTERBEGIN); //сортировка
  }

  #renderFilmsList = () => {
    render(this.#generalContainerFilms, this.#filmsListContainer, RenderPosition.BEFOREEND);
    this.#renderFilms(0, Math.min(this.#listFilms.length, FILM_COUNT_PER_STEP));
    if (this.#listFilms.length > FILM_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  }

  #renderBoard = () => {
    if (this.#listFilms.length === 0) {
      this.#renderNoFilms();
    }
    this.#renderSortMenuFilm();
    this.#renderFilmsList();
  }
}
