/* import FilterView from './view/site-menu-view.js';
 */import { render, RenderPosition } from './utils/render.js';
/* import CardFilmView from './view/card-view.js';
 */import StatisticsView from './view/statistic-view.js';
import ProfileRatingView from './view/profile-rating-view.js';
/* import BtnShowMoreView from './view/btn-show-more.js';
import ContainerCardsView from './view/container-card-view.js';
import PopupFilmView from './view/film-details-popup-view.js';
import SortMenuView from './view/sort-view.js';
import MessageFilmsListEmptyView from './view/no-films-view.js'; */
import { generateCardFilm } from './mock/film.js';
import { generateFilter } from './mock/filter.js';
import MovieListPresenter from './presenter/movie-list-presenter.js';

const headerMainElement = document.querySelector('.header');

const profileRatingView = new ProfileRatingView();
render(headerMainElement, profileRatingView.element, RenderPosition.BEFOREEND); //звание пользователя

const siteMainElement = document.querySelector('.main');

const FILM_CARD_COUNT = 20;
//const FILM_COUNT_PER_STEP = 5;

const films = Array.from({length: FILM_CARD_COUNT}, generateCardFilm);
const filters = generateFilter(films);

/*
const containerCardsView  = new ContainerCardsView();
render(siteMainElement, containerCardsView.element, RenderPosition.BEFOREEND); //контейнер куда поместим карточки фильмов */

//const filmsElement = siteMainElement.querySelector('.films');
//const filmsListContainerElement = filmsElement.querySelector('.films-list__container');

//получает ссылку на контейнер куда отрисовываем и данные о фильме
/* const renderFilms = (filmListEl, film) => {
  const filmComponent = new CardFilmView(film);
  const filmPopupComponent = new PopupFilmView(film);

  const replaceCardFilmToPopup = () => {
    replace(filmPopupComponent, filmComponent);//Замена одного компонента корточки на попап
  };

  const replacePopupToCardFilm = () => {
    replace(filmComponent, filmPopupComponent);//замена через ReplaceChild компомент попап на карточки
  };

  const onEscKeyDown = (evt) => {
    if(evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replacePopupToCardFilm();
      document.removeEventListener('keydown', onEscKeyDown);
      document.body.classList.remove('hide-overflow');
    }
  };

  filmComponent.setPopupClickHandler(() => {
    replaceCardFilmToPopup();
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', onEscKeyDown);
  });

  filmPopupComponent.setClosePopupHandler(() => {
    replacePopupToCardFilm();
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', onEscKeyDown);
  });
  render (filmListEl, filmComponent, RenderPosition.BEFOREEND);
}; */

/* if(films.length === 0) {
  const messageFilmsListEmptyView = new MessageFilmsListEmptyView();
  render(filmsListContainerElement, messageFilmsListEmptyView.element, RenderPosition.BEFOREEND);
} */

/* for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
  renderFilms(filmsListContainerElement, films[i]); //карточки фильмов
} */

//const filmsListElement = filmsElement.querySelector('.films-list');

/* if (films.length > FILM_COUNT_PER_STEP) {
  let renderFilmsCount = FILM_COUNT_PER_STEP;
  const btnShowMoreView = new BtnShowMoreView();
  render(filmsListElement, btnShowMoreView.element, RenderPosition.BEFOREEND);

  const showMoreButton = filmsListElement.querySelector('.films-list__show-more');

  btnShowMoreView.setClickHandler(() => {
    films
      .slice(renderFilmsCount, renderFilmsCount + FILM_COUNT_PER_STEP)
      .forEach((film) => renderFilms(filmsListContainerElement,film));
    renderFilmsCount += FILM_COUNT_PER_STEP;

    if (renderFilmsCount >= films.length) {
      remove(btnShowMoreView);
    }
  });
} */

const movieListPresenter = new MovieListPresenter(siteMainElement);
movieListPresenter.init(films, filters);

const footerMainElement = document.querySelector('.footer');
const statisticsView = new StatisticsView();
const footerStatisticsElement = footerMainElement.querySelector('.footer__statistics');
render(footerStatisticsElement, statisticsView.element, RenderPosition.BEFOREEND);
