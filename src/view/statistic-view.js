import { createElement } from '../render.js';

const createStatisticsTemplate = () => (
  `<section class="footer__statistics">
  <p>130 291 movies inside</p>
</section>`
);

export default class StatisticsView {
  #element = null;

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createStatisticsTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
