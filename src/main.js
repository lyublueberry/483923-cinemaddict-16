import FilterView from './view/site-menu-view.js';
import { render, RenderPosition } from './render.js';
import CardFilmView from './view/card-view.js';
import StatisticsView from './view/statistic-view.js';
import ProfileRatingView from './view/profile-rating-view.js';
import BtnShowMoreView from './view/btn-show-more.js';
import ContainerCardsView from './view/container-card-view.js';
import PopupFilmView from './view/film-details-popup-view.js';
import SortMenuView from './view/sort-view.js';
import MessageFilmsListEmptyView from './view/no-films-view.js';
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
render(siteMainElement, new FilterView(filters).element, RenderPosition.AFTERBEGIN); //меню

const sortMainTemplateElement = siteMainElement.querySelector('.main-navigation');
render(sortMainTemplateElement, new SortMenuView().element, RenderPosition.AFTEREND); //сортировка

render(headerLogoMainElement, new ProfileRatingView().element, RenderPosition.BEFOREEND); //звание пользователя
render(siteMainElement, new ContainerCardsView().element, RenderPosition.BEFOREEND); //контейнер куда поместим карточки фильмов

const filmsElement = siteMainElement.querySelector('.films');
const filmsListContainerElement = filmsElement.querySelector('.films-list__container');

//получает ссылку на контейнер куда отрисовываем и данные о фильме
const renderFilms = (filmListEl, film) => {
  const filmComponent = new CardFilmView(film);
  const filmPopupComponent = new PopupFilmView(film);

  const replaceCardFilmToPopup = () => {
    filmListEl.replaceChild(filmPopupComponent.element, filmComponent.element);//Замена одного компонента корточки на попап
  };

  const replacePopupToCardFilm = () => {
    filmListEl.replaceChild(filmComponent.element, filmPopupComponent.element);//замена через ReplaceChild компомент попап на карточки
  };

  const onEscKeyDown = (evt) => {
    if(evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replacePopupToCardFilm();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  filmComponent.element.querySelector('.film-card__link').addEventListener('click', () => {
    replaceCardFilmToPopup();
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', onEscKeyDown);
  });

  filmPopupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', () => {
    replacePopupToCardFilm();
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render (filmListEl, filmComponent.element, RenderPosition.BEFOREEND);
};

if(films.length === 0) {
  render(filmsListContainerElement, new MessageFilmsListEmptyView().element, RenderPosition.BEFOREEND);
}

for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
  renderFilms(filmsListContainerElement, films[i]); //карточки фильмов
}

const filmsListElement = filmsElement.querySelector('.films-list');
if (films.length > FILM_COUNT_PER_STEP) {
  let renderFilmsCount = FILM_COUNT_PER_STEP;
  render(filmsListElement, new BtnShowMoreView().element, RenderPosition.BEFOREEND);

  const showMoreButton = filmsListElement.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderFilmsCount, renderFilmsCount + FILM_COUNT_PER_STEP)
      .forEach((film) => renderFilms(filmsListContainerElement,film));
    renderFilmsCount += FILM_COUNT_PER_STEP;

    if (renderFilmsCount >= films.length) {
      showMoreButton.remove();
    }
  });
}

render(footerStatisticsElement, new StatisticsView().element, RenderPosition.BEFOREEND);
