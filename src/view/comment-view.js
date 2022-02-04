import { dateFilm } from '../utils/film.js';
import AbstractView from './abstract-view.js';

const dateFormatComment = 'YYYY/MM/DD HH:mm';

export default class CommentFilmView extends AbstractView {
  #comment = null;

  constructor(comment) {
    super();
    this.#comment = comment;
  }

  get template() {
    const createCommentFilmTemplate = (comment) => `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-${comment.emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${comment.comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${comment.author}</span>
          <span class="film-details__comment-day">${dateFilm(comment.date, dateFormatComment)}</span>
          <button data-comment-id=${comment.id} class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`;

    return createCommentFilmTemplate(this.#comment);
  }
}
