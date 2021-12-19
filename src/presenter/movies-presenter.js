//presenter для всей отрисовки доски фильмов
import FilterView from './view/site-menu-view.js';
import StatisticsView from './view/statistic-view.js';
import ProfileRatingView from './view/profile-rating-view.js';
import SortMenuView from './view/sort-view.js';
import MessageFilmsListEmptyView from './view/no-films-view.js';

export default class MoviesBoardPresenter {

  #filmsContainer = null;

  #filterComponent = new FilterView();
  #statisticsComponent = new StatisticsView();
  #profileRatingComponent = new ProfileRatingView();
  #sortMenuComponent = new SortMenuView();
  #noFilmComponent = new MessageFilmsListEmptyView();

  #boardFilms = []; //фильмы

  //здесь передаем куда этот контейнер надо встроить
  constructor(boardFilmdContainer) {
    this.#boardFilmdContainer = boardFilmdContainer;
  }


  //метод инициализации - начала работы модуля
  init = (boardFilms) => {
    this.#boardFilms = [...boardFilms];
  }

  #renderFilter = () => {
    //метод для отрисовки фильтра - меню
  }

  #renderSortMenu = () => {
    //метод отрисовки сортировки
  }

  #renderProfileRating = () => {
    //отрисовка рейтинга пользователя
  }

  #renderNoFilms = () => {
    //отрисовка заглушки если нет фильмов
  }

  #renderLoadMoreButton = () => {
    //отрисовка кнопки допоказа фильмов
  }

  #renderStatistics = () => {
    //отрисовка статистики
  }

  #renderFilm = () => {
    //отрисовка одного фильма
  }


  #renderFilms = () => {
    //отрисовка № фильмов за раз
  }
}

