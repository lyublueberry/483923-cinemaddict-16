import {
  createElement
} from '../render.js';

export default class ContainerCardsView {
  #element = null;

  get element() {
    if(!this.#element){
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    return `<section class="films">
        <section class="films-list">
          <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
          <div class="films-list__container">
          </div>
    </section>`;
  }

  removeElement() {
    this.#element = null;
  }
}
