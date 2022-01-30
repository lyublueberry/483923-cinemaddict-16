import { FilterType } from '../utils/const.js';
import AbstractView from './abstract-view.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;
  return (`<a href="#${name}" class="main-navigation__item" ${type === currentFilterType ? ' main-navigation__item--active' : ''}">${type === FilterType.ALL ? 'All movies' : name} ${type !== FilterType.ALL ?`
  <span id=${type} class="main-navigation__item-count">${count}</span>` : ''} </a>`
  );
};


const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems.map((filter) => createFilterItemTemplate(filter, currentFilterType)).join('');

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
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
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }
}
