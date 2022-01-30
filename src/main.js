import { generateCardFilm } from './mock/film.js';
import { generateComments } from './mock/comments.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
import FilterModel from './model/filter-model.js';
import StatisticsView from './view/statistic-view.js';
import ProfileRatingView from './view/profile-rating-view.js';
import MovieListPresenter from './presenter/movie-list-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import { render, RenderPosition } from './utils/render.js';
import { FILM_CARD_COUNT, MenuItem } from './utils/const.js';
import MainNavView from './view/main-nav-view.js';

const films = Array.from({length: FILM_CARD_COUNT}, generateCardFilm);
const filmsModel = new FilmsModel();
filmsModel.films = films;

const filterModel = new FilterModel();
const siteMainElement = document.querySelector('.main');
const headerMainElement = document.querySelector('.header');

const siteMenuComponent = new MainNavView();
render(siteMainElement, siteMenuComponent, RenderPosition.BEFOREBEGIN);

const profileRatingView = new ProfileRatingView();

render(headerMainElement, profileRatingView.element, RenderPosition.BEFOREEND); //звание пользователя

const commentsModel = new CommentsModel();
commentsModel.comments = generateComments(films);

const movieListPresenter = new MovieListPresenter(siteMainElement, filmsModel, commentsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMenuComponent, filterModel, filmsModel);

filterPresenter.init();
movieListPresenter.init();

//render(siteHeaderElement, siteMenuComponent, RenderPosition.BEFOREEND);

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ALL_MOVIES:
      // Скрыть статистику
      // Показать фильтры
      // Показать доску
      // Показать форму добавления новой задачи
      // Убрать выделение с ADD NEW TASK после сохранения
      break;
    case MenuItem.WATCHLIST:
      // Показать фильтры
      // Показать доску
      // Скрыть статистику
      break;
    case MenuItem.HISTORY:
      // Скрыть фильтры
      // Скрыть доску
      // Показать статистику
      break;
    case MenuItem.FAVORITES:
      // Скрыть фильтры
      // Скрыть доску
      // Показать статистику
      break;
    case MenuItem.STATS:
      filterPresenter.destroy();
      movieListPresenter.destroy();
      // Показать статистику
      break;
  }
};

//siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

const footerMainElement = document.querySelector('.footer');
const statisticsView = new StatisticsView();
const footerStatisticsElement = footerMainElement.querySelector('.footer__statistics');
render(footerStatisticsElement, statisticsView.element, RenderPosition.BEFOREEND);
