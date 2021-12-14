import {
  dateFilm
} from '../util';

import {
  createElement
} from '../render.js';

const dateFormatComment = 'YYYY/MM/DD HH:mm';

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
    const createCommentFilmTemplate = (comment) => `<li class="film-details__comment">
                <span class="film-details__comment-emoji">
                  <img src="${comment.emotion}" width="55" height="55" alt="emoji-smile">
                </span>
                <div>
                  <p class="film-details__comment-text">${comment.text}</p>
                  <p class="film-details__comment-info">
                    <span class="film-details__comment-author">${comment.author}</span>
                    <span class="film-details__comment-day">${dateFilm(comment.date, dateFormatComment)}</span>
                    <button class="film-details__comment-delete">Delete</button>
                  </p>
                </div>
              </li>`;
    return createCommentFilmTemplate(this.#comment);
  }

  removeElement() {
    this.#element = null;
  }
}
