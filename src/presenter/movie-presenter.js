import PopupFilmView from './view/film-details-popup-view.js';
import CardFilmView from './view/card-view.js';
import { render, RenderPosition, replace } from './utils/render.js';

export default class MoviePresenter {
  #filmListContainer = null;

  #filmComponent = null;
  #filmPopupComponent = null;

  #film = null;

  constructor(filmListContainer) {
    this.#filmListContainer = filmListContainer;
  }

  init = (film) => {
    this.#film = film;

    this.#filmComponent = new CardFilmView(film);
    this.#filmPopupComponent = new PopupFilmView(film);

    this.#filmComponent.setPopupClickHandler(this.#handleCardFilmToPopup);
    this.#filmPopupComponent.setClosePopupHandler(this.#handlePopupToCardFilm);

    render(this.#filmListContainer, this.#filmComponent, RenderPosition.BEFOREEND);
  }

  #replaceCardFilmToPopup = () => {
    replace(this.#filmPopupComponent, this.#filmComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToCard = () => {
    replace(this.#filmComponent, this.#filmPopupComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if(evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replacePopupToCardFilm();
      document.removeEventListener('keydown', onEscKeyDown);
      document.body.classList.remove('hide-overflow');
    }
  }

  #handleCardFilmToPopup = () => {
    this.#replaceCardFilmToPopup();
  }

  #handlePopupToCardFilm = () => {
    this.#replacePopupToCardFilm();
  }
}
