import { createElement } from '../render.js';

export default class SortMenuView {

  #element = null;//надо где-то хранить ссылку на дом элемент

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    return `<ul class="sort">
        <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
        <li><a href="#" class="sort__button">Sort by date</a></li>
        <li><a href="#" class="sort__button">Sort by rating</a></li>
      </ul>`;
  }

  removeElement() {
    this.#element = null;
  }

}
