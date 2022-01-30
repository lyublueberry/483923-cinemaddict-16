import { dateFilm } from '../utils/film.js';
import he from 'he';
import CommentFilmView from './comment-view.js';
import SmartView from './smart-view.js';
import { isFormSubmtShortcut } from '../utils/common.js';

const dateFormatRelise = 'DD MMMM YYYY';

const createFilmDetailsPopupTemplates = ({ filmData, commentsData, commentData }) => {
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
    genres,
    description,
    ageRating,
    isWatchlist,
    isWatched,
    isFavorites,
  } = filmData;

  const activeClassName = (item) => item ? 'film-details__control-button--active' : '';

  const templateGenres = genres.map((gen) => `<span class="film-details__genre">${(gen)}</span>`).join('');

  const templateComments = commentsData.map((comment) => new CommentFilmView(comment).template).join('');

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
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsData.length}</span></h3>

        <ul class="film-details__comments-list">
          ${templateComments}
        </ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
          ${commentData.emotion ? `<img src="./images/emoji/${commentData.emotion}.png" width="55" height="55" alt="emoji-${commentData.emotion}">` : ''}
          </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${commentData.comment}</textarea>
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

  constructor(filmData, commentsData) {
    super();
    this._data = {
      filmData,
      commentsData,
      commentData: {
        emotion: '',
        comment: '',
      }
    };

    this.#setInnerHandlers();
  }

  get template() {
    return createFilmDetailsPopupTemplates(this._data);
  }

  reset = (filmData, commentsData) => {
    const commentData = {
      emotion: '',
      comment: '',
    };
    this.updateData({ filmData, commentsData, commentData });
  };

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setClosePopupHandler(this._callback.click);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setSubmitCommentHandler(this._callback.commentFormSubmit);
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('change', this.#inputEmojiHandler);
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#inputMessageHandler);
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeClickHandler);


  };

  #inputEmojiHandler = (evt) => {
    evt.preventDefault();

    const commentData = {
      ...this._data.commentData,
      emotion: evt.target.value
    };

    this.updateData({ commentData });
  };

  #inputMessageHandler = (evt) => {
    evt.preventDefault();

    const commentData = {
      ...this._data.commentData,
      comment: evt.target.value
    };

    this.updateData({ commentData }, true);
  };

  #submitCommentHandler = (evt) => {
    if(isFormSubmtShortcut(evt)) {
      this._callback.commentFormSubmit(this._data.commentData);
    }
  }

  setSubmitCommentHandler = (callback) => {
    this._callback.commentFormSubmit = callback;
    this.element.querySelector('.film-details__comment-input').addEventListener('keydown', this.#submitCommentHandler);
  }

  //данные для попапа в данные для сервера
  static parseDataToFilm = (data) => {
    const film = {...data};
    delete film.emoji;
    delete film.message;
    return film;
  };

  setClosePopupHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeClickHandler);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched')
      .addEventListener('click', this.#watchedClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite')
      .addEventListener('click', this.#favoriteClickHandler);
  };

  setDeleteCommentHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelectorAll('.film-details__comment-delete')
      .forEach((button) => {
        button.addEventListener('click', this.#deleteCommentClickHandler);
      });
  };

  #deleteCommentClickHandler = (evt) => {
    evt.preventDefault();
    const commentId = evt.target.dataset.commentId;
    const filmId = this._data.filmData.id;
    this._callback.deleteClick(filmId, commentId);
  }

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick(this._data);
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick(this._data);
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick(this._data);
  };

/*   static parseDataToComment = (data) => {
    const {emoji, message} = data; //Деструктур
    return {emotion, comment};
  } */
}
