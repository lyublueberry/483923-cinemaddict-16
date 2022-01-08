import { render, RenderPosition } from './utils/render.js';
import StatisticsView from './view/statistic-view.js';
import ProfileRatingView from './view/profile-rating-view.js';
import { generateCardFilm } from './mock/film.js';
import { generateFilter } from './mock/filter.js';
import MovieListPresenter from './presenter/movie-list-presenter.js';

const headerMainElement = document.querySelector('.header');

const profileRatingView = new ProfileRatingView();
render(headerMainElement, profileRatingView.element, RenderPosition.BEFOREEND); //звание пользователя

const siteMainElement = document.querySelector('.main');

const FILM_CARD_COUNT = 20;

const films = Array.from({length: FILM_CARD_COUNT}, generateCardFilm);
const filters = generateFilter(films);

const movieListPresenter = new MovieListPresenter(siteMainElement);
movieListPresenter.init(films, filters);

const footerMainElement = document.querySelector('.footer');
const statisticsView = new StatisticsView();
const footerStatisticsElement = footerMainElement.querySelector('.footer__statistics');
render(footerStatisticsElement, statisticsView.element, RenderPosition.BEFOREEND);
