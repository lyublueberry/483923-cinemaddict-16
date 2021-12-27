import AbstractView from './abstract-view.js';
export default class ContainerFilmsView extends AbstractView {
  get template() {
    return `<section class="films">
    </section>`;
  }
}
