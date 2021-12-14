import {
  createElement
} from '../render.js';

export default class BtnShowMoreView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return '<button class="films-list__show-more">Show more</button>';
  }

  removeElement() {
    this.#element = null;
  }
}
