import { createElement } from '../render.js';

export default class StatisticsView {
  #element = null;

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    const createStatisticsTemplate = () => (
      `<section class="footer__statistics">
      <p>130 291 movies inside</p>
    </section>`
    );

    return createStatisticsTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
