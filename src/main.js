import { createFilterTemplate } from './view/site-menu-view.js';
import { RenderPosition, renderTemplate } from './render.js';
import { createCardFilmTemplate } from './view/card-view.js';
import { createStatistiscFilmsTemplates } from './view/statistic-view.js';
import { createProfileRatingTemplate } from './view/profile-rating-view.js';
import { createBtnShowMoreTemplate } from './view/btn-show-more.js';
import { createContainerCardsFilmsTemplate } from './view/container-card-view.js';
import { createFilmDetailsPopupTemplates } from './view/film-details-popup-view.js';
import { createSortTemplate } from './view/sort-view.js';
import { generateCardFilm } from './mock/film.js';
import { generateFilter } from './mock/filter.js';

const headerMainElement = document.querySelector('.header');
const headerLogoMainElement = headerMainElement.querySelector('.header__logo.logo');
const siteMainElement = document.querySelector('.main');
const FILM_CARD_COUNT = 20;
const FILM_COUNT_PER_STEP = 5;
const footerMainElement = document.querySelector('.footer');
const footerStatisticsElement = footerMainElement.querySelector('.footer__statistics');

const films = Array.from({length: FILM_CARD_COUNT}, generateCardFilm);
const filters = generateFilter(films);
renderTemplate(siteMainElement, createFilterTemplate(filters), RenderPosition.AFTERBEGIN); //меню

const sortMainTemplateElement = siteMainElement.querySelector('.main-navigation');
renderTemplate(sortMainTemplateElement, createSortTemplate(), RenderPosition.AFTEREND); //сортировка

renderTemplate(headerLogoMainElement, createProfileRatingTemplate(), RenderPosition.BEFOREEND); //звание пользователя
renderTemplate(siteMainElement, createContainerCardsFilmsTemplate(), RenderPosition.BEFOREEND); //контейнер куда поместим карточки фильмов

const filmsElement = siteMainElement.querySelector('.films');
const filmsListContainerElement = filmsElement.querySelector('.films-list__container');

for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
  renderTemplate(filmsListContainerElement, createCardFilmTemplate(films[i]), RenderPosition.BEFOREEND); //карточки фильмов
}

const filmsListElement = filmsElement.querySelector('.films-list');
if (films.length > FILM_COUNT_PER_STEP) {
  let renderFilmsCount = FILM_COUNT_PER_STEP;
  renderTemplate(filmsListElement, createBtnShowMoreTemplate(), RenderPosition.BEFOREEND);

  const showMoreButton = filmsListElement.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderFilmsCount, renderFilmsCount + FILM_COUNT_PER_STEP)
      .forEach((film) => renderTemplate(filmsListContainerElement, createCardFilmTemplate(film), RenderPosition.BEFOREEND));
    renderFilmsCount += FILM_COUNT_PER_STEP;

    if (renderFilmsCount >= films.length) {
      showMoreButton.remove();
    }
  });
}
renderTemplate(footerStatisticsElement, createStatistiscFilmsTemplates(), RenderPosition.BEFOREEND);
renderTemplate(footerMainElement, createFilmDetailsPopupTemplates(films[0]), RenderPosition.BEFOREEND);
