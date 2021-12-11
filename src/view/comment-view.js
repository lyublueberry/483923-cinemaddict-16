import {
  dateFilm
} from '../util';

import {
  createElement
} from '../render.js';

const dateFormatComment = 'YYYY/MM/DD HH:mm';

const createCommentFilmTemplate = (comments) => {

  const {
    text,
    emotion,
    author,
    date
  } = comments;
  return `<li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="${emotion}" width="55" height="55" alt="emoji-smile">
            </span>
            <div>
              <p class="film-details__comment-text">${text}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${author}</span>
                <span class="film-details__comment-day">${dateFilm(date, dateFormatComment)}</span>
                <button class="film-details__comment-delete">Delete</button>
              </p>
            </div>
          </li>`;
};

export default class CommentFilmView {
  #element = null;
  #comment = null;

  constructor(comment) {
    this.#comment = comment;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createCommentFilmTemplate(this.#comment);
  }

  removeElement() {
    this.#element = null;
  }
}
