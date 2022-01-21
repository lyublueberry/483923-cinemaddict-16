import { dateFilm } from '../utils/film.js';

import CommentFilmView from './comment-view.js';

import SmartView from './smart-view.js';

const dateFormatRelise = 'DD MMMM YYYY';

const createFilmDetailsPopupTemplates = (data) => {
  const {
    poster,
    filmName,
    originalName,
    rating,
    director,
    screenwriters,
    actors,
    date,
    duration,
    country,
    countComment,
    genres,
    description,
    ageRating,
    isWatchlist,
    isWatched,
    isFavorites,
    comments,
    emoji,
    message
  } = data;


  const activeClassName = (item) => item ? 'film-details__control-button--active' : '';

  const templateGenres = genres.map((gen) => `<span class="film-details__genre">${(gen)}</span>`).join('');
  const templateComments = comments.map((comment) => new CommentFilmView(comment).template).join('');

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">

          <p class="film-details__age">${ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${filmName}</h3>
              <p class="film-details__title-original">Original: ${originalName}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${screenwriters}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${dateFilm(date, dateFormatRelise)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${duration}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">${templateGenres}</td>
            </tr>
          </table>

          <p class="film-details__film-description">
            ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button ${activeClassName(isWatchlist)} film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button ${activeClassName(isWatched)} film-details__control-button--watched" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button ${activeClassName(isFavorites)} film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${countComment}</span></h3>

        <ul class="film-details__comments-list">
          ${templateComments}
        </ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
          ${emoji ? `<img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">` : ''}
          </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${message}</textarea>
          </label>

          <div class="film-details__emoji-list">
          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
          <label class="film-details__emoji-label" for="emoji-smile">
            <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
          <label class="film-details__emoji-label" for="emoji-sleeping">
            <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
          <label class="film-details__emoji-label" for="emoji-puke">
            <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
          <label class="film-details__emoji-label" for="emoji-angry">
            <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
          </label>
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`;
};

export default class PopupFilmView extends SmartView {
  constructor(film) {
    super();
    this._data = PopupFilmView.parseFilmToData(film);
    this.#setInnerHandlers();
  }

  #inputEmojiHandler = (evt) => {
    evt.preventDefault();
    this.updateData({emoji:evt.target.value});
  };

  #inputMessageHandler = (evt) => {
    evt.preventDefault();
    this.updateData({message:evt.target.value}, true);
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('change', this.#inputEmojiHandler);
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#inputMessageHandler);
    this.element.addEventListener('scroll', this.#scrollPositionHandler);
  }

  get template() {
    return createFilmDetailsPopupTemplates(this._data);
  }
  //данные с сервера в данные для попапа

  static parseFilmToData = (film) => ({...film,
    emoji: '',
    message: '',
  });

  //данные для попапа в данные для сервера
  static parseDataToFilm = (data) => {
    const film = {...data};
    delete film.emoji;
    delete film.message;
    return film;
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setClosePopupHandler(this._callback.click);
  }

  setClosePopupHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeClickHandler);
  }

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
  }

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
  }

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  }

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  }

  #scrollPositionHandler = () => {
    this.updateData({
      scrollPosition: this.element.scrollTop,
    }, true);
  }

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick(this._data);
  }

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick(this._data);
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick(this._data);
  }
}
