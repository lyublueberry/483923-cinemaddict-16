import { MenuItem } from '../utils/const.js';
import AbstractView from './abstract-view.js';

const createMainNavTemplate = () => (`<nav class="main-navigation">
  <a href="#stats" class="main-navigation__additional" data-menu-item='${MenuItem.STATS}'>${MenuItem.STATS}</a>
</nav>`
);

export default class MainNavView extends AbstractView {
  get template() {
    return createMainNavTemplate();
  }

  siteMenuClickHandler = (callback) => {
    this._callback.menuClick = callback;
    this.element.querySelectorAll('.main-navigation__additional').forEach((elem) => {
      elem.addEventListener('click', this.#menuClickHandler);
    });
  }

  #menuClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.menuItem);
  }
}
