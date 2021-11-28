import { createSiteMenuTemplate } from './view/site-menu-view.js';
import { RenderPosition, renderTemplate } from './render.js';
import { createCardFilmTemplate } from './view/card-view.js';
import { createStatistiscFilmsTemplates } from './view/statistic-view.js';
import { createProfileRatingTemplate } from './view/profile-rating-view.js';
import { createBtnShowMoreTemplate } from './view/btn-show-more.js';
import { createContainerCardsFilmsTemplate } from './view/container-card-view.js';
import { createFilmDetailsPopupTemplates } from './view/film-details-popup-view.js';
import { createSortTemplate } from './view/sort-view.js';


const headerMainElement = document.querySelector('.header');
const headerLogoMainElement = headerMainElement.querySelector('.header__logo.logo');
const siteMainElement = document.querySelector('.main');
const FILM_CARD_COUNT = 5;
const footerMainElement = document.querySelector('.footer');
const footerStatisticsElement = footerMainElement.querySelector('.footer__statistics');

renderTemplate(siteMainElement, createSiteMenuTemplate(), RenderPosition.AFTERBEGIN);//меню

const sortMainTemplateElement = siteMainElement.querySelector('.main-navigation');
renderTemplate(sortMainTemplateElement, createSortTemplate(), RenderPosition.AFTEREND);//сортировка

renderTemplate(headerLogoMainElement, createProfileRatingTemplate(), RenderPosition.BEFOREEND);//звание пользователя
renderTemplate(siteMainElement, createContainerCardsFilmsTemplate(), RenderPosition.BEFOREEND);//контейнер куда поместим карточки фильмов

const filmsElement = siteMainElement.querySelector('.films');
const filmsListContainerElement = filmsElement.querySelector('.films-list__container');
for (let i = 0; i < FILM_CARD_COUNT; i++) {
  renderTemplate(filmsListContainerElement, createCardFilmTemplate(), RenderPosition.AFTERBEGIN);//карточки фильмов
}

const filmsListElement = filmsElement.querySelector('.films-list');
renderTemplate(filmsListElement, createBtnShowMoreTemplate(), RenderPosition.BEFOREEND);
renderTemplate(footerStatisticsElement, createStatistiscFilmsTemplates(), RenderPosition.BEFOREEND);
renderTemplate(footerMainElement, createFilmDetailsPopupTemplates(), RenderPosition.BEFOREEND);
