import AbstractView from './abstract-view.js';

export default class BtnShowMoreView extends AbstractView {
  get template() {
    return '<button class="films-list__show-more">Show more</button>';
  }

  setClickHandler = (callback) => {
    this._callback.clickBtn = callback;//колбэк записали во внутреннее устройство
    this.element.addEventListener('click', this.#clickHandler);//передали абстрактный обработчик
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.clickBtn();
  }
}
