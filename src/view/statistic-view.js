import AbstractView from './abstract-view.js';

export default class StatisticsView extends AbstractView {
  get template() {
    return `<section class="footer__statistics">
      <p>130 291 movies inside</p>
    </section>`;
  }
}
