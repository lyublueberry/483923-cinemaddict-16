import AbstractView from './abstract-view.js';

export default class FooterStatisticsView extends AbstractView {
  #totalFilmsCount = null;

  /**
   * @param {Number} totalFilmsCount - общее кол-во фильмов
   */
  constructor (totalFilmsCount) {
    super();
    this.#totalFilmsCount = totalFilmsCount;
  }

  get template() {
    return `<section class="footer__statistics">
      <p>${this.#totalFilmsCount.toLocaleString('ru-RU')} movies inside</p>
    </section>`;
  }
}
