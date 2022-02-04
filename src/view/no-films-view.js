import { NoFilmsViewTextContents } from '../utils/const.js';
import AbstractView from './abstract-view.js';

const createNoFilmTemplate = (filterType) => {
  const noFilmTextValue = NoFilmsViewTextContents[filterType];
  return (`<section class="films-list">
  <h2 class="films-list__title">${noFilmTextValue}</h2>
  </section>`);
};

export default class MessageFilmsListEmptyView extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  get template() {
    return createNoFilmTemplate(this._data);
  }
}
