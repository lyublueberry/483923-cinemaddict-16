import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

// Utils
import {FILM_CARD_COUNT,  FilterType,  MenuItem} from './utils/const.js';
import {render, RenderPosition} from './utils/render.js';

// Mocks
import {generateCardFilm} from './mock/film.js';
import {generateComments} from './mock/comments.js';

// Models
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
import FilterModel from './model/filter-model.js';

// Views
import ProfileRatingView from './view/profile-rating-view.js';
import MainNavView from './view/main-nav-view.js';
import FooterStatisticsView from './view/footer-statistic-view.js';

// Presenters
import MovieListPresenter from './presenter/movie-list-presenter.js';
import StaticticPresenter from './presenter/statistic-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

// Config
dayjs.extend(utc);

// Models
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();

// Make data
filmsModel.films = Array.from({ length: FILM_CARD_COUNT }, generateCardFilm);
commentsModel.comments = generateComments(filmsModel.films);

// Elements
const siteMainElement = document.querySelector('.main');
const headerMainElement = document.querySelector('.header');
const footerMainElement = document.querySelector('.footer');
const footerStatisticsElement = footerMainElement.querySelector('.footer__statistics');

// Components
const siteMenuComponent = new MainNavView();
const profileRatingComponent = new ProfileRatingView();
const footerStaticticComponent = new FooterStatisticsView(filmsModel.films.length);

// Presenters
const movieListPresenter = new MovieListPresenter(siteMainElement, filmsModel, commentsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMenuComponent, filterModel, filmsModel);
const statisticPresenter = new StaticticPresenter(siteMainElement, filmsModel);

// Handlers
const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case FilterType.ALL:
    case FilterType.WATCHLIST:
    case FilterType.HISTORY:
    case FilterType.FAVORITES:
      statisticPresenter.destroy();
      movieListPresenter.init();
      break;
    case MenuItem.STATS:
      movieListPresenter.destroy();
      statisticPresenter.init();
      break;
  }
};

const handleFilterModelEvent = (updateType, filter) => {
  handleSiteMenuClick(filter);
};

// Init & set handlers
filterPresenter.init();
movieListPresenter.init();
siteMenuComponent.siteMenuClickHandler(handleSiteMenuClick);

// Observers
filterModel.addObserver(handleFilterModelEvent);

// Render
render(siteMainElement, siteMenuComponent, RenderPosition.BEFOREBEGIN);
render(headerMainElement, profileRatingComponent, RenderPosition.BEFOREEND);
render(footerStatisticsElement, footerStaticticComponent, RenderPosition.BEFOREEND);


