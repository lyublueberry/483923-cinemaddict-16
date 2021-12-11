import { createElement } from '../render.js';

const messageFilmsListEmptyTemplate = () => '<h2 class="films-list__title">There are no movies in our database</h2>';

export default class MessageFilmsListEmptyView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return messageFilmsListEmptyTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
