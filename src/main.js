import { render, RenderPosition } from './utils/render.js';
import StatisticsView from './view/statistic-view.js';
import ProfileRatingView from './view/profile-rating-view.js';
import { generateCardFilm } from './mock/film.js';
import MovieListPresenter from './presenter/movie-list-presenter.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
import { generateComments } from './mock/comments.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';
import { FILM_CARD_COUNT } from './utils/const.js';

const films = Array.from({length: FILM_CARD_COUNT}, generateCardFilm);
const filmsModel = new FilmsModel();
filmsModel.films = films;

const filterModel = new FilterModel();
const siteMainElement = document.querySelector('.main');
const headerMainElement = document.querySelector('.header');

const profileRatingView = new ProfileRatingView();
render(headerMainElement, profileRatingView.element, RenderPosition.BEFOREEND); //звание пользователя

const commentsModel = new CommentsModel();
commentsModel.comments = generateComments(films);

const movieListPresenter = new MovieListPresenter(siteMainElement, filmsModel, commentsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);

filterPresenter.init();
movieListPresenter.init();

const footerMainElement = document.querySelector('.footer');
const statisticsView = new StatisticsView();
const footerStatisticsElement = footerMainElement.querySelector('.footer__statistics');
render(footerStatisticsElement, statisticsView.element, RenderPosition.BEFOREEND);
