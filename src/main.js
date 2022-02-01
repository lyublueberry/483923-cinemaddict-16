import { generateCardFilm } from './mock/film.js';
import { generateComments } from './mock/comments.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
import FilterModel from './model/filter-model.js';
import StatisticsView from './view/statistic-view.js';
import ProfileRatingView from './view/profile-rating-view.js';
import MovieListPresenter from './presenter/movie-list-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import { remove, render, RenderPosition } from './utils/render.js';
import { FILM_CARD_COUNT, FilterType, MenuItem, UpdateType } from './utils/const.js';
import MainNavView from './view/main-nav-view.js';
import StatisticsPageView from './view/statistics-page-view.js';

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

let statisticsComponent = null;

filterPresenter.init();
movieListPresenter.init();

//render(siteHeaderElement, siteMenuComponent, RenderPosition.BEFOREEND);

// let currentMenuItem = 'films';


const handleSiteMenuClick = (menuItem) => {


  console.log('handleSiteMenuClick', { menuItem });
  switch (menuItem) {
    case FilterType.ALL:
    case FilterType.WATCHLIST:
    case FilterType.HISTORY:
    case FilterType.FAVORITES:
/*       if(currentMenuItem === 'films'){
        return;
      } */
/*       currentMenuItem = 'films'; */
      console.log('show films');
      remove(statisticsComponent);
      movieListPresenter.init();
      break;
    case MenuItem.STATS:
/*       if(currentMenuItem === 'stats'){
        return;
      } */
 /*      currentMenuItem = 'stats'; */
      console.log('show stats');
      movieListPresenter.destroy();
      statisticsComponent = new StatisticsPageView();
      render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);

      // Показать статистику
      break;
  }
};

//siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

const footerMainElement = document.querySelector('.footer');
const statisticsView = new StatisticsView();
const footerStatisticsElement = footerMainElement.querySelector('.footer__statistics');
render(footerStatisticsElement, statisticsView.element, RenderPosition.BEFOREEND);

siteMenuComponent.siteMenuClickHandler(handleSiteMenuClick);

const handleFilterModelEvent = (updateType, filter) => {
  console.log('handleFilterModelEvent', { updateType, filter });
  handleSiteMenuClick(filter);
};


filterModel.addObserver(handleFilterModelEvent);

