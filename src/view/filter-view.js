import AbstractView from './abstract-view.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;
  return `<a
            href="#${type}"
            class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}"
            data-name='${type}'
          >
              ${name} ${type !== 'all' ? `<span class="main-navigation__item-count">${count}</span>` : ''}
          </a>`;
};

const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems.map((filter) => createFilterItemTemplate(filter, currentFilterType)).join('');

  return `<div class="main-navigation__items">
            ${filterItemsTemplate}
          </div>`;
};

export default class FilterView extends AbstractView {
  #filter = null;
  #currentFilter = null;

  constructor(filter) {
    super();
    this.#filter = filter;
    this.#currentFilter = this.#currentFilter;
  }

  get template() {
    return createFilterTemplate(this.#filter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;

    this.element.querySelectorAll('.main-navigation__item').forEach((element) => {
      element.addEventListener('click', this.#filterTypeChangeHandler);
    });
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.name);
  }
}
