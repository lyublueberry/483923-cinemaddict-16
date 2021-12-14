import { createElement } from '../render.js';


export default class MessageFilmsListEmptyView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return '<h2 class="films-list__title">There are no movies in our database</h2>';
  }

  removeElement() {
    this.#element = null;
  }
}
