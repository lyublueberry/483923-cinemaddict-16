import PopupFilmView from '../view/film-details-popup-view.js';
import CardFilmView from '../view/card-view.js';
import { render, RenderPosition, replace } from '../utils/render.js';

const KEYDOWN = 'keydown';
const ESCAPE = 'Escape';
const ESC = 'Esc';

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

/*     this.#filmComponent.setPopupClickHandler(this.#handleCardFilmToPopup);
    this.#filmPopupComponent.setClosePopupHandler(this.#handlePopupToCardFilm); */

    render(this.#filmListContainer.container, this.#filmComponent, RenderPosition.BEFOREEND);
  };

/*   #replaceCardFilmToPopup = () => {
    replace(this.#filmPopupComponent, this.#filmComponent);
    document.addEventListener(KEYDOWN, this.#escKeyDownHandler);
  };

  #replacePopupToCardFilm = () => {
    replace(this.#filmComponent, this.#filmPopupComponent);
    document.removeEventListener(KEYDOWN, this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (evt) => {
    if(evt.key === ESCAPE || evt.key === ESC) {
      evt.preventDefault();
      this.#replacePopupToCardFilm();
      //document.removeEventListener(KEYDOWN, this.#onEscKeyDown);
      document.body.classList.remove('hide-overflow');
    }
  };

  #handleCardFilmToPopup = () => {
    this.#replaceCardFilmToPopup();
  };

  #handlePopupToCardFilm = () => {
    this.#replacePopupToCardFilm();
  }; */
}
//h2 и список фильмов или просто h2 и текст
