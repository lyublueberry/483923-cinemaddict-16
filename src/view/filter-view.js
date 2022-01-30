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

  /* setActiveFilter() {
    const locationHash = window.location.hash.split('#')[1];
    if (locationHash) {
      this.element.querySelector('main-navigation__item--active').classList.remove('main-navigation__item--active');
      this.element.querySelector(`a[href="#${locationHash}"`).classList.add('main-navigation__item--active');
    }
    this._callback.setFilter = this.changeActiveFilter.bind(this);
    this.element.addEventListener('click', this._callback.setFilter);
  }

  changeActiveFilter(evt) {
    evt.preventDefault();
    this.#currentFilter = this.element.querySelector('main-navigation__item--active');

    if ((evt.target.tagName === 'A' || evt.target.className === 'main-navigation__item-count') && this.#currentFilter !== evt.target) {
      //this.#currentFilter.classList.remove('main-navigation__item--active');
      this.#currentFilter = evt.target.closest('.main-navigation__item');
      if (this.#currentFilter === null) {
        this.#currentFilter = evt.target;
      }
      this.#currentFilter.classList.add('main-navigation__item--active');
    }
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.name);
  }

  setMenuClickHandler = (callback) => {
    this._callback.menuClick = callback;
    this.element.addEventListener('click', this.#menuClickHandler);
  };

  #menuClickHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName === 'A' || evt.target.className === 'main-navigation__item-count') {
      let filter;
      if (evt.target.className === 'main-navigation__item' || evt.target.className === 'main-navigation__item-count') {
        filter = evt.target.closest('.main-navigation__item ');
      } else {
        filter = evt.target;
      }
      this._callback.menuClick(filter.name.toUpperCase());
    }
  };*/
}
