import {createElement} from '../render.js';

const createFilterItemTemplate = (filters) => filters.map((filter) => (
  `<a href="#${filter.name}" class="main-navigation__item"> ${filter.name} <span class="main-navigation__item-count">${filter.count}</span></a>`
));

const createFilterTemplate = (filters) => {
  const filterItemsTemplate = createFilterItemTemplate(filters).join('');

  return `<nav class="main-navigation">
  <div class="main-navigation__items">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    ${filterItemsTemplate}
  </div>
  <a href="#stats" class="main-navigation__additional">Stats</a>
</nav>`;
};

export default class FilterView {
  #element = null;
  #filters = null;

  constructor(filters) {
    this.#filters = filters;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }

  removeElement() {
    this.#element = null;
  }
}
